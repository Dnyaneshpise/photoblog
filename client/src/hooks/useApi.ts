import { useEffect, useState } from 'react'
import { apiGet, ApiError } from '../lib/api'

/**
 * Loads JSON from the public API once when `path` changes.
 * Why: Pages share loading / error / data state without a heavy data library yet.
 */
export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(Boolean(path))

  useEffect(() => {
    if (!path) {
      setData(null)
      setError(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    apiGet<T>(path)
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Something went wrong'
        setError(message)
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [path])

  return { data, error, loading }
}
