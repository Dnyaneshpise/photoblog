import { FormEvent, useCallback, useEffect, useState } from 'react'
import { apiDelete, apiGet, apiPatch, apiPost, ApiError } from '../../lib/api'

type AdminCollection = {
  id: string
  title: string
  slug: string
  description: string | null
  isPublished: boolean
  sortOrder: number
  photoCount: number
}

export function AdminCollectionsPage() {
  const [items, setItems] = useState<AdminCollection[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await apiGet<{ data: AdminCollection[] }>('/api/admin/collections')
      setItems(result.data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    try {
      await apiPost('/api/admin/collections', {
        title,
        description: description || undefined,
        isPublished,
      })
      setTitle('')
      setDescription('')
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Create failed')
    }
  }

  async function togglePublish(item: AdminCollection) {
    try {
      await apiPatch(`/api/admin/collections/${item.id}`, { isPublished: !item.isPublished })
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Update failed')
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this collection?')) return
    try {
      await apiDelete(`/api/admin/collections/${id}`)
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Delete failed')
    }
  }

  const field =
    'w-full px-3 py-2 border border-[var(--color-border)] bg-[var(--color-surface)] outline-none focus:border-[var(--color-ink)]'

  return (
    <div className="space-y-10">
      <h1 className="text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
        Collections
      </h1>
      {error && <p className="text-sm text-red-700">{error}</p>}

      <form
        onSubmit={onCreate}
        className="space-y-4 p-6 border border-[var(--color-border)] bg-[var(--color-surface)]"
      >
        <input
          required
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={field}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={field}
          rows={3}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          Published
        </label>
        <button
          type="submit"
          className="px-6 py-3 text-xs tracking-[0.16em] uppercase bg-[var(--color-ink)] text-[var(--color-canvas)]"
        >
          Add collection
        </button>
      </form>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 p-4 border border-[var(--color-border)]"
            >
              <div>
                <p style={{ fontFamily: 'var(--font-display)' }} className="text-xl">
                  {item.title}
                </p>
                <p className="text-xs text-[var(--color-ink-subtle)]">
                  /{item.slug} · {item.photoCount} photos ·{' '}
                  {item.isPublished ? 'Published' : 'Draft'}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="text-xs uppercase tracking-wider"
                  onClick={() => void togglePublish(item)}
                >
                  Toggle publish
                </button>
                <button
                  type="button"
                  className="text-xs uppercase tracking-wider text-red-700"
                  onClick={() => void remove(item.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
