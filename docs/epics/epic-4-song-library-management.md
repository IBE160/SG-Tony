# Epic 4: Song Library & Management

**Goal:** Enable users to manage their created songs effectively with playback, downloads, and organization.

**User Value:** Users can organize, replay, and download their Norwegian song library.

**FRs Covered:** FR24-FR27 (Track Management), FR46-FR48 (Storage & Downloads)

**Note:** Songs are automatically deleted after 14 days (no warnings or recovery).

---

### Story 4.1: Create "My Songs" Page with Track List

As a **user**,
I want to view all my generated songs in a dedicated library page,
So that I can access and replay any song I've created.

**Acceptance Criteria:**

**Given** I have generated multiple songs
**When** I tap "My Songs" in the bottom navigation
**Then** I see a list of all my songs sorted by creation date (newest first)
**And** Each song card displays: Artwork thumbnail (60x60px gradient), Song title, Genre badge, Creation date (relative: "2 hours ago"), Duration
**And** I see a small play icon on each card
**And** Tapping a card opens the full song player modal
**And** List supports infinite scroll (load 20 songs at a time)
**And** Empty state displays if no songs: "No songs yet! Let's create your first masterpiece 🎵" with "Create Song" button

**Prerequisites:** Story 3.8 (Song Player)

**Technical Notes:**
- UX reference: `/docs/ux-design-specification.md` section "5.1 User Journey - Journey 3"
- Create `/src/app/songs/page.tsx` for song library
- Query `song` table WHERE user_id = current_user AND deleted_at IS NULL
- Sort by created_at DESC
- Use shadcn/ui Card component for song cards
- Implement pagination with offset/limit or cursor-based
- Cache song list in React Query or SWR

---

### Story 4.2: Implement Song Detail Modal with Full Player

As a **user**,
I want to open a full-screen player modal when I tap a song,
So that I can focus on listening without distractions.

**Acceptance Criteria:**

**Given** I am viewing my song library
**When** I tap on a song card
**Then** A full-screen modal opens with large artwork (200x200px on mobile)
**And** Song metadata displayed: Title (editable inline), Genre, Creation date, Duration
**And** Large play/pause button (60x60px) in center
**And** Animated waveform visualization below
**And** Scrubable progress bar with time markers
**And** Action buttons at bottom: Share, Download, Delete, Edit (rename)
**And** Modal is dismissible: Tap outside, swipe down (mobile), or close button (X)

**Prerequisites:** Story 4.1

**Technical Notes:**
- Create `/src/app/songs/[id]/page.tsx` OR use modal component
- Use same Song Player Card component from Story 3.8 but full-screen variant
- Deep linking: `/songs/{songId}` for shareable URLs
- Preserve playback state when modal closes
- Preload adjacent songs for fast navigation

---

### Story 4.3: Implement Song Download Functionality

As a **user**,
I want to download my generated songs to my device,
So that I can keep them permanently and share them offline.

**Acceptance Criteria:**

**Given** I am viewing a song in the player modal
**When** I tap "Download" button
**Then** Browser download dialog appears with filename: "{song-title}-musikkfabrikken.mp3"
**And** Audio file downloads from Supabase Storage via signed URL
**And** Download completes successfully within 10 seconds (typical)
**And** I see success toast: "✓ Song downloaded!"
**And** Downloaded file is playable on all standard audio players
**And** File metadata includes: Artist="Musikkfabrikken", Album="Norwegian AI Songs"

**Prerequisites:** Story 4.2, Story 3.7 (Supabase Storage)

**Technical Notes:**
- Generate signed download URL from Supabase Storage
- Use browser `download` attribute on anchor tag
- Filename format: `{sanitized-title}-musikkfabrikken.mp3`
- Audio format: MP3 ~128kbps (good quality, reasonable size)
- Set ID3 tags on file upload: artist, album, title
- Handle large files (3-5 MB typical) with progress indicator if needed

---

### Story 4.4: Implement Song Deletion with Confirmation

As a **user**,
I want to delete songs I no longer need,
So that my library stays organized.

**Acceptance Criteria:**

**Given** I am viewing a song in the player modal
**When** I tap "Delete" button (trash icon)
**Then** A confirmation dialog appears: "Slett '{song-title}'? Dette kan ikke angres."
**And** Two options: "Avbryt" (secondary button) and "Slett" (destructive red button)
**And** When I confirm deletion
**Then** Song record is permanently deleted from database
**And** Audio file is removed from Supabase Storage
**And** Song disappears from my library immediately
**And** I see success toast: "Sangen ble slettet"

**Prerequisites:** Story 4.2

**Technical Notes:**
- Permanent deletion: Hard DELETE from database (no soft delete)
- Remove audio file from Supabase Storage bucket immediately
- Use database transaction to ensure both record and file are deleted atomically
- No undo functionality - deletion is permanent
- Confirmation dialog prevents accidental deletions

---

### Story 4.5: Implement Song Rename Functionality

As a **user**,
I want to rename my songs with meaningful titles,
So that I can easily identify them in my library.

**Acceptance Criteria:**

**Given** I am viewing a song in the player modal
**When** I tap the song title (which shows an edit icon on hover)
**Then** Title becomes an editable input field
**And** I can type a new title (1-100 characters)
**And** When I press Enter or tap outside
**Then** Title is saved to database
**And** Updated title appears everywhere: player, library list, shared links
**And** I see success toast: "✓ Song renamed!"
**And** If I leave title empty, it reverts to original AI-generated title

**Prerequisites:** Story 4.2

**Technical Notes:**
- Inline editing: Click title → input field with current value
- Validation: 1-100 characters, no special characters that break filenames
- API endpoint: PATCH `/api/songs/[id]` with `{ title: string }`
- Optimistic update: Show new title immediately, rollback on error
- Sanitize title for safe database storage and filenames

---

**Note on Automatic Deletion:**
- Songs are automatically deleted after 14 days to manage storage costs
- Background job (Vercel Cron or Supabase Function) runs daily
- Query: `WHERE created_at < NOW() - INTERVAL '14 days'`
- Permanent deletion: Hard delete record + remove audio file from Supabase Storage
- No warnings, notifications, or recovery options (users can download before deletion)

---
