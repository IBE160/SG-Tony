# Story 1.2: Inline Generation Status

**Status:** Draft

---

## User Story

As a **user**,
I want **to see my song generating in the list instead of a blocking modal**,
So that **I can continue browsing while my song is being created**.

---

## Acceptance Criteria

**AC #1:** Given I start generating a song, when the generation begins, then no blocking modal appears

**AC #2:** Given a song is generating, when I view the homepage songs section, then the generating song appears at the top with a spinner/progress indicator

**AC #3:** Given a song is generating, when I wait, then the status updates in real-time via polling (every 5 seconds)

**AC #4:** Given a song completes, when the status changes to 'completed', then it becomes a normal clickable song in the list

**AC #5:** Given a song fails, when the status changes to 'failed', then a toast error is shown and the generating indicator is removed

---

## Implementation Details

### Tasks / Subtasks

- [ ] Create Zustand store `src/stores/generating-song-store.ts` (AC: #1, #2)
  - [ ] Define GeneratingSongStore interface
  - [ ] Add generatingSong state (id, title, genre, startedAt)
  - [ ] Add setGeneratingSong and clearGeneratingSong actions
- [ ] Modify `src/components/song-card.tsx` for generating variant (AC: #2)
  - [ ] Add `isGenerating?: boolean` prop
  - [ ] Render spinner instead of play icon when generating
  - [ ] Add pulse animation to card background
  - [ ] Disable click handler when generating
  - [ ] Show "Genererer..." text
- [ ] Modify `src/components/homepage-songs.tsx` (AC: #2, #3, #4, #5)
  - [ ] Subscribe to generating song store
  - [ ] Render generating song at top of list (if exists)
  - [ ] Implement polling logic (reuse from generation-progress-modal)
  - [ ] On completion: clear store, refetch songs list
  - [ ] On failure: clear store, show error toast
- [ ] Modify `src/app/page.tsx` (AC: #1)
  - [ ] Remove GenerationProgressModal import and usage
  - [ ] Use generating song store instead
  - [ ] On generation start: setGeneratingSong with song data
- [ ] Manual testing
  - [ ] Verify no blocking modal appears
  - [ ] Verify generating song shows at top of list
  - [ ] Verify status updates via polling
  - [ ] Verify completion updates list correctly
  - [ ] Verify failure shows toast

### Technical Summary

Replace the blocking `GenerationProgressModal` with inline generation status. Create a Zustand store to track the currently generating song. Modify `SongCard` to render a "generating" variant with spinner and pulse animation. Update `HomepageSongs` to show the generating song at the top and poll for status updates. Reuse existing polling logic from the modal component.

### Project Structure Notes

- **Files to modify:**
  - `src/stores/generating-song-store.ts` (CREATE)
  - `src/components/song-card.tsx` (MODIFY)
  - `src/components/homepage-songs.tsx` (MODIFY)
  - `src/app/page.tsx` (MODIFY - remove modal usage)
- **Expected test locations:** Manual testing via localhost:3000
- **Estimated effort:** 3 story points
- **Prerequisites:** Story 1.1 (HomepageSongs component must exist)

### Key Code References

- Zustand store pattern: `src/stores/credits-store.ts`
- Polling logic: `src/components/generation-progress-modal.tsx:116-176`
- SongCard: `src/components/song-card.tsx`
- Error toast: `src/hooks/use-error-toast.tsx`

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

<!-- Will be populated during dev-story execution -->

### Debug Log References

<!-- Will be populated during dev-story execution -->

### Completion Notes

<!-- Will be populated during dev-story execution -->

### Files Modified

<!-- Will be populated during dev-story execution -->

### Test Results

<!-- Will be populated during dev-story execution -->

---

## Review Notes

<!-- Will be populated during code review -->
