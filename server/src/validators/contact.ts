import { z } from 'zod'

/**
 * Body schema for POST /api/contact.
 * Why: Never trust client input; reject empty or oversized messages early.
 * What: Requires name, email, and message; subject is optional.
 */
export const contactBodySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().email('Valid email is required').max(254),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000),
})

export type ContactBody = z.infer<typeof contactBodySchema>
