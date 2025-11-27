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
Epic: UX Refinements (8 points)
│
├── Story 1.1: Homepage Song Section (3 points)
│   Dependencies: None
│   Delivers: Paginated song list on homepage
│
├── Story 1.2: Inline Generation Status (3 points)
│   Dependencies: Story 1.1 (uses HomepageSongs component)
│   Delivers: Non-blocking generation with status in list
│
└── Story 1.3: Redesigned Lyrics Section (2 points)
    Dependencies: None (can be done in parallel with 1.1)
    Delivers: Manual-first lyrics input with optional AI
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

## Implementation Timeline - Epic 1

**Total Story Points:** 8

**Implementation Sequence:**
1. Story 1.1 + Story 1.3 (can be parallel)
2. Story 1.2 (depends on 1.1)

---
