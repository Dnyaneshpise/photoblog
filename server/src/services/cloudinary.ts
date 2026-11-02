import { v2 as cloudinary } from 'cloudinary'
import { env } from '../config/env.js'

/**
 * Configures the Cloudinary SDK from environment variables.
 * Why: Image binaries should not live in Postgres or the API container.
 * What: Returns whether upload is available; configure() is idempotent.
 */
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

/**
 * Uploads a buffer to Cloudinary and builds a thumbnail transform URL.
 * Why: Admin can attach real files; gallery lists use a smaller derivative.
 */
export async function uploadImageBuffer(
  buffer: Buffer,
  filename: string,
): Promise<UploadResult> {
  configureCloudinary()

  const folder = env.CLOUDINARY_FOLDER || 'photoblog'

  const result = await new Promise<{
    secure_url: string
    public_id: string
    width?: number
    height?: number
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        public_id: undefined,
        use_filename: true,
        unique_filename: true,
        filename_override: filename.replace(/\.[^.]+$/, ''),
      },
      (error, uploaded) => {
        if (error || !uploaded) {
          reject(error ?? new Error('Cloudinary upload failed'))
          return
        }
        resolve({
          secure_url: uploaded.secure_url,
          public_id: uploaded.public_id,
          width: uploaded.width,
          height: uploaded.height,
        })
      },
    )
    stream.end(buffer)
  })

  // Named transformation via URL — avoids a second upload for thumbnails.
  const thumbnailUrl = cloudinary.url(result.public_id, {
    secure: true,
    width: 800,
    crop: 'limit',
    quality: 'auto',
    fetch_format: 'auto',
  })

  return {
    imageUrl: result.secure_url,
    thumbnailUrl,
    storageKey: result.public_id,
    width: result.width ?? null,
    height: result.height ?? null,
  }
}
