import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PhotoCard } from '../components/PhotoCard'
import { StateBlock } from '../components/StateBlock'
import { useApi } from '../hooks/useApi'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { CategoriesResponse, PhotosResponse } from '../types/api'

/**
 * Public gallery with category filters (supports ?category=slug from deep links).
 */
export function GalleryPage() {
  useDocumentTitle('Gallery — Photoblog')
  const [searchParams, setSearchParams] = useSearchParams()
  const initial = searchParams.get('category') ?? ''
  const [category, setCategory] = useState(initial)
  const categories = useApi<CategoriesResponse>('/api/categories')

  useEffect(() => {
    setCategory(searchParams.get('category') ?? '')
  }, [searchParams])

  const photosPath = useMemo(() => {
    const params = new URLSearchParams({ limit: '48' })
    if (category) params.set('category', category)
    return `/api/photos?${params.toString()}`
  }, [category])

  const photos = useApi<PhotosResponse>(photosPath)

  function selectCategory(slug: string) {
    setCategory(slug)
    if (slug) setSearchParams({ category: slug })
    else setSearchParams({})
  }

  if (categories.loading && photos.loading) {
    return <StateBlock title="Loading gallery" detail="Fetching photographs…" />
  }

  if (photos.error) {
    return <StateBlock title="Unable to load gallery" detail={photos.error} />
  }

  const list = photos.data?.data ?? []
  const cats = categories.data?.data ?? []

  return (
    <div className="px-6 md:px-12 py-14 md:py-20">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="max-w-2xl space-y-4">
          <p className="text-xs tracking-[0.22em] uppercase text-[var(--color-ink-subtle)]">Gallery</p>
          <h1
            className="text-4xl md:text-5xl text-[var(--color-ink)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            All photographs
          </h1>
          <p className="text-[var(--color-ink-muted)] leading-relaxed">
            A living archive of published frames. Click any image for a larger view.
          </p>
        </header>

        <div className="flex flex-wrap gap-2">
          <FilterChip label="All" active={!category} onClick={() => selectCategory('')} />
          {cats.map((c) => (
            <FilterChip
              key={c.id}
              label={c.name}
              active={category === c.slug}
              onClick={() => selectCategory(c.slug)}
            />
          ))}
        </div>

        {photos.loading ? (
          <StateBlock title="Loading" detail="Updating the grid…" />
        ) : list.length === 0 ? (
          <StateBlock title="No photographs" detail="Nothing published in this filter yet." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {list.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} preferLightbox />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'px-4 py-2 text-xs tracking-[0.14em] uppercase border transition-colors',
        active
          ? 'bg-[var(--color-ink)] text-[var(--color-canvas)] border-[var(--color-ink)]'
          : 'bg-transparent text-[var(--color-ink-muted)] border-[var(--color-border)] hover:border-[var(--color-ink)]',
      ].join(' ')}
    >
      {label}
    </button>
  )
}
