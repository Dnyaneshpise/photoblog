import type { Request, Response } from 'express'
import { prisma } from '../config/prisma.js'

/**
 * GET /api/admin/dashboard
 * Why: Admin home needs a single payload — drafts, inbox, recent activity — without five round-trips.
 * What: Parallel aggregates + recent photos and unread messages for an operational overview.
 */
export async function adminDashboard(_req: Request, res: Response): Promise<void> {
  const [
    publishedPhotos,
    draftPhotos,
    featuredPhotos,
    publishedCollections,
    draftCollections,
    categories,
    unreadMessages,
    totalMessages,
    recentPhotos,
    recentMessages,
  ] = await Promise.all([
    prisma.photo.count({ where: { isPublished: true } }),
    prisma.photo.count({ where: { isPublished: false } }),
    prisma.photo.count({ where: { isFeatured: true } }),
    prisma.collection.count({ where: { isPublished: true } }),
    prisma.collection.count({ where: { isPublished: false } }),
    prisma.category.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.contactMessage.count(),
    prisma.photo.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 8,
      select: {
        id: true,
        title: true,
        isPublished: true,
        isFeatured: true,
        thumbnailUrl: true,
        imageUrl: true,
        updatedAt: true,
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.contactMessage.findMany({
      where: { isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        createdAt: true,
        isRead: true,
      },
    }),
  ])

  res.json({
    data: {
      counts: {
        publishedPhotos,
        draftPhotos,
        featuredPhotos,
        publishedCollections,
        draftCollections,
        categories,
        unreadMessages,
        totalMessages,
      },
      recentPhotos,
      recentUnreadMessages: recentMessages,
      generatedAt: new Date().toISOString(),
    },
  })
}
