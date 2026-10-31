import type { Request, Response, NextFunction } from 'express'
import { prisma } from '../config/prisma.js'
import { httpError } from './errorHandler.js'

/** Cookie name for the signed admin session. */
export const ADMIN_SESSION_COOKIE = 'photoblog_admin'

/**
 * Express Request extended with the authenticated admin (set by requireAdmin).
 */
export type AuthedRequest = Request & {
  admin?: {
    id: string
    email: string
    name: string | null
  }
}

/**
 * Guards admin-only routes.
 * Why: Public routes stay open; mutations must prove a valid signed session cookie.
 * What: Reads signed cookie, loads AdminUser, attaches admin to req or returns 401.
 */
export async function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const adminId = req.signedCookies?.[ADMIN_SESSION_COOKIE] as string | undefined

    if (!adminId) {
      throw httpError(401, 'Authentication required')
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: adminId },
      select: { id: true, email: true, name: true },
    })

    if (!admin) {
      throw httpError(401, 'Authentication required')
    }

    ;(req as AuthedRequest).admin = admin
    next()
  } catch (err) {
    next(err)
  }
}
