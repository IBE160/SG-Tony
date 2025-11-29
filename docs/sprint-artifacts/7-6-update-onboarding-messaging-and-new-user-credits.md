# Story 7.6: Update Onboarding Messaging and New User Credits

Status: review

## Story

As a **new visitor**,
I want to see a clear value proposition "Logg inn for å lage 2 sanger gratis",
so that I understand the free trial offer and am motivated to sign up.

As a **new user**,
I want to receive 24 free credits when I register,
so that I can create 2 full songs without paying.

## Acceptance Criteria

1. **AC1: Login Modal Message Update**
   - Given I am a logged-out user trying to perform a protected action
   - When the login modal appears
   - Then I see "Logg inn for å lage 2 sanger gratis" as the primary message
   - And I understand that signing up gives me free song credits

2. **AC2: Login Page Message Update**
   - Given I navigate to `/auth/login`
   - When the login page loads
   - Then I see messaging that communicates "2 free songs" value proposition
   - And the call-to-action is compelling and clear

3. **AC3: New User Credit Grant**
   - Given I am a new user completing Google OAuth for the first time
   - When my user_profile is created in the auth callback
   - Then I receive 24 credits (exactly 2 full songs at 12 credits each)
   - And a credit_transaction record is created with type 'signup_bonus'
   - And the transaction description indicates it's a welcome bonus

4. **AC4: Existing Users Unchanged**
   - Given I am an existing user with a user_profile already in the database
   - When I log in again
   - Then my credit_balance is NOT modified
   - And no duplicate signup bonus is granted

5. **AC5: Header/Navigation CTA (optional)**
   - Given I am a logged-out user viewing the site
   - When I see the header "Logg inn" button
   - Then the button or nearby text hints at the free offer

## Tasks / Subtasks

- [x] Task 1: Update login modal default message (AC: #1)
  - [x] 1.1 Edit `src/components/login-modal.tsx`
  - [x] 1.2 Change default `message` prop from "Du må logge inn for å lage låt" to "Logg inn for å lage 2 sanger gratis"

- [x] Task 2: Update login page messaging (AC: #2)
  - [x] 2.1 Edit `src/app/auth/login/page.tsx`
  - [x] 2.2 Update subtitle text to communicate free songs value prop
  - [x] 2.3 Consider adding a small badge or icon showing "2 gratis sanger"

- [x] Task 3: Update auth callback to grant 24 credits (AC: #3, #4)
  - [x] 3.1 Edit `src/app/auth/callback/route.ts`
  - [x] 3.2 Change `credit_balance: 0` to `credit_balance: 24` for new profiles
  - [x] 3.3 After profile creation, insert credit_transaction record:
    - `amount: 24`
    - `balance_after: 24`
    - `transaction_type: 'signup_bonus'` (may need to add this type)
    - `description: 'Velkomstbonus - 2 gratis sanger'`
  - [x] 3.4 Ensure existing users (profile already exists) skip bonus grant

- [x] Task 4: Update database constraints if needed (AC: #3)
  - [x] 4.1 Check if 'signup_bonus' transaction_type needs to be added to CHECK constraint
  - [x] 4.2 Create migration if constraint update is required

- [x] Task 5: Testing (AC: #1-4)
  - [x] 5.1 Test login modal shows new message
  - [x] 5.2 Test login page shows new messaging
  - [x] 5.3 Test new user registration grants 24 credits
  - [x] 5.4 Test existing user login does not grant additional credits
  - [x] 5.5 Verify credit_transaction record is created for signup bonus

## Dev Notes

### Relevant Architecture Patterns
- **Norwegian UI Content**: All user-facing text must be in Norwegian [Source: docs/architecture.md#Language-Localization]
- **Credit System**: Atomic credit operations with transaction logging [Source: docs/architecture.md#Credit-System-Patterns]

### Source Tree Components to Touch
- `src/components/login-modal.tsx` - Default message prop
- `src/app/auth/login/page.tsx` - Page subtitle/messaging
- `src/app/auth/callback/route.ts` - Profile creation with credits
- Possibly: Database migration for transaction_type constraint

### Credit Math
- Full song generation = 12 credits
- 2 songs = 24 credits
- **Total welcome bonus = 24 credits** (exactly 2 free songs)

### Project Structure Notes

- Login modal is used in multiple places (page.tsx, header.tsx)
- The default message change will apply everywhere
- Individual call sites can still override with custom `message` prop if needed

### References

- [Source: docs/architecture.md#Credit-System-Patterns]
- [Source: docs/architecture.md#Authentication-Pattern]
- [Source: docs/epics/epic-7-user-experience-help.md#Story-7.2]
- Current login modal: `src/components/login-modal.tsx:42` (default message)
- Current auth callback: `src/app/auth/callback/route.ts:74` (credit_balance: 0)

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/7-6-update-onboarding-messaging-and-new-user-credits.context.xml`

### Agent Model Used

claude-opus-4-5-20251101

### Debug Log References

### Completion Notes List

- Updated login modal default message to "Logg inn for å lage 2 sanger gratis"
- Updated login page with Norwegian messaging, added gradient badge showing "2 gratis sanger ved registrering!"
- Auth callback now grants 24 credits to new users and creates signup_bonus transaction record
- Created database migration to add 'signup_bonus' to transaction_type CHECK constraint
- All lint and build checks pass
- Note: AC5 (Header CTA enhancement) was optional and not implemented - current "Logg inn" button works fine

### File List

- `src/components/login-modal.tsx` - Updated default message prop
- `src/app/auth/login/page.tsx` - Norwegian messaging, badge, button text
- `src/app/auth/callback/route.ts` - 24 credit bonus, transaction record
- `supabase/migrations/20251129_add_signup_bonus_transaction_type.sql` - New migration
