import { FormEvent, useState } from 'react'
import { apiPost, ApiError } from '../lib/api'
import type { ContactSuccess } from '../types/api'

/**
 * Public contact form.
 * Why: Visitors can reach the photographer; messages land in the database for admin later.
 */
export function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await apiPost<ContactSuccess>('/api/contact', {
        name,
        email,
        subject: subject || undefined,
        message,
      })
      setSuccess(result.data.message)
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Could not send message'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const fieldClass =
    'w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-subtle)] focus:border-[var(--color-ink)] outline-none transition-colors'

  return (
    <div className="px-6 md:px-12 py-14 md:py-20">
      <div className="max-w-xl mx-auto space-y-10">
        <header className="space-y-4">
          <p className="text-xs tracking-[0.22em] uppercase text-[var(--color-ink-subtle)]">Contact</p>
          <h1
            className="text-4xl md:text-5xl text-[var(--color-ink)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Write a note
          </h1>
          <p className="text-[var(--color-ink-muted)] leading-relaxed">
            For commissions, prints, or a quiet hello — messages are stored securely and read personally.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs tracking-[0.14em] uppercase text-[var(--color-ink-subtle)]">
              Name
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-xs tracking-[0.14em] uppercase text-[var(--color-ink-subtle)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-xs tracking-[0.14em] uppercase text-[var(--color-ink-subtle)]">
              Subject <span className="normal-case tracking-normal">(optional)</span>
            </label>
            <input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={fieldClass}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-xs tracking-[0.14em] uppercase text-[var(--color-ink-subtle)]">
              Message
            </label>
            <textarea
              id="message"
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${fieldClass} resize-y min-h-[9rem]`}
            />
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}
          {success && <p className="text-sm text-[var(--color-ink-muted)]">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center px-7 py-3 text-xs tracking-[0.18em] uppercase bg-[var(--color-ink)] text-[var(--color-canvas)] disabled:opacity-60"
          >
            {submitting ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  )
}
