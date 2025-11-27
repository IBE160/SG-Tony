# ibe160 - Technical Specification

**Author:** BIP
**Date:** 2025-11-27
**Project Level:** Quick-Flow (Brownfield)
**Change Type:** UX Refinements Epic
**Development Context:** Post-MVP improvements to existing Next.js application

---

## Context

### Available Documents

| Document | Status |
|----------|--------|
| Product Brief | ✅ Loaded: `docs/product-brief-norskmusikk.md` |
| Epics Index | ✅ Loaded: `docs/epics/index.md` |
| Research | ○ Not found |

### Project Stack

| Component | Version | Source |
|-----------|---------|--------|
| Runtime | Next.js 14.2.3 | package.json |
| React | 18.2.0 | package.json |
| TypeScript | 5.x | package.json |
| UI Framework | Tailwind CSS 3.4.1 | package.json |
| Component Library | shadcn/ui (Radix-based) | package.json |
| Database/Auth/Storage | Supabase 2.84.0 | package.json |
| Payments | Stripe 20.0.0 | package.json |
| Audio Playback | Howler.js 2.2.4 | package.json |
| Waveform Visualization | WaveSurfer.js 7.11.1 | package.json |
| State Management | Zustand 5.0.8 | package.json |
| Icons | Lucide React 0.554.0 | package.json |
| Validation | Zod 4.1.12 | package.json |

### Existing Codebase Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage (song creation)
│   ├── songs/             # Song library page
│   ├── api/               # API routes
│   │   ├── songs/         # Song CRUD endpoints
│   │   ├── lyrics/        # Lyrics generation/optimization
│   │   └── webhooks/      # Stripe/Suno webhooks
│   └── [other pages]
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Header, Footer, Navigation
│   ├── song-card.tsx      # Song list item (REUSE)
│   ├── song-player-card.tsx # Full player (REUSE)
│   ├── lyrics-editor.tsx  # Text area for lyrics
│   ├── genre-selection.tsx
│   ├── concept-input.tsx
│   ├── pronunciation-toggle.tsx
│   └── generation-progress-modal.tsx # TO BE REMOVED
├── hooks/
│   ├── use-toast.ts
│   ├── use-error-toast.tsx
│   └── use-onboarding.ts
├── lib/
│   ├── supabase/          # Supabase client utilities
│   ├── phonetic/          # Pronunciation optimization
│   ├── api/               # API utilities
│   └── utils.ts
├── stores/
│   └── credits-store.ts   # Zustand credit store
└── types/
    ├── song.ts
    └── credit.ts
```

**Confirmed Conventions:**
- Client components: `'use client'` directive
- File naming: kebab-case (`song-card.tsx`)
- Component naming: PascalCase (`SongCard`)
- Function naming: camelCase (`handleSongClick`)
- Tailwind + `cn()` utility for conditional classes
- API responses: `{ data: T }` or `{ error: { code, message } }`
- Norwegian UI text throughout
- Error handling via `useErrorToast` hook

---

## The Change

### Problem Statement

Users currently experience friction in the song creation flow:

1. **Discovery friction**: After creating songs, users must navigate to a separate `/songs` page to see their library. No immediate visibility of their songs from the homepage.

2. **Blocking generation UX**: The full-screen `GenerationProgressModal` blocks all interaction during the 2-3 minute generation time. Users feel trapped and can't do anything else.

3. **Confusing lyrics flow**: The current flow prioritizes AI generation ("Generer tekst med AI" as main button), but many users want to write their own lyrics. The "Instrumental" toggle label doesn't match its actual purpose (phonetic optimization).

### Proposed Solution

Three interconnected UX improvements delivered as one epic with 3 stories:

| Story | Improvement | User Benefit |
|-------|-------------|--------------|
| 1 | **Homepage song section** - Paginated list (10 at a time) below create form | Immediate access to library without navigation |
| 2 | **Inline generation status** - Remove modal, show status in song list | Non-blocking, continue browsing during generation |
| 3 | **Redesigned lyrics section** - Manual text first, optional AI generation | Clearer flow for both manual and AI workflows |

### Scope

**In Scope:**

- [ ] Homepage song section with pagination (10 songs per page)
- [ ] Next/Previous navigation buttons
- [ ] Click song → open player modal (reuse `SongPlayerCard`)
- [ ] Remove `GenerationProgressModal` usage from homepage
- [ ] Add inline "generating" status indicator to song list
- [ ] Redesign lyrics input: main text box labeled "Tekst"
- [ ] Rename toggle: "Instrumental" → "Norsk uttale" (phonetic optimizer)
- [ ] Add optional "Generer tekst" button that expands concept input
- [ ] Norwegian UI labels throughout

**Out of Scope:**

- Changes to song generation API logic
- Changes to Suno API integration
- Changes to `/songs` library page
- Social sharing features
- Canvas generation features
- Payment/credit system changes

---

## Implementation Details

### Source Tree Changes

#### Story 1: Homepage Song Section

| File | Action | Changes |
|------|--------|---------|
| `src/components/homepage-songs.tsx` | CREATE | New component: paginated song list for homepage |
| `src/app/page.tsx` | MODIFY | Import and add `<HomepageSongs />` below create form |

#### Story 2: Inline Generation Status

| File | Action | Changes |
|------|--------|---------|
| `src/components/homepage-songs.tsx` | MODIFY | Add support for "generating" status songs at top |
| `src/components/song-card.tsx` | MODIFY | Add generating state variant with spinner/progress |
| `src/app/page.tsx` | MODIFY | Remove `GenerationProgressModal`, pass generating song to list |
| `src/stores/generating-song-store.ts` | CREATE | Zustand store for active generation tracking |

#### Story 3: Redesigned Lyrics Section

| File | Action | Changes |
|------|--------|---------|
| `src/components/lyrics-input-section.tsx` | CREATE | New component: main text box + optional AI generation |
| `src/components/pronunciation-toggle.tsx` | MODIFY | Rename label to "Norsk uttale" |
| `src/app/page.tsx` | MODIFY | Replace current lyrics flow with new component |

### Technical Approach

**Story 1 - Homepage Songs:**
- Create `HomepageSongs` component using existing `SongCard` and `SongPlayerCard`
- Fetch songs via existing `GET /api/songs?offset=X&limit=10` endpoint
- Simple pagination state: `currentPage` (0-indexed)
- Show "Neste" / "Forrige" buttons based on `hasMore` / `hasPrevious`
- Dialog modal for player (same pattern as `songs-page-client.tsx`)

**Story 2 - Inline Generation:**
- Create Zustand store `generatingSongStore` to track active generation
- When song generation starts: add placeholder to store with `status: 'generating'`
- Poll `/api/songs/{id}` for status updates (reuse existing polling logic)
- `SongCard` renders special "generating" variant when `song.status === 'generating'`
- On completion: remove from store, song appears in normal list via refetch

**Story 3 - Lyrics Redesign:**
- New `LyricsInputSection` component with:
  - Main `Textarea` labeled "Tekst" (always visible)
  - "Norsk uttale" switch (replaces current `PronunciationToggle` label)
  - "Generer tekst" button (collapsed by default)
  - On click: expands to show `ConceptInput` component
  - After AI generates: populates main textarea, collapses concept input
- Removes the "Generer tekst med AI" as primary flow

### Existing Patterns to Follow

**Component Pattern (from `song-card.tsx`):**
```typescript
'use client'

import { ... } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ComponentProps {
  // Props with explicit types
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // useState for local state
  // useCallback for handlers
  // Return JSX with Tailwind classes
}
```

**API Fetching Pattern (from `songs-page-client.tsx`):**
```typescript
const loadSongs = useCallback(async () => {
  try {
    const response = await fetch(`/api/songs?offset=${offset}&limit=10`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed')
    }

    setSongs(data.data || [])
  } catch (error) {
    showError(error, { context: 'load-songs', onRetry: loadSongs })
  }
}, [offset, showError])
```

**Zustand Store Pattern (from `credits-store.ts`):**
```typescript
import { create } from 'zustand'

interface StoreState {
  value: Type
  setValue: (val: Type) => void
}

export const useStore = create<StoreState>((set) => ({
  value: initialValue,
  setValue: (val) => set({ value: val })
}))
```

### Integration Points

| Integration | Type | Details |
|-------------|------|---------|
| `GET /api/songs` | Existing API | Fetch user's songs with pagination |
| `GET /api/songs/{id}` | Existing API | Poll generation status |
| `POST /api/songs/generate` | Existing API | Trigger song generation |
| `SongPlayerCard` | Existing Component | Audio playback in modal |
| `SongCard` | Existing Component | Song list item display |
| `useErrorToast` | Existing Hook | Error handling |
| Supabase Auth | Existing | User authentication check |

---

## Development Context

### Relevant Existing Code

| Reference | Location | Purpose |
|-----------|----------|---------|
| Song list with pagination | `src/app/songs/songs-page-client.tsx` | Pattern for fetching/displaying songs |
| Song card component | `src/components/song-card.tsx` | Reusable song display |
| Player modal pattern | `src/app/songs/songs-page-client.tsx:163-184` | Dialog + SongPlayerCard |
| Generation polling | `src/components/generation-progress-modal.tsx:116-176` | Status polling logic |
| Pronunciation toggle | `src/components/pronunciation-toggle.tsx` | Current toggle (to rename) |
| Concept input | `src/components/concept-input.tsx` | Concept description input |

### Dependencies

**Framework/Libraries (already installed):**
- Next.js 14.2.3
- React 18.2.0
- Zustand 5.0.8
- Lucide React 0.554.0
- shadcn/ui components (Dialog, Button, Card, Switch, Textarea)

**Internal Modules:**
- `@/components/ui/*` - UI primitives
- `@/components/song-card` - Song list item
- `@/components/song-player-card` - Audio player
- `@/hooks/use-error-toast` - Error handling
- `@/hooks/use-toast` - Toast notifications
- `@/lib/supabase/server` - Supabase client
- `@/lib/utils` - Utility functions (`cn`)
- `@/types/song` - Song type definitions

### Configuration Changes

None required - using existing API endpoints and infrastructure.

### Existing Conventions (Brownfield)

| Convention | Pattern |
|------------|---------|
| Semicolons | No (ESLint config) |
| Quotes | Single quotes |
| Indentation | 2 spaces |
| Component files | kebab-case |
| Component names | PascalCase |
| Functions | camelCase |
| Error messages | Norwegian |
| UI text | Norwegian |
| API responses | `{ data: T }` or `{ error: { code, message } }` |

### Test Framework & Standards

| Aspect | Standard |
|--------|----------|
| Framework | None currently configured |
| Testing | Manual testing + Vercel preview deploys |
| Linting | ESLint with Next.js config |

---

## Implementation Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14.2.3 (App Router) + React 18.2.0 |
| Styling | Tailwind CSS 3.4.1 |
| Components | shadcn/ui (Radix primitives) |
| State | React useState + Zustand 5.0.8 |
| API | Next.js API Routes |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth (Google OAuth) |
| Audio | Howler.js + WaveSurfer.js |

---

## Technical Details

### Story 1: Homepage Song Section

**Component Structure:**
```
<HomepageSongs>
  ├── <div> (grid container)
  │   └── <SongCard /> × 10 (or fewer)
  ├── <div> (pagination controls)
  │   ├── <Button>Forrige</Button>
  │   └── <Button>Neste</Button>
  └── <Dialog> (player modal)
      └── <SongPlayerCard />
</div>
```

**State Management:**
- `songs: Song[]` - Current page of songs
- `currentPage: number` - 0-indexed page number
- `hasMore: boolean` - More songs available
- `isLoading: boolean` - Loading state
- `selectedSong: Song | null` - Song for player modal
- `isModalOpen: boolean` - Player modal visibility

**Pagination Logic:**
```typescript
const offset = currentPage * 10
const hasPrevious = currentPage > 0
// hasMore determined by: songs.length === 10
```

### Story 2: Inline Generation Status

**Zustand Store Schema:**
```typescript
interface GeneratingSongStore {
  generatingSong: {
    id: string
    title: string
    genre: string
    startedAt: Date
  } | null
  setGeneratingSong: (song: GeneratingSong | null) => void
  clearGeneratingSong: () => void
}
```

**SongCard Generating Variant:**
- Animated gradient background (pulse)
- Spinner icon instead of play icon
- "Genererer..." text
- Progress indicator (optional)
- Not clickable during generation

**Polling Strategy:**
- Reuse existing 5-second polling interval
- On `status === 'completed'`: clear store, refetch songs
- On `status === 'failed'`: show error toast, clear store

### Story 3: Lyrics Redesign

**New Component Flow:**
```
<LyricsInputSection>
  ├── <div> (header row)
  │   ├── <label>"Tekst"</label>
  │   └── <Switch>"Norsk uttale"</Switch>
  ├── <Textarea> (main lyrics input, always visible)
  ├── <Button>"Generer tekst"</Button> (collapsed state)
  └── <div> (expanded on click)
      ├── <ConceptInput />
      └── <Button>Generer</Button>
</LyricsInputSection>
```

**State Flow:**
1. User can type directly in main textarea
2. Clicking "Generer tekst" expands concept input
3. After AI generates: text populates textarea, concept area collapses
4. "Norsk uttale" toggle applies phonetic optimization to textarea content

---

## Development Setup

```bash
# Clone and install (already done)
cd C:\Users\tony-\SG-Tony
npm install

# Start development server
npm run dev

# Build and type-check
npm run build

# Lint
npm run lint
```

---

## Implementation Guide

### Setup Steps

1. Create feature branch: `git checkout -b feature/ux-refinements-epic`
2. Verify dev server running: `npm run dev`
3. Review existing components in `src/components/`

### Implementation Steps

**Story 1: Homepage Song Section**

1. Create `src/components/homepage-songs.tsx`
   - Import `SongCard`, `SongPlayerCard`, `Dialog`, `Button`
   - Implement pagination state and fetch logic
   - Render song grid (2 columns on desktop, 1 on mobile)
   - Add pagination buttons with Norwegian labels
   - Add player modal

2. Modify `src/app/page.tsx`
   - Import `HomepageSongs`
   - Add section below lyrics/generate area
   - Add heading "Mine sanger"

**Story 2: Inline Generation Status**

1. Create `src/stores/generating-song-store.ts`
   - Define store with generating song state
   - Export hook

2. Modify `src/components/song-card.tsx`
   - Add `isGenerating?: boolean` prop
   - Render generating variant with spinner/pulse animation

3. Modify `src/components/homepage-songs.tsx`
   - Subscribe to generating song store
   - Render generating song at top of list
   - Implement polling and status updates

4. Modify `src/app/page.tsx`
   - Remove `GenerationProgressModal` import and usage
   - Use generating song store instead
   - On generation start: set store, song appears in list

**Story 3: Redesigned Lyrics Section**

1. Create `src/components/lyrics-input-section.tsx`
   - Main textarea with "Tekst" label
   - Integrate pronunciation toggle with "Norsk uttale" label
   - Collapsible concept input section
   - Handle AI generation → populate textarea

2. Modify `src/components/pronunciation-toggle.tsx`
   - Change label from "Uttalelse Bokmål" to "Norsk uttale"

3. Modify `src/app/page.tsx`
   - Replace current lyrics flow with `LyricsInputSection`
   - Remove separate "Generer tekst med AI" button
   - Adjust state management for new flow

### Testing Strategy

| Test Type | Scope |
|-----------|-------|
| Manual | All user flows on desktop and mobile |
| Visual | Check responsive layout at breakpoints |
| Functional | Verify pagination, generation status, player |
| Edge cases | Empty state, error states, loading states |

**Manual Test Checklist:**
- [ ] Homepage shows user's songs (authenticated)
- [ ] Pagination works (next/prev)
- [ ] Clicking song opens player modal
- [ ] Player plays audio correctly
- [ ] Starting generation shows song in list with "generating" status
- [ ] Completed generation updates to normal song
- [ ] Failed generation shows error toast
- [ ] Manual lyrics input works
- [ ] "Norsk uttale" toggle applies optimization
- [ ] "Generer tekst" expands concept input
- [ ] AI-generated lyrics populate textarea
- [ ] Responsive layout on mobile

### Acceptance Criteria

**Story 1:**
- [ ] Homepage displays up to 10 songs below create form
- [ ] Pagination buttons navigate between pages
- [ ] Clicking song opens player modal
- [ ] Empty state shows message if no songs
- [ ] Loading state shows spinner

**Story 2:**
- [ ] No blocking modal during generation
- [ ] Generating song appears at top of list with status indicator
- [ ] Status updates in real-time (polling)
- [ ] Completed song becomes normal list item
- [ ] Failed generation shows toast error

**Story 3:**
- [ ] Main textarea labeled "Tekst" is always visible
- [ ] Users can type lyrics directly
- [ ] "Norsk uttale" toggle controls phonetic optimization
- [ ] "Generer tekst" button expands concept input
- [ ] AI-generated lyrics populate main textarea
- [ ] Concept input collapses after generation

---

## Developer Resources

### File Paths Reference

**New Files:**
- `src/components/homepage-songs.tsx`
- `src/components/lyrics-input-section.tsx`
- `src/stores/generating-song-store.ts`

**Modified Files:**
- `src/app/page.tsx`
- `src/components/song-card.tsx`
- `src/components/pronunciation-toggle.tsx`

**Existing Files (Reference):**
- `src/app/songs/songs-page-client.tsx`
- `src/components/song-player-card.tsx`
- `src/components/generation-progress-modal.tsx`
- `src/components/concept-input.tsx`
- `src/components/lyrics-editor.tsx`

### Key Code Locations

| Code | Location |
|------|----------|
| Song fetching pattern | `src/app/songs/songs-page-client.tsx:31-64` |
| Player modal pattern | `src/app/songs/songs-page-client.tsx:163-184` |
| Generation polling | `src/components/generation-progress-modal.tsx:116-176` |
| SongCard component | `src/components/song-card.tsx` |
| Current lyrics flow | `src/app/page.tsx:94-163` |
| Pronunciation toggle | `src/components/pronunciation-toggle.tsx` |

### Testing Locations

Manual testing via:
- Local dev server: `http://localhost:3000`
- Vercel preview deploys on PR

### Documentation to Update

- None required for this epic

---

## UX/UI Considerations

### UI Components Affected

| Component | Change |
|-----------|--------|
| Homepage (`page.tsx`) | Add songs section, redesign lyrics area |
| `SongCard` | Add generating variant |
| `PronunciationToggle` | Rename label |
| New: `HomepageSongs` | Song list with pagination |
| New: `LyricsInputSection` | Redesigned lyrics input |

### UX Flow Changes

**Current Flow:**
1. Select genre → Enter concept → Click "Generer tekst med AI"
2. Lyrics appear → Click "Generer sang"
3. Blocking modal shows progress
4. Navigate to /songs to see result

**New Flow:**
1. Select genre → Write lyrics OR click "Generer tekst" for AI
2. Toggle "Norsk uttale" if desired
3. Click "Generer sang"
4. Song appears in list below with "generating" status
5. User can continue browsing, song updates when complete

### Visual/Interaction Patterns

- Follow existing card design (shadow, hover effects)
- Use existing color scheme (#E94560, #FFC93C)
- Responsive: 1 column mobile, 2 columns desktop
- Use existing animation patterns (pulse for loading)

### Accessibility

- Maintain keyboard navigation on all interactive elements
- ARIA labels in Norwegian
- Loading states announced to screen readers
- Focus management when modals open/close

### User Feedback

- Loading spinner during fetch
- Toast on generation complete/failed
- Visual "generating" indicator on song card
- Button disabled states during operations

---

## Testing Approach

**Manual Testing Strategy:**

1. Desktop Chrome - full flow testing
2. Mobile Safari - responsive layout
3. Edge cases: no songs, generation error, slow network

**Test Scenarios:**

| Scenario | Expected Result |
|----------|-----------------|
| Load homepage (authenticated, has songs) | Songs display below create form |
| Load homepage (authenticated, no songs) | Empty state message |
| Load homepage (unauthenticated) | Songs section hidden or login prompt |
| Click "Neste" on last page | Button disabled |
| Click song during generation | Not clickable, shows generating state |
| Generate song, wait for completion | Song updates from generating to normal |
| Type in lyrics textarea | Text appears, no optimization applied |
| Toggle "Norsk uttale" with text | Optimization applied/removed |
| Click "Generer tekst" | Concept input expands |
| Generate AI lyrics | Text populates main textarea |

---

## Deployment Strategy

### Deployment Steps

1. Create PR from `feature/ux-refinements-epic` to `main`
2. Vercel creates preview deployment automatically
3. Test on preview URL
4. Merge to `main`
5. Vercel deploys to production automatically

### Rollback Plan

1. Revert merge commit on `main`
2. Vercel auto-deploys previous version
3. No database migrations = clean rollback

### Monitoring

- Vercel Analytics for performance
- Browser console for client errors
- Supabase dashboard for API errors
