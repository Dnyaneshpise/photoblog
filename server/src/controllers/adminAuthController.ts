import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../config/prisma.js'
import { env } from '../config/env.js'
import { httpError } from '../middleware/errorHandler.js'
import { ADMIN_SESSION_COOKIE, type AuthedRequest } from '../middleware/requireAdmin.js'

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

/** Session cookie options — httpOnly so JS cannot read it; secure in production. */
function sessionCookieOptions() {
  return {
    httpOnly: true,
    signed: true,
    sameSite: 'lax' as const,
    secure: env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  }
}

/**
 * POST /api/admin/auth/login
 * Why: Only verified admins may mutate portfolio content.
 * What: Validates credentials with bcrypt, sets a signed session cookie.
 */
export async function adminLogin(req: Request, res: Response): Promise<void> {
  const body = loginSchema.parse(req.body)

  const admin = await prisma.adminUser.findUnique({ where: { email: body.email } })
  if (!admin) {
    // Same message whether email or password is wrong — avoids account enumeration.
    throw httpError(401, 'Invalid email or password')
  }

  const valid = await bcrypt.compare(body.password, admin.passwordHash)
  if (!valid) {
    throw httpError(401, 'Invalid email or password')
  }

  res.cookie(ADMIN_SESSION_COOKIE, admin.id, sessionCookieOptions())
  res.json({
    data: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    },
  })
}

/**
 * POST /api/admin/auth/logout
 * Why: Clearing the cookie ends ends the session on this browser.
 */
export async function adminLogout(_req: Request, res: Response): Promise<void> {
  res.clearCookie(ADMIN_SESSION_COOKIE, {
    httpOnly: true,
    signed: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    path: '/',
  })
  res.json({ data: { ok: true } })
}

/**
 * GET /api/admin/auth/me
 * Why: Frontend needs to know if a session is still valid when opening /admin.
 */
export async function adminMe(req: Request, res: Response): Promise<void> {
  const admin = (req as AuthedRequest).admin
  if (!admin) {
    throw httpError(401, 'Authentication required')
  }
  res.json({ data: admin })
}
