import type { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../config/prisma.js'
import { httpError } from '../middleware/errorHandler.js'
import { destroyImage } from '../services/cloudinary.js'

const photoBodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional().nullable(),
  altText: z.string().trim().max(500).optional().nullable(),
  imageUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional().nullable(),
  storageKey: z.string().optional().nullable(),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
  location: z.string().trim().max(200).optional().nullable(),
  capturedAt: z.coerce.date().optional().nullable(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  categoryId: z.string().optional().nullable(),
})

export async function adminListPhotos(req: Request, res: Response): Promise<void> {
  const query = z
    .object({
      q: z.string().trim().max(80).optional(),
      published: z
        .enum(['true', 'false'])
        .optional()
        .transform((v) => (v === undefined ? undefined : v === 'true')),
      featured: z
        .enum(['true', 'false'])
        .optional()
        .transform((v) => (v === undefined ? undefined : v === 'true')),
      categoryId: z.string().optional(),
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(40),
    })
    .parse(req.query)

  const where: Record<string, unknown> = {}
  if (query.published !== undefined) where.isPublished = query.published
  if (query.featured !== undefined) where.isFeatured = query.featured
  if (query.categoryId) where.categoryId = query.categoryId
  if (query.q) {
    where.OR = [
      { title: { contains: query.q, mode: 'insensitive' } },
      { location: { contains: query.q, mode: 'insensitive' } },
      { description: { contains: query.q, mode: 'insensitive' } },
    ]
  }

  const skip = (query.page - 1) * query.limit
  const [total, photos] = await Promise.all([
    prisma.photo.count({ where }),
    prisma.photo.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      skip,
      take: query.limit,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { collections: true } },
      },
    }),
  ])

  res.json({
    data: photos,
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit) || 1,
    },
  })
}

export async function adminCreatePhoto(req: Request, res: Response): Promise<void> {
  const body = photoBodySchema.parse(req.body)

  const photo = await prisma.photo.create({
    data: {
      title: body.title,
      description: body.description ?? null,
      altText: body.altText ?? null,
      imageUrl: body.imageUrl,
      thumbnailUrl: body.thumbnailUrl ?? null,
      storageKey: body.storageKey ?? null,
      width: body.width ?? null,
      height: body.height ?? null,
      location: body.location ?? null,
      capturedAt: body.capturedAt ?? null,
      isFeatured: body.isFeatured ?? false,
      isPublished: body.isPublished ?? false,
      sortOrder: body.sortOrder ?? 0,
      categoryId: body.categoryId ?? null,
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  })

  res.status(201).json({ data: photo })
}

export async function adminUpdatePhoto(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id)
  const body = photoBodySchema.partial().parse(req.body)

  const existing = await prisma.photo.findUnique({ where: { id } })
  if (!existing) throw httpError(404, 'Photo not found')

  const photo = await prisma.photo.update({
    where: { id },
    data: {
      ...body,
      description: body.description === undefined ? undefined : body.description,
      altText: body.altText === undefined ? undefined : body.altText,
      thumbnailUrl: body.thumbnailUrl === undefined ? undefined : body.thumbnailUrl,
      storageKey: body.storageKey === undefined ? undefined : body.storageKey,
      location: body.location === undefined ? undefined : body.location,
      capturedAt: body.capturedAt === undefined ? undefined : body.capturedAt,
      categoryId: body.categoryId === undefined ? undefined : body.categoryId,
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  })

  res.json({ data: photo })
}

export async function adminDeletePhoto(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id)
  const existing = await prisma.photo.findUnique({ where: { id } })
  if (!existing) throw httpError(404, 'Photo not found')

  if (existing.storageKey) {
    await destroyImage(existing.storageKey)
  }

  await prisma.photo.delete({ where: { id } })
  res.json({ data: { ok: true } })
}

const bulkSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(100),
  action: z.enum([
    'publish',
    'unpublish',
    'feature',
    'unfeature',
    'delete',
    'setCategory',
  ]),
  categoryId: z.string().nullable().optional(),
})

export async function adminBulkPhotos(req: Request, res: Response): Promise<void> {
  const body = bulkSchema.parse(req.body)
  const { ids, action } = body

  if (action === 'delete') {
    const rows = await prisma.photo.findMany({
      where: { id: { in: ids } },
      select: { id: true, storageKey: true },
    })
    await Promise.all(
      rows.filter((r) => r.storageKey).map((r) => destroyImage(r.storageKey as string)),
    )
    const result = await prisma.photo.deleteMany({ where: { id: { in: ids } } })
    res.json({ data: { action, affected: result.count } })
    return
  }

  if (action === 'setCategory') {
    const result = await prisma.photo.updateMany({
      where: { id: { in: ids } },
      data: { categoryId: body.categoryId ?? null },
    })
    res.json({ data: { action, affected: result.count } })
    return
  }

  const data =
    action === 'publish'
      ? { isPublished: true }
      : action === 'unpublish'
        ? { isPublished: false }
        : action === 'feature'
          ? { isFeatured: true }
          : { isFeatured: false }

  const result = await prisma.photo.updateMany({
    where: { id: { in: ids } },
    data,
  })
  res.json({ data: { action, affected: result.count } })
}

const reorderSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1).max(500),
})

export async function adminReorderPhotos(req: Request, res: Response): Promise<void> {
  const body = reorderSchema.parse(req.body)

  await prisma.$transaction(
    body.orderedIds.map((id, index) =>
      prisma.photo.update({
        where: { id },
        data: { sortOrder: index + 1 },
      }),
    ),
  )

  res.json({ data: { ok: true, count: body.orderedIds.length } })
}
