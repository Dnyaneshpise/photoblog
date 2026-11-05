import { useEffect } from 'react'

type SeoInput = {
  title: string
  description?: string
  image?: string | null
  type?: 'website' | 'article'
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Sets document title plus Open Graph / Twitter meta for a route.
 * Why: Premium portfolios should share clean previews on social and messaging apps.
 */
export function useSeoMeta({ title, description, image, type = 'website' }: SeoInput) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    const desc =
      description?.trim() ||
      'Photoblog — a photography portfolio by Dnyanesh Pise.'

    upsertMeta('name', 'description', desc)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', desc)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', window.location.href)
    upsertMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', desc)

    if (image) {
      upsertMeta('property', 'og:image', image)
      upsertMeta('name', 'twitter:image', image)
    }

    return () => {
      document.title = previousTitle
    }
  }, [title, description, image, type])
}
