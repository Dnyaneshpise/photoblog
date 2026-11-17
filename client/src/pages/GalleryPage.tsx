import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PhotoCard } from '../components/PhotoCard'
import { Lightbox } from '../components/Lightbox'
import { StateBlock } from '../components/StateBlock'
import { useApi } from '../hooks/useApi'
import { useSeoMeta } from '../hooks/useSeoMeta'
import type { CategoriesResponse, Photo, PhotosResponse } from '../types/api'

/**
 * Public gallery — editorial filters, mosaic rhythm, count, navigable lightbox.
 */
export function GalleryPage() {
  useSeoMeta({
    title: 'Gallery — Photoblog',
    description: 'Browse published photographs from the Photoblog archive.',
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [accumulated, setAccumulated] = useState<Photo[]>([])
  const categories = useApi<CategoriesResponse>('/api/categories')

  useEffect(() => {
    setCategory(searchParams.get('category') ?? '')
    setPage(1)
    setAccumulated([])
    setActiveId(null)
  }, [searchParams])

  const photosPath = useMemo(() => {
    const params = new URLSearchParams({ limit: '24', page: String(page) })
    if (category) params.set('category', category)
    return `/api/photos?${params.toString()}`
  }, [category, page])

  const photos = useApi<PhotosResponse>(photosPath)

  useEffect(() => {
    if (!photos.data?.data) return
    if (page === 1) {
      setAccumulated(photos.data.data)
      return
    }
    setAccumulated((prev) => {
      const ids = new Set(prev.map((p) => p.id))
      const next = photos.data!.data.filter((p) => !ids.has(p.id))
      return [...prev, ...next]
    })
  }, [photos.data, page])

  const list = accumulated
  const cats = categories.data?.data ?? []
  const meta = photos.data?.meta
  const total = meta?.total ?? list.length
  const totalPages = meta?.totalPages ?? 1
  const canLoadMore = page < totalPages

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
    setPage(1)
    setAccumulated([])
    if (slug) setSearchParams({ category: slug })
    else setSearchParams({})
  }

  if (categories.loading && photos.loading && page === 1) {
    return <StateBlock title="Loading gallery" detail="Fetching photographs…" loading />
  }

  if (photos.error && list.length === 0) {
    return <StateBlock title="Unable to load gallery" detail={photos.error} />
  }

  const activeCategoryName = category
    ? cats.find((c) => c.slug === category)?.name
    : null

  return (
    <div className="pl-page">
      <div className="max-w-[72rem] mx-auto space-y-14 md:space-y-16">
        <motion.header
          className="pl-page-intro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="pl-kicker">Archive</p>
          <h1 className="pl-display">
            {activeCategoryName ?? 'All photographs'}
          </h1>
          <p className="pl-lead">
            A living set of published work. Open any frame; use the arrow keys to move through the set.
          </p>
        </motion.header>

        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--color-rule)] pb-1">
          <nav className="flex flex-wrap items-center gap-x-7 gap-y-3" aria-label="Filter by category">
            <FilterLink label="All" active={!category} onClick={() => selectCategory('')} />
            {cats.map((c) => (
              <FilterLink
                key={c.id}
                label={c.name}
                active={category === c.slug}
                onClick={() => selectCategory(c.slug)}
              />
            ))}
          </nav>
          <p className="text-[0.62rem] tracking-[0.14em] uppercase text-[var(--color-ink-tertiary)] tabular-nums">
            {total} {total === 1 ? 'frame' : 'frames'}
          </p>
        </div>

        {photos.loading && list.length === 0 ? (
          <StateBlock title="Loading" detail="Updating the grid…" loading />
        ) : list.length === 0 ? (
          <StateBlock title="No photographs" detail="Nothing published in this filter yet." />
        ) : (
          <>
            <div className="pl-mosaic">
              {list.map((photo, i) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  preferLightbox
                  index={i}
                  onOpenLightbox={openLightbox}
                  aspect={mosaicAspect(i)}
                />
              ))}
            </div>

            {canLoadMore && (
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  className="px-7 py-3 text-[0.68rem] tracking-[0.16em] uppercase border border-[var(--color-rule)] text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors disabled:opacity-50"
                  disabled={photos.loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {photos.loading ? 'Loading…' : 'Load more'}
                </button>
              </div>
            )}
          </>
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

function mosaicAspect(i: number): string {
  const pattern = [
    'aspect-[4/5]',
    'aspect-[3/4]',
    'aspect-[4/3]',
    'aspect-[1/1]',
    'aspect-[3/4]',
    'aspect-[4/5]',
    'aspect-[16/10]',
    'aspect-[3/2]',
  ]
  return pattern[i % pattern.length]
}

function FilterLink({
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
      className={`pl-filter ${active ? 'is-active' : ''}`}
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
    >
      {label}
    </button>
  )
}
