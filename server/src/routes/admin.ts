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
  adminGetCollection,
  adminCreateCollection,
  adminUpdateCollection,
  adminDeleteCollection,
} from '../controllers/adminCollectionsController.js'
import {
  adminListCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from '../controllers/adminCategoriesController.js'
import {
  adminGetSettings,
  adminUpdateSettings,
  adminListMessages,
  adminUpdateMessage,
} from '../controllers/adminSettingsController.js'
import { adminUploadImage } from '../controllers/adminUploadController.js'

const router = Router()

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES },
})

router.post('/auth/login', asyncHandler(adminLogin))
router.post('/auth/logout', asyncHandler(adminLogout))
router.get('/auth/me', requireAdmin, asyncHandler(adminMe))

router.post('/upload', requireAdmin, upload.single('file'), asyncHandler(adminUploadImage))

router.get('/photos', requireAdmin, asyncHandler(adminListPhotos))
router.post('/photos', requireAdmin, asyncHandler(adminCreatePhoto))
router.patch('/photos/:id', requireAdmin, asyncHandler(adminUpdatePhoto))
router.delete('/photos/:id', requireAdmin, asyncHandler(adminDeletePhoto))

router.get('/collections', requireAdmin, asyncHandler(adminListCollections))
router.get('/collections/:id', requireAdmin, asyncHandler(adminGetCollection))
router.post('/collections', requireAdmin, asyncHandler(adminCreateCollection))
router.patch('/collections/:id', requireAdmin, asyncHandler(adminUpdateCollection))
router.delete('/collections/:id', requireAdmin, asyncHandler(adminDeleteCollection))

router.get('/categories', requireAdmin, asyncHandler(adminListCategories))
router.post('/categories', requireAdmin, asyncHandler(adminCreateCategory))
router.patch('/categories/:id', requireAdmin, asyncHandler(adminUpdateCategory))
router.delete('/categories/:id', requireAdmin, asyncHandler(adminDeleteCategory))

router.get('/settings', requireAdmin, asyncHandler(adminGetSettings))
router.patch('/settings', requireAdmin, asyncHandler(adminUpdateSettings))
router.get('/messages', requireAdmin, asyncHandler(adminListMessages))
router.patch('/messages/:id', requireAdmin, asyncHandler(adminUpdateMessage))

export default router
