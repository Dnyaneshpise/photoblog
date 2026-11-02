import type { Request, Response } from 'express'
import { httpError } from '../middleware/errorHandler.js'
import { isCloudinaryConfigured, uploadImageBuffer } from '../services/cloudinary.js'

/**
 * POST /api/admin/upload
 * Why: Admins need to attach real image files, not only paste remote URLs.
 * What: Accepts multipart field "file", uploads to Cloudinary, returns URLs + metadata.
 */
export async function adminUploadImage(req: Request, res: Response): Promise<void> {
  if (!isCloudinaryConfigured()) {
    throw httpError(
      503,
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.',
    )
  }

  const file = req.file
  if (!file) {
    throw httpError(400, 'No file uploaded. Use form field name "file".')
  }

  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowed.includes(file.mimetype)) {
    throw httpError(400, 'Only JPEG, PNG, WebP, or GIF images are allowed.')
  }

  // Soft limit — Cloudinary free tier and API body size.
  const maxBytes = 10 * 1024 * 1024
  if (file.size > maxBytes) {
    throw httpError(400, 'Image must be 10MB or smaller.')
  }

  const uploaded = await uploadImageBuffer(file.buffer, file.originalname || 'photo')

  res.status(201).json({ data: uploaded })
}
