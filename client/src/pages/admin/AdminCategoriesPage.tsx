import { FormEvent, useCallback, useEffect, useState } from 'react'
import { apiDelete, apiGet, apiPost, ApiError } from '../../lib/api'

type AdminCategory = {
  id: string
  name: string
  slug: string
  photoCount: number
}

/**
 * Manage gallery categories used as public filters.
 */
export function AdminCategoriesPage() {
  const [items, setItems] = useState<AdminCategory[]>([])
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await apiGet<{ data: AdminCategory[] }>('/api/admin/categories')
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
      await apiPost('/api/admin/categories', { name })
      setName('')
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Create failed')
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this category? Photos stay; they become uncategorized.')) return
    try {
      await apiDelete(`/api/admin/categories/${id}`)
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
        Categories
      </h1>
      {error && <p className="text-sm text-red-700">{error}</p>}

      <form onSubmit={onCreate} className="flex flex-col sm:flex-row gap-3 max-w-xl">
        <input
          required
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={field}
        />
        <button
          type="submit"
          className="px-6 py-3 text-xs tracking-[0.16em] uppercase bg-[var(--color-ink)] text-[var(--color-canvas)] shrink-0"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul className="space-y-2 max-w-xl">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 p-3 border border-[var(--color-border)]"
            >
              <div>
                <p style={{ fontFamily: 'var(--font-display)' }} className="text-lg">
                  {item.name}
                </p>
                <p className="text-xs text-[var(--color-ink-subtle)]">
                  /{item.slug} · {item.photoCount} photos
                </p>
              </div>
              <button
                type="button"
                className="text-xs uppercase tracking-wider text-red-700"
                onClick={() => void remove(item.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
