interface Props {
  isDark: boolean
  onToggle: () => void
}

export function ThemeToggle({ isDark, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all duration-150 hover:opacity-70 cursor-pointer"
      style={{ background: 'var(--c-muted)', color: 'var(--c-fg)' }}
    >
      {isDark ? '☀' : '◐'}
    </button>
  )
}
