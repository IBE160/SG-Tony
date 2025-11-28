# Story 2.1: UI Polish & Bug Fixes

Status: review

## Story

As a **user**,
I want **a polished, consistent UI with Norwegian text and no visual bugs**,
so that **I have a seamless, professional experience using the app**.

## Acceptance Criteria

### Main Page
1. **AC #1:** Generate song button displays "Generer sang" only
2. **AC #2:** Gender buttons centered, "(valgfritt)" text removed
3. **AC #3:** H1 elements use theme red color
4. **AC #4:** Both gender buttons use same orange background style
5. **AC #5:** Footer content centered
6. **AC #6:** Mobile settings icon has no notification badge
7. **AC #7:** Navbar does not shift when clicking profile/priser

### Mine Sanger Page
8. **AC #8:** Song cards have subtle nordic theme gradient background
9. **AC #9:** Genre badge properly sized and text centered
10. **AC #10:** Song modal has single container (outer white box removed, X moved inside)

### Song Player
11. **AC #11:** Timer updates correctly when seeking within a song

### Instillinger Page
12. **AC #12:** (Mobile) "Alle transaksjoner" dropdown positioned below "Transaksjonshistorikk" text
13. **AC #13:** All content translated to Norwegian

### Mobile Navigation
14. **AC #14:** Bottom nav labels in Norwegian

### Footer
15. **AC #15:** Footer position stable across page navigation

## Tasks / Subtasks

### Main Page Tasks
- [x] Task 1: Update generate button text (AC: #1)
  - [x] Locate button component
  - [x] Change text to "Generer sang"
- [x] Task 2: Fix gender buttons layout (AC: #2, #4)
  - [x] Center gender buttons container
  - [x] Remove "(valgfritt)" text
  - [x] Apply consistent orange background to both buttons
- [x] Task 3: Update H1 styling (AC: #3)
  - [x] Identify theme red color from design system
  - [x] Apply to all H1 elements on main page
- [x] Task 4: Center footer content (AC: #5)
  - [x] Update footer CSS for centered alignment
- [x] Task 5: Remove mobile settings notification badge (AC: #6)
  - [x] Locate settings icon component
  - [x] Remove notification indicator styling
- [x] Task 6: Fix navbar layout stability (AC: #7)
  - [x] Identify cause of layout shift
  - [x] Apply fixed width or proper flex layout

### Mine Sanger Page Tasks
- [x] Task 7: Add gradient background to song cards (AC: #8)
  - [x] Create subtle nordic theme gradient
  - [x] Apply to song card component
- [x] Task 8: Fix genre badge sizing (AC: #9)
  - [x] Increase badge padding
  - [x] Center text within badge
- [x] Task 9: Simplify song modal structure (AC: #10)
  - [x] Verified modal already uses single container
  - [x] X button already positioned inside DialogContent

### Song Player Tasks
- [x] Task 10: Fix timer sync on seek (AC: #11)
  - [x] Debug timer update logic
  - [x] Ensure timer syncs with audio currentTime on seek

### Instillinger Page Tasks
- [x] Task 11: Fix mobile dropdown positioning (AC: #12)
  - [x] Reposition "Alle transaksjoner" dropdown
  - [x] Place below "Transaksjonshistorikk" heading
- [x] Task 12: Translate Instillinger content (AC: #13)
  - [x] Audit all text strings
  - [x] Replace with Norwegian translations

### Mobile Navigation Tasks
- [x] Task 13: Translate bottom nav labels (AC: #14)
  - [x] Identify navigation component
  - [x] Update all labels to Norwegian

### Footer Stability Tasks
- [x] Task 14: Fix footer position stability (AC: #15)
  - [x] Identify cause of position changes
  - [x] Apply consistent positioning CSS

### Testing Tasks
- [x] Task 15: Visual regression testing
  - [x] Lint passes with no errors
  - [x] Build passes successfully
  - [x] Verify no layout shifts during navigation

## Dev Notes

- Use existing nordic theme color palette from Tailwind config
- Check `tailwind.config.ts` for defined colors (red, orange variants)
- Song player timer issue likely in audio event handlers - check `onTimeUpdate` vs `onSeeked` events
- Layout shift bugs often caused by dynamic content loading or conditional rendering

### Project Structure Notes

- Main page: `src/app/page.tsx`
- Mine sanger: `src/app/mine-sanger/page.tsx`
- Instillinger: `src/app/instillinger/page.tsx`
- Components: `src/components/`
- Footer: Check for shared layout component

### References

- [Source: docs/epics.md#Epic-2]
- Nordic theme colors defined in Tailwind config

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/2-1-ui-polish-bug-fixes.context.xml`

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

Implementation completed in single session - all 15 ACs addressed.

### Completion Notes List

- AC #1: Changed button text from "Generer sang med Suno (10 kreditter)" to "Generer sang"
- AC #2, #4: Gender buttons centered with consistent orange gradient background on both
- AC #3: Added text-primary class to H1 for theme red color
- AC #5: Footer content centered using flex-col items-center
- AC #6: Removed badge from mobile navigation settings icon
- AC #7: Fixed navbar stability by adding min-w-[160px] to user area
- AC #8: Added subtle nordic gradient to song cards
- AC #9: Genre badge now has proper padding and centered text
- AC #10: Modal already has single container structure with X inside
- AC #11: Fixed timer sync by restarting animation frame on seek
- AC #12: Mobile dropdown now stacks below heading on small screens
- AC #13: Settings page fully translated to Norwegian
- AC #14: Bottom nav labels now in Norwegian (Hjem, Sanger, Instillinger)
- AC #15: Footer uses mt-auto for stable positioning

### File List

**Modified:**
- src/app/page.tsx - Generate button text, H1 styling
- src/components/voice-gender-selector.tsx - Centered buttons, removed valgfritt, orange bg
- src/components/layout/footer.tsx - Centered content, mt-auto for stability
- src/components/layout/bottom-navigation.tsx - Norwegian labels, removed badge
- src/components/layout/header.tsx - Fixed width for user area
- src/components/song-card.tsx - Nordic gradient background, badge sizing
- src/components/song-player-card.tsx - Timer sync on seek fix
- src/components/transaction-history.tsx - Mobile dropdown positioning
- src/app/settings/page.tsx - Norwegian translations
