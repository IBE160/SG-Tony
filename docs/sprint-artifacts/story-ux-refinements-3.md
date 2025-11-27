# Story 1.3: Redesigned Lyrics Section

**Status:** Draft

---

## User Story

As a **user**,
I want **a clear lyrics input where I can type directly or optionally use AI**,
So that **I understand how to create songs with my own text or get AI help**.

---

## Acceptance Criteria

**AC #1:** Given I view the homepage, when I see the lyrics section, then there is a main textarea labeled "Tekst" that is always visible

**AC #2:** Given the textarea is visible, when I type in it, then my text is captured as lyrics (no AI involved)

**AC #3:** Given the "Norsk uttale" toggle is visible, when I toggle it on/off, then phonetic optimization is applied/removed from my lyrics

**AC #4:** Given I click "Generer tekst", when the button is clicked, then a concept input area expands below

**AC #5:** Given I enter a concept and click generate, when AI generates lyrics, then the generated text populates the main textarea and the concept input collapses

---

## Implementation Details

### Tasks / Subtasks

- [ ] Create `src/components/lyrics-input-section.tsx` (AC: #1, #2, #4, #5)
  - [ ] Add main Textarea with "Tekst" label (always visible)
  - [ ] Add lyrics state management
  - [ ] Add "Generer tekst" button (collapsed state)
  - [ ] Add expandable concept input section
  - [ ] Integrate ConceptInput component when expanded
  - [ ] Handle AI generation → populate textarea → collapse
  - [ ] Handle manual typing
- [ ] Integrate pronunciation toggle (AC: #3)
  - [ ] Import and add PronunciationToggle component
  - [ ] Wire up toggle state
  - [ ] Apply/remove optimization when toggled
- [ ] Modify `src/components/pronunciation-toggle.tsx` (AC: #3)
  - [ ] Change label from "Uttalelse Bokmål" to "Norsk uttale"
- [ ] Modify `src/app/page.tsx` (AC: #1, #2, #3, #4, #5)
  - [ ] Remove old lyrics generation flow
  - [ ] Import LyricsInputSection
  - [ ] Replace current lyrics area with new component
  - [ ] Adjust state management for new flow
  - [ ] Remove "Generer tekst med AI" as primary button
- [ ] Manual testing
  - [ ] Verify textarea labeled "Tekst" is visible
  - [ ] Verify typing directly works
  - [ ] Verify toggle labeled "Norsk uttale"
  - [ ] Verify "Generer tekst" expands concept input
  - [ ] Verify AI generation populates textarea
  - [ ] Verify concept area collapses after generation

### Technical Summary

Create a new `LyricsInputSection` component that inverts the current flow. The main textarea for lyrics is always visible and editable. The "Norsk uttale" toggle applies phonetic optimization. The "Generer tekst" button is secondary - clicking it expands the concept input for AI generation. After AI generates, the text populates the main textarea and the concept area collapses. This supports both manual and AI-assisted workflows clearly.

### Project Structure Notes

- **Files to modify:**
  - `src/components/lyrics-input-section.tsx` (CREATE)
  - `src/components/pronunciation-toggle.tsx` (MODIFY - rename label)
  - `src/app/page.tsx` (MODIFY - use new component)
- **Expected test locations:** Manual testing via localhost:3000
- **Estimated effort:** 2 story points
- **Prerequisites:** None (can be done in parallel with Story 1.1)

### Key Code References

- Current lyrics flow: `src/app/page.tsx:94-163`
- LyricsEditor component: `src/components/lyrics-editor.tsx`
- PronunciationToggle: `src/components/pronunciation-toggle.tsx`
- ConceptInput: `src/components/concept-input.tsx`
- Textarea component: `src/components/ui/textarea.tsx`
- Switch component: `src/components/ui/switch.tsx`

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
