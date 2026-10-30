import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getSettings } from '../controllers/settingsController.js'

/**
 * Public portfolio settings route.
 * Why: About page and site chrome read identity from the API, not env hardcoding.
 */
const router = Router()

router.get('/settings', asyncHandler(getSettings))

export default router
