import { useState, useCallback, useRef } from 'react'

interface SnackbarState {
  visible: boolean
  message: string
}

export function useSnackbar() {
  const [state, setState] = useState<SnackbarState>({
    visible: false,
    message: '',
  })

  const timeoutRef = useRef<NodeJS.Timeout>()
  const undoCallbackRef = useRef<(() => void) | null>(null)

  const show = useCallback((message: string, onUndo: () => void) => {
    // Clear existing timeout if any
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    undoCallbackRef.current = onUndo

    setState({
      visible: true,
      message,
    })
  }, [])

  const hide = useCallback(() => {
    setState({
      visible: false,
      message: '',
    })

    undoCallbackRef.current = null

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleUndo = useCallback(() => {
    if (undoCallbackRef.current) {
      undoCallbackRef.current()
    }
    hide()
  }, [hide])

  return {
    visible: state.visible,
    message: state.message,
    show,
    hide,
    handleUndo,
  }
}
