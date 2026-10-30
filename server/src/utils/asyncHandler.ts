import type { Request, Response, NextFunction, RequestHandler } from 'express'

/**
 * Wraps an async route handler so rejected promises reach Express error middleware.
 * Why: Express 5 handles async errors better, but this keeps handlers consistent
 *      and avoids silent failures if a handler throws before a response is sent.
 * What: Returns a RequestHandler that catches promise rejections and calls next(err).
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
