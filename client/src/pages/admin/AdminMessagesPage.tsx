import { useCallback, useEffect, useState } from 'react'
import { apiGet, apiPatch, ApiError } from '../../lib/api'

type Message = {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  isRead: boolean
  createdAt: string
}

export function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const result = await apiGet<{ data: Message[] }>('/api/admin/messages')
      setMessages(result.data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load messages')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function markRead(id: string, isRead: boolean) {
    try {
      await apiPatch(`/api/admin/messages/${id}`, { isRead })
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Update failed')
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
        Messages
      </h1>
      {error && <p className="text-sm text-red-700">{error}</p>}

      {messages.length === 0 ? (
        <p className="text-[var(--color-ink-muted)]">No messages yet.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className="p-5 border border-[var(--color-border)] bg-[var(--color-surface)] space-y-2"
            >
              <div className="flex flex-wrap justify-between gap-2">
                <p className="font-medium">
                  {m.name}{' '}
                  <span className="text-[var(--color-ink-subtle)] font-normal">&lt;{m.email}&gt;</span>
                </p>
                <p className="text-xs text-[var(--color-ink-subtle)]">
                  {new Date(m.createdAt).toLocaleString()} · {m.isRead ? 'Read' : 'Unread'}
                </p>
              </div>
              {m.subject && <p className="text-sm">{m.subject}</p>}
              <p className="text-[var(--color-ink-muted)] whitespace-pre-wrap">{m.message}</p>
              <button
                type="button"
                className="text-xs uppercase tracking-wider"
                onClick={() => void markRead(m.id, !m.isRead)}
              >
                Mark as {m.isRead ? 'unread' : 'read'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
