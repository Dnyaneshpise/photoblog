import type { Request, Response } from 'express'
import { httpError } from '../middleware/errorHandler.js'
import {
  isCloudinaryConfigured,
  uploadImageBuffer,
  describeCloudinaryError,
} from '../services/cloudinary.js'

/**
 * POST /api/admin/upload
 * Why: Admins need to attach real image files, not only paste remote URLs.
 * What: Accepts multipart field "file", uploads to Cloudinary, returns URLs + metadata.
 */
export async function adminUploadImage(req: Request, res: Response): Promise<void> {
  if (!isCloudinaryConfigured()) {
    throw httpError(
      503,
      'Cloudinary is not configured. On Render, set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET from the Cloudinary console → Account → API Keys.',
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

  const maxBytes = 10 * 1024 * 1024
  if (file.size > maxBytes) {
    throw httpError(400, 'Image must be 10MB or smaller.')
  }

  try {
    const uploaded = await uploadImageBuffer(
      file.buffer,
      file.originalname || 'photo.jpg',
      file.mimetype,
    )
    res.status(201).json({ data: uploaded })
  } catch (err) {
    // Prefer statusCode we attach in the service; otherwise map raw Cloudinary errors.
    if (err && typeof err === 'object' && 'statusCode' in err) {
      throw err
    }
    const described = describeCloudinaryError(err)
    throw httpError(described.status, described.message)
  }
}
