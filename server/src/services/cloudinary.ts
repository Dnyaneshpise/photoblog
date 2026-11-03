import { v2 as cloudinary } from 'cloudinary'
import { env } from '../config/env.js'

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET,
  )
}

export function configureCloudinary(): void {
  if (!isCloudinaryConfigured()) return

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

export type UploadResult = {
  imageUrl: string
  thumbnailUrl: string
  storageKey: string
  width: number | null
  height: number | null
}

export function describeCloudinaryError(err: unknown): { message: string; status: number } {
  const anyErr = err as {
    message?: string
    http_code?: number
    name?: string
    error?: { message?: string }
  }

  const httpCode = anyErr?.http_code
  const raw =
    anyErr?.error?.message ||
    anyErr?.message ||
    (err instanceof Error ? err.message : 'Cloudinary upload failed')

  if (httpCode === 401 || httpCode === 403 || /\b403\b|\b401\b|unauthorized|forbidden/i.test(raw)) {
    return {
      status: 502,
      message:
        'Cloudinary rejected the upload (403/401). Check Render env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET must match the API Keys page. Use an unrestricted key and a verified account.',
    }
  }

  if (httpCode && httpCode >= 400 && httpCode < 500) {
    return { status: 400, message: `Cloudinary: ${raw}` }
  }

  return { status: 502, message: `Cloudinary: ${raw}` }
}

export async function uploadImageBuffer(
  buffer: Buffer,
  filename: string,
  mimeType: string,
): Promise<UploadResult> {
  configureCloudinary()

  const folder = env.CLOUDINARY_FOLDER || 'photoblog'
  const safeName = filename.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80)
  const dataUri = `data:${mimeType};base64,${buffer.toString('base64')}`

  try {
    const uploaded = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: 'image',
      use_filename: true,
      unique_filename: true,
      filename_override: safeName || 'photo',
      overwrite: false,
    })

    const thumbnailUrl = cloudinary.url(uploaded.public_id, {
      secure: true,
      width: 800,
      crop: 'limit',
      quality: 'auto',
      fetch_format: 'auto',
    })

    return {
      imageUrl: uploaded.secure_url,
      thumbnailUrl,
      storageKey: uploaded.public_id,
      width: uploaded.width ?? null,
      height: uploaded.height ?? null,
    }
  } catch (err) {
    const described = describeCloudinaryError(err)
    const error = new Error(described.message) as Error & { statusCode: number }
    error.statusCode = described.status
    throw error
  }
}

/**
 * Deletes an asset from Cloudinary by public_id (storageKey).
 * Why: Removing a photo row should not leave orphaned binaries in the cloud.
 * What: Best-effort destroy; failures are logged but do not block DB delete.
 */
export async function destroyImage(storageKey: string): Promise<void> {
  if (!isCloudinaryConfigured() || !storageKey) return
  configureCloudinary()
  try {
    await cloudinary.uploader.destroy(storageKey, { resource_type: 'image' })
  } catch (err) {
    console.error('[cloudinary] destroy failed', storageKey, err)
  }
}
