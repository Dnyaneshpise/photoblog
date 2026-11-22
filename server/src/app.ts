import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'
import { prisma } from './config/prisma.js'
import publicRouter from './routes/index.js'
import adminRouter from './routes/admin.js'
import { errorHandler } from './middleware/errorHandler.js'
import { requestLog } from './middleware/requestLog.js'
import { apiLimiter } from './middleware/rateLimit.js'

export function createApp() {
  const app = express()
  app.set('trust proxy', 1)
  app.use(helmet())
  app.use(requestLog)
  app.use(cors({ origin: env.CLIENT_URL, credentials: true }))
  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser(env.SESSION_SECRET))

  app.get('/api/health', async (_req, res) => {
    let database: 'up' | 'down' = 'down'
    try {
      await prisma.$queryRaw`SELECT 1`
      database = 'up'
    } catch {
      database = 'down'
    }
    const ok = database === 'up'
    res.status(ok ? 200 : 503).json({
      status: ok ? 'ok' : 'degraded',
      service: 'photoblog-api',
      database,
      time: new Date().toISOString(),
    })
  })

  app.use('/api', apiLimiter)
  app.use('/api', publicRouter)
  app.use('/api/admin', adminRouter)
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found' })
  })
  app.use(errorHandler)
  return app
}
