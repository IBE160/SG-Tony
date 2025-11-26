/**
 * Error Handler Utility
 * Parses errors and returns user-friendly error messages
 * Technical details are logged server-side, never exposed to users
 */

import { ErrorCode, ERROR_MESSAGES, type ErrorMessage } from './error-messages'

/**
 * API Error Response Format (from architecture.md)
 */
interface APIErrorResponse {
  error?: {
    code?: string
    message?: string
    details?: unknown
  }
}

/**
 * Parse an unknown error and return the appropriate user-friendly ErrorMessage
 * Logs full technical details to console (server-side logging)
 *
 * @param error - The error to handle (unknown type)
 * @param context - Optional context string for logging (e.g., 'song-generation', 'lyric-optimize')
 * @returns ErrorMessage from the dictionary
 */
export function handleError(error: unknown, context?: string): ErrorMessage {
  // Server-side logging with full technical details
  console.error(`[Error${context ? ` in ${context}` : ''}]:`, error)

  // Handle network/fetch errors
  if (error instanceof TypeError) {
    const message = error.message.toLowerCase()
    if (message.includes('fetch') || message.includes('network') || message.includes('failed to fetch')) {
      return ERROR_MESSAGES[ErrorCode.NETWORK_ERROR]
    }
  }

  // Handle API response errors
  if (isAPIErrorResponse(error)) {
    const code = error.error?.code?.toUpperCase()
    const message = error.error?.message?.toLowerCase() || ''

    // Match known error codes
    if (code && code in ErrorCode) {
      return ERROR_MESSAGES[code as ErrorCode]
    }

    // Match by message content
    if (message.includes('insufficient') && message.includes('credit')) {
      return ERROR_MESSAGES[ErrorCode.INSUFFICIENT_CREDITS]
    }
    if (message.includes('payment') || message.includes('stripe')) {
      return ERROR_MESSAGES[ErrorCode.PAYMENT_FAILED]
    }
    if (message.includes('unauthorized') || message.includes('401') || message.includes('auth')) {
      return ERROR_MESSAGES[ErrorCode.AUTH_REQUIRED]
    }
    if (message.includes('session') && message.includes('expired')) {
      return ERROR_MESSAGES[ErrorCode.SESSION_EXPIRED]
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    // Network errors
    if (message.includes('network') || message.includes('fetch') || message.includes('offline')) {
      return ERROR_MESSAGES[ErrorCode.NETWORK_ERROR]
    }

    // Timeout errors
    if (message.includes('timeout') || message.includes('timed out') || message.includes('aborted')) {
      return ERROR_MESSAGES[ErrorCode.TIMEOUT_ERROR]
    }

    // Auth errors
    if (message.includes('unauthorized') || message.includes('401') || message.includes('unauthenticated')) {
      return ERROR_MESSAGES[ErrorCode.AUTH_REQUIRED]
    }
    if (message.includes('session') && (message.includes('expired') || message.includes('invalid'))) {
      return ERROR_MESSAGES[ErrorCode.SESSION_EXPIRED]
    }

    // Credit errors
    if (message.includes('insufficient') && message.includes('credit')) {
      return ERROR_MESSAGES[ErrorCode.INSUFFICIENT_CREDITS]
    }
    if (message.includes('credits') && (message.includes('not enough') || message.includes('need'))) {
      return ERROR_MESSAGES[ErrorCode.INSUFFICIENT_CREDITS]
    }

    // Payment errors
    if (message.includes('payment') || message.includes('charge') || message.includes('card')) {
      return ERROR_MESSAGES[ErrorCode.PAYMENT_FAILED]
    }

    // Suno API errors
    if (message.includes('suno') || message.includes('music generation')) {
      return ERROR_MESSAGES[ErrorCode.SUNO_API_ERROR]
    }

    // OpenAI/GPT errors
    if (message.includes('openai') || message.includes('gpt') || message.includes('lyric generation')) {
      return ERROR_MESSAGES[ErrorCode.OPENAI_API_ERROR]
    }

    // Validation errors
    if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return ERROR_MESSAGES[ErrorCode.VALIDATION_ERROR]
    }

    // Song-specific errors
    if (message.includes('song') && message.includes('not found')) {
      return ERROR_MESSAGES[ErrorCode.SONG_NOT_FOUND]
    }
    if (message.includes('download') && message.includes('fail')) {
      return ERROR_MESSAGES[ErrorCode.SONG_DOWNLOAD_FAILED]
    }
    if (message.includes('delete') && message.includes('fail')) {
      return ERROR_MESSAGES[ErrorCode.SONG_DELETE_FAILED]
    }
  }

  // Default to unknown error
  return ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR]
}

/**
 * Get error message directly by error code
 * Useful when you know the specific error type
 */
export function getErrorByCode(code: ErrorCode): ErrorMessage {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR]
}

/**
 * Type guard for API error responses
 */
function isAPIErrorResponse(error: unknown): error is APIErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as APIErrorResponse).error === 'object'
  )
}

/**
 * Check if an error is a specific type
 */
export function isErrorCode(error: unknown, code: ErrorCode): boolean {
  const errorMessage = handleError(error)
  return errorMessage.code === code
}
