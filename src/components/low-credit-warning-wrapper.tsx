'use client'

import { useEffect, useState } from 'react'
import { useCreditsStore } from '@/stores/credits-store'
import { LowCreditWarning } from '@/components/low-credit-warning'
import { useRouter } from 'next/navigation'

interface LowCreditWarningWrapperProps {
  userId?: string
}

export function LowCreditWarningWrapper({ userId }: LowCreditWarningWrapperProps) {
  const router = useRouter()
  const balance = useCreditsStore((state) => state.balance)
  const refreshBalance = useCreditsStore((state) => state.refreshBalance)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (userId) {
      refreshBalance()
    }
  }, [userId, refreshBalance])

  const handlePurchaseClick = () => {
    router.push('/settings?openPurchaseModal=true')
  }

  // Don't render on server to avoid hydration mismatch
  if (!mounted || !userId) return null

  return (
    <div className="container mx-auto px-4 pt-4">
      <LowCreditWarning
        balance={balance}
        userId={userId}
        onPurchaseClick={handlePurchaseClick}
      />
    </div>
  )
}
