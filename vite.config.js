import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { createContactHandler } from './server/contact.js'
import { createAdminHandler } from './server/admin.js'
import { createNewsHandler } from './server/news.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), {
    name: 'local-contact-api',
    configureServer(server) {
      // Secrets stay in the Node process; Vite exposes only VITE_* to the browser.
      const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
      const handler = createContactHandler({ env })
      const adminHandler = createAdminHandler({ env })
      const newsHandler = createNewsHandler({ env })
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0]
        if (path === '/api/admin') return adminHandler(req, res)
        if (path === '/api/news') return newsHandler(req, res)
        next()
      })
      server.middlewares.use('/api/contact', (req, res, next) => {
        if (req.url?.split('?')[0] !== '/') return next()
        return handler(req, res)
      })
    },
  }],
}))
