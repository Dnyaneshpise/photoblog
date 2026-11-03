import type { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../config/prisma.js'
import { httpError } from '../middleware/errorHandler.js'
import { destroyImage } from '../services/cloudinary.js'

const photoBodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional().nullable(),
  altText: z.string().trim().max(500).optional().nullable(),
  imageUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional().nullable(),
  storageKey: z.string().optional().nullable(),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
  location: z.string().trim().max(200).optional().nullable(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  categoryId: z.string().optional().nullable(),
})

export async function adminListPhotos(_req: Request, res: Response): Promise<void> {
  const photos = await prisma.photo.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  })
  res.json({ data: photos })
}

export async function adminCreatePhoto(req: Request, res: Response): Promise<void> {
  const body = photoBodySchema.parse(req.body)

  const photo = await prisma.photo.create({
    data: {
      title: body.title,
      description: body.description ?? null,
      altText: body.altText ?? null,
      imageUrl: body.imageUrl,
      thumbnailUrl: body.thumbnailUrl ?? null,
      storageKey: body.storageKey ?? null,
      width: body.width ?? null,
      height: body.height ?? null,
      location: body.location ?? null,
      isFeatured: body.isFeatured ?? false,
      isPublished: body.isPublished ?? false,
      sortOrder: body.sortOrder ?? 0,
      categoryId: body.categoryId ?? null,
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  })

  res.status(201).json({ data: photo })
}

export async function adminUpdatePhoto(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id)
  const body = photoBodySchema.partial().parse(req.body)

  const existing = await prisma.photo.findUnique({ where: { id } })
  if (!existing) throw httpError(404, 'Photo not found')

  const photo = await prisma.photo.update({
    where: { id },
    data: {
      ...body,
      description: body.description === undefined ? undefined : body.description,
      altText: body.altText === undefined ? undefined : body.altText,
      thumbnailUrl: body.thumbnailUrl === undefined ? undefined : body.thumbnailUrl,
      storageKey: body.storageKey === undefined ? undefined : body.storageKey,
      location: body.location === undefined ? undefined : body.location,
      categoryId: body.categoryId === undefined ? undefined : body.categoryId,
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  })

  res.json({ data: photo })
}

/**
 * DELETE /api/admin/photos/:id
 * Why: Remove portfolio row and, when possible, the Cloudinary binary.
 */
export async function adminDeletePhoto(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id)
  const existing = await prisma.photo.findUnique({ where: { id } })
  if (!existing) throw httpError(404, 'Photo not found')

  if (existing.storageKey) {
    await destroyImage(existing.storageKey)
  }

  await prisma.photo.delete({ where: { id } })
  res.json({ data: { ok: true } })
}
