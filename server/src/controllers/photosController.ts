import type { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../config/prisma.js'
import { httpError } from '../middleware/errorHandler.js'

const listQuerySchema = z.object({
  featured: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
  category: z.string().min(1).optional(),
  location: z.string().min(1).max(120).optional(),
  sort: z.enum(['editorial', 'newest', 'oldest', 'title']).default('editorial'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(24),
})

function paramString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

function orderByForSort(sort: z.infer<typeof listQuerySchema>['sort']) {
  switch (sort) {
    case 'newest':
      return [{ createdAt: 'desc' as const }]
    case 'oldest':
      return [{ createdAt: 'asc' as const }]
    case 'title':
      return [{ title: 'asc' as const }]
    case 'editorial':
    default:
      return [{ sortOrder: 'asc' as const }, { createdAt: 'desc' as const }]
  }
}

export async function listPhotos(req: Request, res: Response): Promise<void> {
  const query = listQuerySchema.parse(req.query)

  const where: {
    isPublished: boolean
    isFeatured?: boolean
    category?: { slug: string }
    location?: { contains: string; mode: 'insensitive' }
  } = {
    isPublished: true,
  }

  if (query.featured !== undefined) where.isFeatured = query.featured
  if (query.category) where.category = { slug: query.category }
  if (query.location) where.location = { contains: query.location, mode: 'insensitive' }

  const skip = (query.page - 1) * query.limit
  const orderBy = orderByForSort(query.sort)

  const [total, photos] = await Promise.all([
    prisma.photo.count({ where }),
    prisma.photo.findMany({
      where,
      orderBy,
      skip,
      take: query.limit,
      include: {
        category: { select: { id: true, name: true, slug: true } },
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
      sort: query.sort,
      filters: {
        featured: query.featured ?? null,
        category: query.category ?? null,
        location: query.location ?? null,
      },
    },
  })
}

export async function getPhotoById(req: Request, res: Response): Promise<void> {
  const id = paramString(req.params.id)

  const photo = await prisma.photo.findFirst({
    where: { id, isPublished: true },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      collections: {
        include: {
          collection: {
            select: { id: true, title: true, slug: true },
          },
        },
      },
    },
  })

  if (!photo) throw httpError(404, 'Photo not found')
  res.json({ data: photo })
}

export async function listCategories(_req: Request, res: Response): Promise<void> {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { photos: { where: { isPublished: true } } } },
    },
  })

  res.json({
    data: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      publishedPhotoCount: c._count.photos,
    })),
  })
}

export async function listLocations(_req: Request, res: Response): Promise<void> {
  const rows = await prisma.photo.findMany({
    where: { isPublished: true, location: { not: null } },
    select: { location: true },
    distinct: ['location'],
    orderBy: { location: 'asc' },
    take: 100,
  })

  res.json({
    data: rows.map((r) => r.location).filter((v): v is string => Boolean(v && v.trim())),
  })
}
