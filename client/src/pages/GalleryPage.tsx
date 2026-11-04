import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PhotoCard } from '../components/PhotoCard'
import { StateBlock } from '../components/StateBlock'
import { useApi } from '../hooks/useApi'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import type { CategoriesResponse, PhotosResponse } from '../types/api'

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
    return <StateBlock title="Loading gallery" detail="Fetching photographs…" loading />
  }

  if (photos.error) {
    return <StateBlock title="Unable to load gallery" detail={photos.error} />
  }

  const list = photos.data?.data ?? []
  const cats = categories.data?.data ?? []

  return (
    <div className="pl-page">
      <div className="max-w-[72rem] mx-auto space-y-12 md:space-y-16">
        <header className="max-w-2xl space-y-5">
          <p className="pl-kicker">Gallery</p>
          <h1 className="pl-display text-[clamp(2.2rem,5vw,3.5rem)]">All photographs</h1>
          <p className="pl-lead">
            A living archive of published frames. Open any image for a larger view.
          </p>
        </header>

        <div className="flex flex-wrap gap-x-7 gap-y-3 border-b border-[var(--color-rule)] pb-1">
          <button
            type="button"
            className={`pl-filter ${!category ? 'is-active' : ''}`}
            onClick={() => selectCategory('')}
          >
            All
          </button>
          {cats.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`pl-filter ${category === c.slug ? 'is-active' : ''}`}
              onClick={() => selectCategory(c.slug)}
            >
              {c.name}
            </button>
          ))}
        </div>

        {photos.loading ? (
          <StateBlock title="Loading" detail="Updating the grid…" loading />
        ) : list.length === 0 ? (
          <StateBlock title="No photographs" detail="Nothing published in this filter yet." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-12 md:gap-y-14">
            {list.map((photo, i) => (
              <PhotoCard key={photo.id} photo={photo} preferLightbox index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
