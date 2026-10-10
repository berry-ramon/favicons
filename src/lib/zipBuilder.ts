import JSZip from 'jszip'
import { buildManifest } from './manifestBuilder'
import { buildHTMLSnippet } from './snippetBuilder'
import type { AppOptions, ManifestConfig } from '../types/icon'

function dataURLToUint8Array(dataURL: string): Uint8Array {
  const base64 = dataURL.split(',')[1]
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export async function buildAndDownloadZip(
  icons: Map<string, string>,
  options: AppOptions,
  manifest: ManifestConfig
): Promise<void> {
  const zip = new JSZip()
  const folder = zip.folder('favicons')!
  const selected = new Set(icons.keys())

  for (const [filename, dataURL] of icons) {
    const bytes = dataURLToUint8Array(dataURL)
    folder.file(filename, bytes, { binary: true })
  }

  if (options.generateManifest) {
    const manifestStr = buildManifest(manifest, options.basePath, selected)
    folder.file('manifest.json', manifestStr)
  }

  if (options.generateSnippet) {
    const snippet = buildHTMLSnippet(selected, options.basePath)
    folder.file('snippet.html', snippet)
  }

  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  triggerDownload(blob, `favicons-${ts}.zip`)
}

export function downloadSingleIcon(filename: string, dataURL: string): void {
  const bytes = dataURLToUint8Array(dataURL)
  let mimeType = 'image/png'
  if (filename.endsWith('.ico')) mimeType = 'image/x-icon'
  if (filename.endsWith('.svg')) mimeType = 'image/svg+xml'
  if (filename.endsWith('.json')) mimeType = 'application/json'
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: mimeType })
  triggerDownload(blob, filename)
}

export function downloadTextFile(content: string, filename: string, mimeType = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType })
  triggerDownload(blob, filename)
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
