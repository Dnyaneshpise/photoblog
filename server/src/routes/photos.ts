import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  listPhotos, getPhotoById, listCategories, listLocations,
} from '../controllers/photosController.js'
import {
  getRandomPhotos, searchPhotos, getPhotoNeighbors, getRelatedPhotos,
} from '../controllers/discoveryController.js'
import { publicCache } from '../middleware/publicCache.js'

const router = Router()
router.use(publicCache(90))

router.get('/categories', asyncHandler(listCategories))
router.get('/locations', asyncHandler(listLocations))
router.get('/photos', asyncHandler(listPhotos))
router.get('/photos/random', asyncHandler(getRandomPhotos))
router.get('/photos/search', asyncHandler(searchPhotos))
router.get('/photos/:id/neighbors', asyncHandler(getPhotoNeighbors))
router.get('/photos/:id/related', asyncHandler(getRelatedPhotos))
router.get('/photos/:id', asyncHandler(getPhotoById))

export default router
