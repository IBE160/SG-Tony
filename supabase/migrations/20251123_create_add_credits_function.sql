-- =====================================================
-- Add Credits Stored Procedure
-- Date: 2025-11-23
-- Description: Atomically add credits after successful Stripe payment
-- Ensures credit balance update and transaction log are atomic
-- =====================================================

CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_description TEXT,
  p_stripe_session_id TEXT DEFAULT NULL
) RETURNS credit_transaction AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
  v_transaction credit_transaction;
BEGIN
  -- Lock user profile row to prevent race conditions
  SELECT credit_balance INTO v_current_balance
  FROM user_profile
  WHERE id = p_user_id
  FOR UPDATE;

  -- Validate positive amount
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive: %', p_amount;
  END IF;

  -- Calculate new balance (add credits)
  v_new_balance := v_current_balance + p_amount;

  -- Update user balance
  UPDATE user_profile
  SET credit_balance = v_new_balance,
      updated_at = NOW()
  WHERE id = p_user_id;

  -- Record purchase transaction (positive amount)
  INSERT INTO credit_transaction (user_id, amount, balance_after, transaction_type, description, stripe_session_id)
  VALUES (p_user_id, p_amount, v_new_balance, 'purchase', p_description, p_stripe_session_id)
  RETURNING * INTO v_transaction;

  RETURN v_transaction;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION add_credits IS 'Atomically add credits with row locking and audit trail (used by Stripe webhook)';

-- =====================================================
-- Migration Complete
-- This function is called when:
-- 1. Stripe webhook confirms successful payment
-- 2. Admin manually adds credits (future feature)
-- 3. Any other credit addition scenario
-- Benefits: Ensures credit balance and transaction log are atomically updated together
-- =====================================================
