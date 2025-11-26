# Story 7.3: Create FAQ and Help Documentation Page

Status: review

## Story

As a **user**,
I want access to comprehensive help documentation,
so that I can find answers to common questions without contacting support.

## Acceptance Criteria

1. **Help Page Route**: `/help` page exists and is accessible from Settings page footer link
2. **FAQ Organization**: FAQ organized by 5 categories:
   - Getting Started: "How do I create my first song?", "What are credits?"
   - Norwegian Pronunciation: "What is Uttalelse Bokmål?", "Can I override phonetic changes?"
   - Credits & Payments: "How do credit packages work?", "What payment methods do you accept?"
   - Songs & Library: "How long are songs stored?", "How do I download my songs?"
   - Troubleshooting: "My song generation failed, why?", "Why did my preview sound different?"
3. **Accordion UI**: Each FAQ entry is expandable using shadcn/ui Accordion component
4. **Search Functionality**: Search bar filters FAQs by keyword (client-side)
5. **Contact Link**: "Still need help? Contact us" link at bottom (email: support@musikkfabrikken.no)
6. **Norwegian Content**: All FAQ content in Norwegian (Bokmål) per ui_content_language config
7. **Mobile Responsive**: Page works well on mobile (primary target device)
8. **Build Verification**: Production build succeeds with no TypeScript or ESLint errors

## Tasks / Subtasks

- [x] Task 1: Create Help Page Route (AC: #1, #7)
  - [x] Create `/src/app/help/page.tsx`
  - [x] Add page metadata (title, description in Norwegian)
  - [x] Basic page layout with header "Hjelp og ofte stilte spørsmål"
  - [x] Mobile-responsive container (max-width 640px centered)

- [x] Task 2: Create FAQ Data Structure (AC: #2, #6)
  - [x] Create `/src/lib/faq-data.ts` (placed in lib root following existing pattern)
  - [x] Define FAQCategory interface: { id, title, items: FAQItem[] }
  - [x] Define FAQItem interface: { id, question, answer }
  - [x] Populate all 5 categories with Norwegian content
  - [x] 4 questions per category (20 total FAQs)

- [x] Task 3: Build FAQ Accordion Component (AC: #3)
  - [x] Create `/src/components/faq-accordion.tsx`
  - [x] Use shadcn/ui Accordion component (type="single" collapsible)
  - [x] Accept FAQCategory[] as prop
  - [x] Render category headers with styled section dividers
  - [x] Render FAQ items as AccordionItem with question as trigger

- [x] Task 4: Implement Search Functionality (AC: #4)
  - [x] Add search input at top of help page
  - [x] Create useState for searchQuery
  - [x] Filter FAQ items where question OR answer includes searchQuery (case-insensitive)
  - [x] Show "Ingen resultater" empty state when no matches
  - [x] Debounce search input (300ms)

- [x] Task 5: Add Contact Section (AC: #5)
  - [x] Add section at bottom: "Trenger du fortsatt hjelp?"
  - [x] Add mailto link: support@musikkfabrikken.no
  - [x] Style with Card component, subtle border
  - [x] Add message encouraging user to check FAQ first

- [x] Task 6: Add Navigation Link from Settings (AC: #1)
  - [x] Update `/src/app/settings/page.tsx`
  - [x] Add "Hjelp" link in footer section
  - [x] Use Next.js Link component to `/help`
  - [x] Add Lucide HelpCircle icon

- [x] Task 7: Polish and Accessibility (AC: #7)
  - [x] Ensure proper heading hierarchy (h1 for page title, h2 for categories)
  - [x] Add aria-labels for search input
  - [x] Test keyboard navigation through accordion (shadcn accordion supports this)
  - [x] Verify mobile layout (touch-friendly accordion triggers min-h-48px)

- [x] Task 8: Build Verification (AC: #8)
  - [x] Run `npm run build` - success
  - [x] Run `npm run lint` - no errors
  - [x] No TypeScript errors

## Dev Notes

### Architecture Alignment

**From `/docs/architecture.md` - Project Structure:**
- Pages follow Next.js App Router pattern: `/src/app/help/page.tsx`
- Constants in `/src/lib/constants/` folder

**From `/docs/ux-design-specification.md` - UX Pattern Decisions:**
- Accordion pattern for FAQ entries (Section 6.1 Component Strategy)
- Mobile-first responsive design (Section 8.1)
- Touch targets minimum 48x48px

**Norwegian Language (ui_content_language: Norwegian):**
All user-facing text must be in Norwegian (Bokmål):
- "Hjelp og ofte stilte spørsmål" (Help and frequently asked questions)
- "Søk i ofte stilte spørsmål..." (Search FAQs...)
- "Trenger du fortsatt hjelp?" (Still need help?)
- "Kontakt oss" (Contact us)
- "Ingen resultater funnet" (No results found)

### Project Structure Notes

**Files to Create:**
- `/src/app/help/page.tsx` - Help page route
- `/src/lib/constants/faq-data.ts` - FAQ content data
- `/src/components/faq-accordion.tsx` - Reusable FAQ accordion component

**Files to Modify:**
- `/src/app/settings/page.tsx` - Add help link

**Existing Components to Reuse:**
- `/src/components/ui/accordion.tsx` - shadcn/ui Accordion (verify if installed)
- `/src/components/ui/input.tsx` - Search input
- `/src/components/ui/card.tsx` - Contact section card
- Lucide icons: `Search`, `HelpCircle`, `Mail`

### Learnings from Previous Story

**From Story 7.2 (Onboarding Flow) - Status: review**

- **Norwegian Translation Pattern**: All UI text in Norwegian with English code variables
- **useOnboarding Hook Pattern**: Shows Supabase integration for user-specific state
- **Spotlight Effect CSS**: Available animation pattern if needed for emphasis
- **Files Created in 7.2**:
  - src/hooks/use-onboarding.ts
  - src/components/onboarding-modal.tsx
  - supabase/migrations/20251126_add_onboarding_completed.sql
- **Files Modified in 7.2**:
  - src/types/supabase.ts
  - src/app/page.tsx

**From Story 7.1 (Contextual Tooltips) - Status: review**

- **InfoTooltip Component**: Available at `/src/components/info-tooltip.tsx` - could be reused for FAQ hints
- **TOOLTIPS Constants Pattern**: Follow same pattern for FAQ_DATA constant
- **TooltipProvider**: Already in layout.tsx

[Source: docs/sprint-artifacts/7-2-create-onboarding-flow-for-first-time-users.md#Dev-Agent-Record]

### Technical Implementation Notes

**FAQ Data Structure:**
```typescript
interface FAQItem {
  id: string
  question: string
  answer: string
}

interface FAQCategory {
  id: string
  title: string
  icon?: string // Optional Lucide icon name
  items: FAQItem[]
}

export const FAQ_DATA: FAQCategory[] = [
  {
    id: 'getting-started',
    title: 'Kom i gang',
    items: [
      {
        id: 'how-to-create',
        question: 'Hvordan lager jeg min første sang?',
        answer: 'Velg en sjanger, beskriv hva sangen skal handle om, og trykk "Lag sang". AI-en lager teksten og musikken for deg på under 5 minutter!'
      },
      // ... more items
    ]
  },
  // ... more categories
]
```

**Search Filter Implementation:**
```typescript
const [searchQuery, setSearchQuery] = useState('')

const filteredFAQ = useMemo(() => {
  if (!searchQuery.trim()) return FAQ_DATA

  const query = searchQuery.toLowerCase()
  return FAQ_DATA.map(category => ({
    ...category,
    items: category.items.filter(
      item =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
    )
  })).filter(category => category.items.length > 0)
}, [searchQuery])
```

**Accordion Pattern:**
```tsx
<Accordion type="single" collapsible>
  {category.items.map(item => (
    <AccordionItem key={item.id} value={item.id}>
      <AccordionTrigger>{item.question}</AccordionTrigger>
      <AccordionContent>{item.answer}</AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
```

### FAQ Content Categories (Norwegian)

**1. Kom i gang (Getting Started)**
- Hvordan lager jeg min første sang?
- Hva er kreditter og hvordan fungerer de?
- Kan jeg prøve gratis før jeg kjøper kreditter?
- Hvordan logger jeg inn?

**2. Norsk uttale (Norwegian Pronunciation)**
- Hva er "Uttalelse Bokmål"?
- Kan jeg overstyre fonetiske endringer?
- Hvorfor høres sangene mer norske ut enn andre AI-verktøy?
- Fungerer det med dialekter eller nynorsk?

**3. Kreditter og betaling (Credits & Payments)**
- Hvordan fungerer kredittpakkene?
- Hvilke betalingsmetoder aksepterer dere?
- Hva koster det å lage en sang?
- Får jeg pengene tilbake hvis noe går galt?

**4. Sanger og bibliotek (Songs & Library)**
- Hvor lenge lagres sangene mine?
- Hvordan laster jeg ned sangene mine?
- Kan jeg slette en sang?
- Kan jeg dele sangene mine på sosiale medier?

**5. Feilsøking (Troubleshooting)**
- Sanggenereringen mislyktes, hvorfor?
- Hvorfor hørtes forhåndsvisningen annerledes ut?
- Appen fungerer ikke - hva gjør jeg?
- Hvordan kontakter jeg support?

### References

- [Epic 7 - User Experience & Help](../epics/epic-7-user-experience-help.md)
- [UX Design Specification - Component Library](../ux-design-specification.md#6-component-library)
- [Architecture Document - Project Structure](../architecture.md#project-structure)
- [Previous Story 7.2 - Onboarding Flow](./7-2-create-onboarding-flow-for-first-time-users.md)
- [Previous Story 7.1 - Contextual Tooltips](./7-1-add-contextual-tooltips-throughout-app.md)
- [shadcn/ui Accordion Documentation](https://ui.shadcn.com/docs/components/accordion)

## Change Log

**2025-11-26 - Story Completed (review status)**
- All 8 tasks completed successfully
- Created help page with FAQ accordion, search, and contact section
- All 5 FAQ categories populated with 4 questions each (20 total)
- Build and lint passed with no errors

**2025-11-26 - Story Created (drafted status)**
- Story drafted by SM agent using create-story workflow
- Extracted from Epic 7: User Experience & Help (Story 7.3)
- Source: docs/epics/epic-7-user-experience-help.md
- No prerequisites (standalone page)
- Learnings incorporated from Story 7.1 (TOOLTIPS pattern) and 7.2 (Norwegian translations)
- All text translated to Norwegian (Bokmål)
- Next step: Run story-context workflow or proceed to development

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/stories/7-3-create-faq-and-help-documentation-page.context.xml

### Agent Model Used

claude-opus-4-5-20251101

### Debug Log References

- Installed shadcn/ui accordion component
- Created FAQ data with 5 categories, 4 questions each (Norwegian)
- Implemented debounced search with useMemo filtering
- Added responsive layout with 640px max-width
- All touch targets meet 48px minimum requirement

### Completion Notes List

- Help page accessible at /help route
- FAQ organized by 5 categories as required
- Search filters questions and answers case-insensitively
- Contact section with mailto link to support@musikkfabrikken.no
- Help link added to Settings page footer with HelpCircle icon
- All text in Norwegian (Bokmål)
- Mobile-responsive design with touch-friendly accordion
- Production build successful, no TypeScript or ESLint errors

### File List

**Files Created:**
- src/app/help/page.tsx
- src/lib/faq-data.ts
- src/components/faq-accordion.tsx
- src/components/ui/accordion.tsx (shadcn/ui)

**Files Modified:**
- src/app/settings/page.tsx (added help link)
