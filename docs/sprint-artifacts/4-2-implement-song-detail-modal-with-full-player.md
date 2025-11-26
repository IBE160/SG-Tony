# Story 4.2: Implement Song Detail Modal with Full Player

Status: drafted (deferred post-MVP)

## Story

As a **user**,
I want to open a full-screen player modal when I tap a song,
so that I can focus on listening without distractions and have access to all song actions.

## Acceptance Criteria

1. **Modal Opens on Song Tap**: Given I am viewing my song library, when I tap on a song card, then a full-screen modal opens

2. **Large Artwork Display**: Modal displays large artwork (200x200px on mobile) with gradient background based on genre colors

3. **Song Metadata Displayed**: Modal shows song title (editable inline), genre badge, creation date, and duration

4. **Large Play/Pause Button**: A large play/pause button (60x60px) is centered below the artwork

5. **Waveform Visualization**: An animated waveform visualization displays below the play button, responding to audio playback

6. **Scrubable Progress Bar**: A scrubable progress bar with time markers (current time / total duration) allows seeking within the song

7. **Action Buttons**: Action buttons at bottom of modal: Share, Download, Delete, Edit (rename) - each with Norwegian labels

8. **Modal Dismissible**: Modal can be dismissed by: tapping outside (backdrop), swiping down (mobile gesture), or tapping close button (X)

9. **Deep Linking Support**: Modal is accessible via direct URL `/songs/{songId}` for shareable links

10. **Playback State Preserved**: When modal closes, playback continues in background; reopening same song resumes current position

## Tasks / Subtasks

- [ ] Task 1: Create Song Detail Modal Component (AC: #1, #2, #3, #8)
  - [ ] Create `/src/components/song-detail-modal.tsx` using shadcn/ui Dialog component
  - [ ] Implement full-screen modal layout optimized for mobile (100vh on mobile, 80vh max on desktop)
  - [ ] Add large artwork display (200x200px) with gradient background from genre colors
  - [ ] Display song metadata: title, genre badge, creation date (relative Norwegian), duration
  - [ ] Implement close button (X) in top-right corner
  - [ ] Add backdrop click handler to close modal
  - [ ] Implement swipe-down gesture to close (mobile) using touch events

- [ ] Task 2: Implement Audio Player Controls (AC: #4, #5, #6)
  - [ ] Create large play/pause button (60x60px) with Playful Nordic theme colors
  - [ ] Integrate with existing audio player state from Story 3.8
  - [ ] Implement animated waveform visualization (use wavesurfer.js or CSS animation)
  - [ ] Create scrubable progress bar using shadcn/ui Progress or custom slider
  - [ ] Display time markers: current time (left) / total duration (right)
  - [ ] Handle seek functionality: clicking/dragging on progress bar updates playback position

- [ ] Task 3: Implement Action Buttons (AC: #7)
  - [ ] Add "Del" (Share) button with share icon
  - [ ] Add "Last ned" (Download) button with download icon
  - [ ] Add "Slett" (Delete) button with trash icon (destructive variant)
  - [ ] Add "Rediger" (Edit/Rename) button with edit icon
  - [ ] Style buttons in horizontal row at bottom of modal
  - [ ] Each button triggers respective action (implemented in Stories 4.3-4.5 or placeholder)

- [ ] Task 4: Implement Inline Title Editing (AC: #3)
  - [ ] Make song title clickable/tappable to enter edit mode
  - [ ] Show edit icon on hover/focus
  - [ ] Replace title with input field when editing
  - [ ] Save on Enter key or blur (click outside)
  - [ ] Cancel on Escape key, revert to original title
  - [ ] Validate: 1-100 characters, no empty titles
  - [ ] Show success toast on save: "Sangittel oppdatert"
  - [ ] API call: PATCH `/api/songs/[id]` with `{ title: string }`

- [ ] Task 5: Implement Deep Linking (AC: #9)
  - [ ] Create `/src/app/songs/[id]/page.tsx` for direct song access
  - [ ] Fetch song data on page load
  - [ ] Automatically open modal when accessing `/songs/{songId}`
  - [ ] Handle 404 case: song not found or unauthorized
  - [ ] Support browser back/forward navigation

- [ ] Task 6: Implement Playback State Preservation (AC: #10)
  - [ ] Use global audio player state (context or Zustand store)
  - [ ] When modal closes, continue playing current song
  - [ ] When reopening same song, resume at current position
  - [ ] When opening different song, stop previous and start new
  - [ ] Sync playback state between modal and mini-player (if exists)

- [ ] Task 7: Integrate with Song Library Page (AC: #1)
  - [ ] Update `/src/app/songs/songs-page-client.tsx` to use new modal
  - [ ] Pass song data to modal on card click
  - [ ] Update URL to `/songs/{songId}` when modal opens (shallow routing)
  - [ ] Restore URL to `/songs` when modal closes

- [ ] Task 8: Testing and Validation
  - [ ] Test modal opens correctly from song library
  - [ ] Test all metadata displays correctly (title, genre, date, duration)
  - [ ] Test play/pause button controls audio playback
  - [ ] Test progress bar seeking works accurately
  - [ ] Test title editing saves and displays updated title
  - [ ] Test modal dismiss methods: backdrop click, swipe down, close button
  - [ ] Test deep linking: navigate directly to `/songs/{songId}`
  - [ ] Test playback state preservation across modal open/close
  - [ ] Test responsive layout on mobile, tablet, desktop
  - [ ] Test Norwegian text displays correctly
  - [ ] Verify RLS: users can only access their own songs

## Dev Notes

### Architecture Alignment

**From `/docs/architecture.md` - Component Structure:**
- Use shadcn/ui Dialog component as base for modal
- Follow component naming: `song-detail-modal.tsx`
- Implement as Client Component (needs interactivity)
- Use Zustand for global audio playback state (ADR-003)

**From `/docs/architecture.md` - API Routes:**
- PATCH `/api/songs/[id]` for title updates
- GET `/api/songs/[id]` for fetching single song
- Follow RESTful patterns and error response format

**From `/docs/architecture.md` - State Management:**
- Use Zustand for global audio player state
- URL state for current song (deep linking)
- Local component state for modal UI

### Project Structure Notes

**Files to Create:**
- `/src/components/song-detail-modal.tsx` - Main modal component
- `/src/app/songs/[id]/page.tsx` - Deep link page for individual songs
- `/src/app/api/songs/[id]/route.ts` - GET/PATCH endpoints for single song (if not exists)
- `/src/stores/audio-player-store.ts` - Zustand store for audio state (if not exists)

**Files to Modify:**
- `/src/app/songs/songs-page-client.tsx` - Update to use new modal, add URL routing
- `/src/components/song-card.tsx` - May need updates for modal integration

**Files to Reference (from Story 4.1):**
- `/src/components/song-player-card.tsx` (Story 3.8) - Existing player component to extend/reuse
- `/src/lib/utils/date-formatter.ts` - Norwegian date formatting utilities
- `/src/types/song.ts` - Song type definitions
- `/src/components/ui/dialog.tsx` - shadcn/ui Dialog base component

### Learnings from Previous Story

**From Story 4-1-create-my-songs-page-with-track-list (Status: done)**

- **Existing Components to Reuse:**
  - `SongCard` component at `/src/components/song-card.tsx` - handles song display
  - `SongPlayerCard` from Story 3.8 - existing player with basic controls
  - `formatRelativeDate()` at `/src/lib/utils/date-formatter.ts` - Norwegian dates
  - `formatDuration()` - MM:SS duration formatting

- **API Route Pattern:**
  - `/src/app/api/songs/route.ts` exists for listing songs
  - Extend with `/src/app/api/songs/[id]/route.ts` for single song operations
  - Use RLS for authorization (auth check in API routes)

- **Modal Integration Pattern:**
  - Story 4.1 already integrates with song player modal on card click
  - Current implementation uses basic modal - extend to full-screen
  - State management: modal open/close in client component state

- **Norwegian Text Patterns:**
  - Action buttons: "Del" (Share), "Last ned" (Download), "Slett" (Delete), "Rediger" (Edit)
  - Success messages: "Sangittel oppdatert" (Song title updated)
  - Error messages: "Noe gikk galt..." pattern

- **Responsive Layout:**
  - 1 column on mobile, 2 columns on tablet/desktop for library
  - Modal should be full-screen on mobile, centered overlay on desktop

- **File Organization:**
  - Page components: `/src/app/[route]/page.tsx`
  - Components: `/src/components/[component-name].tsx`
  - API routes: `/src/app/api/[resource]/route.ts`

[Source: docs/sprint-artifacts/4-1-create-my-songs-page-with-track-list.md#Dev-Agent-Record]

### Technical Implementation Notes

**Waveform Visualization Options:**

1. **wavesurfer.js** (recommended for real waveform):
```typescript
import WaveSurfer from 'wavesurfer.js'

const wavesurfer = WaveSurfer.create({
  container: '#waveform',
  waveColor: '#E94560',
  progressColor: '#0F3460',
  cursorColor: '#FFC93C',
  barWidth: 3,
  barRadius: 3,
  responsive: true,
  height: 60,
})
```

2. **CSS Animation** (simpler, decorative):
```css
/* Animated bars that respond to audio playing state */
.waveform-bar {
  animation: wave 0.5s ease-in-out infinite;
}
```

**Progress Bar with Seeking:**

```typescript
// Using custom slider or shadcn/ui Slider
const handleSeek = (value: number[]) => {
  const seekTime = (value[0] / 100) * duration
  audioRef.current.currentTime = seekTime
}

<Slider
  value={[(currentTime / duration) * 100]}
  max={100}
  step={0.1}
  onValueChange={handleSeek}
/>
```

**Inline Title Editing:**

```typescript
const [isEditing, setIsEditing] = useState(false)
const [title, setTitle] = useState(song.title)

const handleSave = async () => {
  if (title.trim().length === 0) {
    setTitle(song.title) // Revert to original
    return
  }
  await fetch(`/api/songs/${song.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ title: title.trim() })
  })
  toast({ title: 'Sangittel oppdatert' })
  setIsEditing(false)
}
```

**Swipe Down to Close (Mobile Gesture):**

```typescript
const handleTouchStart = (e: TouchEvent) => {
  startY.current = e.touches[0].clientY
}

const handleTouchEnd = (e: TouchEvent) => {
  const endY = e.changedTouches[0].clientY
  if (endY - startY.current > 100) { // Swipe down threshold
    onClose()
  }
}
```

**Deep Linking with Next.js App Router:**

```typescript
// /src/app/songs/[id]/page.tsx
export default async function SongDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })
  const { data: song } = await supabase
    .from('song')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!song) notFound()

  return <SongDetailModal song={song} isOpen={true} />
}
```

**Audio Player State (Zustand):**

```typescript
// /src/stores/audio-player-store.ts
interface AudioPlayerStore {
  currentSong: Song | null
  isPlaying: boolean
  currentTime: number
  duration: number
  setCurrentSong: (song: Song) => void
  play: () => void
  pause: () => void
  seek: (time: number) => void
}

export const useAudioPlayerStore = create<AudioPlayerStore>((set) => ({
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  setCurrentSong: (song) => set({ currentSong: song }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  seek: (time) => set({ currentTime: time }),
}))
```

### Action Button Implementation Notes

Action buttons connect to Stories 4.3-4.5:
- **Share (Del)**: Placeholder for Story 5.1 (Social Share Sheet)
- **Download (Last ned)**: Implemented in Story 4.3
- **Delete (Slett)**: Implemented in Story 4.4
- **Edit (Rediger)**: Title editing inline (this story), full edit in Story 4.5

For now, implement title editing fully. Other buttons should show toast "Kommer snart..." (Coming soon) or navigate to respective functionality.

### Testing Strategy

**Unit Tests:**
- Title editing validation (empty, too long, special characters)
- Time formatting for progress bar
- Seek calculation from slider position

**Integration Tests:**
- API route returns correct song data
- PATCH request updates title in database
- Modal receives correct song data

**E2E Tests:**
- Open modal from song library → verify all elements display
- Edit title → verify persists after refresh
- Deep link `/songs/{id}` → verify modal opens with correct song
- Swipe down on mobile → verify modal closes
- Play/pause → verify audio playback controls work

### References

- [Epic 4 - Story 4.2](../epics/epic-4-song-library-management.md#story-42-implement-song-detail-modal-with-full-player)
- [Story 4.1 - My Songs Page](4-1-create-my-songs-page-with-track-list.md)
- [Story 3.8 - Song Player Card Component](3-8-build-song-player-card-component.md)
- [Architecture - State Management (Zustand)](../architecture.md#state-management)
- [Architecture - API Response Format](../architecture.md#api-response-format)
- [UX Design - Song Player Modal](../ux-design-specification.md)
- [shadcn/ui Dialog Component](https://ui.shadcn.com/docs/components/dialog)
- [wavesurfer.js Documentation](https://wavesurfer-js.org/)

## Change Log

**2025-11-26 - Story Created (drafted status)**
- Story drafted by create-story workflow (SM agent)
- Extracted from Epic 4: Song Library & Management
- Source: docs/epics/epic-4-song-library-management.md#story-42
- Prerequisites: Story 4.1 (done) - My Songs page created
- Depends on: Story 3.8 (Song Player Card) for existing player components
- Includes comprehensive learnings from Story 4.1 (components, API patterns, Norwegian text)
- Next step: Run story-context workflow or proceed to development

## Dev Agent Record

### Context Reference

<!-- Deferred post-MVP - see docs/future-enhancements.md -->

### Agent Model Used

<!-- To be filled by dev agent -->

### Debug Log References

<!-- To be filled by dev agent -->

### Completion Notes List

<!-- To be filled by dev agent -->

### File List

<!-- To be filled by dev agent -->
