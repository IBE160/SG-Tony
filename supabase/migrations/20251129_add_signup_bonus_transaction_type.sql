-- Migration: Add 'signup_bonus' to credit_transaction transaction_type CHECK constraint
-- Story: 7.6 - Update Onboarding Messaging and New User Credits
-- Purpose: Allow recording signup bonus credits for new user registrations

-- Drop the existing CHECK constraint
ALTER TABLE credit_transaction DROP CONSTRAINT IF EXISTS credit_transaction_transaction_type_check;

-- Add the updated CHECK constraint with 'signup_bonus' type
ALTER TABLE credit_transaction
ADD CONSTRAINT credit_transaction_transaction_type_check
CHECK (transaction_type IN ('purchase', 'deduction', 'refund', 'signup_bonus'));

-- Add comment documenting the new type
COMMENT ON COLUMN credit_transaction.transaction_type IS 'Transaction type: purchase (credit buy), deduction (song generation), refund (failed generation), signup_bonus (welcome credits for new users)';
