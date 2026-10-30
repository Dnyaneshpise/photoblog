import type { Request, Response } from 'express'
import { prisma } from '../config/prisma.js'
import { httpError } from '../middleware/errorHandler.js'

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

  // Prefer explicit coverPhotoId when present; otherwise first ordered photo.
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
  const { slug } = req.params

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

  res.json({
    data: {
      id: collection.id,
      title: collection.title,
      slug: collection.slug,
      description: collection.description,
      sortOrder: collection.sortOrder,
      photos: collection.photos.map((row) => ({
        ...row.photo,
        collectionSortOrder: row.sortOrder,
      })),
    },
  })
}
