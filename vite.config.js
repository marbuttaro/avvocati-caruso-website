import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { createContactHandler } from './server/contact.js'
import { createAdminHandler } from './server/admin.js'
import { createNewsHandler } from './server/news.js'
import { createLocalImageStore, LOCAL_IMAGE_PREFIX } from './server/news-images.js'

// https://vite.dev/config/
export default defineConfig(({ mode, isSsrBuild }) => ({
  build: { copyPublicDir: !isSsrBuild },
  // Bundle the runtime: Vercel's file tracing must not choose different package
  // export conditions from the Node process serving the generated SSR entry.
  ssr: { noExternal: true },
  plugins: [react(), {
    name: 'local-contact-api',
    configureServer(server) {
      // Secrets stay in the Node process; Vite exposes only VITE_* to the browser.
      const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
      const handler = createContactHandler({ env })
      const adminHandler = createAdminHandler({ env })
      const newsHandler = createNewsHandler({ env })
      const localImages = createLocalImageStore(env.NEWS_IMAGES_DIR || undefined)
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0]
        if (path === '/api/admin') return adminHandler(req, res)
        if (path === '/api/news') return newsHandler(req, res)
        // Immagini delle news caricate in locale (in produzione sono su Vercel Blob)
        if (path?.startsWith(LOCAL_IMAGE_PREFIX)) {
          return localImages.read(path.slice(LOCAL_IMAGE_PREFIX.length)).then(file => {
            if (!file) { res.statusCode = 404; return res.end() }
            res.writeHead(200, { 'Content-Type': file.type, 'Cache-Control': 'no-store' })
            res.end(file.body)
          })
        }
        next()
      })
      server.middlewares.use('/api/contact', (req, res, next) => {
        if (req.url?.split('?')[0] !== '/') return next()
        return handler(req, res)
      })
    },
  }],
}))
