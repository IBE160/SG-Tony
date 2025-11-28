# ibe160 - Epic Breakdown

**Date:** 2025-11-27
**Project Level:** Quick-Flow (Brownfield)

---

## Epic 1: UX Refinements

**Slug:** ux-refinements

### Goal

Improve the song creation user experience by making songs immediately accessible from the homepage, removing the blocking generation modal, and clarifying the lyrics input flow to support both manual and AI-assisted workflows.

### Scope

**In Scope:**
- Homepage song section with pagination
- Inline generation status (no blocking modal)
- Redesigned lyrics input section
- Norwegian UI labels

**Out of Scope:**
- Song generation API changes
- Suno integration changes
- Song library page modifications
- Social sharing features

### Success Criteria

1. Users can see and play their songs directly from the homepage
2. Song generation no longer blocks the UI
3. Users can write lyrics manually or generate with AI via clear flow
4. All UI text in Norwegian

### Dependencies

- Existing `SongCard` and `SongPlayerCard` components
- Existing `GET /api/songs` endpoint
- Existing phonetic optimization system

---

## Story Map - Epic 1

```
Epic: UX Refinements (11 points)
│
├── Story 1.1: Homepage Song Section (3 points) ✓ DONE
│   Dependencies: None
│   Delivers: Paginated song list on homepage
│
├── Story 1.2: Inline Generation Status (3 points) ✓ DONE
│   Dependencies: Story 1.1 (uses HomepageSongs component)
│   Delivers: Non-blocking generation with status in list
│
├── Story 1.3: Redesigned Lyrics Section (2 points) ✓ DONE
│   Dependencies: None (can be done in parallel with 1.1)
│   Delivers: Manual-first lyrics input with optional AI
│
└── Story 1.4: Enhanced Lyrics Input with Dual-Mode UX (3 points) ← NEW
    Dependencies: Story 1.3 (existing lyrics section)
    Delivers: AI-first lyrics with custom text toggle + phonetic optimization link
```

---

## Stories - Epic 1

### Story 1.1: Homepage Song Section

As a **user**,
I want **to see my songs on the homepage with pagination**,
So that **I can quickly access my music without navigating to a separate page**.

**Acceptance Criteria:**
- AC #1: Homepage displays up to 10 songs below the create form
- AC #2: "Neste" button loads next 10 songs
- AC #3: "Forrige" button loads previous 10 songs
- AC #4: Clicking a song opens player modal
- AC #5: Empty state shows friendly message if no songs

**Prerequisites:** None

**Technical Notes:** Create `HomepageSongs` component reusing `SongCard`, `SongPlayerCard`, and existing API

**Estimated Effort:** 3 points

---

### Story 1.2: Inline Generation Status

As a **user**,
I want **to see my song generating in the list instead of a blocking modal**,
So that **I can continue browsing while my song is being created**.

**Acceptance Criteria:**
- AC #1: No blocking modal during generation
- AC #2: Generating song appears at top of list with spinner
- AC #3: Status updates in real-time via polling
- AC #4: Completed song becomes normal list item
- AC #5: Failed generation shows toast error

**Prerequisites:** Story 1.1 (HomepageSongs component)

**Technical Notes:** Create Zustand store for generation state, add generating variant to SongCard, reuse polling logic

**Estimated Effort:** 3 points

---

### Story 1.3: Redesigned Lyrics Section

As a **user**,
I want **a clear lyrics input where I can type directly or optionally use AI**,
So that **I understand how to create songs with my own text or get AI help**.

**Acceptance Criteria:**
- AC #1: Main textarea labeled "Tekst" is always visible
- AC #2: Users can type lyrics directly
- AC #3: "Norsk uttale" toggle controls phonetic optimization
- AC #4: "Generer tekst" button expands concept input
- AC #5: AI-generated lyrics populate main textarea

**Prerequisites:** None

**Technical Notes:** Create `LyricsInputSection` component, rename `PronunciationToggle` label

**Estimated Effort:** 2 points

---

### Story 1.4: Enhanced Lyrics Input with Dual-Mode UX

As a **user**,
I want **a dual-mode lyrics input that defaults to AI generation with an option for custom text**,
So that **I can quickly describe what I want or paste my own lyrics with Norwegian pronunciation optimization**.

**Acceptance Criteria:**

**Mode 1: AI Generated (Default)**
- AC #1: Textarea labeled "Beskriv sangen" with placeholder "F.eks: Bursdagssang til Per som alltid kommer for sent og snakker om båten sin..."
- AC #2: User enters keywords/description of desired song
- AC #3: "✨ Lag tekst" button below textarea generates lyrics via AI
- AC #4: Generated lyrics appear in editable textarea

**Mode 2: Custom Text (Toggle)**
- AC #5: "Egen tekst" toggle switches to custom text mode
- AC #6: When enabled, label changes to "Skriv sangteksten din"
- AC #7: Placeholder changes to "Skriv eller lim inn sangteksten din her..."
- AC #8: "Lag tekst" button is hidden in this mode

**Phonetic Optimization**
- AC #9: "Optimaliser tekst" link visible bottom-right when text exists in field
- AC #10: Clicking runs Norwegian phonetic optimization on current text
- AC #11: Optimized text replaces current textarea content

**Prerequisites:** Story 1.3 (existing lyrics section)

**Technical Notes:**
- Refactor existing `LyricsInputSection` component with mode state
- Reuse existing phonetic optimization API (`/api/optimize-pronunciation`)
- AI lyrics generation uses existing GPT integration

**Estimated Effort:** 3 points

---

## Implementation Timeline - Epic 1

**Total Story Points:** 11

**Implementation Sequence:**
1. Story 1.1 + Story 1.3 (can be parallel) ✓ DONE
2. Story 1.2 (depends on 1.1) ✓ DONE
3. Story 1.4 (depends on 1.3) ← NEXT

---

## Epic 2: UI Polish & Bug Fixes

**Slug:** ui-polish-bug-fixes

### Goal

Improve overall UI quality through visual refinements, translation to Norwegian, and bug fixes across all pages to deliver a polished, consistent user experience.

### Scope

**In Scope:**
- Main page styling and text changes
- Mine sanger page improvements
- Instillinger page fixes and translation
- Mobile navigation translation
- Footer and navbar stability fixes
- Song player timer bug fix

**Out of Scope:**
- New features
- Backend changes
- API modifications

### Success Criteria

1. All UI text displays in Norwegian
2. Consistent styling across all pages (colors, spacing, alignment)
3. No layout shifts on navigation
4. Song player timer works correctly when seeking

### Dependencies

- Existing component library
- Nordic theme color palette

---

## Story Map - Epic 2

```
Epic: UI Polish & Bug Fixes (5 points)
│
└── Story 2.1: UI Polish & Bug Fixes (5 points)
    Dependencies: None
    Delivers: All 15 UI improvements in single pass
```

---

## Stories - Epic 2

### Story 2.1: UI Polish & Bug Fixes

As a **user**,
I want **a polished, consistent UI with Norwegian text and no visual bugs**,
So that **I have a seamless, professional experience using the app**.

**Acceptance Criteria:**

**Main Page:**
- AC #1: Generate song button displays "Generer sang" only
- AC #2: Gender buttons centered, "(valgfritt)" text removed
- AC #3: H1 elements use theme red color
- AC #4: Both gender buttons use same orange background style
- AC #5: Footer content centered
- AC #6: Mobile settings icon has no notification badge
- AC #7: Navbar does not shift when clicking profile/priser

**Mine Sanger Page:**
- AC #8: Song cards have subtle nordic theme gradient background
- AC #9: Genre badge properly sized and text centered
- AC #10: Song modal has single container (outer white box removed, X moved inside)

**Song Player:**
- AC #11: Timer updates correctly when seeking within a song

**Instillinger Page:**
- AC #12: (Mobile) "Alle transaksjoner" dropdown positioned below "Transaksjonshistorikk" text
- AC #13: All content translated to Norwegian

**Mobile Navigation:**
- AC #14: Bottom nav labels in Norwegian

**Footer:**
- AC #15: Footer position stable across page navigation

**Prerequisites:** None

**Technical Notes:** Use existing nordic theme colors. Address layout stability issues with proper CSS.

**Estimated Effort:** 5 points

---

## Implementation Timeline - Epic 2

**Total Story Points:** 5

**Implementation Sequence:**
1. Story 2.1 (all items can be done in single pass)

---
