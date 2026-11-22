import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { submitContact } from '../controllers/contactController.js'
import { contactLimiter } from '../middleware/rateLimit.js'

const router = Router()
router.post('/contact', contactLimiter, asyncHandler(submitContact))
export default router
