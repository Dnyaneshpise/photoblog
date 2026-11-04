import { FormEvent, useState } from 'react'
import { apiPost, ApiError } from '../lib/api'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { ContactSuccess } from '../types/api'

export function ContactPage() {
  useDocumentTitle('Contact — Photoblog')
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

  return (
    <div className="pl-page">
      <div className="max-w-lg mx-auto space-y-12">
        <header className="space-y-5">
          <p className="pl-kicker">Contact</p>
          <h1 className="pl-display text-[clamp(2.2rem,5vw,3.5rem)]">Write a note</h1>
          <p className="pl-lead">
            For commissions, prints, or a quiet hello — messages are read personally.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-8">
          <div>
            <label htmlFor="name" className="pl-label">Name</label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-field"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="email" className="pl-label">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-field"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="subject" className="pl-label">
              Subject <span className="normal-case tracking-normal opacity-60">(optional)</span>
            </label>
            <input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="pl-field"
            />
          </div>

          <div>
            <label htmlFor="message" className="pl-label">Message</label>
            <textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="pl-field resize-y min-h-[8rem]"
            />
          </div>

          {error && <p className="text-sm text-red-800">{error}</p>}
          {success && <p className="text-sm text-[var(--color-ink-secondary)]">{success}</p>}

          <button type="submit" disabled={submitting} className="pl-btn">
            {submitting ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  )
}
