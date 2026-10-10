import type { ManifestConfig } from '../types/icon'

interface ManifestIcon {
  src: string
  sizes: string
  type: string
  purpose?: string
}

export function buildManifest(config: ManifestConfig, basePath: string, selectedFiles: Set<string>): string {
  const base = basePath.endsWith('/') ? basePath : basePath + '/'

  const icons: ManifestIcon[] = []

  const pwaFiles = [
    { filename: 'icon-144x144.png', size: '144x144' },
    { filename: 'icon-192x192.png', size: '192x192' },
    { filename: 'icon-512x512.png', size: '512x512' },
    { filename: 'android-chrome-192x192.png', size: '192x192' },
    { filename: 'android-chrome-512x512.png', size: '512x512' },
  ]

  for (const { filename, size } of pwaFiles) {
    if (selectedFiles.has(filename)) {
      icons.push({ src: `${base}${filename}`, sizes: size, type: 'image/png', purpose: 'any' })
    }
  }

  const maskableFiles = [
    { filename: 'maskable-192.png', size: '192x192' },
    { filename: 'maskable-512.png', size: '512x512' },
  ]

  for (const { filename, size } of maskableFiles) {
    if (selectedFiles.has(filename)) {
      icons.push({ src: `${base}${filename}`, sizes: size, type: 'image/png', purpose: 'maskable' })
    }
  }

  const manifest = {
    name: config.name || 'My App',
    short_name: config.shortName || 'App',
    description: config.description || '',
    theme_color: config.themeColor,
    background_color: config.backgroundColor,
    start_url: '/',
    display: 'standalone',
    icons,
  }

  return JSON.stringify(manifest, null, 2)
}
