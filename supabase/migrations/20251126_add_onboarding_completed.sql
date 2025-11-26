-- =====================================================
-- Migration: Add onboarding_completed to user_profile
-- Generated: 2025-11-26
-- Story: 7.2 - Create Onboarding Flow for First-Time Users
-- =====================================================

-- Add onboarding_completed column to user_profile
-- Default false so all existing users will see onboarding
ALTER TABLE user_profile
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

COMMENT ON COLUMN user_profile.onboarding_completed IS 'Whether user has completed or skipped onboarding wizard';

-- =====================================================
-- Migration Complete
-- =====================================================
