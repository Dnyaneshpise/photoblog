import { Router } from 'express'
import multer from 'multer'
import { asyncHandler } from '../utils/asyncHandler.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import {
  adminLogin,
  adminLogout,
  adminMe,
} from '../controllers/adminAuthController.js'
import {
  adminListPhotos,
  adminCreatePhoto,
  adminUpdatePhoto,
  adminDeletePhoto,
} from '../controllers/adminPhotosController.js'
import {
  adminListCollections,
  adminCreateCollection,
  adminUpdateCollection,
  adminDeleteCollection,
} from '../controllers/adminCollectionsController.js'
import {
  adminGetSettings,
  adminUpdateSettings,
  adminListMessages,
  adminUpdateMessage,
} from '../controllers/adminSettingsController.js'
import { adminUploadImage } from '../controllers/adminUploadController.js'

/**
 * Admin API routes.
 * Why: All mutating operations live under /api/admin and require a session
 *      except login, which establishes the session.
 */
const router = Router()

// Memory storage — file is streamed to Cloudinary; nothing written to disk.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
})

// Auth
router.post('/auth/login', asyncHandler(adminLogin))
router.post('/auth/logout', asyncHandler(adminLogout))
router.get('/auth/me', requireAdmin, asyncHandler(adminMe))

// Upload (Cloudinary)
router.post(
  '/upload',
  requireAdmin,
  upload.single('file'),
  asyncHandler(adminUploadImage),
)

// Photos
router.get('/photos', requireAdmin, asyncHandler(adminListPhotos))
router.post('/photos', requireAdmin, asyncHandler(adminCreatePhoto))
router.patch('/photos/:id', requireAdmin, asyncHandler(adminUpdatePhoto))
router.delete('/photos/:id', requireAdmin, asyncHandler(adminDeletePhoto))

// Collections
router.get('/collections', requireAdmin, asyncHandler(adminListCollections))
router.post('/collections', requireAdmin, asyncHandler(adminCreateCollection))
router.patch('/collections/:id', requireAdmin, asyncHandler(adminUpdateCollection))
router.delete('/collections/:id', requireAdmin, asyncHandler(adminDeleteCollection))

// Settings & inbox
router.get('/settings', requireAdmin, asyncHandler(adminGetSettings))
router.patch('/settings', requireAdmin, asyncHandler(adminUpdateSettings))
router.get('/messages', requireAdmin, asyncHandler(adminListMessages))
router.patch('/messages/:id', requireAdmin, asyncHandler(adminUpdateMessage))

export default router
