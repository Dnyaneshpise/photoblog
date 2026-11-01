import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'
import publicRouter from './routes/index.js'
import adminRouter from './routes/admin.js'
import { errorHandler } from './middleware/errorHandler.js'

/**
 * Creates and configures the Express application.
 * Why: Separates app setup from the HTTP server so tests can import the app without listening.
 * What: Security middleware, CORS with credentials, public + admin routes, error handler.
 */
export function createApp() {
  const app = express()

  // Render terminates TLS; trust X-Forwarded-* so secure cookies work correctly.
  app.set('trust proxy', 1)

  app.use(helmet())

  // credentials: true is required for the admin session cookie (Netlify → Render).
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    }),
  )

  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser(env.SESSION_SECRET))

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'photoblog-api', time: new Date().toISOString() })
  })

  app.use('/api', publicRouter)
  app.use('/api/admin', adminRouter)

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  app.use(errorHandler)

  return app
}
