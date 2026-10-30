import type { Request, Response } from 'express'
import { prisma } from '../config/prisma.js'
import { httpError } from '../middleware/errorHandler.js'

/**
 * Reads a single path param as a string.
 * Why: Express types params as string | string[]; Prisma where needs string.
 */
function paramString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

/**
 * GET /api/collections
 * Why: Portfolio "series" navigation is driven by published collections, not hardcoded sections.
 * What: Returns published collections ordered by sortOrder, with cover photo when set.
 */
export async function listCollections(_req: Request, res: Response): Promise<void> {
  const collections = await prisma.collection.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    include: {
      photos: {
        where: { photo: { isPublished: true } },
        orderBy: { sortOrder: 'asc' },
        take: 1,
        include: {
          photo: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
              thumbnailUrl: true,
              altText: true,
              width: true,
              height: true,
            },
          },
        },
      },
      _count: {
        select: { photos: { where: { photo: { isPublished: true } } } },
      },
    },
  })

  const data = await Promise.all(
    collections.map(async (collection) => {
      let cover = collection.photos[0]?.photo ?? null

      if (collection.coverPhotoId) {
        const coverPhoto = await prisma.photo.findFirst({
          where: { id: collection.coverPhotoId, isPublished: true },
          select: {
            id: true,
            title: true,
            imageUrl: true,
            thumbnailUrl: true,
            altText: true,
            width: true,
            height: true,
          },
        })
        if (coverPhoto) cover = coverPhoto
      }

      return {
        id: collection.id,
        title: collection.title,
        slug: collection.slug,
        description: collection.description,
        sortOrder: collection.sortOrder,
        publishedPhotoCount: collection._count.photos,
        coverPhoto: cover,
      }
    }),
  )

  res.json({ data })
}

/**
 * GET /api/collections/:slug
 * Why: Collection detail pages need title, description, and ordered published photos.
 * What: Looks up by slug; 404 if missing or unpublished.
 */
export async function getCollectionBySlug(req: Request, res: Response): Promise<void> {
  const slug = paramString(req.params.slug)

  const collection = await prisma.collection.findFirst({
    where: { slug, isPublished: true },
    include: {
      photos: {
        where: { photo: { isPublished: true } },
        orderBy: { sortOrder: 'asc' },
        include: {
          photo: {
            include: {
              category: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      },
    },
  })

  if (!collection) {
    throw httpError(404, 'Collection not found')
  }

  const photos = collection.photos.map((row) => ({
    id: row.photo.id,
    title: row.photo.title,
    description: row.photo.description,
    altText: row.photo.altText,
    imageUrl: row.photo.imageUrl,
    thumbnailUrl: row.photo.thumbnailUrl,
    width: row.photo.width,
    height: row.photo.height,
    location: row.photo.location,
    isFeatured: row.photo.isFeatured,
    category: row.photo.category,
    collectionSortOrder: row.sortOrder,
  }))

  res.json({
    data: {
      id: collection.id,
      title: collection.title,
      slug: collection.slug,
      description: collection.description,
      sortOrder: collection.sortOrder,
      photos,
    },
  })
}
