import { create } from 'zustand'

const LOW_BALANCE_THRESHOLD = 20 // Show warning when balance < 20 credits

interface CreditsStore {
  balance: number
  setBalance: (balance: number) => void
  refreshBalance: () => Promise<void>
  isLowBalance: () => boolean
  hasInsufficientCredits: (required: number) => boolean
}

export const useCreditsStore = create<CreditsStore>((set, get) => ({
  balance: 0,
  setBalance: (balance) => set({ balance }),
  refreshBalance: async () => {
    try {
      const res = await fetch('/api/credits/balance')
      if (!res.ok) {
        throw new Error('Failed to fetch balance')
      }
      const { data } = await res.json()
      set({ balance: data.balance })
    } catch (error) {
      console.error('Error refreshing balance:', error)
    }
  },
  isLowBalance: () => get().balance < LOW_BALANCE_THRESHOLD,
  hasInsufficientCredits: (required) => get().balance < required,
}))
