import { useState } from 'react'
import type { AppOptions, PresetKey } from '../types/icon'
import { PRESETS, ALL_ICONS, SPECIAL_FILES, CATEGORY_LABELS, CATEGORY_ORDER } from '../lib/presets'

interface Props {
  options: AppOptions
  onChange: (opts: AppOptions) => void
}

function Section({ title, tooltip, children, defaultOpen = true }: {
  title: string
  tooltip?: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--c-card)', border: '1px solid var(--c-border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer"
        aria-expanded={open}
        title={tooltip}
      >
        <span className="font-heading font-semibold text-sm" style={{ color: 'var(--c-fg)' }}>{title}</span>
        <span className="text-xs" style={{ color: 'var(--c-fg-muted)' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  )
}

function Toggle({ label, id, checked, onChange, tooltip }: {
  label: string
  id: string
  checked: boolean
  onChange: (v: boolean) => void
  tooltip?: string
}) {
  return (
    <label htmlFor={id} className="flex items-center justify-between cursor-pointer" title={tooltip}>
      <span className="text-sm" style={{ color: 'var(--c-fg)' }}>{label}</span>
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className="w-10 h-5 rounded-full transition-colors duration-200"
          style={{ background: checked ? 'var(--c-primary)' : 'var(--c-muted)' }}
        />
        <div
          className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
          style={{ transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
        />
      </div>
    </label>
  )
}

function Slider({ label, id, value, min, max, step, format, onChange, tooltip }: {
  label: string
  id: string
  value: number
  min: number
  max: number
  step: number
  format: (v: number) => string
  onChange: (v: number) => void
  tooltip?: string
}) {
  return (
    <div title={tooltip}>
      <div className="flex justify-between items-center mb-1.5">
        <label htmlFor={id} className="text-sm" style={{ color: 'var(--c-fg)' }}>{label}</label>
        <span className="text-xs font-mono" style={{ color: 'var(--c-fg-muted)' }}>{format(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: 'var(--c-primary)', background: 'var(--c-muted)' }}
        aria-label={label}
      />
    </div>
  )
}

const PRESET_ORDER: PresetKey[] = ['complete', 'modern', 'pwa', 'legacy', 'custom']

export function OptionsPanel({ options, onChange }: Props) {
  const set = (patch: Partial<AppOptions>) => onChange({ ...options, ...patch })

  const toggleFile = (filename: string) => {
    const next = new Set(options.selectedFiles)
    if (next.has(filename)) next.delete(filename)
    else next.add(filename)
    set({ selectedFiles: next, preset: 'custom' })
  }

  const allCustomFiles = [...ALL_ICONS.map(i => i.filename), ...SPECIAL_FILES]
  const customSelected = options.preset === 'custom' ? options.selectedFiles : new Set(PRESETS[options.preset].files)

  return (
    <div className="space-y-3">
      {/* Background */}
      <Section title="Background & Shape" tooltip="Control the background fill, padding, and corner rounding of all generated icons">
        <Toggle
          id="opt-transparent"
          label="Transparent background"
          checked={options.transparent}
          onChange={v => set({ transparent: v })}
          tooltip="Keep the background transparent (PNG only). Ignored for maskable icons which always need a background."
        />
        {!options.transparent && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="opt-bg-color" className="text-sm" style={{ color: 'var(--c-fg)' }}>Background color</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="opt-bg-color"
                type="color"
                value={options.bgColor}
                onChange={e => set({ bgColor: e.target.value })}
                className="w-9 h-9 rounded-lg cursor-pointer border p-0.5"
                style={{ borderColor: 'var(--c-input-border)', background: 'var(--c-input)' }}
                aria-label="Background color"
              />
              <input
                type="text"
                value={options.bgColor}
                onChange={e => set({ bgColor: e.target.value })}
                maxLength={7}
                className="flex-1 text-sm rounded-lg px-3 py-2 border font-mono outline-none"
                style={{ background: 'var(--c-input)', color: 'var(--c-fg)', borderColor: 'var(--c-input-border)' }}
                aria-label="Background color hex"
              />
            </div>
          </div>
        )}
        <Slider
          id="opt-padding"
          label="Padding"
          value={options.padding}
          min={0}
          max={0.25}
          step={0.01}
          format={v => `${Math.round(v * 100)}%`}
          onChange={v => set({ padding: v })}
          tooltip="Add breathing room around your logo inside the icon canvas"
        />
        <Slider
          id="opt-radius"
          label="Corner radius"
          value={options.cornerRadius}
          min={0}
          max={0.5}
          step={0.01}
          format={v => `${Math.round(v * 100)}%`}
          onChange={v => set({ cornerRadius: v })}
          tooltip="0% = square, 50% = circle, ~22% = iOS squircle"
        />
      </Section>

      {/* Presets */}
      <Section title="Package Preset" tooltip="Choose which output files to generate">
        <div className="space-y-2">
          {PRESET_ORDER.map(key => (
            <label
              key={key}
              className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-all ${options.preset === key ? 'border-[var(--c-primary)]' : 'border-transparent'}`}
              style={{ background: options.preset === key ? 'color-mix(in srgb, var(--c-primary) 8%, var(--c-muted))' : 'var(--c-muted)' }}
            >
              <input
                type="radio"
                name="preset"
                value={key}
                checked={options.preset === key}
                onChange={() => set({ preset: key })}
                className="mt-0.5 accent-[var(--c-primary)]"
              />
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--c-fg)' }}>
                  {PRESETS[key].label}
                  {key !== 'custom' && (
                    <span className="ml-2 text-xs font-normal" style={{ color: 'var(--c-fg-muted)' }}>
                      {PRESETS[key].files.length} files
                    </span>
                  )}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--c-fg-muted)' }}>
                  {PRESETS[key].description}
                </div>
              </div>
            </label>
          ))}
        </div>

        {options.preset === 'custom' && (
          <div className="space-y-3 pt-1">
            {CATEGORY_ORDER.map(cat => {
              const catIcons = ALL_ICONS.filter(i => i.category === cat)
              return (
                <div key={cat}>
                  <p className="text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--c-fg-muted)' }}>
                    {CATEGORY_LABELS[cat]}
                  </p>
                  <div className="space-y-1">
                    {catIcons.map(spec => (
                      <label key={spec.filename} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={customSelected.has(spec.filename)}
                          onChange={() => toggleFile(spec.filename)}
                          className="rounded accent-[var(--c-primary)]"
                        />
                        <span className="text-xs font-mono flex-1" style={{ color: 'var(--c-fg)' }}>{spec.filename}</span>
                        <span className="text-xs" style={{ color: 'var(--c-fg-muted)' }}>{spec.width}×{spec.height}</span>
                      </label>
                    ))}
                    {SPECIAL_FILES.map(f => (
                      <label key={f} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customSelected.has(f)}
                          onChange={() => toggleFile(f)}
                          className="rounded accent-[var(--c-primary)]"
                        />
                        <span className="text-xs font-mono flex-1" style={{ color: 'var(--c-fg)' }}>{f}</span>
                        <span className="text-xs" style={{ color: 'var(--c-fg-muted)' }}>special</span>
                      </label>
                    ))}
                  </div>
                </div>
              )
            })}
            {allCustomFiles.map(() => null)}
          </div>
        )}
      </Section>

      {/* Optional outputs */}
      <Section title="Optional Outputs" defaultOpen={false} tooltip="Generate a manifest.json and HTML snippet alongside the icons">
        <Toggle
          id="opt-manifest"
          label="Generate manifest.json"
          checked={options.generateManifest}
          onChange={v => set({ generateManifest: v })}
          tooltip="Creates a Web App Manifest with icon paths, app name, and colors"
        />
        <Toggle
          id="opt-snippet"
          label="Generate HTML snippet"
          checked={options.generateSnippet}
          onChange={v => set({ generateSnippet: v })}
          tooltip="Creates a copy-paste <head> block with all <link> tags"
        />
        <div>
          <label htmlFor="opt-base-path" className="block text-sm mb-1.5" style={{ color: 'var(--c-fg)' }}>
            Base path
          </label>
          <input
            id="opt-base-path"
            type="text"
            value={options.basePath}
            onChange={e => set({ basePath: e.target.value })}
            placeholder="/"
            className="w-full text-sm rounded-lg px-3 py-2 border font-mono outline-none"
            style={{ background: 'var(--c-input)', color: 'var(--c-fg)', borderColor: 'var(--c-input-border)' }}
            aria-label="Base path for icon URLs"
            title="The root path where your icons will be served from, e.g. / or /assets/"
          />
          <p className="text-xs mt-1" style={{ color: 'var(--c-fg-muted)' }}>Used in manifest.json and HTML snippet paths</p>
        </div>
      </Section>
    </div>
  )
}
