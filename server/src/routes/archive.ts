import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  getArchiveStats,
  getSitemap,
  getJsonFeed,
} from '../controllers/archiveController.js'
import { publicCache } from '../middleware/publicCache.js'

const router = Router()

router.use(publicCache(120))

router.get('/archive/stats', asyncHandler(getArchiveStats))
router.get('/sitemap', asyncHandler(getSitemap))
router.get('/feed', asyncHandler(getJsonFeed))

export default router
