import type { Request, Response } from 'express'
import { prisma } from '../config/prisma.js'
import { contactBodySchema } from '../validators/contact.js'

/**
 * POST /api/contact
 * Why: Visitors need a way to reach the photographer without exposing a raw inbox in the UI.
 * What: Validates the body, stores a ContactMessage row, returns 201 without leaking internals.
 */
export async function submitContact(req: Request, res: Response): Promise<void> {
  const body = contactBodySchema.parse(req.body)

  const saved = await prisma.contactMessage.create({
    data: {
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
    },
    select: { id: true, createdAt: true },
  })

  // Do not echo the full message back — confirmation id is enough for the UI.
  res.status(201).json({
    data: {
      id: saved.id,
      createdAt: saved.createdAt,
      message: 'Thank you. Your message has been received.',
    },
  })
}
