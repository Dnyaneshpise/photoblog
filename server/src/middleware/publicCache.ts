import type { Request, Response, NextFunction } from 'express'

export function publicCache(maxAgeSeconds = 60) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    const originalJson = res.json.bind(res)
    res.json = ((body: unknown) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        res.setHeader(
          'Cache-Control',
          `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${maxAgeSeconds * 5}`,
        )
      }
      return originalJson(body)
    }) as Response['json']
    next()
  }
}
