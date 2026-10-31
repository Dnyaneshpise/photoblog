import { FormEvent, useCallback, useEffect, useState } from 'react'
import { apiDelete, apiGet, apiPatch, apiPost, ApiError } from '../../lib/api'

type AdminPhoto = {
  id: string
  title: string
  description: string | null
  altText: string | null
  imageUrl: string
  thumbnailUrl: string | null
  isFeatured: boolean
  isPublished: boolean
  sortOrder: number
  location: string | null
}

/**
 * Admin photo list + create/edit form (image by URL until Cloudinary upload ships).
 */
export function AdminPhotosPage() {
  const [photos, setPhotos] = useState<AdminPhoto[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [description, setDescription] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiGet<{ data: AdminPhoto[] }>('/api/admin/photos')
      setPhotos(result.data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load photos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await apiPost('/api/admin/photos', {
        title,
        imageUrl,
        thumbnailUrl: thumbnailUrl || undefined,
        description: description || undefined,
        isPublished,
        isFeatured,
      })
      setTitle('')
      setImageUrl('')
      setThumbnailUrl('')
      setDescription('')
      setIsPublished(true)
      setIsFeatured(false)
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create photo')
    } finally {
      setSaving(false)
    }
  }

  async function toggle(photo: AdminPhoto, field: 'isPublished' | 'isFeatured') {
    try {
      await apiPatch(`/api/admin/photos/${photo.id}`, { [field]: !photo[field] })
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Update failed')
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this photograph?')) return
    try {
      await apiDelete(`/api/admin/photos/${id}`)
      await load()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Delete failed')
    }
  }

  const field =
    'w-full px-3 py-2 border border-[var(--color-border)] bg-[var(--color-surface)] outline-none focus:border-[var(--color-ink)]'

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Photographs
        </h1>
        <p className="text-[var(--color-ink-muted)]">
          Add images by URL for now. Cloudinary upload can replace this later.
        </p>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <form onSubmit={onCreate} className="grid md:grid-cols-2 gap-4 p-6 border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs tracking-[0.12em] uppercase text-[var(--color-ink-subtle)]">Title</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className={field} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs tracking-[0.12em] uppercase text-[var(--color-ink-subtle)]">Image URL</label>
          <input required type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={field} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs tracking-[0.12em] uppercase text-[var(--color-ink-subtle)]">Thumbnail URL</label>
          <input type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className={field} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs tracking-[0.12em] uppercase text-[var(--color-ink-subtle)]">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={field} rows={3} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
          Featured on homepage
        </label>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 text-xs tracking-[0.16em] uppercase bg-[var(--color-ink)] text-[var(--color-canvas)] disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Add photograph'}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-[var(--color-ink-muted)]">Loading…</p>
      ) : (
        <ul className="space-y-4">
          {photos.map((photo) => (
            <li
              key={photo.id}
              className="flex flex-col sm:flex-row gap-4 p-4 border border-[var(--color-border)] bg-[var(--color-surface)]"
            >
              <img
                src={photo.thumbnailUrl || photo.imageUrl}
                alt={photo.altText || photo.title}
                className="w-full sm:w-36 h-28 object-cover bg-[var(--color-border)]"
              />
              <div className="flex-1 space-y-2">
                <p className="text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                  {photo.title}
                </p>
                <p className="text-xs text-[var(--color-ink-subtle)]">
                  {photo.isPublished ? 'Published' : 'Draft'} · {photo.isFeatured ? 'Featured' : 'Not featured'}
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <button type="button" className="text-xs uppercase tracking-wider" onClick={() => void toggle(photo, 'isPublished')}>
                    Toggle publish
                  </button>
                  <button type="button" className="text-xs uppercase tracking-wider" onClick={() => void toggle(photo, 'isFeatured')}>
                    Toggle featured
                  </button>
                  <button type="button" className="text-xs uppercase tracking-wider text-red-700" onClick={() => void remove(photo.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
