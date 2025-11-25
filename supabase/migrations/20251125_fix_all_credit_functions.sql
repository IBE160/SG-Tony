-- =====================================================
-- Fix ALL Credit Functions with SECURITY DEFINER
-- Date: 2025-11-25
-- Issue: Credit operations fail with RLS policy violations
-- Solution: Add SECURITY DEFINER to bypass RLS for system operations
-- =====================================================

-- =====================================================
-- 1. Fix deduct_credits function
-- =====================================================

CREATE OR REPLACE FUNCTION deduct_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_description TEXT,
  p_song_id UUID DEFAULT NULL
) RETURNS credit_transaction
LANGUAGE plpgsql
SECURITY DEFINER  -- Bypass RLS for system operations
SET search_path = public
AS $$
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

  -- Validate sufficient credits
  IF v_current_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient credits: have %, need %', v_current_balance, p_amount;
  END IF;

  -- Calculate new balance
  v_new_balance := v_current_balance - p_amount;

  -- Update user balance
  UPDATE user_profile
  SET credit_balance = v_new_balance,
      updated_at = NOW()
  WHERE id = p_user_id;

  -- Record transaction
  INSERT INTO credit_transaction (user_id, amount, balance_after, transaction_type, description, song_id)
  VALUES (p_user_id, -p_amount, v_new_balance, 'deduction', p_description, p_song_id)
  RETURNING * INTO v_transaction;

  RETURN v_transaction;
END;
$$;

-- =====================================================
-- 2. Fix add_credits function
-- =====================================================

CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_description TEXT,
  p_stripe_session_id TEXT DEFAULT NULL
) RETURNS credit_transaction
LANGUAGE plpgsql
SECURITY DEFINER  -- Bypass RLS for system operations
SET search_path = public
AS $$
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

  -- Record purchase transaction
  INSERT INTO credit_transaction (user_id, amount, balance_after, transaction_type, description, stripe_session_id)
  VALUES (p_user_id, p_amount, v_new_balance, 'purchase', p_description, p_stripe_session_id)
  RETURNING * INTO v_transaction;

  RETURN v_transaction;
END;
$$;

-- =====================================================
-- 3. Fix refund_credits function
-- =====================================================

CREATE OR REPLACE FUNCTION refund_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_description TEXT,
  p_song_id UUID DEFAULT NULL
) RETURNS credit_transaction
LANGUAGE plpgsql
SECURITY DEFINER  -- Bypass RLS for system operations
SET search_path = public
AS $$
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

  -- Calculate new balance (add credits back)
  v_new_balance := v_current_balance + p_amount;

  -- Update user balance
  UPDATE user_profile
  SET credit_balance = v_new_balance,
      updated_at = NOW()
  WHERE id = p_user_id;

  -- Record refund transaction
  INSERT INTO credit_transaction (user_id, amount, balance_after, transaction_type, description, song_id)
  VALUES (p_user_id, p_amount, v_new_balance, 'refund', p_description, p_song_id)
  RETURNING * INTO v_transaction;

  RETURN v_transaction;
END;
$$;

-- =====================================================
-- 4. Grant execute permissions
-- =====================================================

GRANT EXECUTE ON FUNCTION deduct_credits(UUID, INTEGER, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION add_credits(UUID, INTEGER, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION refund_credits(UUID, INTEGER, TEXT, UUID) TO authenticated;

-- =====================================================
-- Verification Query
-- Run this after migration to verify SECURITY DEFINER is set:
-- =====================================================

-- SELECT
--   p.proname as function_name,
--   p.prosecdef as is_security_definer
-- FROM pg_proc p
-- WHERE p.proname IN ('deduct_credits', 'add_credits', 'refund_credits');
-- Expected: is_security_definer = true for all three

COMMENT ON FUNCTION deduct_credits IS 'Atomically deduct credits. SECURITY DEFINER bypasses RLS for credit_transaction inserts.';
COMMENT ON FUNCTION add_credits IS 'Atomically add credits. SECURITY DEFINER bypasses RLS for credit_transaction inserts.';
COMMENT ON FUNCTION refund_credits IS 'Atomically refund credits. SECURITY DEFINER bypasses RLS for credit_transaction inserts.';
