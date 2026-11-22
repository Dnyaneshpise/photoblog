import type { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../config/prisma.js'
import { httpError } from '../middleware/errorHandler.js'

function paramString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

const photoCardSelect = {
  id: true,
  title: true,
  description: true,
  altText: true,
  imageUrl: true,
  thumbnailUrl: true,
  width: true,
  height: true,
  location: true,
  capturedAt: true,
  isFeatured: true,
  sortOrder: true,
  category: { select: { id: true, name: true, slug: true } },
} as const

/** Subset returned by photoCardSelect — not a full Prisma Photo row. */
type PhotoCard = {
  id: string
  title: string
  description: string | null
  altText: string | null
  imageUrl: string
  thumbnailUrl: string | null
  width: number | null
  height: number | null
  location: string | null
  capturedAt: Date | null
  isFeatured: boolean
  sortOrder: number
  category: { id: string; name: string; slug: string } | null
}

export async function getRandomPhotos(req: Request, res: Response): Promise<void> {
  const limit = Math.min(Math.max(Number(req.query.limit) || 1, 1), 12)
  const total = await prisma.photo.count({ where: { isPublished: true } })
  if (total === 0) {
    res.json({ data: [] })
    return
  }
  const offsets = new Set<number>()
  const target = Math.min(limit, total)
  while (offsets.size < target) offsets.add(Math.floor(Math.random() * total))
  const photos = await Promise.all(
    [...offsets].map((skip) =>
      prisma.photo.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: 1,
        select: photoCardSelect,
      }),
    ),
  )
  res.json({ data: photos.flat() })
}

export async function searchPhotos(req: Request, res: Response): Promise<void> {
  const schema = z.object({
    q: z.string().trim().min(1).max(80),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(40).default(24),
  })
  const query = schema.parse(req.query)
  const term = query.q
  const where = {
    isPublished: true,
    OR: [
      { title: { contains: term, mode: 'insensitive' as const } },
      { description: { contains: term, mode: 'insensitive' as const } },
      { altText: { contains: term, mode: 'insensitive' as const } },
      { location: { contains: term, mode: 'insensitive' as const } },
    ],
  }
  const skip = (query.page - 1) * query.limit
  const [total, photos] = await Promise.all([
    prisma.photo.count({ where }),
    prisma.photo.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      skip,
      take: query.limit,
      select: photoCardSelect,
    }),
  ])
  res.json({
    data: photos,
    meta: {
      q: term,
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit) || 1,
    },
  })
}

export async function getPhotoNeighbors(req: Request, res: Response): Promise<void> {
  const id = paramString(req.params.id)
  const current = await prisma.photo.findFirst({
    where: { id, isPublished: true },
    select: { id: true, sortOrder: true, createdAt: true, title: true },
  })
  if (!current) throw httpError(404, 'Photo not found')
  const [previous, next] = await Promise.all([
    prisma.photo.findFirst({
      where: {
        isPublished: true,
        OR: [
          { sortOrder: { lt: current.sortOrder } },
          { sortOrder: current.sortOrder, createdAt: { gt: current.createdAt } },
        ],
      },
      orderBy: [{ sortOrder: 'desc' }, { createdAt: 'asc' }],
      select: photoCardSelect,
    }),
    prisma.photo.findFirst({
      where: {
        isPublished: true,
        OR: [
          { sortOrder: { gt: current.sortOrder } },
          { sortOrder: current.sortOrder, createdAt: { lt: current.createdAt } },
        ],
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: photoCardSelect,
    }),
  ])
  res.json({ data: { currentId: current.id, previous, next } })
}

export async function getRelatedPhotos(req: Request, res: Response): Promise<void> {
  const id = paramString(req.params.id)
  const limit = Math.min(Math.max(Number(req.query.limit) || 6, 1), 12)
  const current = await prisma.photo.findFirst({
    where: { id, isPublished: true },
    select: {
      id: true,
      categoryId: true,
      collections: { select: { collectionId: true } },
    },
  })
  if (!current) throw httpError(404, 'Photo not found')
  const collectionIds = current.collections.map((c) => c.collectionId)
  const picked = new Map<string, PhotoCard>()
  if (collectionIds.length > 0) {
    const inSeries = await prisma.photo.findMany({
      where: {
        isPublished: true,
        id: { not: id },
        collections: { some: { collectionId: { in: collectionIds } } },
      },
      take: limit,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: photoCardSelect,
    })
    for (const p of inSeries) picked.set(p.id, p)
  }
  if (picked.size < limit && current.categoryId) {
    const excludeIds = [...picked.keys(), id]
    const sameCat = await prisma.photo.findMany({
      where: {
        isPublished: true,
        id: { notIn: excludeIds },
        categoryId: current.categoryId,
      },
      take: limit - picked.size,
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }],
      select: photoCardSelect,
    })
    for (const p of sameCat) picked.set(p.id, p)
  }
  if (picked.size < limit) {
    const filler = await prisma.photo.findMany({
      where: { isPublished: true, id: { notIn: [...picked.keys(), id] } },
      take: limit - picked.size,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      select: photoCardSelect,
    })
    for (const p of filler) picked.set(p.id, p)
  }
  res.json({ data: [...picked.values()].slice(0, limit) })
}
