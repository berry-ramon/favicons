import type { ManifestConfig } from '../types/icon'

interface Props {
  manifest: ManifestConfig
  onChange: (config: ManifestConfig) => void
}

function Field({
  label, id, value, onChange, placeholder, as,
}: {
  label: string
  id: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  as?: 'textarea'
}) {
  const inputClass = 'w-full text-sm rounded-lg px-3 py-2 border transition-colors outline-none'
  const inputStyle = {
    background: 'var(--c-input)',
    color: 'var(--c-fg)',
    borderColor: 'var(--c-input-border)',
  }

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium mb-1.5" style={{ color: 'var(--c-fg-muted)' }}>
        {label}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className={inputClass}
          style={inputStyle}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
          style={inputStyle}
        />
      )}
    </div>
  )
}

function ColorField({
  label, id, value, onChange,
}: {
  label: string
  id: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium mb-1.5" style={{ color: 'var(--c-fg-muted)' }}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-9 h-9 rounded-lg cursor-pointer border p-0.5"
          style={{ borderColor: 'var(--c-input-border)', background: 'var(--c-input)' }}
          aria-label={label}
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          maxLength={7}
          className="flex-1 text-sm rounded-lg px-3 py-2 border font-mono outline-none"
          style={{ background: 'var(--c-input)', color: 'var(--c-fg)', borderColor: 'var(--c-input-border)' }}
          aria-label={`${label} hex value`}
        />
      </div>
    </div>
  )
}

export function ManifestPanel({ manifest, onChange }: Props) {
  const update = (key: keyof ManifestConfig) => (v: string) =>
    onChange({ ...manifest, [key]: v })

  return (
    <div className="space-y-3">
      <Field label="App Name" id="manifest-name" value={manifest.name} onChange={update('name')} placeholder="My Awesome App" />
      <Field label="Short Name" id="manifest-short" value={manifest.shortName} onChange={update('shortName')} placeholder="App" />
      <Field label="Description" id="manifest-desc" value={manifest.description} onChange={update('description')} placeholder="A short description of what this app does" as="textarea" />
      <div className="grid grid-cols-2 gap-3">
        <ColorField label="Theme Color" id="manifest-theme" value={manifest.themeColor} onChange={update('themeColor')} />
        <ColorField label="Background Color" id="manifest-bg" value={manifest.backgroundColor} onChange={update('backgroundColor')} />
      </div>
    </div>
  )
}
