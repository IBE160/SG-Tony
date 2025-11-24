# Story 3.4: Create Phonetic Diff Viewer Component

Status: ready-for-dev

## Story

As a **user**,
I want to see a side-by-side comparison of original and optimized lyrics,
so that I understand what pronunciation changes are being made.

## Acceptance Criteria

**Given** Pronunciation optimization has been applied
**When** I click "Forhåndsvis fonetiske endringer" button
**Then** A modal opens showing split-screen view: Original (left) | Optimized (right)
**And** Changed words are highlighted in green background (#06D6A0)
**And** Unchanged words are displayed in gray
**And** Each line is numbered (1, 2, 3...)
**And** I can toggle optimization ON/OFF for individual lines (per-line checkbox)
**And** I can close modal and accept changes or revert to original
**And** Mobile view: Stacked layout (Original above, Optimized below)

## Tasks / Subtasks

- [ ] Task 1: Create PhoneticDiffViewer component structure (AC: Modal with split-screen layout)
  - [ ] Create `/src/components/phonetic-diff-viewer.tsx` component file
  - [ ] Set up component props interface (originalLyrics, optimizedLyrics, onAccept, onRevert)
  - [ ] Implement modal container using shadcn/ui Dialog component
  - [ ] Create responsive layout: side-by-side on desktop, stacked on mobile
  - [ ] Add Norwegian labels and headers

- [ ] Task 2: Implement diff highlighting logic (AC: Green highlights for changes)
  - [ ] Create diff algorithm to compare original vs optimized lyrics line-by-line
  - [ ] Identify changed words within each line
  - [ ] Apply green background (#06D6A0) to changed words
  - [ ] Apply gray color to unchanged words
  - [ ] Use monospace font for proper text alignment
  - [ ] Handle edge cases (empty lines, punctuation)

- [ ] Task 3: Add line numbering and layout (AC: Numbered lines)
  - [ ] Implement line number column for both sides
  - [ ] Ensure line numbers align with content
  - [ ] Style line numbers (gray, smaller font)
  - [ ] Handle long lines with proper wrapping
  - [ ] Maintain alignment between left and right sides

- [ ] Task 4: Implement per-line toggle functionality (AC: Individual line toggles)
  - [ ] Add checkbox for each line to toggle optimization ON/OFF
  - [ ] Track toggle state in component state
  - [ ] Update displayed lyrics when toggles change
  - [ ] Merge selected lines (original vs optimized) for final output
  - [ ] Provide visual feedback for toggled state
  - [ ] Add Norwegian label "Bruk original" for checkboxes

- [ ] Task 5: Implement modal actions (AC: Accept/Revert functionality)
  - [ ] Create "Godta endringer" (Accept) button
  - [ ] Create "Tilbake til original" (Revert) button
  - [ ] Create "Lukk" (Close) button
  - [ ] Implement onAccept callback with merged lyrics
  - [ ] Implement onRevert callback to restore original
  - [ ] Handle modal close without action (preserve state)
  - [ ] Style buttons according to UX design (primary green, secondary gray)

- [ ] Task 6: Responsive design and accessibility (AC: Mobile stacked layout)
  - [ ] Implement desktop layout: 2-column grid (50/50 split)
  - [ ] Implement mobile layout: stacked vertical (Original above, Optimized below)
  - [ ] Add breakpoint at 768px for mobile/desktop switch
  - [ ] Ensure touch-friendly tap targets (48px+ for checkboxes)
  - [ ] Add ARIA labels for screen readers
  - [ ] Implement keyboard navigation (Tab, Enter, Escape)
  - [ ] Test with Norwegian screen reader

- [ ] Task 7: Integration and testing (AC: All)
  - [ ] Integrate with pronunciation optimizer output (Story 3.3)
  - [ ] Test with various lyrics lengths (short, long, multi-verse)
  - [ ] Test diff highlighting accuracy
  - [ ] Test per-line toggle functionality
  - [ ] Test modal open/close/accept/revert flows
  - [ ] Test responsive breakpoints on mobile and desktop
  - [ ] Verify Norwegian UI text throughout
  - [ ] Test accessibility with keyboard only

## Dev Notes

### Requirements Context

**From Epic 3: Norwegian Song Creation (CORE)**

Story 3.4 creates the visual comparison interface for the pronunciation optimizer - a critical transparency and trust feature. Users need to see exactly what changes the AI is making to their lyrics before committing to song generation. This component enables users to make informed decisions and provides per-line control over optimization.

**Key Requirements:**
- **FR10**: User can preview before/after pronunciation changes
- **FR12**: User can override pronunciation optimization on a per-line basis
- **FR13**: Phonetic diff viewer shows visual comparison
- **Core Value**: Transparency in AI pronunciation optimization

**Technical Constraints from Architecture:**
- **Component Path**: `/src/components/phonetic-diff-viewer.tsx` (custom component)
- **UI Library**: shadcn/ui Dialog component for modal
- **Styling**: Tailwind CSS with green highlights (#06D6A0)
- **Responsive**: Mobile-first design with stacked mobile layout
- **Font**: Monospace for proper text alignment in diff view
- **Accessibility**: WCAG 2.1 AA compliant (keyboard navigation, ARIA labels)

**From Epic 3 - Story 3.4 Specifications:**

Component specifications:
- **Modal Container**: Full-screen overlay on mobile, centered modal on desktop
- **Layout**: Split-screen (desktop) or stacked (mobile) with Original | Optimized
- **Highlighting**: Green background (#06D6A0) for changed words, gray for unchanged
- **Line Numbers**: Left gutter with 1-based numbering
- **Per-Line Toggles**: Checkbox for each line to include/exclude optimization
- **Actions**: Accept (merge selected), Revert (restore original), Close
- **Diff Algorithm**: Word-level comparison within lines, preserve punctuation

[Source: docs/epics/epic-3-norwegian-song-creation-core.md, docs/architecture.md, docs/ux-design-specification.md]

### Project Structure Notes

**Files to Create:**
- `/src/components/phonetic-diff-viewer.tsx` - Main phonetic diff viewer component
- `/src/lib/phonetic/diff.ts` - Diff algorithm for word-level comparison
- `/src/types/phonetic.ts` - TypeScript types for diff data structures

**Files to Modify:**
- `/src/app/page.tsx` - Integrate phonetic diff viewer with pronunciation flow
- `/src/components/pronunciation-toggle.tsx` - Add "Preview Changes" button (if exists, else create)

**Existing Components to Leverage (from Previous Stories):**
- `/src/components/ui/dialog.tsx` - shadcn/ui Dialog for modal (Story 1.4)
- `/src/components/ui/button.tsx` - shadcn/ui Button for actions (Story 1.4)
- `/src/components/ui/checkbox.tsx` - shadcn/ui Checkbox for per-line toggles (Story 1.4)
- `/src/lib/phonetic/optimizer.ts` - Pronunciation optimizer output (Story 3.3)

**Component Architecture Pattern:**

```typescript
// /src/components/phonetic-diff-viewer.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { computeDiff } from '@/lib/phonetic/diff'

interface PhoneticDiffViewerProps {
  originalLyrics: string
  optimizedLyrics: string
  isOpen: boolean
  onClose: () => void
  onAccept: (mergedLyrics: string) => void
  onRevert: () => void
}

export function PhoneticDiffViewer({
  originalLyrics,
  optimizedLyrics,
  isOpen,
  onClose,
  onAccept,
  onRevert
}: PhoneticDiffViewerProps) {
  // Component logic with per-line toggle state
  // Diff computation and highlighting
  // Merge logic for selected lines
  // Responsive layout switching
}
```

[Source: docs/architecture.md - Component Structure, Implementation Patterns]

### Architecture Alignment

**Component Mapping (from Architecture):**

This story creates the phonetic diff visualization subsystem for Epic 3:

1. **Phonetic Diff Viewer Component** (`/src/components/phonetic-diff-viewer.tsx`) - NEW
   - Modal dialog with split-screen layout
   - Word-level diff highlighting
   - Per-line optimization toggles
   - Accept/Revert/Close actions
   - Responsive mobile/desktop layouts

2. **Diff Algorithm** (`/src/lib/phonetic/diff.ts`) - NEW
   - Word-level comparison logic
   - Returns changed/unchanged word segments
   - Preserves punctuation and spacing
   - Line-by-line processing

3. **Phonetic Types** (`/src/types/phonetic.ts`) - NEW
   - DiffLine interface (lineNumber, original, optimized, isToggled)
   - DiffSegment interface (text, isChanged)
   - PhoneticDiffData interface

**Integration Points:**
- Receives optimization output from Story 3.3 (pronunciation optimizer)
- User-selected merged lyrics passed to Story 3.5 (song generation)
- Works with existing modal/dialog patterns from shadcn/ui (Story 1.4)

**Norwegian UI Language:**
- All button labels in Norwegian: "Godta endringer", "Tilbake til original", "Lukk"
- Modal title: "Forhåndsvisning av fonetiske endringer"
- Checkbox labels: "Bruk original"
- Headers: "Original tekst" | "Optimert tekst"

[Source: docs/architecture.md - Language & Localization, Technology Stack Details]

### Learnings from Previous Story

**From Story 3-2-implement-ai-lyric-generation-with-song-concept-input (Status: review)**

- **Norwegian UI Consistency**: All user-facing text must be in Norwegian - apply to all buttons, labels, headers, and tooltips in diff viewer
- **Component File Pattern**: Created components in `/src/components/` with kebab-case naming - follow for `phonetic-diff-viewer.tsx`
- **shadcn/ui Components**: Used Dialog, Button, Textarea from shadcn/ui - leverage Dialog for modal, Button for actions, Checkbox for toggles
- **Client Component Directive**: Used 'use client' for interactive components - required for this component due to state management
- **TypeScript Types**: Created dedicated type files in `/src/types/` - create `phonetic.ts` for diff-related types
- **Monospace Font**: Used for lyrics editor to preserve formatting - apply to diff viewer for proper word alignment
- **Loading States**: Implemented clear loading feedback - not needed for diff viewer (instant display)
- **Error Handling**: Norwegian error messages throughout - handle edge cases (empty lyrics, malformed input)

**New Services/Patterns Created in Story 3.2:**
- **API Route Pattern**: `/src/app/api/lyrics/generate/route.ts` with POST handler, validation, GPT-4 integration
- **Component Props Pattern**: Clear TypeScript interfaces for component props
- **Character Validation**: Real-time validation with visual feedback (green/yellow/red)
- **Toast Notifications**: Used for success/error feedback - consider for diff viewer actions

**Technical Patterns to Follow:**
- **Responsive Design**: Mobile-first with Tailwind breakpoints (sm:, md:, lg:)
- **Accessibility**: ARIA labels, keyboard navigation (Tab, Enter, Escape)
- **State Management**: Local useState for component state (toggle checkboxes, merged lyrics)
- **Callback Props**: onAccept, onRevert, onClose pattern for parent communication
- **Norwegian Labels**: Consistent Norwegian UI throughout

**Files to Leverage:**
- `/src/components/ui/dialog.tsx` - shadcn/ui Dialog component for modal container
- `/src/components/ui/button.tsx` - shadcn/ui Button for actions (Godta, Tilbake, Lukk)
- `/src/components/ui/checkbox.tsx` - shadcn/ui Checkbox for per-line toggles
- `/src/lib/phonetic/optimizer.ts` - Pronunciation optimizer output (from Story 3.3)

**Architectural Decisions from Story 3.2:**
- Per-line edit capability is critical for user control
- Visual feedback must be immediate and clear
- Norwegian cultural context must be preserved
- Editable components need monospace font
- Component should be reusable and testable

**Potential Issues to Address:**
- **Long Lyrics**: Handle lyrics with many lines (10+ verses) - scrollable modal content
- **Word Alignment**: Ensure proper alignment between original and optimized sides despite different word lengths
- **Punctuation Handling**: Preserve punctuation in diff algorithm (commas, periods, quotes)
- **Norwegian Characters**: Handle æ, ø, å correctly in diff comparison
- **Empty Lines**: Handle blank lines in lyrics gracefully
- **Toggle State Persistence**: Track which lines have optimization toggled off
- **Merge Logic**: Correctly merge original + optimized lines based on toggle state
- **Mobile Touch Targets**: Checkboxes must be 48px+ for easy tapping
- **Keyboard Navigation**: Tab through checkboxes, Enter to toggle, Escape to close
- **Screen Reader Compatibility**: ARIA labels for all interactive elements

**Integration Considerations:**
- Diff viewer triggered by "Forhåndsvis fonetiske endringer" button (create if not exists)
- Requires both original and optimized lyrics as input (from Story 3.3)
- onAccept callback returns merged lyrics (combination of original and optimized based on toggles)
- Merged lyrics then used for song generation (Story 3.5)
- Modal must be non-blocking - user can close and return later

[Source: docs/sprint-artifacts/3-2-implement-ai-lyric-generation-with-song-concept-input.md#Dev-Agent-Record]

### References

- [Epic 3 Story 3.4 Acceptance Criteria](../epics/epic-3-norwegian-song-creation-core.md#story-34-create-phonetic-diff-viewer-component)
- [Architecture - Component Structure](../architecture.md#component-structure)
- [Architecture - Implementation Patterns](../architecture.md#implementation-patterns)
- [Architecture - Language & Localization](../architecture.md#language--localization)
- [UX Design - Custom Components: Phonetic Diff Viewer](../ux-design-specification.md#61-custom-component-phonetic-diff-viewer)
- [PRD - FR10, FR12, FR13 (Pronunciation Preview & Override)](../prd.md#norwegian-pronunciation-optimization)
- [Story 3.3 - Pronunciation Optimizer](./3-3-build-norwegian-pronunciation-optimizer-with-gpt4.md)
- [Story 3.2 - AI Lyric Generation](./3-2-implement-ai-lyric-generation-with-song-concept-input.md)
- [Story 1.4 - shadcn/ui Components](./1-4-install-shadcn-ui-and-core-components.md)

## Change Log

**2025-11-24 - Story Created (drafted status)**
- Story drafted by create-story workflow (SM agent)
- Extracted from Epic 3: Norwegian Song Creation (CORE)
- Source: docs/epics/epic-3-norwegian-song-creation-core.md
- Prerequisites: Story 3.3 (Pronunciation Optimizer)
- Implements FR10, FR12, FR13 (Phonetic diff viewer with per-line toggle)
- Integrated learnings from Story 3.2: Norwegian UI, component patterns, monospace fonts, accessibility
- Next step: Run story-ready workflow to mark ready for development, then implement with dev-story workflow

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/stories/3-4-create-phonetic-diff-viewer-component.context.xml` - Story context generated 2025-11-24

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
