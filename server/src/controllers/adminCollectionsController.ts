import type { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../config/prisma.js'
import { httpError } from '../middleware/errorHandler.js'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const collectionBodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(5000).optional().nullable(),
  coverPhotoId: z.string().optional().nullable(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  photoIds: z.array(z.string()).optional(),
})

/**
 * GET /api/admin/collections — all collections including drafts.
 */
export async function adminListCollections(_req: Request, res: Response): Promise<void> {
  const collections = await prisma.collection.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    include: {
      _count: { select: { photos: true } },
    },
  })
  res.json({
    data: collections.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      description: c.description,
      coverPhotoId: c.coverPhotoId,
      isPublished: c.isPublished,
      sortOrder: c.sortOrder,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      photoCount: c._count.photos,
    })),
  })
}

/**
 * GET /api/admin/collections/:id
 * Why: Editor needs ordered photo membership when assigning images to a series.
 */
export async function adminGetCollection(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id)

  const collection = await prisma.collection.findUnique({
    where: { id },
    include: {
      photos: {
        orderBy: { sortOrder: 'asc' },
        include: {
          photo: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
              thumbnailUrl: true,
              isPublished: true,
            },
          },
        },
      },
    },
  })

  if (!collection) throw httpError(404, 'Collection not found')

  res.json({
    data: {
      id: collection.id,
      title: collection.title,
      slug: collection.slug,
      description: collection.description,
      coverPhotoId: collection.coverPhotoId,
      isPublished: collection.isPublished,
      sortOrder: collection.sortOrder,
      photoIds: collection.photos.map((row) => row.photoId),
      photos: collection.photos.map((row) => ({
        ...row.photo,
        collectionSortOrder: row.sortOrder,
      })),
    },
  })
}

/**
 * POST /api/admin/collections
 */
export async function adminCreateCollection(req: Request, res: Response): Promise<void> {
  const body = collectionBodySchema.parse(req.body)
  const slug = body.slug?.length ? slugify(body.slug) : slugify(body.title)

  const collection = await prisma.collection.create({
    data: {
      title: body.title,
      slug,
      description: body.description ?? null,
      coverPhotoId: body.coverPhotoId ?? null,
      isPublished: body.isPublished ?? false,
      sortOrder: body.sortOrder ?? 0,
      photos: body.photoIds
        ? {
            create: body.photoIds.map((photoId, index) => ({
              photoId,
              sortOrder: index + 1,
            })),
          }
        : undefined,
    },
  })

  res.status(201).json({ data: collection })
}

/**
 * PATCH /api/admin/collections/:id
 */
export async function adminUpdateCollection(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id)
  const body = collectionBodySchema.partial().parse(req.body)

  const existing = await prisma.collection.findUnique({ where: { id } })
  if (!existing) throw httpError(404, 'Collection not found')

  if (body.photoIds) {
    await prisma.photoCollection.deleteMany({ where: { collectionId: id } })
    if (body.photoIds.length > 0) {
      await prisma.photoCollection.createMany({
        data: body.photoIds.map((photoId, index) => ({
          collectionId: id,
          photoId,
          sortOrder: index + 1,
        })),
      })
    }
  }

  const collection = await prisma.collection.update({
    where: { id },
    data: {
      title: body.title,
      slug: body.slug ? slugify(body.slug) : undefined,
      description: body.description === undefined ? undefined : body.description,
      coverPhotoId: body.coverPhotoId === undefined ? undefined : body.coverPhotoId,
      isPublished: body.isPublished,
      sortOrder: body.sortOrder,
    },
  })

  res.json({ data: collection })
}

/**
 * DELETE /api/admin/collections/:id
 */
export async function adminDeleteCollection(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id)
  const existing = await prisma.collection.findUnique({ where: { id } })
  if (!existing) throw httpError(404, 'Collection not found')

  await prisma.collection.delete({ where: { id } })
  res.json({ data: { ok: true } })
}
