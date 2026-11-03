import { useEffect } from 'react'

/**
 * Sets document.title for the active page.
 * Why: Browser tabs and SEO need route-specific titles, not a single static string.
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])
}
