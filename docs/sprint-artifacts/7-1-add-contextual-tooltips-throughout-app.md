# Story 7.1: Add Contextual Tooltips Throughout App

Status: ready-for-dev

## Story

As a **user**,
I want helpful tooltips when I hover/tap on unfamiliar features,
so that I understand what each feature does without leaving the page.

## Acceptance Criteria

1. **Info Icons Added**: Info icons (ⓘ) appear next to key features that need explanation
2. **Tooltip on Hover/Tap**: Hovering (desktop) or tapping (mobile) info icon shows tooltip
3. **Norwegian Content**: All tooltip text is in Norwegian (Bokmål) as per ui_content_language config
4. **Key Tooltips Implemented**:
   - "Uttalelse Bokmål": "Forbedrer automatisk norsk uttale for Suno AI"
   - "Kreditter": "1 kreditt ≈ kr 5. Full sang koster 10 kreditter."
   - "Gratis forhåndsvisning": "30-sekunders forhåndsvisning for å høre sangen din før kjøp"
   - "Last ned": "Last ned hele sangen som MP3 (tilgjengelig i 14 dager)"
5. **Tooltip Styling**: White card with drop shadow, max-width 250px, rounded corners
6. **Dismiss Behavior**: Tooltips dismiss when tapping outside or hovering away
7. **Accessibility**: ARIA role="tooltip", keyboard accessible (focus to show)
8. **Build Verification**: Production build succeeds with no TypeScript or ESLint errors

## Tasks / Subtasks

- [ ] Task 1: Create Tooltip Constants File (AC: #3, #4)
  - [ ] Create `/src/lib/constants/tooltips.ts`
  - [ ] Define tooltip content object with Norwegian text:
    ```typescript
    export const TOOLTIPS = {
      pronunciation: 'Forbedrer automatisk norsk uttale for Suno AI',
      credits: '1 kreditt ≈ kr 5. Full sang koster 10 kreditter.',
      freePreview: '30-sekunders forhåndsvisning for å høre sangen din før kjøp',
      download: 'Last ned hele sangen som MP3 (tilgjengelig i 14 dager)',
      // Add more as needed
    } as const;
    ```
  - [ ] Export type for tooltip keys

- [ ] Task 2: Create InfoTooltip Wrapper Component (AC: #1, #2, #5, #6, #7)
  - [ ] Create `/src/components/info-tooltip.tsx`
  - [ ] Use existing shadcn/ui Tooltip component from `/src/components/ui/tooltip.tsx`
  - [ ] Add Info icon from lucide-react
  - [ ] Style tooltip content: white background, drop shadow, max-w-[250px], rounded-md
  - [ ] Ensure ARIA attributes for accessibility
  - [ ] Props: `content: string`, `side?: 'top' | 'bottom' | 'left' | 'right'`

- [ ] Task 3: Add TooltipProvider to Root Layout (AC: #2)
  - [ ] Update `/src/app/layout.tsx`
  - [ ] Wrap app with `<TooltipProvider>` from shadcn/ui
  - [ ] Configure delayDuration for hover delay (default 400ms)

- [ ] Task 4: Add Tooltip to Pronunciation Toggle (AC: #4)
  - [ ] Update `/src/components/pronunciation-toggle.tsx`
  - [ ] Add InfoTooltip next to "Uttalelse Bokmål" label
  - [ ] Use TOOLTIPS.pronunciation content
  - [ ] Position: right side of label

- [ ] Task 5: Add Tooltip to Credit Display (AC: #4)
  - [ ] Find credit balance display component(s)
  - [ ] Add InfoTooltip next to "Kreditter" label
  - [ ] Use TOOLTIPS.credits content
  - [ ] Show in header/navigation and credit purchase modal

- [ ] Task 6: Add Tooltip to Free Preview Feature (AC: #4)
  - [ ] Find free preview button/UI in song generation flow
  - [ ] Add InfoTooltip next to preview option
  - [ ] Use TOOLTIPS.freePreview content

- [ ] Task 7: Add Tooltip to Download Button (AC: #4)
  - [ ] Update `/src/components/song-player-card.tsx`
  - [ ] Add InfoTooltip next to download button
  - [ ] Use TOOLTIPS.download content
  - [ ] Mention 14-day availability

- [ ] Task 8: Style Tooltip Content (AC: #5)
  - [ ] Customize TooltipContent in info-tooltip.tsx or globally
  - [ ] Apply: bg-white, shadow-lg, text-secondary (navy), max-w-[250px]
  - [ ] Verify text is readable (proper contrast)
  - [ ] Test on mobile and desktop

- [ ] Task 9: Test Keyboard Accessibility (AC: #7)
  - [ ] Tab to info icon - verify focus visible
  - [ ] Press Enter/Space on focused icon - verify tooltip shows
  - [ ] Tab away - verify tooltip dismisses
  - [ ] Verify ARIA attributes in DOM

- [ ] Task 10: Test Touch Behavior (AC: #6)
  - [ ] Test on mobile viewport (Chrome DevTools)
  - [ ] Tap info icon - tooltip appears
  - [ ] Tap outside - tooltip dismisses
  - [ ] Verify touch target is at least 44x44px

- [ ] Task 11: Build Verification (AC: #8)
  - [ ] Run `npm run build` - verify success
  - [ ] Run `npm run lint` - verify no errors
  - [ ] Check for TypeScript errors

## Dev Notes

### Architecture Alignment

**From `/docs/ux-design-specification.md` - Feedback Patterns:**

- **Info Tooltip Pattern**: White card with drop shadow, auto-dismiss on tap outside
- **Usage**: Explaining features like "Uttalelse Bokmål" toggle
- **Info Blue**: `#3B82F6` for informational messages (optional for icon)
- **Contextual tooltips** for features that need explanation

**From `/docs/architecture.md` - UI Components:**

- shadcn/ui Tooltip component already installed (Story 1.4)
- Built on Radix UI for accessibility (ARIA, keyboard support)
- lucide-react for icons (Info icon: `<Info />`)

**Norwegian Language (ui_content_language: Norwegian):**

All user-facing text must be in Norwegian (Bokmål):
- Tooltip content in Norwegian
- Labels in Norwegian
- Keep code/variables in English

### Project Structure Notes

**Files to Create:**
- `/src/lib/constants/tooltips.ts` - Centralized tooltip content
- `/src/components/info-tooltip.tsx` - Reusable InfoTooltip wrapper

**Files to Modify:**
- `/src/app/layout.tsx` - Add TooltipProvider
- `/src/components/pronunciation-toggle.tsx` - Add tooltip to Uttalelse toggle
- `/src/components/song-player-card.tsx` - Add tooltip to download
- `/src/components/credit-purchase-modal.tsx` - Add tooltip to credits
- Other components as identified

**Existing Components to Use:**
- `/src/components/ui/tooltip.tsx` - shadcn/ui Tooltip (already installed)
- lucide-react `Info` icon

### Technical Context

**shadcn/ui Tooltip Usage:**
```tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <button className="p-1">
        <Info className="h-4 w-4 text-muted-foreground" />
      </button>
    </TooltipTrigger>
    <TooltipContent className="bg-white text-secondary shadow-lg max-w-[250px]">
      <p>Tooltip content here</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

**Accessibility Requirements:**
- Radix UI Tooltip handles ARIA attributes automatically
- Focus management built-in
- Keyboard: focusable trigger, Escape to dismiss
- Screen readers announce tooltip content

**Mobile Considerations:**
- Touch: tap to show, tap outside to dismiss
- Touch target: minimum 44x44px for info icon button
- Position: avoid viewport edges, use `side` prop for placement

### References

- [Epic 7 - User Experience & Help](../epics/epic-7-user-experience-help.md)
- [UX Design Specification - Feedback Patterns](../ux-design-specification.md)
- [Architecture Document - UI Components](../architecture.md)
- [shadcn/ui Tooltip Documentation](https://ui.shadcn.com/docs/components/tooltip)
- [Radix UI Tooltip Primitives](https://www.radix-ui.com/primitives/docs/components/tooltip)

## Change Log

**2025-11-26 - Story Created (drafted status)**
- Story drafted by SM agent
- Extracted from Epic 7: User Experience & Help
- Source: docs/epics/epic-7-user-experience-help.md
- Prerequisites: Story 1.4 (shadcn/ui) - completed
- Tooltip component already exists at `/src/components/ui/tooltip.tsx`
- Key files identified for tooltip additions
- Next step: Run story-context workflow or proceed to development

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/stories/7-1-add-contextual-tooltips-throughout-app.context.xml`

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
