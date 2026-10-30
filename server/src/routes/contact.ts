import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { asyncHandler } from '../utils/asyncHandler.js'
import { submitContact } from '../controllers/contactController.js'

/**
 * Public contact route with a strict rate limit.
 * Why: Contact forms are a common spam target; limit submissions per IP.
 * What: Allows 5 posts per 15 minutes per IP, then returns 429.
 */
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many contact submissions. Please try again later.' },
})

const router = Router()

router.post('/contact', contactLimiter, asyncHandler(submitContact))

export default router
