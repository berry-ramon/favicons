import { useEffect, useState } from 'react'
import type { ToastItem } from '../types/icon'

interface ToastProps {
  toasts: ToastItem[]
  onRemove: (id: string) => void
}

function ToastMessage({ toast, onRemove }: { toast: ToastItem; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onRemove(toast.id), 300)
    }, 2800)
    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  const colors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-300',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300',
  }

  const icons = { success: '✓', error: '✕', info: 'ℹ' }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium shadow-lg transition-all duration-300 ${colors[toast.type]} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    >
      <span className="text-base leading-none">{icons[toast.type]}</span>
      <span>{toast.message}</span>
    </div>
  )
}

export function ToastContainer({ toasts, onRemove }: ToastProps) {
  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end pointer-events-none"
    >
      {toasts.map(t => (
        <ToastMessage key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  )
}
