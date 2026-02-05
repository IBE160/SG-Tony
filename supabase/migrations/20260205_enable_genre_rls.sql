-- =====================================================
-- Enable RLS on Genre Table
-- Generated: 2026-02-05
-- Description: Fix security warning by enabling RLS with public read access
-- =====================================================

-- Enable RLS on genre table
ALTER TABLE genre ENABLE ROW LEVEL SECURITY;

-- Allow anyone (authenticated or anonymous) to read genres
-- This is public reference data that doesn't contain sensitive information
CREATE POLICY genre_select_public ON genre
  FOR SELECT USING (true);

-- Note: No INSERT/UPDATE/DELETE policies are created
-- This means only service_role (admin) can modify genres
-- which is the intended behavior for reference data

COMMENT ON POLICY genre_select_public ON genre IS 'Genres are public reference data, readable by all users';
