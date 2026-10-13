import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readdirSync } from 'node:fs'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const imagesDirectory = fileURLToPath(new URL('./public/images/', import.meta.url))
const virtualModuleId = 'virtual:public-images'
const resolvedVirtualModuleId = `\0${virtualModuleId}`
const supportedImageTypes = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp'])

function imageGallery() {
  const getImages = () => {
    try {
      return readdirSync(imagesDirectory, { withFileTypes: true })
        .filter((entry) => entry.isFile() && supportedImageTypes.has(extname(entry.name).toLowerCase()))
        .map((entry) => ({
          fileName: entry.name,
          src: `/images/${encodeURIComponent(entry.name)}`,
        }))
        .sort((a, b) => a.fileName.localeCompare(b.fileName))
    } catch {
      return []
    }
  }

  return {
    name: 'public-image-gallery',
    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${JSON.stringify(getImages())}`
      }
    },
    configureServer(server) {
      server.watcher.add(imagesDirectory)
      const refreshGallery = (file) => {
        if (
          dirname(resolve(file)) === resolve(imagesDirectory) &&
          supportedImageTypes.has(extname(file).toLowerCase())
        ) {
          const module = server.moduleGraph.getModuleById(resolvedVirtualModuleId)
          if (module) server.moduleGraph.invalidateModule(module)
          server.ws.send({ type: 'full-reload' })
        }
      }
      server.watcher.on('add', refreshGallery)
      server.watcher.on('change', refreshGallery)
      server.watcher.on('unlink', refreshGallery)
    },
  }
}

export default defineConfig({
  plugins: [react(), imageGallery()],
})
