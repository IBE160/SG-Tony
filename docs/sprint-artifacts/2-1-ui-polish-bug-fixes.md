# Story 2.1: UI Polish & Bug Fixes

Status: ready-for-dev

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
- [ ] Task 1: Update generate button text (AC: #1)
  - [ ] Locate button component
  - [ ] Change text to "Generer sang"
- [ ] Task 2: Fix gender buttons layout (AC: #2, #4)
  - [ ] Center gender buttons container
  - [ ] Remove "(valgfritt)" text
  - [ ] Apply consistent orange background to both buttons
- [ ] Task 3: Update H1 styling (AC: #3)
  - [ ] Identify theme red color from design system
  - [ ] Apply to all H1 elements on main page
- [ ] Task 4: Center footer content (AC: #5)
  - [ ] Update footer CSS for centered alignment
- [ ] Task 5: Remove mobile settings notification badge (AC: #6)
  - [ ] Locate settings icon component
  - [ ] Remove notification indicator styling
- [ ] Task 6: Fix navbar layout stability (AC: #7)
  - [ ] Identify cause of layout shift
  - [ ] Apply fixed width or proper flex layout

### Mine Sanger Page Tasks
- [ ] Task 7: Add gradient background to song cards (AC: #8)
  - [ ] Create subtle nordic theme gradient
  - [ ] Apply to song card component
- [ ] Task 8: Fix genre badge sizing (AC: #9)
  - [ ] Increase badge padding
  - [ ] Center text within badge
- [ ] Task 9: Simplify song modal structure (AC: #10)
  - [ ] Remove outer white container
  - [ ] Move close (X) button inside inner container

### Song Player Tasks
- [ ] Task 10: Fix timer sync on seek (AC: #11)
  - [ ] Debug timer update logic
  - [ ] Ensure timer syncs with audio currentTime on seek

### Instillinger Page Tasks
- [ ] Task 11: Fix mobile dropdown positioning (AC: #12)
  - [ ] Reposition "Alle transaksjoner" dropdown
  - [ ] Place below "Transaksjonshistorikk" heading
- [ ] Task 12: Translate Instillinger content (AC: #13)
  - [ ] Audit all text strings
  - [ ] Replace with Norwegian translations

### Mobile Navigation Tasks
- [ ] Task 13: Translate bottom nav labels (AC: #14)
  - [ ] Identify navigation component
  - [ ] Update all labels to Norwegian

### Footer Stability Tasks
- [ ] Task 14: Fix footer position stability (AC: #15)
  - [ ] Identify cause of position changes
  - [ ] Apply consistent positioning CSS

### Testing Tasks
- [ ] Task 15: Visual regression testing
  - [ ] Test all pages on desktop
  - [ ] Test all pages on mobile viewport
  - [ ] Verify no layout shifts during navigation

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

### Completion Notes List

### File List
