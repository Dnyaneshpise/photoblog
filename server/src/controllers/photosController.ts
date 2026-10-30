import type { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../config/prisma.js'
import { httpError } from '../middleware/errorHandler.js'

/** Query params accepted by GET /api/photos. */
const listQuerySchema = z.object({
  featured: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
  category: z.string().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(24),
})

/**
 * Reads a single path param as a string.
 * Why: Express types params as string | string[]; Prisma expects string.
 */
function paramString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

/**
 * GET /api/photos
 * Why: Powers the public gallery and homepage featured strip.
 * What: Returns only published photos, optional featured/category filters, paginated.
 */
export async function listPhotos(req: Request, res: Response): Promise<void> {
  const query = listQuerySchema.parse(req.query)

  const where: {
    isPublished: boolean
    isFeatured?: boolean
    category?: { slug: string }
  } = {
    isPublished: true,
  }

  if (query.featured !== undefined) {
    where.isFeatured = query.featured
  }

  if (query.category) {
    where.category = { slug: query.category }
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

/**
 * GET /api/photos/:id
 * Why: Single-photo view / lightbox needs full metadata for one published image.
 * What: Looks up by id; returns 404 if missing or not published (hides drafts).
 */
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

  if (!photo) {
    throw httpError(404, 'Photo not found')
  }

  res.json({ data: photo })
}

/**
 * GET /api/categories
 * Why: Gallery filters need the list of categories without hardcoding names in the UI.
 * What: Returns all categories ordered by name with published photo counts.
 */
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
