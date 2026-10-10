import { useState } from 'react'
import type { IconSpec } from '../types/icon'
import { ALL_ICONS, SPECIAL_FILES, CATEGORY_LABELS, CATEGORY_ORDER } from '../lib/presets'
import { downloadSingleIcon } from '../lib/zipBuilder'

interface Props {
  icons: Map<string, string>
  isGenerating: boolean
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void
}

function IconCell({
  spec,
  dataURL,
  isGenerating,
  onDownload,
}: {
  spec: { filename: string; width: number; height: number; isMaskable?: boolean; description?: string }
  dataURL: string | undefined
  isGenerating: boolean
  onDownload: () => void
}) {
  const [hovered, setHovered] = useState(false)
  // Display size: minimum 48px, maximum 96px
  const displaySize = Math.min(96, Math.max(48, spec.width))

  return (
    <div
      className="flex flex-col items-center gap-2 relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="rounded-xl overflow-hidden flex items-center justify-center relative"
        style={{ width: displaySize, height: displaySize }}
      >
        <div className="absolute inset-0 checkerboard rounded-xl" />
        {dataURL ? (
          <img
            src={dataURL}
            alt={spec.filename}
            className="relative z-10"
            style={{ width: spec.width <= 48 ? spec.width : displaySize, height: spec.height <= 48 ? spec.height : displaySize, imageRendering: spec.width <= 32 ? 'pixelated' : 'auto' }}
          />
        ) : (
          <div
            className="absolute inset-0 z-10 rounded-xl animate-pulse"
            style={{ background: 'var(--c-muted)' }}
          />
        )}
        {/* Hover overlay */}
        {dataURL && hovered && (
          <button
            onClick={onDownload}
            className="absolute inset-0 z-20 flex items-center justify-center rounded-xl cursor-pointer transition-opacity"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            aria-label={`Download ${spec.filename}`}
            title={`Download ${spec.filename}`}
          >
            <span className="text-white text-xl">↓</span>
          </button>
        )}
        {isGenerating && !dataURL && (
          <div className="absolute inset-0 z-10 rounded-xl animate-pulse" style={{ background: 'var(--c-muted)' }} />
        )}
      </div>

      <div className="text-center w-full">
        <p
          className="text-xs font-mono leading-tight break-all"
          style={{ color: 'var(--c-fg)', fontSize: '10px', maxWidth: displaySize }}
        >
          {spec.filename}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--c-fg-muted)', fontSize: '9px' }}>
          {spec.width}×{spec.height}
          {spec.isMaskable && ' ✦'}
        </p>
      </div>
    </div>
  )
}

function SpecialCell({
  filename,
  dataURL,
  isGenerating,
  onDownload,
}: {
  filename: string
  dataURL: string | undefined
  isGenerating: boolean
  onDownload: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const displaySize = 64

  return (
    <div
      className="flex flex-col items-center gap-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="rounded-xl overflow-hidden flex items-center justify-center relative"
        style={{ width: displaySize, height: displaySize }}
      >
        <div className="absolute inset-0 checkerboard rounded-xl" />
        {dataURL ? (
          <img
            src={dataURL}
            alt={filename}
            className="relative z-10"
            style={{ width: 32, height: 32, imageRendering: 'pixelated' }}
          />
        ) : (
          <div className="absolute inset-0 z-10 rounded-xl animate-pulse" style={{ background: 'var(--c-muted)' }} />
        )}
        {dataURL && hovered && (
          <button
            onClick={onDownload}
            className="absolute inset-0 z-20 flex items-center justify-center rounded-xl cursor-pointer"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            aria-label={`Download ${filename}`}
          >
            <span className="text-white text-xl">↓</span>
          </button>
        )}
        {isGenerating && !dataURL && (
          <div className="absolute inset-0 z-10 rounded-xl animate-pulse" style={{ background: 'var(--c-muted)' }} />
        )}
      </div>
      <div className="text-center">
        <p className="text-xs font-mono" style={{ color: 'var(--c-fg)', fontSize: '10px' }}>{filename}</p>
        <p className="text-xs" style={{ color: 'var(--c-fg-muted)', fontSize: '9px' }}>
          {filename === 'favicon.ico' ? '16+32+48' : 'vector'}
        </p>
      </div>
    </div>
  )
}

export function PreviewGrid({ icons, isGenerating, onToast }: Props) {
  const handleDownload = (filename: string, dataURL: string | undefined) => {
    if (!dataURL) return
    downloadSingleIcon(filename, dataURL)
    onToast(`Downloaded ${filename}`, 'success')
  }

  const visibleCategories = CATEGORY_ORDER.filter(cat =>
    ALL_ICONS.some(i => i.category === cat && icons.has(i.filename))
  )

  const hasSpecials = SPECIAL_FILES.some(f => icons.has(f))
  const hasAny = icons.size > 0 || isGenerating

  if (!hasAny) return null

  return (
    <div className="space-y-8">
      {/* Special files */}
      {(hasSpecials || isGenerating) && (
        <section aria-label="Browser favicon files">
          <h3 className="font-heading font-semibold text-sm mb-4" style={{ color: 'var(--c-fg-muted)' }}>
            Browser Favicons
          </h3>
          <div className="flex flex-wrap gap-6">
            {SPECIAL_FILES.map(filename => {
              const dataURL = icons.get(filename)
              return (
                <SpecialCell
                  key={filename}
                  filename={filename}
                  dataURL={dataURL}
                  isGenerating={isGenerating}
                  onDownload={() => handleDownload(filename, dataURL)}
                />
              )
            })}
          </div>
        </section>
      )}

      {/* Per-category sections */}
      {CATEGORY_ORDER.map(cat => {
        const catIcons = ALL_ICONS.filter(i => i.category === cat)
        const visible = catIcons.filter(i => icons.has(i.filename) || isGenerating)
        if (visible.length === 0) return null

        return (
          <section key={cat} aria-label={`${CATEGORY_LABELS[cat]} icons`}>
            <h3 className="font-heading font-semibold text-sm mb-4" style={{ color: 'var(--c-fg-muted)' }}>
              {CATEGORY_LABELS[cat]}
            </h3>
            <div className="flex flex-wrap gap-6">
              {visible.map(spec => (
                <IconCell
                  key={spec.filename}
                  spec={spec}
                  dataURL={icons.get(spec.filename)}
                  isGenerating={isGenerating}
                  onDownload={() => handleDownload(spec.filename, icons.get(spec.filename))}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
