# Epic 9: Core Navigation & Layout Components

**Goal:** Establish consistent site-wide navigation and layout that reinforces brand identity, enables seamless user flow, and prominently displays auth/credit state to drive engagement and purchases.

**User Value:** Users can navigate confidently across the app, always know their credit balance, and experience a professional, trustworthy interface on both desktop and mobile.

**Business Value:** Credit balance visibility drives purchase behavior; professional appearance builds trust and reduces bounce rate.

**Dependencies:** Epic 2 (User Authentication & Credit System)

---

### Story 9.1: Responsive Header with Navigation and Auth State

As a **user**,
I want a consistent header across all pages showing navigation and my account status,
So that I can easily navigate the app and always know my credit balance.

**Acceptance Criteria:**

**Desktop Header (Logged In):**
**Given** I am logged in
**When** I view any page
**Then** I see a header with:
- Logo "Musikkfabrikken" on the left (clickable → home/create page)
- Navigation links: "Mine Sanger", "Priser"
- User dropdown on the right showing: Avatar (or initials), credit balance (e.g., "25 kr")
**And** User dropdown menu contains: "Innstillinger", "Kjøp kreditter", "Logg ut"
**And** Header is sticky (fixed to top on scroll)

**Desktop Header (Logged Out):**
**Given** I am not logged in
**When** I view any page
**Then** I see a header with:
- Logo "Musikkfabrikken" on the left (clickable → home)
- Navigation links: "Priser"
- Auth buttons: "Logg inn" (secondary), "Kom i gang" (primary CTA)

**Mobile Header (Logged In):**
**Given** I am on a mobile device and logged in
**When** I view any page
**Then** I see a compact header with:
- Logo (icon or short text) on the left
- Credit balance indicator (e.g., "25 kr")
- Hamburger menu icon on the right
**And** Tapping hamburger opens slide-out menu with:
- "Lag Sang" (home/create)
- "Mine Sanger"
- "Priser"
- "Innstillinger"
- "Kjøp kreditter"
- "Logg ut"
**And** Menu can be closed by tapping outside or X button

**Mobile Header (Logged Out):**
**Given** I am on a mobile device and not logged in
**When** I view any page
**Then** I see a compact header with:
- Logo on the left
- Hamburger menu with: "Priser", "Logg inn", "Kom i gang"

**Loading State:**
**Given** auth state is being determined
**When** page loads
**Then** User area shows skeleton loader (no flickering between logged in/out states)

**Prerequisites:** None (uses existing Supabase auth)

**Technical Notes:**
- Create `/src/components/layout/header.tsx` - main header component
- Create `/src/components/layout/mobile-nav.tsx` - slide-out Sheet component
- Create `/src/components/layout/user-menu.tsx` - dropdown with avatar, credits, actions
- Use `@supabase/ssr` for server-side auth state
- Query user's credit balance from `user_credits` or profile table
- Use shadcn/ui components: `DropdownMenu`, `Sheet`, `Button`, `Avatar`
- Responsive breakpoint: Mobile < 768px, Desktop >= 768px
- Add to `/src/app/layout.tsx` to wrap all pages

---

### Story 9.2: Footer Component with Essential Links

As a **user**,
I want a footer with important links and information,
So that I can find legal information and contact details when needed.

**Acceptance Criteria:**

**Given** I am on any page
**When** I scroll to the bottom
**Then** I see a footer containing:
- Secondary navigation links: "Om oss", "Kontakt", "Vilkår", "Personvern"
- Copyright notice: "© 2025 Musikkfabrikken. Alle rettigheter reservert."
**And** Footer has consistent styling with the rest of the app
**And** Links are accessible and have proper hover states
**And** Footer is responsive (stacks on mobile if needed)

**Prerequisites:** None

**Technical Notes:**
- Create `/src/components/layout/footer.tsx`
- Keep minimal for MVP - can be expanded later
- Links can be placeholder pages initially (just `/about`, `/contact`, `/terms`, `/privacy`)
- Use muted colors to not distract from main content
- Add to `/src/app/layout.tsx` below main content

---

### Story 9.3: Layout Integration and Consistency

As a **developer**,
I want a unified layout wrapper for the entire application,
So that header and footer appear consistently on all pages.

**Acceptance Criteria:**

**Given** the Header and Footer components exist
**When** I update the root layout
**Then** All pages automatically have Header at top and Footer at bottom
**And** Main content area has proper min-height (footer stays at bottom even on short pages)
**And** Layout handles different page content heights gracefully
**And** No layout shift occurs during page transitions
**And** Auth state is shared across Header (no redundant auth calls)

**Prerequisites:** Story 9.1, Story 9.2

**Technical Notes:**
- Update `/src/app/layout.tsx` with structure:
  ```tsx
  <body>
    <Header />
    <main className="min-h-[calc(100vh-header-footer)]">
      {children}
    </main>
    <Footer />
  </body>
  ```
- Use CSS flexbox or grid for sticky footer pattern
- Consider Suspense boundary for Header auth state
- Ensure consistent padding/margins across pages

---

**Epic Summary:**
| Story | Description | Priority | Points |
|-------|-------------|----------|--------|
| 9.1 | Responsive Header with Auth State | High | 5 |
| 9.2 | Footer Component | Medium | 2 |
| 9.3 | Layout Integration | High | 2 |

**Total Points:** 9

---
