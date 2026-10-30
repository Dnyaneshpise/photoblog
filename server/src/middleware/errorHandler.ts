import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

/**
 * Shape of JSON error responses sent to the client.
 * Why: Keep a single, predictable error format for the frontend.
 */
export type ApiErrorBody = {
  error: string
  details?: unknown
}

/**
 * Central Express error middleware.
 * Why: Avoid scattering try/catch and status codes in every controller.
 * What: Maps known error types (Zod, not-found) to HTTP status codes and JSON bodies.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Validation failures from Zod → 400 with field-level details.
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: err.flatten(),
    } satisfies ApiErrorBody)
    return
  }

  // Controllers may attach statusCode for domain errors (e.g. 404).
  if (err && typeof err === 'object' && 'statusCode' in err) {
    const statusCode = Number((err as { statusCode: number }).statusCode) || 500
    const message =
      'message' in err && typeof (err as { message: unknown }).message === 'string'
        ? (err as { message: string }).message
        : 'Request failed'
    res.status(statusCode).json({ error: message } satisfies ApiErrorBody)
    return
  }

  console.error('[api] unhandled error', err)
  res.status(500).json({ error: 'Internal server error' } satisfies ApiErrorBody)
}

/**
 * Helper to throw an HTTP-aware error from controllers.
 * Why: Controllers stay readable: throw httpError(404, 'Photo not found').
 */
export function httpError(statusCode: number, message: string): Error & { statusCode: number } {
  const error = new Error(message) as Error & { statusCode: number }
  error.statusCode = statusCode
  return error
}
