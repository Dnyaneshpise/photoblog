import type { Request, Response } from 'express'
import { prisma } from '../config/prisma.js'
import { httpError } from '../middleware/errorHandler.js'

/**
 * GET /api/settings
 * Why: Photographer name, bio, and social links live in the database so the site
 *      is not hardcoded and can be edited from admin later.
 * What: Returns the single PortfolioSettings row (seed creates one).
 */
export async function getSettings(_req: Request, res: Response): Promise<void> {
  const settings = await prisma.portfolioSettings.findFirst({
    orderBy: { updatedAt: 'desc' },
  })

  if (!settings) {
    throw httpError(404, 'Portfolio settings not found')
  }

  // Never expose internal admin-only fields if we add them later; select explicitly.
  res.json({
    data: {
      photographerName: settings.photographerName,
      tagline: settings.tagline,
      homepageIntro: settings.homepageIntro,
      biography: settings.biography,
      artistStatement: settings.artistStatement,
      profileImageUrl: settings.profileImageUrl,
      contactEmail: settings.contactEmail,
      socialLinks: settings.socialLinks,
      updatedAt: settings.updatedAt,
    },
  })
}
