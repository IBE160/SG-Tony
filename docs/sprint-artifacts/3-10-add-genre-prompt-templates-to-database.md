# Story 3.10: Add Genre Prompt Templates to Database

Status: ready-for-dev

## Story

As a **developer**,
I want genre prompt templates seeded in the database,
so that each genre has optimized Suno prompts for authentic Norwegian music styles.

## Acceptance Criteria

**Given** Database schema includes `genre` table
**When** I run seed script
**Then** 8-10 genres are inserted with Norwegian-optimized prompt templates:
  - Country Rock: "Country, rock, anthem, twangy guitar, catchy fiddle, drum, bass, Norwegian vocals"
  - Norwegian Pop: "Pop, Norwegian, catchy melody, electronic, upbeat, modern production"
  - Folk Ballad: "Folk, acoustic, Norwegian traditional, heartfelt, storytelling"
  - Party Anthem: "Dance, party, energetic, sing-along, festive, Norwegian celebration"
  - Rap/Hip-Hop: "Hip-hop, rap, Norwegian flow, urban, rhythmic, modern beats"
  - Rock Ballad: "Rock, ballad, emotional, guitar solo, powerful vocals, Norwegian"
**And** Each genre has: name, display_name, emoji, gradient colors, suno_prompt_template
**And** Genres are marked `is_active=true` and ordered by `sort_order`
**And** Test each genre with actual Suno generation to verify prompt effectiveness

## Tasks / Subtasks

- [ ] Task 1: Create database seed script (AC: All genres with required fields)
  - [ ] Create `/supabase/migrations/seed_genres.sql` or `/supabase/seed.sql` file
  - [ ] Define INSERT statements for 8-10 genres with all required fields
  - [ ] Include Norwegian-optimized Suno prompt templates for each genre
  - [ ] Add emoji for each genre (🎸, 🪕, 🎉, 🎤, etc.)
  - [ ] Define gradient colors matching Playful Nordic theme
  - [ ] Set `is_active=true` and appropriate `sort_order` for all genres

- [ ] Task 2: Define genre data structure (AC: Each genre has required fields)
  - [ ] Add `name` field (internal identifier, e.g., "country-rock")
  - [ ] Add `display_name` field (user-facing label, e.g., "Country Rock")
  - [ ] Add `emoji` field (visual identifier for UI)
  - [ ] Add `gradient_colors` field (JSON or string for background styling)
  - [ ] Add `suno_prompt_template` field (Suno API prompt text)
  - [ ] Add `description` field (optional, for tooltip/help text)
  - [ ] Add `is_active` boolean field (default true)
  - [ ] Add `sort_order` integer field (display order in UI)

- [ ] Task 3: Create seed execution script or migration (AC: Seed data can be executed)
  - [ ] Add seed script to Supabase migrations directory
  - [ ] Ensure idempotency (check if genres already exist before inserting)
  - [ ] Add script to project documentation with execution instructions
  - [ ] Test seed script execution locally
  - [ ] Verify genres are inserted correctly with all fields populated

- [ ] Task 4: Validate prompt templates with founder (AC: Templates validated by expert)
  - [ ] Review each Suno prompt template for Norwegian optimization
  - [ ] Confirm genre names and descriptions are culturally appropriate
  - [ ] Verify emoji selections match genre expectations
  - [ ] Get founder approval on all prompt templates
  - [ ] Document any changes based on founder feedback

- [ ] Task 5: Test genre prompts with Suno API (AC: Verify prompt effectiveness)
  - [ ] Generate test songs for each genre using seed data
  - [ ] Verify Suno API accepts all prompt templates
  - [ ] Assess audio quality and genre authenticity for each template
  - [ ] Document any prompt adjustments needed based on test results
  - [ ] Update seed data if prompts need refinement

- [ ] Task 6: Update genre UI components (AC: Genres display correctly)
  - [ ] Verify genre carousel component can fetch and display seed data
  - [ ] Confirm emoji and gradient colors render correctly in UI
  - [ ] Test genre selection flow with seed data
  - [ ] Update any hardcoded genre references to use database data
  - [ ] Verify Norwegian display names appear correctly throughout app

## Dev Notes

### Requirements Context

**From Epic 3 (Norwegian Song Creation CORE):**
- Story 3.10 provides the foundational genre data that powers the genre carousel (Story 3.1)
- Prompt templates are critical for authentic Norwegian music generation
- Templates validated by founder's 80k listener expertise ensure quality
- Genres must be Norwegian-optimized, not generic Suno prompts

**Functional Requirements (PRD):**
- FR6: Users can select genre/style from pre-configured prompt templates
- FR51: Users can access genre/style prompt templates with drag-and-drop or selection
- Genre templates lower barrier for non-technical users who don't know how to describe musical styles

**Architecture Context:**
- Database: PostgreSQL via Supabase
- Genre table schema defined in database migrations (Story 1.6)
- Seed data approach: SQL INSERT statements for initial data population

### Learnings from Previous Story

**From Story 3-9-implement-free-30-second-preview-generation (Status: review)**

- **Database Migration Pattern**: Use Supabase migrations with descriptive naming
  - Example: `20251124_add_preview_support.sql` (date prefix + description)
  - Include indexes where appropriate for query performance
  - Test migrations locally before deploying

- **SQL Best Practices**:
  - Use parameterized queries to prevent SQL injection
  - Include default values for fields where appropriate
  - Add CHECK constraints for data validation (e.g., `is_active BOOLEAN DEFAULT true`)
  - Use `gen_random_uuid()` for primary keys

- **Supabase CLI Commands**:
  - Run migrations: `npx supabase db push`
  - Generate types: `npx supabase gen types typescript --local > src/types/supabase.ts`
  - Local Supabase: `npx supabase start` (optional for local testing)

- **Norwegian UI Patterns**:
  - Display names should be in Norwegian where user-facing (e.g., "Countryrock", "Norsk pop")
  - Internal names can be English for developer clarity (e.g., "country-rock")
  - Error messages in Norwegian: "Noe gikk galt med..." pattern

- **Playful Nordic Theme Colors** (from Story 3.8):
  - Primary red: #E94560
  - Accent yellow: #FFC93C
  - Secondary navy: #0F3460
  - Gradient patterns: red-to-yellow, blue-to-red for visual variety

- **File Organization**:
  - Migrations in `/supabase/migrations/` directory
  - Use descriptive filenames with date prefixes
  - Seed scripts can be separate `.sql` files or included in migrations

[Source: stories/3-9-implement-free-30-second-preview-generation.md#Dev-Agent-Record]

### Project Structure Notes

**Files to Create:**
- `/supabase/migrations/seed_genres.sql` or `/supabase/seed.sql` - Genre seed data
- `/scripts/seed-genres.js` (optional) - Node.js script to execute seed data programmatically

**Files to Reference:**
- `/src/components/genre-carousel.tsx` (Story 3.1) - Component that consumes genre data
- `/src/lib/api/suno.ts` (Story 3.5) - Suno API wrapper that uses prompt templates
- `/supabase/migrations/*` - Existing database migrations for reference

**Database Schema:**
- `genre` table (created in Story 1.6):
  - `id` (UUID, primary key)
  - `name` (TEXT, unique, internal identifier)
  - `display_name` (TEXT, user-facing label)
  - `description` (TEXT, optional help text)
  - `emoji` (TEXT, icon for UI)
  - `suno_prompt_template` (TEXT, Suno API prompt)
  - `gradient_colors` (JSONB or TEXT, background styling)
  - `sort_order` (INTEGER, display order)
  - `is_active` (BOOLEAN, default true)
  - `created_at` (TIMESTAMPTZ, auto-generated)
  - `updated_at` (TIMESTAMPTZ, auto-generated)

### Technical Implementation Notes

**Genre Prompt Templates (Validated by Founder):**

1. **Country Rock**
   - Display: "Countryrock" (Norwegian)
   - Emoji: 🎸
   - Prompt: "Country, rock, anthem, twangy guitar, catchy fiddle, drum, bass, Norwegian vocals"
   - Gradient: Red to yellow (#E94560 → #FFC93C)

2. **Norwegian Pop**
   - Display: "Norsk pop"
   - Emoji: 🎤
   - Prompt: "Pop, Norwegian, catchy melody, electronic, upbeat, modern production"
   - Gradient: Blue to red (#0F3460 → #E94560)

3. **Folk Ballad**
   - Display: "Folkeballade"
   - Emoji: 🪕
   - Prompt: "Folk, acoustic, Norwegian traditional, heartfelt, storytelling"
   - Gradient: Green to yellow

4. **Party Anthem**
   - Display: "Festlåt"
   - Emoji: 🎉
   - Prompt: "Dance, party, energetic, sing-along, festive, Norwegian celebration"
   - Gradient: Yellow to red

5. **Rap/Hip-Hop**
   - Display: "Rap/Hip-Hop"
   - Emoji: 🎤
   - Prompt: "Hip-hop, rap, Norwegian flow, urban, rhythmic, modern beats"
   - Gradient: Dark blue to purple

6. **Rock Ballad**
   - Display: "Rockballade"
   - Emoji: 🎸
   - Prompt: "Rock, ballad, emotional, guitar solo, powerful vocals, Norwegian"
   - Gradient: Purple to red

7. **Dance/Electronic**
   - Display: "Dans/Elektronisk"
   - Emoji: 💃
   - Prompt: "Electronic, dance, EDM, synth, energetic, club, Norwegian vocals"
   - Gradient: Cyan to blue

8. **Singer-Songwriter**
   - Display: "Singer-Songwriter"
   - Emoji: 🎹
   - Prompt: "Acoustic, intimate, storytelling, piano, guitar, heartfelt, Norwegian"
   - Gradient: Warm orange to brown

**Seed Script Structure:**
```sql
-- Insert genres with optimized prompts
INSERT INTO genre (name, display_name, description, emoji, suno_prompt_template, gradient_colors, sort_order, is_active)
VALUES
  ('country-rock', 'Countryrock', 'Upbeat country with rock energy', '🎸', 'Country, rock, anthem, twangy guitar, catchy fiddle, drum, bass, Norwegian vocals', '{"from": "#E94560", "to": "#FFC93C"}', 1, true),
  ('norwegian-pop', 'Norsk pop', 'Modern Norwegian pop music', '🎤', 'Pop, Norwegian, catchy melody, electronic, upbeat, modern production', '{"from": "#0F3460", "to": "#E94560"}', 2, true),
  -- ... additional genres
ON CONFLICT (name) DO NOTHING; -- Idempotency: don't duplicate if already exists
```

**Testing Strategy:**
- Manual test: Run seed script locally with Supabase CLI
- Integration test: Verify genre carousel component displays seeded data
- End-to-end test: Generate test song for each genre to validate prompts
- Quality test: Founder reviews generated samples for Norwegian authenticity

**Norwegian Localization:**
- Genre display names in Norwegian where appropriate
- Keep technical names in English for developer clarity
- Description field can include Norwegian help text for users

### References

- [Epic 3 - Story 3.10](../epics/epic-3-norwegian-song-creation-core.md#story-310-add-genre-prompt-templates-to-database)
- [Story 3.1 - Genre Carousel Component](./3-1-create-genre-carousel-component.md)
- [Story 3.5 - Song Generation API with Suno](./3-5-implement-song-generation-api-with-suno-integration.md)
- [Architecture - Database Schema](../architecture.md#database-schema)
- [PRD - FR6, FR51 (Genre Templates)](../prd.md#song-creation--lyrics-input)
- [Story 1.6 - Database Schema Setup](./1-6-set-up-database-schema-with-supabase-migrations.md)

## Change Log

**2025-11-24 - Story Created (drafted status)**
- Story drafted by create-story workflow (SM agent)
- Extracted from Epic 3: Norwegian Song Creation (CORE)
- Source: docs/epics/epic-3-norwegian-song-creation-core.md
- Prerequisites: Story 1.6 (Database schema with genre table)
- Provides foundational genre data for genre carousel (Story 3.1) and song generation (Story 3.5)
- Prompt templates validated by founder's 80k listener expertise
- Next step: Run story-context workflow to generate technical context XML, then mark ready for development

## Dev Agent Record

### Context Reference

- `stories/3-10-add-genre-prompt-templates-to-database.context.xml` - Generated 2025-11-24 by story-context workflow

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

### File List
