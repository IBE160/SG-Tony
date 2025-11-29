-- Migration: Update user profile trigger to include welcome bonus credits
-- Story: 7.6 - Update Onboarding Messaging and New User Credits
-- Purpose: New users receive 24 credits (2 free songs) automatically on signup
-- Note: Only updates the FUNCTION - trigger already exists from 20251122

-- Welcome bonus: 24 credits = 2 free songs (12 credits per song)
-- Function to create user_profile with welcome bonus when a new user signs up
-- Using CREATE OR REPLACE to update existing function (no need to drop trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  welcome_bonus_credits INTEGER := 24;
BEGIN
  -- Create user profile with welcome bonus credits
  INSERT INTO public.user_profile (id, display_name, credit_balance)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    welcome_bonus_credits
  );

  -- Record the signup bonus transaction for audit trail
  INSERT INTO public.credit_transaction (user_id, amount, balance_after, transaction_type, description)
  VALUES (
    NEW.id,
    welcome_bonus_credits,
    welcome_bonus_credits,
    'signup_bonus',
    'Velkomstbonus - 2 gratis sanger'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.handle_new_user IS 'Automatically creates user_profile with 24 welcome bonus credits and records signup_bonus transaction when new user signs up';
