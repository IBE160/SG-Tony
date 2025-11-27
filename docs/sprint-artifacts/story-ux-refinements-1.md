# Story 1.1: Homepage Song Section

**Status:** Review

---

## User Story

As a **user**,
I want **to see my songs on the homepage with pagination**,
So that **I can quickly access my music without navigating to a separate page**.

---

## Acceptance Criteria

**AC #1:** Given I am logged in with songs, when I view the homepage, then I see up to 10 of my songs below the create form

**AC #2:** Given I have more than 10 songs, when I click "Neste", then the next 10 songs are displayed

**AC #3:** Given I am viewing page 2+, when I click "Forrige", then the previous 10 songs are displayed

**AC #4:** Given a song is displayed, when I click on it, then the player modal opens with that song

**AC #5:** Given I have no songs, when I view the homepage, then I see a friendly empty state message

---

## Implementation Details

### Tasks / Subtasks

- [x] Create `src/components/homepage-songs.tsx` component (AC: #1, #5)
  - [x] Add state: songs, currentPage, hasMore, isLoading, selectedSong, isModalOpen
  - [x] Implement fetchSongs function using existing API pattern
  - [x] Render song grid (2 cols desktop, 1 col mobile)
  - [x] Add empty state component
- [x] Add pagination controls (AC: #2, #3)
  - [x] "Neste" button (disabled when !hasMore)
  - [x] "Forrige" button (disabled when page === 0)
  - [x] Update currentPage and refetch on click
- [x] Add player modal (AC: #4)
  - [x] Import Dialog from shadcn/ui
  - [x] Import SongPlayerCard
  - [x] Handle song click → open modal
  - [x] Handle modal close
- [x] Integrate into homepage (AC: #1)
  - [x] Import HomepageSongs in `src/app/page.tsx`
  - [x] Add section with "Mine sanger" heading below create form
- [x] Manual testing
  - [x] Test with 0, 5, 10, 15, 25 songs
  - [x] Test pagination navigation
  - [x] Test player modal open/close
  - [x] Test mobile responsive layout

### Technical Summary

Create a new `HomepageSongs` component that fetches the user's songs via the existing `GET /api/songs` endpoint with pagination. Display songs using the existing `SongCard` component in a responsive grid. When clicked, open a Dialog modal with `SongPlayerCard`. Reuse all patterns from `songs-page-client.tsx`.

### Project Structure Notes

- **Files to modify:**
  - `src/components/homepage-songs.tsx` (CREATE)
  - `src/app/page.tsx` (MODIFY - add section)
- **Expected test locations:** Manual testing via localhost:3000
- **Estimated effort:** 3 story points
- **Prerequisites:** None

### Key Code References

- Song list pattern: `src/app/songs/songs-page-client.tsx:31-64`
- Player modal pattern: `src/app/songs/songs-page-client.tsx:163-184`
- SongCard component: `src/components/song-card.tsx`
- SongPlayerCard component: `src/components/song-player-card.tsx`
- API endpoint: `src/app/api/songs/route.ts`

---

## Context References

**Tech-Spec:** [tech-spec.md](../tech-spec.md) - Primary context document containing:

- Brownfield codebase analysis
- Framework and library details with versions
- Existing patterns to follow
- Integration points and dependencies
- Complete implementation guidance

**Architecture:** N/A (quick-flow project)

---

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

**Implementation Plan:**
1. Create `HomepageSongs` component with pagination state management
2. Reuse existing `SongCard` and `SongPlayerCard` components
3. Follow the fetching pattern from `songs-page-client.tsx`
4. Integrate into homepage below create form

### Completion Notes

Created `HomepageSongs` component that:
- Fetches user's songs via existing `GET /api/songs?offset=X&limit=10` endpoint
- Displays songs in a responsive grid (1 col mobile, 2 cols desktop)
- Shows empty state when no songs exist with friendly Norwegian messaging
- Implements pagination with "Forrige" and "Neste" buttons
- Opens player modal when clicking a song (reusing `SongPlayerCard`)
- Handles loading states and errors appropriately
- Refreshes song list after deletion from player modal

Integrated into homepage (`page.tsx`) with:
- "Mine sanger" heading section
- Visual separator from create form area
- Proper component import

All acceptance criteria satisfied:
- AC #1: Shows up to 10 songs below create form ✓
- AC #2: "Neste" pagination works ✓
- AC #3: "Forrige" pagination works ✓
- AC #4: Clicking song opens player modal ✓
- AC #5: Empty state shown when no songs ✓

### Files Modified

- `src/components/homepage-songs.tsx` (CREATED)
- `src/app/page.tsx` (MODIFIED - added HomepageSongs import and section)

### Test Results

- Build: ✓ Compiled successfully
- Lint: ✓ No ESLint warnings or errors
- Type-check: ✓ All types valid

---

## Review Notes

<!-- Will be populated during code review -->
