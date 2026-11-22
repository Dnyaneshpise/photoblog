import rateLimit from 'express-rate-limit'
import { env } from '../config/env.js'

function makeLimiter(windowMs: number, max: number, message: string) {
  return rateLimit({
    windowMs,
    max: env.NODE_ENV === 'development' ? Math.max(max * 5, max) : max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: message },
  })
}

export const apiLimiter = makeLimiter(
  60_000,
  180,
  'Too many requests. Please slow down and try again shortly.',
)

export const contactLimiter = makeLimiter(
  15 * 60_000,
  8,
  'Too many contact submissions from this address. Please try again later.',
)

export const loginLimiter = makeLimiter(
  15 * 60_000,
  20,
  'Too many login attempts. Please wait and try again.',
)
