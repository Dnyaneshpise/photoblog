import { createApp } from './app.js'
import { env } from './config/env.js'

/**
 * HTTP server entry point.
 * Why: Keeps the listen() call separate from app configuration.
 * What: Creates the Express app and starts listening on the configured port.
 */
const app = createApp()

app.listen(env.PORT, () => {
  console.log(`Photoblog API running on http://localhost:${env.PORT}`)
  console.log(`Environment: ${env.NODE_ENV}`)
})
