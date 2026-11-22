import { z } from 'zod'

/**
 * Body schema for POST /api/contact.
 * Why: Never trust client input; reject empty or oversized messages early.
 * What: Requires name, email, and message; subject optional; honeypot field must stay empty.
 */
export const contactBodySchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(120),
    email: z.string().trim().email('Valid email is required').max(254),
    subject: z.string().trim().max(200).optional(),
    message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000),
    /** Honeypot — real users leave this blank; bots often fill hidden fields. */
    website: z.string().max(0).optional().or(z.literal('')),
  })
  .transform((data) => {
    // Strip honeypot from downstream use.
    const { website: _honeypot, ...rest } = data
    return rest
  })

export type ContactBody = z.infer<typeof contactBodySchema>
