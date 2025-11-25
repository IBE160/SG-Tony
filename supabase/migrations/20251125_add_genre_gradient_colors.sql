-- =====================================================
-- Add gradient_colors to genre table
-- Story 3.10: Add Genre Prompt Templates to Database
-- Generated: 2025-11-25
-- =====================================================

-- Add gradient_colors column to genre table
ALTER TABLE genre ADD COLUMN IF NOT EXISTS gradient_colors JSONB DEFAULT '{"from": "#E94560", "to": "#FFC93C"}'::jsonb;

COMMENT ON COLUMN genre.gradient_colors IS 'Gradient background colors for genre cards (JSON with from/to hex colors)';

-- Update existing genres with Norwegian-optimized prompt templates and gradient colors
-- Based on founder's 80k listener expertise and Playful Nordic theme

-- Country Rock
UPDATE genre
SET
  display_name = 'Countryrock',
  suno_prompt_template = 'Country, rock, anthem, twangy guitar, catchy fiddle, drum, bass, Norwegian vocals',
  gradient_colors = '{"from": "#E94560", "to": "#FFC93C"}'::jsonb,
  description = 'Upbeat country with rock energy'
WHERE name = 'country-rock';

-- Norwegian Pop
UPDATE genre
SET
  display_name = 'Norsk pop',
  suno_prompt_template = 'Pop, Norwegian, catchy melody, electronic, upbeat, modern production',
  gradient_colors = '{"from": "#0F3460", "to": "#E94560"}'::jsonb,
  description = 'Modern Norwegian pop music'
WHERE name = 'norwegian-pop';

-- Folk Ballad
UPDATE genre
SET
  display_name = 'Folkeballade',
  suno_prompt_template = 'Folk, acoustic, Norwegian traditional, heartfelt, storytelling',
  gradient_colors = '{"from": "#06D6A0", "to": "#FFC93C"}'::jsonb,
  description = 'Acoustic folk with Norwegian tradition'
WHERE name = 'folk-ballad';

-- Party Anthem
UPDATE genre
SET
  display_name = 'Festlåt',
  suno_prompt_template = 'Dance, party, energetic, sing-along, festive, Norwegian celebration',
  gradient_colors = '{"from": "#FFC93C", "to": "#E94560"}'::jsonb,
  description = 'Energetic party songs for celebrations'
WHERE name = 'party-anthem';

-- Rap/Hip-Hop
UPDATE genre
SET
  suno_prompt_template = 'Hip-hop, rap, Norwegian flow, urban, rhythmic, modern beats',
  gradient_colors = '{"from": "#0F3460", "to": "#8B5CF6"}'::jsonb,
  description = 'Norwegian rap with urban rhythmic flow'
WHERE name = 'rap-hiphop';

-- Rock Ballad
UPDATE genre
SET
  display_name = 'Rockballade',
  suno_prompt_template = 'Rock, ballad, emotional, guitar solo, powerful vocals, Norwegian',
  gradient_colors = '{"from": "#8B5CF6", "to": "#E94560"}'::jsonb,
  description = 'Emotional rock with powerful vocals'
WHERE name = 'rock-ballad';

-- Dance/Electronic
UPDATE genre
SET
  name = 'electronic-dance',
  display_name = 'Dans/Elektronisk',
  emoji = '💃',
  suno_prompt_template = 'Electronic, dance, EDM, synth, energetic, club, Norwegian vocals',
  gradient_colors = '{"from": "#06D6A0", "to": "#3B82F6"}'::jsonb,
  description = 'High-energy electronic dance music',
  sort_order = 7
WHERE name = 'electronic-dance';

-- Singer-Songwriter (Acoustic)
UPDATE genre
SET
  name = 'singer-songwriter',
  display_name = 'Singer-Songwriter',
  emoji = '🎹',
  suno_prompt_template = 'Acoustic, intimate, storytelling, piano, guitar, heartfelt, Norwegian',
  gradient_colors = '{"from": "#FB923C", "to": "#92400E"}'::jsonb,
  description = 'Intimate acoustic storytelling',
  sort_order = 8
WHERE name = 'acoustic-singer-songwriter';

-- Remove genres that don't fit the Norwegian-optimized strategy
DELETE FROM genre WHERE name IN ('indie-pop', 'blues-rock');

COMMENT ON TABLE genre IS 'Genre reference data with 8 Norwegian-optimized song genres';
