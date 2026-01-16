'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'

interface SnackbarProps {
  visible: boolean
  message: string
  onUndo: () => void
  onDismiss: () => void
}

export function Snackbar({ visible, message, onUndo, onDismiss }: SnackbarProps) {
  useEffect(() => {
    if (!visible) return

    const timer = setTimeout(() => {
      onDismiss()
    }, 5000)

    return () => clearTimeout(timer)
  }, [visible, onDismiss])

  return (
    <div
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-[150]",
        "bg-elevated border border-border rounded-xl",
        "px-5 py-4 flex items-center gap-4",
        "shadow-lg max-w-[400px] w-[90%]",
        "transition-all duration-300 ease-out",
        visible ? "bottom-6 opacity-100" : "-bottom-20 opacity-0 pointer-events-none"
      )}
    >
      <span className="text-sm text-text-primary flex-1">{message}</span>
      <button
        onClick={onUndo}
        className={cn(
          "px-4 py-2 bg-primary hover:bg-primary-hover",
          "text-white text-[13px] font-bold rounded-md",
          "transition-colors"
        )}
      >
        Angre
      </button>
    </div>
  )
}
