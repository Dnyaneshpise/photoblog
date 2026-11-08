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
 * Public gallery — editorial filters, mosaic rhythm, navigable lightbox.
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
    return <StateBlock title="Loading gallery" detail="Fetching photographs…" loading />
  }

  if (photos.error) {
    return <StateBlock title="Unable to load gallery" detail={photos.error} />
  }

  return (
    <div className="pl-page">
      <div className="max-w-[72rem] mx-auto space-y-12 md:space-y-14">
        <motion.header
          className="max-w-2xl space-y-4"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="pl-kicker">Archive</p>
          <h1 className="pl-display text-[clamp(2.25rem,5vw,3.5rem)]">All photographs</h1>
          <p className="pl-lead max-w-lg">
            A living set of published work. Open any frame; use the arrow keys to move through the set.
          </p>
        </motion.header>

        <nav
          className="flex flex-wrap items-center gap-x-7 gap-y-3 border-b border-[var(--color-rule)] pb-1"
          aria-label="Filter by category"
        >
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

        {photos.loading ? (
          <StateBlock title="Loading" detail="Updating the grid…" loading />
        ) : list.length === 0 ? (
          <StateBlock title="No photographs" detail="Nothing published in this filter yet." />
        ) : (
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
      onClick={onClick}
      className={['pl-filter', active ? 'is-active' : ''].join(' ')}
    >
      {label}
    </button>
  )
}
