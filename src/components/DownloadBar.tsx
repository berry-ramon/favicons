import { useState } from 'react'
import type { AppOptions, ManifestConfig } from '../types/icon'
import { buildAndDownloadZip, downloadTextFile } from '../lib/zipBuilder'
import { buildManifest } from '../lib/manifestBuilder'
import { buildHTMLSnippet } from '../lib/snippetBuilder'
import { countEstimatedKB } from '../lib/generateIcons'

interface Props {
  icons: Map<string, string>
  options: AppOptions
  manifest: ManifestConfig
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void
}

export function DownloadBar({ icons, options, manifest, onToast }: Props) {
  const [downloading, setDownloading] = useState(false)
  const count = icons.size
  const kb = countEstimatedKB(icons)
  const selected = new Set(icons.keys())

  const handleDownloadZip = async () => {
    if (icons.size === 0) return
    setDownloading(true)
    try {
      await buildAndDownloadZip(icons, options, manifest)
      onToast(`Downloaded ${count} files as ZIP`, 'success')
    } catch (e) {
      onToast('Failed to create ZIP. Please try again.', 'error')
    } finally {
      setDownloading(false)
    }
  }

  const handleDownloadManifest = () => {
    const content = buildManifest(manifest, options.basePath, selected)
    downloadTextFile(content, 'manifest.json', 'application/json')
    onToast('manifest.json downloaded', 'success')
  }

  const handleCopySnippet = async () => {
    const snippet = buildHTMLSnippet(selected, options.basePath)
    try {
      await navigator.clipboard.writeText(snippet)
      onToast('HTML snippet copied to clipboard', 'success')
    } catch {
      onToast('Failed to copy. Please try manually.', 'error')
    }
  }

  return (
    <div className="space-y-3">
      {count > 0 && (
        <p className="text-xs text-center" style={{ color: 'var(--c-fg-muted)' }}>
          {count} file{count !== 1 ? 's' : ''} · ~{kb} KB
        </p>
      )}

      <button
        onClick={handleDownloadZip}
        disabled={count === 0 || downloading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-heading font-semibold text-sm transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: 'var(--c-primary)',
          color: 'var(--c-primary-fg)',
        }}
        aria-label={`Download all ${count} icons as a ZIP file`}
      >
        {downloading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden />
            Building ZIP…
          </>
        ) : (
          <>
            ↓ Download all as ZIP
          </>
        )}
      </button>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleDownloadManifest}
          disabled={count === 0}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: 'var(--c-muted)',
            color: 'var(--c-fg)',
            borderColor: 'var(--c-border)',
          }}
          aria-label="Download manifest.json"
        >
          ↓ manifest.json
        </button>

        <button
          onClick={handleCopySnippet}
          disabled={count === 0}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: 'var(--c-muted)',
            color: 'var(--c-fg)',
            borderColor: 'var(--c-border)',
          }}
          aria-label="Copy HTML snippet to clipboard"
        >
          ⎘ Copy HTML
        </button>
      </div>
    </div>
  )
}
