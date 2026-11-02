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

type PhotoOption = {
  id: string
  title: string
  thumbnailUrl: string | null
  imageUrl: string
  isPublished: boolean
}

type CollectionDetail = {
  id: string
  title: string
  description: string | null
  isPublished: boolean
  photoIds: string[]
  coverPhotoId: string | null
}

/**
 * Admin collections: create series and assign ordered photos from the library.
 */
export function AdminCollectionsPage() {
  const [items, setItems] = useState<AdminCollection[]>([])
  const [library, setLibrary] = useState<PhotoOption[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editPublished, setEditPublished] = useState(true)
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([])
  const [savingEdit, setSavingEdit] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [collectionsResult, photosResult] = await Promise.all([
        apiGet<{ data: AdminCollection[] }>('/api/admin/collections'),
        apiGet<{ data: PhotoOption[] }>('/api/admin/photos'),
      ])
      setItems(collectionsResult.data)
      setLibrary(photosResult.data)
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

  async function openEditor(id: string) {
    setError(null)
    try {
      const result = await apiGet<{ data: CollectionDetail }>(`/api/admin/collections/${id}`)
      const c = result.data
      setEditingId(c.id)
      setEditTitle(c.title)
      setEditDescription(c.description ?? '')
      setEditPublished(c.isPublished)
      setSelectedPhotoIds(c.photoIds)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not open collection')
    }
  }

  function togglePhoto(photoId: string) {
    setSelectedPhotoIds((current) =>
      current.includes(photoId)
        ? current.filter((id) => id !== photoId)
        : [...current, photoId],
    )
  }

  async function saveEditor(e: FormEvent) {
    e.preventDefault()
    if (!editingId) return
    setSavingEdit(true)
    setError(null)
    try {
      await apiPatch(`/api/admin/collections/${editingId}`, {
        title: editTitle,
        description: editDescription || null,
        isPublished: editPublished,
        photoIds: selectedPhotoIds,
        coverPhotoId: selectedPhotoIds[0] ?? null,
      })
      setEditingId(null)
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Save failed')
    } finally {
      setSavingEdit(false)
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
      if (editingId === id) setEditingId(null)
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
        <p className="text-sm text-[var(--color-ink-muted)]">Create a series, then edit it to attach photographs.</p>
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

      {editingId && (
        <form
          onSubmit={saveEditor}
          className="space-y-5 p-6 border border-[var(--color-ink)] bg-[var(--color-surface)]"
        >
          <h2 className="text-xl" style={{ fontFamily: 'var(--font-display)' }}>
            Edit collection
          </h2>
          <input
            required
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className={field}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className={field}
            rows={3}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={editPublished}
              onChange={(e) => setEditPublished(e.target.checked)}
            />
            Published
          </label>

          <div className="space-y-3">
            <p className="text-xs tracking-[0.12em] uppercase text-[var(--color-ink-subtle)]">
              Photographs in this series ({selectedPhotoIds.length} selected)
            </p>
            <p className="text-sm text-[var(--color-ink-muted)]">
              First selected image becomes the cover. Order follows selection order.
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto">
              {library.map((photo) => {
                const selected = selectedPhotoIds.includes(photo.id)
                const order = selected ? selectedPhotoIds.indexOf(photo.id) + 1 : null
                return (
                  <li key={photo.id}>
                    <button
                      type="button"
                      onClick={() => togglePhoto(photo.id)}
                      className={[
                        'w-full text-left border p-2 space-y-2 transition-colors',
                        selected
                          ? 'border-[var(--color-ink)] bg-[var(--color-canvas)]'
                          : 'border-[var(--color-border)]',
                      ].join(' ')}
                    >
                      <img
                        src={photo.thumbnailUrl || photo.imageUrl}
                        alt={photo.title}
                        className="w-full aspect-[4/3] object-cover"
                      />
                      <p className="text-xs line-clamp-2">
                        {order ? `${order}. ` : ''}
                        {photo.title}
                      </p>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={savingEdit}
              className="px-6 py-3 text-xs tracking-[0.16em] uppercase bg-[var(--color-ink)] text-[var(--color-canvas)] disabled:opacity-60"
            >
              {savingEdit ? 'Saving…' : 'Save collection'}
            </button>
            <button
              type="button"
              className="px-6 py-3 text-xs tracking-[0.16em] uppercase border border-[var(--color-border)]"
              onClick={() => setEditingId(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

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
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="text-xs uppercase tracking-wider"
                  onClick={() => void openEditor(item.id)}
                >
                  Edit / photos
                </button>
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
