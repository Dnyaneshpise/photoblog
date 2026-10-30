import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  listCollections,
  getCollectionBySlug,
} from '../controllers/collectionsController.js'

/**
 * Public collection routes.
 * Why: Series / project pages are a core portfolio navigation pattern.
 */
const router = Router()

router.get('/collections', asyncHandler(listCollections))
router.get('/collections/:slug', asyncHandler(getCollectionBySlug))

export default router
