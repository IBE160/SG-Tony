/**
 * Credit Validation Utility
 * Provides credit checking functionality for client-side validation
 */

export interface CreditCheckResult {
  sufficient: boolean
  balance: number
  required: number
  shortfall?: number
}

/**
 * Check if user has sufficient credits for an action
 * @param balance - Current credit balance
 * @param required - Required credits for the action
 * @returns CreditCheckResult with validation details
 */
export function checkSufficientCredits(
  balance: number,
  required: number
): CreditCheckResult {
  const sufficient = balance >= required
  return {
    sufficient,
    balance,
    required,
    shortfall: sufficient ? undefined : required - balance,
  }
}
