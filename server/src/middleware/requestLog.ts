import type { Request, Response, NextFunction } from 'express'

export function requestLog(req: Request, res: Response, next: NextFunction): void {
  const started = Date.now()
  res.on('finish', () => {
    if (req.path === '/api/health' || req.path === '/health') return
    const ms = Date.now() - started
    console.log('[http]', JSON.stringify({
      method: req.method,
      path: req.originalUrl?.split('?')[0] ?? req.path,
      status: res.statusCode,
      ms,
      ip: req.ip,
    }))
  })
  next()
}
