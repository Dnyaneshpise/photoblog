import { FormEvent, useEffect, useState } from 'react'
import { apiGet, apiPatch, ApiError } from '../../lib/api'

type Settings = {
  photographerName: string
  tagline: string | null
  homepageIntro: string | null
  biography: string | null
  artistStatement: string | null
  contactEmail: string | null
}

export function AdminSettingsPage() {
  const [form, setForm] = useState<Settings | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    apiGet<{ data: Settings }>('/api/admin/settings')
      .then((r) => setForm(r.data))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Load failed'))
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const result = await apiPatch<{ data: Settings }>('/api/admin/settings', form)
      setForm(result.data)
      setSaved(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (!form && !error) return <p>Loading settings…</p>
  if (!form) return <p className="text-red-700">{error}</p>

  const field =
    'w-full px-3 py-2 border border-[var(--color-border)] bg-[var(--color-surface)] outline-none focus:border-[var(--color-ink)]'

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
      <h1 className="text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
        Site settings
      </h1>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {saved && <p className="text-sm text-[var(--color-ink-muted)]">Saved.</p>}

      {(
        [
          ['photographerName', 'Photographer name'],
          ['tagline', 'Tagline'],
          ['contactEmail', 'Contact email'],
        ] as const
      ).map(([key, label]) => (
        <div key={key} className="space-y-2">
          <label className="text-xs tracking-[0.12em] uppercase text-[var(--color-ink-subtle)]">
            {label}
          </label>
          <input
            className={field}
            value={form[key] ?? ''}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        </div>
      ))}

      {(
        [
          ['homepageIntro', 'Homepage intro'],
          ['biography', 'Biography'],
          ['artistStatement', 'Artist statement'],
        ] as const
      ).map(([key, label]) => (
        <div key={key} className="space-y-2">
          <label className="text-xs tracking-[0.12em] uppercase text-[var(--color-ink-subtle)]">
            {label}
          </label>
          <textarea
            className={field}
            rows={5}
            value={form[key] ?? ''}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={saving}
        className="px-6 py-3 text-xs tracking-[0.16em] uppercase bg-[var(--color-ink)] text-[var(--color-canvas)] disabled:opacity-60"
      >
        {saving ? 'Saving…' : 'Save settings'}
      </button>
    </form>
  )
}
