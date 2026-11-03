import type { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../config/prisma.js'
import { httpError } from '../middleware/errorHandler.js'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const categoryBodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(120).optional(),
})

/**
 * GET /api/admin/categories
 */
export async function adminListCategories(_req: Request, res: Response): Promise<void> {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { photos: true } } },
  })
  res.json({
    data: categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      photoCount: c._count.photos,
    })),
  })
}

/**
 * POST /api/admin/categories
 */
export async function adminCreateCategory(req: Request, res: Response): Promise<void> {
  const body = categoryBodySchema.parse(req.body)
  const slug = body.slug?.length ? slugify(body.slug) : slugify(body.name)

  const category = await prisma.category.create({
    data: { name: body.name, slug },
  })
  res.status(201).json({ data: category })
}

/**
 * PATCH /api/admin/categories/:id
 */
export async function adminUpdateCategory(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id)
  const body = categoryBodySchema.partial().parse(req.body)

  const existing = await prisma.category.findUnique({ where: { id } })
  if (!existing) throw httpError(404, 'Category not found')

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug ? slugify(body.slug) : body.name ? slugify(body.name) : undefined,
    },
  })
  res.json({ data: category })
}

/**
 * DELETE /api/admin/categories/:id
 * Photos keep their rows; categoryId is set null via onDelete: SetNull.
 */
export async function adminDeleteCategory(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id)
  const existing = await prisma.category.findUnique({ where: { id } })
  if (!existing) throw httpError(404, 'Category not found')

  await prisma.category.delete({ where: { id } })
  res.json({ data: { ok: true } })
}
