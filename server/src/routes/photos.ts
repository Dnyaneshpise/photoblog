import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  listPhotos,
  getPhotoById,
  listCategories,
} from '../controllers/photosController.js'

/**
 * Public photo and category routes.
 * Why: Keeps HTTP path definitions separate from business logic (controllers).
 * What: Mounts list/detail photo endpoints and the categories list under /api.
 */
const router = Router()

// Categories first so "/categories" is not captured by "/:id".
router.get('/categories', asyncHandler(listCategories))
router.get('/photos', asyncHandler(listPhotos))
router.get('/photos/:id', asyncHandler(getPhotoById))

export default router
