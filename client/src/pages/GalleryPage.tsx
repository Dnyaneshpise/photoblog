import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PhotoCard } from '../components/PhotoCard'
import { Lightbox } from '../components/Lightbox'
import { StateBlock } from '../components/StateBlock'
import { useApi } from '../hooks/useApi'
import { useSeoMeta } from '../hooks/useSeoMeta'
import type { CategoriesResponse, Photo, PhotosResponse } from '../types/api'

/**
 * Public gallery with filters and a navigable lightbox for the current result set.
 */
export function GalleryPage() {
  useSeoMeta({
    title: 'Gallery — Photoblog',
    description: 'Browse published photographs from the Photoblog archive.',
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [activeId, setActiveId] = useState<string | null>(null)
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
  const list = photos.data?.data ?? []
  const cats = categories.data?.data ?? []

  const activeIndex = activeId ? list.findIndex((p) => p.id === activeId) : -1
  const activePhoto = activeIndex >= 0 ? list[activeIndex] : null

  const openLightbox = useCallback((photo: Photo) => {
    setActiveId(photo.id)
  }, [])

  const goPrev = useCallback(() => {
    if (activeIndex <= 0) return
    setActiveId(list[activeIndex - 1].id)
  }, [activeIndex, list])

  const goNext = useCallback(() => {
    if (activeIndex < 0 || activeIndex >= list.length - 1) return
    setActiveId(list[activeIndex + 1].id)
  }, [activeIndex, list])

  function selectCategory(slug: string) {
    setCategory(slug)
    setActiveId(null)
    if (slug) setSearchParams({ category: slug })
    else setSearchParams({})
  }

  if (categories.loading && photos.loading) {
    return <StateBlock title="Loading gallery" detail="Fetching photographs…" />
  }

  if (photos.error) {
    return <StateBlock title="Unable to load gallery" detail={photos.error} />
  }

  return (
    <div className="px-6 md:px-12 py-14 md:py-20">
      <div className="max-w-[72rem] mx-auto space-y-12">
        <header className="max-w-2xl space-y-4">
          <p className="text-xs tracking-[0.22em] uppercase text-[var(--color-ink-subtle)]">Gallery</p>
          <h1
            className="text-4xl md:text-5xl text-[var(--color-ink)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            All photographs
          </h1>
          <p className="text-[var(--color-ink-muted)] leading-relaxed">
            Click a frame to open the lightbox. Use arrow keys to move through the set.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-12 md:gap-y-14">
            {list.map((photo, i) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                preferLightbox
                index={i}
                onOpenLightbox={openLightbox}
              />
            ))}
          </div>
        )}
      </div>

      <Lightbox
        open={Boolean(activePhoto)}
        src={activePhoto?.imageUrl ?? ''}
        alt={activePhoto?.altText || activePhoto?.title || ''}
        title={activePhoto?.title}
        onClose={() => setActiveId(null)}
        onPrev={activeIndex > 0 ? goPrev : undefined}
        onNext={activeIndex >= 0 && activeIndex < list.length - 1 ? goNext : undefined}
        index={activeIndex >= 0 ? activeIndex : undefined}
        total={list.length}
      />
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
