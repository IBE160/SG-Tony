'use client'

import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface LowCreditWarningProps {
  balance: number
  userId: string
  onPurchaseClick: () => void
}

const LOW_BALANCE_THRESHOLD = 20
const DISMISSAL_DURATION_HOURS = 24

export function LowCreditWarning({ balance, userId, onPurchaseClick }: LowCreditWarningProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check localStorage for dismissal state
    const dismissalKey = `low-credit-warning-dismissed-${userId}`
    const dismissalData = localStorage.getItem(dismissalKey)

    if (dismissalData) {
      try {
        const { timestamp } = JSON.parse(dismissalData)
        const hoursSinceDismissal = (Date.now() - timestamp) / (1000 * 60 * 60)

        // Reset dismissal after 24 hours or if balance above threshold
        if (hoursSinceDismissal < DISMISSAL_DURATION_HOURS && balance < LOW_BALANCE_THRESHOLD) {
          setIsDismissed(true)
        } else {
          localStorage.removeItem(dismissalKey)
        }
      } catch (error) {
        // Invalid data, remove it
        localStorage.removeItem(dismissalKey)
      }
    }
  }, [userId, balance])

  const handleDismiss = () => {
    const dismissalKey = `low-credit-warning-dismissed-${userId}`
    localStorage.setItem(dismissalKey, JSON.stringify({ timestamp: Date.now() }))
    setIsDismissed(true)
  }

  // Don't show if balance >= threshold or user dismissed
  if (balance >= LOW_BALANCE_THRESHOLD || isDismissed) return null

  return (
    <Alert className="bg-[#FFC93C] border-[#FFC93C] text-gray-900 mb-4">
      <AlertDescription className="flex items-center justify-between gap-4">
        <span className="flex-1">
          💡 Lite kreditter igjen! Du har {balance} kreditter. Kjøp mer?
        </span>
        <div className="flex gap-2 flex-shrink-0">
          <Button onClick={onPurchaseClick} size="sm" variant="secondary" className="whitespace-nowrap">
            Kjøp kreditter
          </Button>
          <Button
            onClick={handleDismiss}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            aria-label="Lukk advarsel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
