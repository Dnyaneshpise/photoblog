/**
 * Thin HTTP client for the Photoblog public and admin APIs.
 * Why: Centralize base URL, JSON parsing, and credential cookies.
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

async function parseError(response: Response): Promise<string> {
  let message = response.statusText || 'Request failed'
  try {
    const body = (await response.json()) as { error?: string }
    if (body.error) message = body.error
  } catch {
    // non-JSON body
  }
  return message
}

/**
 * GET JSON. credentials: 'include' sends the admin session cookie when present.
 */
export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
  const response = await fetch(url, {
    ...init,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  if (!response.ok) throw new ApiError(response.status, await parseError(response))
  return response.json() as Promise<T>
}

/**
 * POST JSON with credentials (login, contact, admin creates).
 */
export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!response.ok) throw new ApiError(response.status, await parseError(response))
  return response.json() as Promise<T>
}

/** PATCH JSON with credentials. */
export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
  const response = await fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new ApiError(response.status, await parseError(response))
  return response.json() as Promise<T>
}

/** DELETE with credentials. */
export async function apiDelete<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new ApiError(response.status, await parseError(response))
  return response.json() as Promise<T>
}
