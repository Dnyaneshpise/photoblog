import type { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../config/prisma.js'
import { httpError } from '../middleware/errorHandler.js'

const settingsBodySchema = z.object({
  photographerName: z.string().trim().min(1).max(200).optional(),
  tagline: z.string().trim().max(300).optional().nullable(),
  homepageIntro: z.string().trim().max(5000).optional().nullable(),
  biography: z.string().trim().max(10000).optional().nullable(),
  artistStatement: z.string().trim().max(10000).optional().nullable(),
  profileImageUrl: z.string().url().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  socialLinks: z.record(z.string(), z.string()).optional().nullable(),
})

/**
 * GET /api/admin/settings — full settings for the editor.
 */
export async function adminGetSettings(_req: Request, res: Response): Promise<void> {
  const settings = await prisma.portfolioSettings.findFirst({ orderBy: { updatedAt: 'desc' } })
  if (!settings) throw httpError(404, 'Portfolio settings not found')
  res.json({ data: settings })
}

/**
 * PATCH /api/admin/settings — update site identity copy.
 */
export async function adminUpdateSettings(req: Request, res: Response): Promise<void> {
  const body = settingsBodySchema.parse(req.body)

  const existing = await prisma.portfolioSettings.findFirst({ orderBy: { updatedAt: 'desc' } })
  if (!existing) throw httpError(404, 'Portfolio settings not found')

  const settings = await prisma.portfolioSettings.update({
    where: { id: existing.id },
    data: {
      photographerName: body.photographerName,
      tagline: body.tagline === undefined ? undefined : body.tagline,
      homepageIntro: body.homepageIntro === undefined ? undefined : body.homepageIntro,
      biography: body.biography === undefined ? undefined : body.biography,
      artistStatement: body.artistStatement === undefined ? undefined : body.artistStatement,
      profileImageUrl: body.profileImageUrl === undefined ? undefined : body.profileImageUrl,
      contactEmail: body.contactEmail === undefined ? undefined : body.contactEmail,
      socialLinks: body.socialLinks === undefined ? undefined : body.socialLinks,
    },
  })

  res.json({ data: settings })
}

/**
 * GET /api/admin/messages — contact form inbox.
 */
export async function adminListMessages(_req: Request, res: Response): Promise<void> {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  res.json({ data: messages })
}

/**
 * PATCH /api/admin/messages/:id — mark read/unread.
 */
export async function adminUpdateMessage(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id)
  const body = z.object({ isRead: z.boolean() }).parse(req.body)

  const existing = await prisma.contactMessage.findUnique({ where: { id } })
  if (!existing) throw httpError(404, 'Message not found')

  const message = await prisma.contactMessage.update({
    where: { id },
    data: { isRead: body.isRead },
  })
  res.json({ data: message })
}
