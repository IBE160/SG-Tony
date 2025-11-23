# Story 3.2: Implement AI Lyric Generation with Song Concept Input

Status: ready-for-dev

## Story

As a **user**,
I want to describe my song concept and have AI generate Norwegian lyrics,
so that I don't need to write lyrics myself.

## Acceptance Criteria

**Given** I have selected a genre from the genre selection
**When** I enter a song concept in the textarea (e.g., "Morsom bursdagssang for vennen min Lars som elsker fiske")
**Then** Character count appears below textarea (1-500 characters)
**And** When I click "Generer tekst med AI" button
**Then** OpenAI GPT-4 generates Norwegian lyrics based on concept + genre
**And** Generated lyrics appear in editable textarea (4-8 verse lines typical)
**And** Lyrics match the genre style (e.g., Country Rock = twangy, upbeat)
**And** Norwegian cultural context is preserved (references Norwegian life, humor)
**And** Generation takes <10 seconds
**And** I can edit generated lyrics manually before proceeding

## Tasks / Subtasks

- [ ] Task 1: Create API route for lyric generation (AC: GPT-4 integration)
  - [ ] Create `/src/app/api/lyrics/generate/route.ts`
  - [ ] Set up OpenAI SDK initialization with API key
  - [ ] Implement POST handler accepting concept and genre
  - [ ] Configure GPT-4 with temperature 0.7 for creativity
  - [ ] Return JSON response with generated lyrics

- [ ] Task 2: Implement lyric generation logic (AC: Norwegian cultural context)
  - [ ] Design prompt template for Norwegian Bokmål lyrics
  - [ ] Include genre style guidance in prompt
  - [ ] Include cultural context hints (Norwegian references)
  - [ ] Limit output to 4-8 lines typical for song verses
  - [ ] Handle edge cases (inappropriate content, API errors)

- [ ] Task 3: Create concept input component (AC: Textarea with character count)
  - [ ] Create textarea component for song concept input
  - [ ] Implement real-time character counter (1-500 chars)
  - [ ] Add placeholder text in Norwegian
  - [ ] Display validation state (error if too short/long)
  - [ ] Style according to UX design specification

- [ ] Task 4: Create lyric display/edit component (AC: Editable textarea)
  - [ ] Create textarea for displaying generated lyrics
  - [ ] Make lyrics editable after generation
  - [ ] Preserve line breaks and formatting
  - [ ] Add Norwegian label "Generert tekst"
  - [ ] Style consistently with concept input

- [ ] Task 5: Implement generate lyrics button and flow (AC: Integration)
  - [ ] Create "Generer tekst med AI" button
  - [ ] Disable button if genre not selected or concept empty
  - [ ] Show loading state during API call (<10s)
  - [ ] Handle success: populate lyrics textarea
  - [ ] Handle errors: show Norwegian error message with retry
  - [ ] Integrate with genre selection from Story 3.1

- [ ] Task 6: Testing and quality validation (AC: All)
  - [ ] Test with various genre + concept combinations
  - [ ] Verify Norwegian cultural references appear
  - [ ] Verify lyrics match genre style
  - [ ] Test character count validation
  - [ ] Test manual editing of generated lyrics
  - [ ] Verify API response time <10 seconds
  - [ ] Test error handling (API failure, timeout)

## Dev Notes

### Requirements Context

**From Epic 3: Norwegian Song Creation (CORE)**

Story 3.2 implements AI-powered Norwegian lyric generation - the first step in making song creation accessible to non-musicians. This is the core "AI assists user" feature that distinguishes Musikkfabrikken from manual lyric writing.

**Key Requirements:**
- **FR5**: User can input lyrics for song generation (now AI-generated)
- **FR6**: User can select genre/style templates
- **FR8**: User can preview lyrics before generation
- **Core Value**: Norwegian cultural context in AI-generated content

**Technical Constraints from Architecture:**
- **API Route**: `/src/app/api/lyrics/generate/route.ts` (Next.js App Router pattern)
- **OpenAI Integration**: GPT-4 API with temperature 0.7 for creative balance
- **Environment Variable**: `OPENAI_API_KEY` (server-side only)
- **Cost**: ~$0.03 per request (acceptable for credit-based model)
- **Timeout**: <10 seconds target response time

**From Epic 3 - Story 3.2 Specifications:**

Component specifications:
- **Concept Input**: Textarea with 1-500 character limit, real-time counter
- **Lyrics Display**: Editable textarea to allow manual refinement
- **Button**: "Generer tekst med AI" - disabled until genre selected and concept entered
- **Loading State**: Inline spinner or skeleton during generation
- **Error Handling**: Norwegian error messages with retry capability

[Source: docs/epics/epic-3-norwegian-song-creation-core.md, docs/architecture.md]

### Project Structure Notes

**Files to Create:**
- `/src/app/api/lyrics/generate/route.ts` - API route for lyric generation
- `/src/components/concept-input.tsx` - Concept textarea with character counter
- `/src/components/lyrics-editor.tsx` - Editable lyrics display component
- `/src/lib/api/openai.ts` - OpenAI SDK wrapper and configuration

**Files to Modify:**
- `/src/app/page.tsx` - Integrate concept input and lyrics editor
- `.env.local` - Add `OPENAI_API_KEY` environment variable
- `/src/types/song.ts` - Add type definitions for lyrics generation

**API Implementation Pattern:**

```typescript
// /src/app/api/lyrics/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { concept, genre } = await request.json()

    // Validate inputs
    if (!concept || concept.length < 10 || concept.length > 500) {
      return NextResponse.json(
        { error: { code: 'INVALID_CONCEPT', message: 'Konseptet må være mellom 10 og 500 tegn' } },
        { status: 400 }
      )
    }

    // Generate lyrics with GPT-4
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: `Du er en norsk låtskriver som lager autentiske norske tekster i ${genre} stil.
                    Skriv 4-8 korte verslinjer på norsk bokmål med referanser til norsk kultur og humor.
                    Ikke bruk anførselstegn eller formatering - bare rene tekstlinjer.`
        },
        {
          role: 'user',
          content: `Lag en ${genre} sang om: ${concept}`
        }
      ],
      max_tokens: 200
    })

    const lyrics = completion.choices[0]?.message?.content?.trim() || ''

    return NextResponse.json({ data: { lyrics } })
  } catch (error) {
    console.error('Lyric generation failed:', error)
    return NextResponse.json(
      { error: { code: 'GENERATION_FAILED', message: 'Kunne ikke generere tekst. Prøv igjen.' } },
      { status: 500 }
    )
  }
}
```

[Source: docs/architecture.md - API Response Format, Implementation Patterns]

### Architecture Alignment

**Component Mapping (from Architecture):**

This story creates the lyric generation subsystem for Epic 3:

1. **Lyrics Generation API** (`/src/app/api/lyrics/generate/route.ts`) - NEW
   - OpenAI GPT-4 integration
   - Norwegian prompt engineering
   - Genre-aware lyric generation
   - Error handling with Norwegian messages

2. **Concept Input Component** (`/src/components/concept-input.tsx`) - NEW
   - Character counter (1-500 chars)
   - Real-time validation
   - Norwegian placeholder text
   - Accessibility features

3. **Lyrics Editor Component** (`/src/components/lyrics-editor.tsx`) - NEW
   - Editable textarea for generated lyrics
   - Preserves line breaks
   - Manual editing capability
   - Norwegian labels

4. **OpenAI Wrapper** (`/src/lib/api/openai.ts`) - NEW
   - SDK initialization
   - Reusable configuration
   - Error handling patterns

**Existing Components (from Previous Stories):**
- `/src/components/genre-selection.tsx` - Genre selection (Story 3.1)
- `/src/lib/supabase/client.ts` - Database client (Story 1.3)
- `/src/components/ui/*` - shadcn/ui components (Story 1.4)

**Integration Points:**
- Selected genre from Story 3.1 passed to lyric generation API
- Generated lyrics will be passed to pronunciation optimizer (Story 3.3)
- Lyrics + genre will be sent to Suno for song generation (Story 3.5)

[Source: docs/architecture.md - Technology Stack Details]

### Learnings from Previous Story

**From Story 3-1-create-genre-carousel-component (Status: review)**

- **Norwegian UI Consistency**: All user-facing text in Norwegian - buttons, labels, placeholders, error messages
- **Component Structure**: Created `/src/components/genre-selection.tsx` following architecture pattern - use same pattern for new components
- **Supabase Client Pattern**: Used `createClient()` from `/src/lib/supabase/client.ts` for database queries
- **Loading States**: Implemented skeleton UI for better perceived performance - apply to API calls
- **Error Handling**: Norwegian error messages with retry capability - "Kunne ikke laste sjangre. Prøv igjen?"
- **Accessibility**: ARIA roles, keyboard navigation, focus states - continue pattern
- **TypeScript Types**: Created Genre interface - create similar Lyrics types

**New Services/Patterns Created:**
- **Genre Selection Component**: `/src/components/genre-selection.tsx` - responsive flexbox grid with selection state
- **Genre Database Seeding**: `/scripts/seed-genres.js` - idempotent seeding pattern for reference data
- **Genre Migration**: `/supabase/migrations/20251123_add_additional_genres.sql` - migration file pattern

**Technical Patterns to Follow:**
- **API Routes**: Use Next.js App Router `route.ts` pattern with POST handlers
- **Error Responses**: Consistent JSON format with error codes and Norwegian messages
- **Environment Variables**: Server-side only for API keys (OPENAI_API_KEY)
- **Client Components**: Use 'use client' directive for components with state/interactivity
- **Form Validation**: Real-time validation feedback with Norwegian error messages

**Files to Leverage:**
- `/src/components/genre-selection.tsx` - Genre selection integration for API call
- `/src/components/ui/button.tsx` - shadcn/ui Button component for "Generer tekst" button
- `/src/components/ui/textarea.tsx` - shadcn/ui Textarea component for concept/lyrics inputs

**Potential Issues to Address:**
- **OpenAI API Timeout**: Implement timeout handling (10 second limit per AC)
- **Rate Limiting**: Consider adding rate limiting to prevent API abuse
- **Content Filtering**: OpenAI may refuse inappropriate content - handle gracefully
- **Norwegian Quality**: Ensure GPT-4 produces authentic Norwegian, not Americanized text
- **Genre Style Matching**: Verify lyrics match genre characteristics (test with real examples)
- **Character Encoding**: Handle Norwegian special characters (æ, ø, å) correctly
- **Empty Responses**: Handle case where GPT-4 returns empty or malformed response
- **Long Concepts**: User may paste long text - enforce 500 char limit client-side and server-side
- **Line Break Preservation**: Ensure formatting is preserved in lyrics textarea

**Integration Considerations:**
- Concept input must wait for genre selection (disabled state until genre selected)
- Generated lyrics will be input to pronunciation optimizer (Story 3.3)
- API response must return plain text (no markdown, no formatting)
- Loading state must be clear - users expect ~5-10 seconds wait
- Allow manual editing after generation - users may want to tweak AI output

[Source: docs/sprint-artifacts/3-1-create-genre-carousel-component.md#Dev-Agent-Record]

### References

- [Epic 3 Story 3.2 Acceptance Criteria](../epics/epic-3-norwegian-song-creation-core.md#story-32-implement-ai-lyric-generation-with-song-concept-input)
- [Architecture - API Contracts](../architecture.md#api-contracts)
- [Architecture - OpenAI Integration](../architecture.md#openai-integration)
- [Architecture - Implementation Patterns](../architecture.md#implementation-patterns)
- [Architecture - Language & Localization](../architecture.md#language--localization)
- [PRD - FR5, FR6, FR8 (Lyrics Input & Genre Selection)](../prd.md#song-creation--lyrics-input)
- [Story 3.1 - Genre Selection Component](./3-1-create-genre-carousel-component.md)

## Change Log

**2025-11-23 - Story Created (drafted status)**
- Story drafted by create-story workflow (SM agent)
- Extracted from Epic 3: Norwegian Song Creation (CORE)
- Source: docs/epics/epic-3-norwegian-song-creation-core.md
- Prerequisites: Story 3.1 (Genre Selection)
- Implements FR5, FR6, FR8 (AI lyric generation with concept input)
- Integrated learnings from Story 3.1: Norwegian UI, component patterns, error handling
- Next step: Run story-ready workflow to mark ready for development, then implement with dev-story workflow

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/stories/3-2-implement-ai-lyric-generation-with-song-concept-input.context.xml` - Generated 2025-11-23

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
