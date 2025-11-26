# Epic 8: System Resilience & Operations

**Goal:** Ensure the system handles errors gracefully and provides reliable service.

**User Value:** Reliable service that handles failures transparently.

**FRs Covered:** FR66-FR70 (Error Handling)

**MVP Scope:** 4 stories (8.1, 8.4, 8.6, 8.7) - Stories 8.2, 8.3, 8.5, 8.8 deferred to post-MVP (see future-enhancements.md)

---

### Story 8.1: Implement Basic Error Logging

As a **developer/founder**,
I want errors logged so I can diagnose production issues.

**Acceptance Criteria:**

**Given** The application is running in production
**When** Any error occurs (client-side or server-side)
**Then** Error is logged with context: Error message, Stack trace, User ID (if authenticated), Timestamp
**And** Client errors are caught by Error Boundary components
**And** API errors are caught in try-catch blocks
**And** Logs are viewable in Vercel Dashboard (free tier)

**Prerequisites:** None (foundational)

**Technical Notes:**
- Client error logging: React Error Boundaries + `window.onerror`
- Server error logging: Try-catch in all API routes, use `console.error()` with structured data
- Log service: Vercel Logs (built-in, free) - upgrade to Sentry post-MVP if needed
- Sensitive data: Never log passwords, API keys, or PII
- Keep it simple: `console.error({ error, userId, route, timestamp })`

---

### Story 8.2: DEFERRED TO POST-MVP
<!-- Suno API Health Monitoring - Moved to docs/future-enhancements.md -->
<!-- Use manual monitoring at MVP scale. Decision date: 2025-11-26 -->

---

### Story 8.3: DEFERRED TO POST-MVP
<!-- API Cost Monitoring - Moved to docs/future-enhancements.md -->
<!-- Use Suno/Stripe dashboards manually at MVP scale. Decision date: 2025-11-26 -->

---

### Story 8.4: Implement Automatic Retry Logic for API Failures

As a **user**,
I want the system to automatically retry failed API calls,
So that transient errors don't cause my song generation to fail unnecessarily.

**Acceptance Criteria:**

**Given** An API call to Suno, OpenAI, or Google fails due to network error or timeout
**When** The error is detected as transient (5xx error, timeout, connection refused)
**Then** System automatically retries the request up to 3 times
**And** Retry uses exponential backoff: 1s, 2s, 4s delays between attempts
**And** If all retries fail, user sees friendly error message
**And** Credits are not deducted until successful API response
**And** Retry attempts are logged for monitoring
**And** User sees progress indicator during retries: "Retrying... (attempt 2 of 3)"

**Prerequisites:** Story 3.5 (Suno), Story 3.2 (OpenAI), Story 6.1 (Google)

**Technical Notes:**
- Create retry utility: `/src/lib/utils/retry.ts` with exponential backoff
- Wrap all external API calls with retry logic
- Detect transient errors: HTTP 5xx, ECONNREFUSED, ETIMEDOUT
- Max retries: 3 attempts (configurable)
- Backoff: 1s, 2s, 4s (exponential)
- Log retries: Include attempt number, delay, final outcome
- Non-retriable errors: 4xx client errors (bad request, unauthorized) - fail immediately

---

### Story 8.5: DEFERRED TO POST-MVP
<!-- Session State Persistence - Moved to docs/future-enhancements.md -->
<!-- UX polish, users can re-enter short form. Decision date: 2025-11-26 -->

---

### Story 8.6: Implement Webhook Polling Fallback Mechanism

As a **developer**,
I want polling fallback if Suno webhooks fail,
So that song generation still completes even if webhook delivery fails.

**Acceptance Criteria:**

**Given** Song generation has been initiated with Suno
**When** Webhook notification is expected but doesn't arrive within 5 minutes
**Then** System automatically switches to polling mode
**And** Client polls `/api/songs/[id]` every 10 seconds
**And** Polling checks song status: 'generating' → 'completed' or 'failed'
**And** When status changes to 'completed', polling stops
**And** User experience is identical whether webhook or polling completes
**And** Webhook failure is logged for monitoring

**Prerequisites:** Story 3.7 (Webhook Handler), Story 3.5 (Song Generation)

**Technical Notes:**
- Client-side polling: Start after 5 minutes if status still 'generating'
- Use React Query or SWR with `refetchInterval: 10000` (10 seconds)
- Stop polling when: status='completed', status='failed', or 10 minutes elapsed
- Webhook timeout detection: Server-side job checks songs 'generating' > 10 minutes
- Fallback: Manually query Suno API for song status if stuck
- Log webhook failures: Track delivery success rate

---

### Story 8.7: Prevent Double-Charging on Concurrent Requests

As a **user**,
I want protection against double-charging if I accidentally submit twice,
So that I'm never charged multiple times for the same song generation.

**Acceptance Criteria:**

**Given** I have clicked "Generate Song" button
**When** I accidentally click again before the first request completes
**Then** The second request is blocked with message: "Generation already in progress"
**And** Only one song generation is initiated
**And** Only one credit deduction occurs (10 credits, not 20)
**And** Database row locking prevents concurrent credit deductions
**And** User sees clear UI feedback: Button disabled during generation
**And** Re-enabling happens only after: Success, failure, or 5-minute timeout

**Prerequisites:** Story 2.6 (Atomic Credit Deduction), Story 3.5 (Song Generation)

**Technical Notes:**
- Client-side: Disable button immediately on click, add loading spinner
- Server-side: Use database row locking in `deduct_credits()` function
- Idempotency: Check for existing song with status='generating' for user
- If duplicate request: Return existing song_id instead of creating new record
- Atomic operation: SELECT FOR UPDATE in PostgreSQL transaction
- Timeout: After 5 minutes, allow retry (consider previous generation failed)

---

### Story 8.8: DEFERRED TO POST-MVP
<!-- Founder Admin Dashboard - Moved to docs/future-enhancements.md -->
<!-- Use Supabase Studio + Stripe Dashboard at MVP scale. Decision date: 2025-11-26 -->

---
