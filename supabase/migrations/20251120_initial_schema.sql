-- =====================================================
-- Musikkfabrikken - Initial Database Schema
-- Generated: 2025-11-20
-- Description: Core tables for Norwegian song generation platform
-- =====================================================

-- =====================================================
-- 1. USER PROFILE TABLE
-- Extends Supabase auth.users with credit balance and preferences
-- =====================================================
CREATE TABLE user_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  display_name TEXT,
  credit_balance INTEGER DEFAULT 0 CHECK (credit_balance >= 0),
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE user_profile IS 'Extended user profile with credit balance and preferences';
COMMENT ON COLUMN user_profile.credit_balance IS 'Pre-paid credits for song generation, cannot be negative';
COMMENT ON COLUMN user_profile.preferences IS 'User preferences stored as JSON (e.g., default genre, phonetic settings)';

-- =====================================================
-- 2. SONG TABLE
-- Generated songs with metadata, status tracking, and soft delete
-- =====================================================
CREATE TABLE song (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profile(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  concept TEXT,  -- User's original concept/prompt
  original_lyrics TEXT,  -- Before phonetic optimization
  optimized_lyrics TEXT,  -- After phonetic optimization
  phonetic_enabled BOOLEAN DEFAULT true,
  suno_song_id TEXT,  -- Suno API song ID
  audio_url TEXT,  -- Supabase Storage URL
  duration_seconds INTEGER,
  status TEXT NOT NULL CHECK (status IN ('generating', 'completed', 'failed')),
  error_message TEXT,
  canvas_url TEXT,  -- Optional canvas image URL
  shared_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ  -- Soft delete (14-day retention policy)
);

COMMENT ON TABLE song IS 'Generated songs with AI-optimized Norwegian pronunciation';
COMMENT ON COLUMN song.phonetic_enabled IS 'Whether Norwegian pronunciation optimization was applied';
COMMENT ON COLUMN song.status IS 'Generation status: generating (in progress), completed (ready), failed (error)';
COMMENT ON COLUMN song.deleted_at IS 'Soft delete timestamp for 14-day retention policy (cost management)';

-- Performance indexes for song queries
CREATE INDEX idx_song_user_id ON song(user_id);
CREATE INDEX idx_song_status ON song(status);
CREATE INDEX idx_song_created_at ON song(created_at DESC);

-- =====================================================
-- 3. CREDIT TRANSACTION TABLE
-- Audit log for all credit operations (purchases, deductions, refunds)
-- =====================================================
CREATE TABLE credit_transaction (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profile(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,  -- Positive for purchase, negative for deduction
  balance_after INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'deduction', 'refund')),
  description TEXT NOT NULL,
  stripe_session_id TEXT,  -- For purchases
  song_id UUID REFERENCES song(id) ON DELETE SET NULL,  -- For deductions/refunds
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE credit_transaction IS 'Audit trail for all credit operations';
COMMENT ON COLUMN credit_transaction.amount IS 'Positive for purchases/refunds, negative for deductions';
COMMENT ON COLUMN credit_transaction.balance_after IS 'User credit balance after this transaction';

-- Performance indexes for transaction queries
CREATE INDEX idx_credit_transaction_user_id ON credit_transaction(user_id);
CREATE INDEX idx_credit_transaction_created_at ON credit_transaction(created_at DESC);

-- =====================================================
-- 4. GENRE TABLE
-- Reference data for song genres with Suno prompt templates
-- =====================================================
CREATE TABLE genre (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  emoji TEXT,
  suno_prompt_template TEXT NOT NULL,  -- e.g., "Country, rock, anthem, twangy guitar"
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

COMMENT ON TABLE genre IS 'Reference data for song genres with AI prompt templates';
COMMENT ON COLUMN genre.suno_prompt_template IS 'Template string sent to Suno API for genre-specific music generation';

-- =====================================================
-- 5. MASTERING REQUEST TABLE
-- Manual mastering service tracking (premium feature)
-- =====================================================
CREATE TABLE mastering_request (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profile(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES song(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  mastered_audio_url TEXT,
  notes TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

COMMENT ON TABLE mastering_request IS 'Manual mastering service requests for premium users';

-- Performance index for mastering request status queries
CREATE INDEX idx_mastering_request_status ON mastering_request(status);

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- Enforces multi-tenant data isolation at database level
-- =====================================================

-- Enable RLS on all user-facing tables
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE song ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transaction ENABLE ROW LEVEL SECURITY;
ALTER TABLE mastering_request ENABLE ROW LEVEL SECURITY;
-- Note: genre table is reference data and does NOT need RLS

-- User Profile Policies
CREATE POLICY user_profile_select ON user_profile
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY user_profile_update ON user_profile
  FOR UPDATE USING (auth.uid() = id);

COMMENT ON POLICY user_profile_select ON user_profile IS 'Users can only read their own profile';
COMMENT ON POLICY user_profile_update ON user_profile IS 'Users can only update their own profile';

-- Song Policies
CREATE POLICY song_select ON song
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY song_insert ON song
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY song_update ON song
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY song_delete ON song
  FOR DELETE USING (auth.uid() = user_id);

COMMENT ON POLICY song_select ON song IS 'Users can only read their own songs';
COMMENT ON POLICY song_insert ON song IS 'Users can only create songs for themselves';
COMMENT ON POLICY song_update ON song IS 'Users can only update their own songs';
COMMENT ON POLICY song_delete ON song IS 'Users can only delete their own songs';

-- Credit Transaction Policies
CREATE POLICY credit_transaction_select ON credit_transaction
  FOR SELECT USING (auth.uid() = user_id);

COMMENT ON POLICY credit_transaction_select ON credit_transaction IS 'Users can only read their own credit transactions';
-- Note: No INSERT/UPDATE/DELETE policies - transactions created by system functions only

-- Mastering Request Policies
CREATE POLICY mastering_request_select ON mastering_request
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY mastering_request_insert ON mastering_request
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY mastering_request_update ON mastering_request
  FOR UPDATE USING (auth.uid() = user_id);

COMMENT ON POLICY mastering_request_select ON mastering_request IS 'Users can only read their own mastering requests';
COMMENT ON POLICY mastering_request_insert ON mastering_request IS 'Users can only create mastering requests for themselves';
COMMENT ON POLICY mastering_request_update ON mastering_request IS 'Users can only update their own mastering requests';

-- =====================================================
-- 7. STORED PROCEDURES
-- Atomic credit deduction with validation and transaction logging
-- =====================================================

CREATE OR REPLACE FUNCTION deduct_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_description TEXT,
  p_song_id UUID DEFAULT NULL
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
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION deduct_credits IS 'Atomically deduct credits with validation, row locking, and audit trail';

-- =====================================================
-- 8. SEED DATA - GENRES
-- Initial genre reference data with Suno prompt templates
-- =====================================================

INSERT INTO genre (name, display_name, description, emoji, suno_prompt_template, sort_order, is_active) VALUES
  (
    'country-rock',
    'Country Rock',
    'Country rock anthem with twangy guitar and catchy fiddle',
    '🎸',
    'Country, rock, anthem, twangy guitar, catchy fiddle, drum, bass',
    1,
    true
  ),
  (
    'norwegian-pop',
    'Norwegian Pop',
    'Modern Norwegian pop with catchy, upbeat melodies',
    '🎤',
    'Norwegian pop, catchy, upbeat, modern',
    2,
    true
  ),
  (
    'folk-ballad',
    'Folk Ballad',
    'Acoustic folk ballad with storytelling and Norwegian tradition',
    '🪕',
    'Folk, ballad, acoustic, storytelling, Norwegian tradition',
    3,
    true
  ),
  (
    'party-anthem',
    'Party Anthem',
    'Energetic party anthem with celebratory Norwegian lyrics',
    '🎉',
    'Party, anthem, energetic, celebratory, Norwegian lyrics',
    4,
    true
  );

COMMENT ON TABLE genre IS 'Genre reference data seeded with 4 core Norwegian song genres';

-- =====================================================
-- Migration Complete
-- Next Steps:
-- 1. Run this migration in Supabase SQL Editor
-- 2. Verify tables created: Check Table Editor
-- 3. Generate TypeScript types: npx supabase gen types typescript
-- 4. Update Supabase clients with Database type
-- =====================================================
