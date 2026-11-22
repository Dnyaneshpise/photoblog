import { Router } from 'express'
import multer from 'multer'
import { asyncHandler } from '../utils/asyncHandler.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { loginLimiter } from '../middleware/rateLimit.js'
import { adminLogin, adminLogout, adminMe } from '../controllers/adminAuthController.js'
import {
  adminListPhotos, adminCreatePhoto, adminUpdatePhoto, adminDeletePhoto,
  adminBulkPhotos, adminReorderPhotos,
} from '../controllers/adminPhotosController.js'
import {
  adminListCollections, adminGetCollection, adminCreateCollection,
  adminUpdateCollection, adminDeleteCollection,
} from '../controllers/adminCollectionsController.js'
import {
  adminListCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory,
} from '../controllers/adminCategoriesController.js'
import { adminGetSettings, adminUpdateSettings } from '../controllers/adminSettingsController.js'
import {
  adminListMessages, adminGetMessage, adminUpdateMessage,
  adminMarkAllMessagesRead, adminDeleteMessage,
} from '../controllers/adminMessagesController.js'
import { adminDashboard } from '../controllers/adminDashboardController.js'
import { adminUploadImage } from '../controllers/adminUploadController.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } })

router.post('/auth/login', loginLimiter, asyncHandler(adminLogin))
router.post('/auth/logout', asyncHandler(adminLogout))
router.get('/auth/me', requireAdmin, asyncHandler(adminMe))
router.get('/dashboard', requireAdmin, asyncHandler(adminDashboard))
router.post('/upload', requireAdmin, upload.single('file'), asyncHandler(adminUploadImage))

router.get('/photos', requireAdmin, asyncHandler(adminListPhotos))
router.post('/photos', requireAdmin, asyncHandler(adminCreatePhoto))
router.post('/photos/bulk', requireAdmin, asyncHandler(adminBulkPhotos))
router.post('/photos/reorder', requireAdmin, asyncHandler(adminReorderPhotos))
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
router.post('/messages/mark-all-read', requireAdmin, asyncHandler(adminMarkAllMessagesRead))
router.get('/messages/:id', requireAdmin, asyncHandler(adminGetMessage))
router.patch('/messages/:id', requireAdmin, asyncHandler(adminUpdateMessage))
router.delete('/messages/:id', requireAdmin, asyncHandler(adminDeleteMessage))

export default router
