# Story 1.6: Set Up Database Schema with Supabase Migrations

Status: ready-for-dev

## Story

As a developer,
I want the core database schema created with Row Level Security enabled and TypeScript types generated,
so that user data is properly isolated, tables support all application features, and database queries are type-safe throughout the codebase.

## Acceptance Criteria

1. **Core Tables Created**: All 5 core tables exist in Supabase database: `user_profile`, `song`, `credit_transaction`, `genre`, `mastering_request`
2. **Schema Structure Verified**: All table columns match architecture specification with correct data types, constraints, and default values
3. **Row Level Security Enabled**: RLS is enabled on all user-facing tables (user_profile, song, credit_transaction, mastering_request)
4. **RLS Policies Implemented**: RLS policies enforce `auth.uid() = user_id` access control for SELECT, INSERT, UPDATE, DELETE operations
5. **Indexes Created**: Performance indexes exist on: user_id, created_at DESC, status columns across relevant tables
6. **Stored Procedure Functional**: `deduct_credits()` function exists and correctly performs atomic credit deduction with insufficient balance validation
7. **TypeScript Types Generated**: `/src/types/supabase.ts` file contains auto-generated types for all database tables with proper TypeScript interfaces
8. **RLS Testing Verified**: Manual RLS testing confirms users can only access their own data and attempts to access other users' data fail
9. **Genre Seed Data Loaded**: Initial genre reference data populated (at minimum: Country Rock, Norwegian Pop, Folk Ballad, Party Anthem)
10. **Build Verification**: Application builds successfully with new Supabase types, no TypeScript errors related to database queries

## Tasks / Subtasks

- [ ] Task 1: Review and prepare database schema SQL (AC: #1, #2)
  - [ ] Read complete database schema from `/docs/architecture.md` section "Data Architecture"
  - [ ] Review all 5 table definitions: user_profile, song, credit_transaction, genre, mastering_request
  - [ ] Verify column types, constraints, foreign keys, defaults match architecture spec
  - [ ] Note: Complete SQL provided in architecture doc - no invention required

- [ ] Task 2: Create database migration file (AC: #1, #2)
  - [ ] Create migration directory if not exists: `/supabase/migrations/`
  - [ ] Create migration file: `/supabase/migrations/20250120_initial_schema.sql` (use current date)
  - [ ] Copy table creation SQL from architecture doc into migration file
  - [ ] Add comments for clarity (table purposes, important constraints)
  - [ ] Format SQL for readability

- [ ] Task 3: Apply database schema to Supabase (AC: #1, #2, #5)
  - [ ] Connect to Supabase project via dashboard SQL Editor
  - [ ] Run migration SQL to create all tables
  - [ ] Verify all 5 tables created: Check Supabase dashboard Table Editor
  - [ ] Verify indexes created: Query `pg_indexes` table or check Supabase dashboard
  - [ ] Verify foreign key constraints active
  - [ ] Verify CHECK constraints work (e.g., credit_balance >= 0)

- [ ] Task 4: Enable Row Level Security on tables (AC: #3)
  - [ ] Enable RLS on `user_profile` table
  - [ ] Enable RLS on `song` table
  - [ ] Enable RLS on `credit_transaction` table
  - [ ] Enable RLS on `mastering_request` table
  - [ ] Note: `genre` table does NOT need RLS (reference data, publicly readable)
  - [ ] Verify RLS enabled: Check Supabase dashboard or query `pg_tables`

- [ ] Task 5: Create RLS policies for user_profile (AC: #4)
  - [ ] Create policy: `user_profile_select` - Users can SELECT their own profile (`auth.uid() = id`)
  - [ ] Create policy: `user_profile_update` - Users can UPDATE their own profile (`auth.uid() = id`)
  - [ ] Note: No INSERT policy needed (user profiles created by auth system)
  - [ ] Note: No DELETE policy (account deletion handled separately)
  - [ ] Test policy: Attempt to query another user's profile (should return empty)

- [ ] Task 6: Create RLS policies for song table (AC: #4)
  - [ ] Create policy: `song_select` - Users can SELECT their own songs (`auth.uid() = user_id`)
  - [ ] Create policy: `song_insert` - Users can INSERT songs for themselves (`auth.uid() = user_id`)
  - [ ] Create policy: `song_update` - Users can UPDATE their own songs (`auth.uid() = user_id`)
  - [ ] Create policy: `song_delete` - Users can DELETE their own songs (`auth.uid() = user_id`)
  - [ ] Test policy: Attempt to access another user's songs (should fail)

- [ ] Task 7: Create RLS policies for credit_transaction (AC: #4)
  - [ ] Create policy: `credit_transaction_select` - Users can SELECT their own transactions (`auth.uid() = user_id`)
  - [ ] Note: No INSERT/UPDATE/DELETE policies (transactions created by system functions only)
  - [ ] Test policy: Attempt to view another user's transactions (should return empty)

- [ ] Task 8: Create RLS policies for mastering_request (AC: #4)
  - [ ] Create policy: `mastering_request_select` - Users can SELECT their own requests (`auth.uid() = user_id`)
  - [ ] Create policy: `mastering_request_insert` - Users can INSERT requests for themselves (`auth.uid() = user_id`)
  - [ ] Create policy: `mastering_request_update` - Users can UPDATE their own requests (`auth.uid() = user_id`)
  - [ ] Test policy: Attempt to access another user's mastering requests (should fail)

- [ ] Task 9: Create deduct_credits stored procedure (AC: #6)
  - [ ] Copy `deduct_credits()` function SQL from architecture doc
  - [ ] Create function in Supabase SQL Editor
  - [ ] Function should:
    - Lock user profile row (FOR UPDATE)
    - Validate sufficient credits (RAISE EXCEPTION if insufficient)
    - Deduct credits from user balance
    - Record transaction in credit_transaction table
    - Return transaction record
  - [ ] Test function manually: Create test user, add credits, call deduct_credits()
  - [ ] Test insufficient credits scenario: Verify exception raised

- [ ] Task 10: Load genre seed data (AC: #9)
  - [ ] Create seed data SQL for genre table
  - [ ] Include minimum genres:
    - Country Rock (emoji: 🎸, Suno template: "Country, rock, anthem, twangy guitar, catchy fiddle, drum, bass")
    - Norwegian Pop (emoji: 🎤, Suno template: "Norwegian pop, catchy, upbeat, modern")
    - Folk Ballad (emoji: 🪕, Suno template: "Folk, ballad, acoustic, storytelling, Norwegian tradition")
    - Party Anthem (emoji: 🎉, Suno template: "Party, anthem, energetic, celebratory, Norwegian lyrics")
  - [ ] Add additional genres from architecture spec if desired
  - [ ] Run seed SQL in Supabase SQL Editor
  - [ ] Verify genres inserted: SELECT * FROM genre

- [ ] Task 11: Generate TypeScript types from database schema (AC: #7)
  - [ ] Install Supabase CLI if not installed: `npm install -g supabase`
  - [ ] Get Supabase project ref ID from Supabase dashboard settings
  - [ ] Run type generation: `npx supabase gen types typescript --project-id <project-ref> > src/types/supabase.ts`
  - [ ] Alternative: Use Supabase dashboard API to generate types
  - [ ] Verify generated file contains interfaces for all 5 tables
  - [ ] Check TypeScript interfaces match table schemas (user_profile, song, credit_transaction, genre, mastering_request)

- [ ] Task 12: Update Supabase client to use typed queries (AC: #7, #10)
  - [ ] Open `/src/lib/supabase/client.ts`
  - [ ] Import Database type: `import { Database } from '@/types/supabase'`
  - [ ] Type the createClient call: `createClientComponentClient<Database>()`
  - [ ] Open `/src/lib/supabase/server.ts`
  - [ ] Import Database type and type the server client similarly
  - [ ] Verify TypeScript autocomplete works for table names and columns

- [ ] Task 13: Create test query to verify RLS (AC: #8)
  - [ ] Create temporary test file: `/src/app/test-database/page.tsx`
  - [ ] Import Supabase client
  - [ ] Query user_profile table: `supabase.from('user_profile').select('*')`
  - [ ] Query song table: `supabase.from('song').select('*')`
  - [ ] Run dev server, authenticate with Google OAuth (from story 1.3)
  - [ ] Verify queries work for authenticated user
  - [ ] Verify TypeScript autocomplete works for column names
  - [ ] Note RLS behavior: Empty results expected if no data for authenticated user

- [ ] Task 14: Build verification and cleanup (AC: #10)
  - [ ] Run `npm run build` and verify success (exit code 0)
  - [ ] Check for TypeScript errors related to Supabase types (should be none)
  - [ ] Delete test file: `/src/app/test-database/page.tsx`
  - [ ] Run `npm run build` again to verify clean build
  - [ ] Document Supabase project ref ID in `.env.example` for team reference
  - [ ] Commit migration files and generated types

## Dev Notes

### Architecture Alignment

**From `/docs/architecture.md` - Data Architecture:**

**Complete Database Schema Provided:**

The architecture document contains the full SQL schema for all 5 core tables:
1. **user_profile** - User account extensions with credit balance
2. **song** - Generated songs with metadata, status, and soft delete
3. **credit_transaction** - Audit log for all credit operations
4. **genre** - Reference data for song genre templates
5. **mastering_request** - Premium manual mastering service tracking

**Key Schema Features:**
- **TIMESTAMPTZ** columns for proper timezone handling (created_at, updated_at)
- **UUID** primary keys with `gen_random_uuid()` defaults
- **Foreign key constraints** with CASCADE/SET NULL behaviors
- **CHECK constraints** for data integrity (e.g., credit_balance >= 0, status enums)
- **Soft deletes** using `deleted_at TIMESTAMPTZ` for 14-day retention (song table)
- **JSONB** columns for flexible data (user preferences)

**Row Level Security (RLS) Pattern:**

All user-facing tables enforce multi-tenant data isolation:
```sql
CREATE POLICY table_name_select ON table_name
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY table_name_insert ON table_name
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

**Why RLS Matters:**
- Users can ONLY access their own data
- Protection enforced at database level, not just application code
- Service role key bypasses RLS for admin operations
- Critical for GDPR compliance and security

**Atomic Credit Deduction Function:**

The `deduct_credits()` stored procedure ensures:
1. **Atomic transaction** - All-or-nothing credit deduction
2. **Race condition prevention** - Row locking (FOR UPDATE)
3. **Validation** - Raises exception if insufficient credits
4. **Audit trail** - Creates credit_transaction record automatically
5. **Rollback on failure** - Transaction integrity maintained

**From Epic 1 Tech Spec:**

**Indexes for Performance:**
- `user_id` - Fast user data lookups across all tables
- `created_at DESC` - Chronological sorting for track lists
- `status` - Filtering songs by generation status (generating, completed, failed)

**Storage Buckets (Note):**
While not part of this story, the tech spec mentions Supabase Storage buckets (`songs`, `canvases`) are configured separately in story 1.3. This story focuses only on database schema.

### Project Structure Notes

**Files to Create:**
- `/supabase/migrations/20250120_initial_schema.sql` - Complete database schema migration
- `/supabase/seed.sql` or inline seed SQL - Genre reference data (optional separate file)
- `/src/types/supabase.ts` - Auto-generated TypeScript types from database schema

**Files to Modify:**
- `/src/lib/supabase/client.ts` - Add Database type to client creation
- `/src/lib/supabase/server.ts` - Add Database type to server client creation

**Temporary Files:**
- `/src/app/test-database/page.tsx` - Test page for RLS verification (created for testing, deleted before completion)

**Environment Variables (Already Set in Story 1.3):**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anonymous key for client-side queries (respects RLS)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for admin operations (bypasses RLS)

### Learnings from Previous Story

**From Story 1-3-set-up-supabase-project-and-environment-variables (Status: done)**

- **Supabase Project Ready**:
  - PostgreSQL 17 database provisioned
  - Google OAuth provider enabled in Auth settings
  - Storage buckets `songs` and `canvases` created
  - Environment variables configured in `.env.local`
  - Supabase client initialization code working in client and server contexts

- **Database Access Patterns**:
  - Client-side: Use `createClient()` from `/src/lib/supabase/client.ts` (RLS enforced)
  - Server-side: Use `createServerClient()` from `/src/lib/supabase/server.ts` (RLS enforced)
  - Admin operations: Use service role key (bypasses RLS)

- **Testing Approach**:
  - Manual SQL execution in Supabase dashboard SQL Editor
  - Test RLS policies by creating test users and attempting cross-user data access
  - Use Supabase dashboard Table Editor for visual verification
  - Automated testing in future stories (Epic 2+)

[Source: docs/sprint-artifacts/1-3-set-up-supabase-project-and-environment-variables.md#Dev-Agent-Record]

**From Story 1-4-install-shadcn-ui-and-core-components (Status: review)**

- **Build Configuration Verified**:
  - `npm run build` working successfully
  - TypeScript strict mode enabled
  - Import path aliases (`@/*`) configured and working

- **Testing Pattern**:
  - Create test pages in `src/app/test-*/page.tsx`
  - Verify functionality manually
  - Delete test pages before marking story complete

- **TypeScript Autocomplete**:
  - Confirmed that TypeScript autocomplete works with properly typed imports
  - Same pattern will apply to Supabase types once generated

[Source: docs/sprint-artifacts/1-4-install-shadcn-ui-and-core-components.md#Dev-Agent-Record]

### Technical Context

**Supabase SQL Editor Usage:**

The easiest way to run migrations for this story:
1. Navigate to Supabase dashboard → SQL Editor
2. Create new query
3. Paste migration SQL
4. Execute (Run button)
5. Check for errors in output
6. Verify tables created in Table Editor

**Alternative: Supabase CLI (Optional):**

For more advanced workflows (not required for MVP):
```bash
# Initialize Supabase locally (optional)
npx supabase init

# Create migration file
npx supabase migration new initial_schema

# Apply migrations to remote database
npx supabase db push

# Generate types after migration
npx supabase gen types typescript --linked > src/types/supabase.ts
```

**RLS Testing Strategy:**

To properly test RLS policies:
1. Create test user account via Google OAuth (story 1.3)
2. Note the user's UUID from Supabase dashboard → Authentication → Users
3. In SQL Editor, query with specific user context:
   ```sql
   -- Set auth context to specific user
   SET request.jwt.claim.sub = '<user-uuid>';

   -- Test query (should only return that user's data)
   SELECT * FROM song;
   ```
4. Test without auth context (should return error or empty if RLS working)

**TypeScript Type Generation:**

The generated `/src/types/supabase.ts` will contain:
```typescript
export interface Database {
  public: {
    Tables: {
      user_profile: {
        Row: { id: string; display_name: string | null; credit_balance: number; ... }
        Insert: { id: string; display_name?: string | null; ... }
        Update: { display_name?: string | null; ... }
      }
      song: { ... }
      credit_transaction: { ... }
      genre: { ... }
      mastering_request: { ... }
    }
  }
}
```

This enables type-safe queries:
```typescript
const { data } = await supabase
  .from('song')         // TypeScript knows 'song' is valid table
  .select('title, genre') // TypeScript knows these columns exist
  .eq('status', 'completed'); // TypeScript validates status values
```

**Potential Issues and Solutions:**

**Issue**: Migration fails due to existing tables
- **Solution**: Drop existing tables first or use `IF NOT EXISTS` in CREATE statements

**Issue**: RLS policies prevent data access even for correct user
- **Solution**: Verify `auth.uid()` matches user_id column, check Supabase Auth session

**Issue**: TypeScript generation fails
- **Solution**: Ensure Supabase project ref ID is correct, try alternative: Supabase dashboard → API → Generate Types

**Issue**: Insufficient credits exception not raised
- **Solution**: Review stored procedure logic, ensure FOR UPDATE lock acquired before balance check

**Issue**: Genre seed data conflicts with existing data
- **Solution**: Use `INSERT ... ON CONFLICT DO NOTHING` or check for existing genres first

### References

- [Architecture Document - Data Architecture](../architecture.md#data-architecture)
- [Architecture Document - ADR-002: Supabase Backend](../architecture.md#adr-002-use-supabase-for-backend-services)
- [Epic 1 Tech Spec - Database Schema (Epic AC6)](tech-spec-epic-1.md#acceptance-criteria-authoritative)
- [PRD - Functional Requirements (Credit System)](../prd.md#credit-system--payments)
- [Supabase Documentation - Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Documentation - Database Functions](https://supabase.com/docs/guides/database/functions)
- [Supabase Documentation - TypeScript Types](https://supabase.com/docs/reference/javascript/typescript-support)

## Change Log

**2025-11-20 - Story Created (drafted status)**
- Story drafted by create-story workflow (SM agent)
- Extracted from Epic 1: Foundation & Infrastructure
- Source: docs/sprint-artifacts/tech-spec-epic-1.md, docs/epics/epic-1-foundation-infrastructure.md, docs/architecture.md
- Prerequisites: Story 1.3 completed (done status) - Supabase project created and configured
- Story 1.5 skipped (Vercel deployment permissions issue)
- Includes learnings from Story 1.3 (Supabase setup) and 1.4 (Build configuration)
- Complete SQL schema provided in architecture document - no schema design needed
- Next step: Run story-ready workflow to mark as ready-for-dev, or proceed directly to development

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/1-6-set-up-database-schema-with-supabase-migrations.context.xml

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

### File List
