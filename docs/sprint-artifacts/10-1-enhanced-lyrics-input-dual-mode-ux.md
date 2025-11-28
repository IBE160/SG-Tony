# Story 10.1: Enhanced Lyrics Input with Dual-Mode UX

Status: review

## Story

As a **user**,
I want **a dual-mode lyrics input that defaults to AI generation with an option for custom text**,
so that **I can quickly describe what I want or paste my own lyrics with Norwegian pronunciation optimization**.

## Acceptance Criteria

### Mode 1: AI Generated (Default)
1. **AC #1**: Textarea labeled "Beskriv sangen" with placeholder "F.eks: Bursdagssang til Per som alltid kommer for sent og snakker om båten sin..."
2. **AC #2**: User enters keywords/description of desired song
3. **AC #3**: "✨ Lag tekst" button below textarea generates lyrics via AI
4. **AC #4**: Generated lyrics appear in editable textarea (replacing description)

### Mode 2: Custom Text (Toggle)
5. **AC #5**: "Egen tekst" toggle switches to custom text mode
6. **AC #6**: When enabled, label changes to "Skriv sangteksten din"
7. **AC #7**: Placeholder changes to "Skriv eller lim inn sangteksten din her..."
8. **AC #8**: "Lag tekst" button is hidden in this mode

### Phonetic Optimization
9. **AC #9**: "Optimaliser tekst" link visible bottom-right when text exists in field
10. **AC #10**: Clicking runs Norwegian phonetic optimization on current text
11. **AC #11**: Optimized text replaces current textarea content

## Tasks / Subtasks

- [x] Task 1: Refactor LyricsInputSection component state (AC: #1-8)
  - [x] 1.1 Add `isCustomTextMode` state (default: false)
  - [x] 1.2 Create mode toggle with "Egen tekst" label
  - [x] 1.3 Implement dynamic label switching based on mode
  - [x] 1.4 Implement dynamic placeholder switching based on mode
  - [x] 1.5 Conditionally render "Lag tekst" button (hidden in custom mode)

- [x] Task 2: Update AI Generation flow (AC: #3, #4)
  - [x] 2.1 Remove modal-based generation (use inline approach)
  - [x] 2.2 Rename button to "✨ Lag tekst"
  - [x] 2.3 After generation, replace textarea content with generated lyrics
  - [x] 2.4 Keep textarea editable after generation

- [x] Task 3: Implement "Optimaliser tekst" link (AC: #9-11)
  - [x] 3.1 Add link element positioned bottom-right of textarea
  - [x] 3.2 Show only when textarea has content
  - [x] 3.3 Connect to existing `/api/lyrics/optimize` endpoint
  - [x] 3.4 Replace textarea content with optimized text

- [x] Task 4: Update parent component integration
  - [x] 4.1 Update page.tsx props if interface changes
  - [x] 4.2 Ensure concept/description state flows correctly

- [x] Task 5: Testing
  - [x] 5.1 Test default mode (AI generation flow)
  - [x] 5.2 Test custom text mode toggle
  - [x] 5.3 Test phonetic optimization
  - [x] 5.4 Test mode switching with existing content

## Dev Notes

### Current Implementation Analysis

The existing `LyricsInputSection` component at `src/components/lyrics-input-section.tsx`:
- Uses modal-based AI generation (to be changed to inline)
- Has "Tekst" label with "Norsk uttale" toggle (to be replaced with mode toggle)
- "Generer tekst" button opens modal (to become inline "Lag tekst" button)
- "Optimaliser" button exists but is a Button, not a link

### Key Changes Required

| Current | New |
|---------|-----|
| "Tekst" label | "Beskriv sangen" (default) / "Skriv sangteksten din" (custom) |
| "Norsk uttale" toggle | "Egen tekst" toggle |
| Modal-based generation | Inline "✨ Lag tekst" button |
| "Optimaliser" button | "Optimaliser tekst" link (bottom-right) |

### Files to Modify

1. `src/components/lyrics-input-section.tsx` - Primary refactor
2. `src/app/page.tsx` - Update props if interface changes

### Existing APIs to Reuse

- `/api/lyrics/optimize` - Norwegian phonetic optimization
- `/api/lyrics/generate` - AI lyrics generation (via existing `onGenerateLyrics` prop)

### Project Structure Notes

- Component lives at `src/components/lyrics-input-section.tsx`
- Uses shadcn/ui components (Switch, Textarea, Button)
- Styling uses Tailwind CSS with nordic theme colors

### References

- [Source: docs/epics.md#Story-1.4]
- [Source: src/components/lyrics-input-section.tsx] - Current implementation
- [Source: src/app/api/lyrics/optimize/route.ts] - Optimization API

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/stories/10-1-enhanced-lyrics-input-dual-mode-ux.context.xml

### Agent Model Used

claude-opus-4-5-20251101

### Debug Log References

- 2025-11-28: Implemented dual-mode UX for lyrics input. Approach: Created `isCustomTextMode` state to toggle between AI description mode (default) and custom text mode. Dynamic labels/placeholders switch based on mode. "Lag tekst" button hidden in custom mode. "Optimaliser tekst" link positioned bottom-right of textarea.

### Completion Notes List

- Refactored `LyricsInputSection` from modal-based to inline AI generation
- Simplified component interface: removed 6 unused props (pronunciationEnabled, onPronunciationToggle, onOpenDiffViewer, hasPhoneticChanges, hasOriginalLyrics)
- Implemented dual-mode toggle with "Egen tekst" switch
- Added "Optimaliser tekst" link with proper positioning (absolute bottom-right inside textarea container)
- All 11 acceptance criteria verified and satisfied
- Build and lint pass with no errors

### Change Log

- 2025-11-28: Implemented Story 10.1 - Enhanced Lyrics Input with Dual-Mode UX

### File List

- src/components/lyrics-input-section.tsx (modified - complete refactor)
- src/app/page.tsx (modified - updated props)
