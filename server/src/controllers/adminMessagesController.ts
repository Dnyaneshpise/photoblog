import type { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../config/prisma.js'
import { httpError } from '../middleware/errorHandler.js'

export async function adminListMessages(req: Request, res: Response): Promise<void> {
  const query = z
    .object({
      unread: z
        .enum(['true', 'false'])
        .optional()
        .transform((v) => (v === undefined ? undefined : v === 'true')),
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(30),
    })
    .parse(req.query)

  const where = {
    ...(query.unread === true ? { isRead: false } : {}),
    ...(query.unread === false ? { isRead: true } : {}),
  }

  const skip = (query.page - 1) * query.limit
  const [total, messages] = await Promise.all([
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: query.limit,
    }),
  ])

  res.json({
    data: messages,
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit) || 1,
      unread: query.unread,
    },
  })
}

export async function adminGetMessage(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id)
  const markRead = req.query.markRead === 'true'

  const existing = await prisma.contactMessage.findUnique({ where: { id } })
  if (!existing) throw httpError(404, 'Message not found')

  const message = markRead
    ? await prisma.contactMessage.update({
        where: { id },
        data: { isRead: true },
      })
    : existing

  res.json({ data: message })
}

export async function adminUpdateMessage(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id)
  const body = z.object({ isRead: z.boolean() }).parse(req.body)

  const existing = await prisma.contactMessage.findUnique({ where: { id } })
  if (!existing) throw httpError(404, 'Message not found')

  const message = await prisma.contactMessage.update({
    where: { id },
    data: { isRead: body.isRead },
  })
  res.json({ data: message })
}

export async function adminMarkAllMessagesRead(_req: Request, res: Response): Promise<void> {
  const result = await prisma.contactMessage.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  })
  res.json({ data: { updated: result.count } })
}

export async function adminDeleteMessage(req: Request, res: Response): Promise<void> {
  const id = String(req.params.id)
  const existing = await prisma.contactMessage.findUnique({ where: { id } })
  if (!existing) throw httpError(404, 'Message not found')

  await prisma.contactMessage.delete({ where: { id } })
  res.json({ data: { ok: true } })
}
