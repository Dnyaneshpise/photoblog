import type { Request, Response } from 'express'
import { prisma } from '../config/prisma.js'

export async function getArchiveStats(_req: Request, res: Response): Promise<void> {
  const [published, featured, collections, categories, locations] = await Promise.all([
    prisma.photo.count({ where: { isPublished: true } }),
    prisma.photo.count({ where: { isPublished: true, isFeatured: true } }),
    prisma.collection.count({ where: { isPublished: true } }),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: {
        name: true,
        slug: true,
        _count: { select: { photos: { where: { isPublished: true } } } },
      },
    }),
    prisma.photo.findMany({
      where: { isPublished: true, location: { not: null } },
      select: { location: true },
      distinct: ['location'],
      take: 40,
    }),
  ])

  res.json({
    data: {
      publishedPhotos: published,
      featuredPhotos: featured,
      collections,
      categories: categories.map((c) => ({
        name: c.name,
        slug: c.slug,
        publishedPhotoCount: c._count.photos,
      })),
      locations: locations
        .map((row) => row.location)
        .filter((v): v is string => Boolean(v && v.trim())),
      generatedAt: new Date().toISOString(),
    },
  })
}

export async function getSitemap(_req: Request, res: Response): Promise<void> {
  const [photos, collections] = await Promise.all([
    prisma.photo.findMany({
      where: { isPublished: true },
      select: { id: true, updatedAt: true, title: true },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.collection.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true, title: true },
      orderBy: { updatedAt: 'desc' },
    }),
  ])

  const staticPaths = ['/', '/gallery', '/collections', '/about', '/contact']

  res.json({
    data: {
      static: staticPaths.map((path) => ({ path, changefreq: 'weekly' as const })),
      photos: photos.map((p) => ({
        path: `/gallery/${p.id}`,
        title: p.title,
        lastmod: p.updatedAt.toISOString(),
      })),
      collections: collections.map((c) => ({
        path: `/collections/${c.slug}`,
        title: c.title,
        lastmod: c.updatedAt.toISOString(),
      })),
    },
  })
}

export async function getJsonFeed(req: Request, res: Response): Promise<void> {
  const limit = Math.min(Number(req.query.limit) || 20, 50)

  const photos = await prisma.photo.findMany({
    where: { isPublished: true },
    orderBy: [{ createdAt: 'desc' }],
    take: limit,
    select: {
      id: true,
      title: true,
      description: true,
      altText: true,
      imageUrl: true,
      thumbnailUrl: true,
      location: true,
      capturedAt: true,
      createdAt: true,
      category: { select: { name: true, slug: true } },
    },
  })

  res.json({
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Photoblog archive',
    home_page_url: process.env.CLIENT_URL || undefined,
    description: 'Latest published photographs from the portfolio.',
    items: photos.map((p) => ({
      id: p.id,
      url: `${(process.env.CLIENT_URL || '').replace(/\/$/, '')}/gallery/${p.id}`,
      title: p.title,
      content_text: p.description || p.altText || p.title,
      image: p.imageUrl,
      banner_image: p.thumbnailUrl || p.imageUrl,
      date_published: (p.capturedAt || p.createdAt).toISOString(),
      tags: p.category ? [p.category.name] : undefined,
      _photoblog: {
        location: p.location,
        categorySlug: p.category?.slug ?? null,
      },
    })),
  })
}
