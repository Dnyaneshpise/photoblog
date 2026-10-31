/**
 * Thin HTTP client for the Photoblog public API.
 * Why: Centralize base URL and JSON parsing so pages do not repeat fetch boilerplate.
 * What: Resolves VITE_API_URL (Netlify) or falls back to same-origin / local proxy.
 */

const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Performs a JSON request against the API.
 * Why: One place to handle non-OK responses and network failures.
 */
export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`

  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    let message = response.statusText || 'Request failed'
    try {
      const body = (await response.json()) as { error?: string }
      if (body.error) message = body.error
    } catch {
      // response was not JSON — keep statusText
    }
    throw new ApiError(response.status, message)
  }

  return response.json() as Promise<T>
}

/**
 * POST helper for JSON bodies (contact form).
 */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    let message = response.statusText || 'Request failed'
    try {
      const data = (await response.json()) as { error?: string }
      if (data.error) message = data.error
    } catch {
      // ignore
    }
    throw new ApiError(response.status, message)
  }

  return response.json() as Promise<T>
}
