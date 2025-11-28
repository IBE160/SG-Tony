# Story 3.11: Implement Early Audio Playback with FIRST_SUCCESS Status

Status: ready-for-dev

## Story

As a **user generating a song**,
I want **to start listening to my song as soon as the first track is ready** (FIRST_SUCCESS status),
so that **I don't have to wait for full generation completion before hearing my creation**.

## Background Research

### Suno API Status Flow
| Status | Meaning |
|--------|---------|
| `PENDING` | Processing/generating |
| `TEXT_SUCCESS` | Lyrics generated |
| `FIRST_SUCCESS` | **First track ready** - partial audio available |
| `SUCCESS` | All tracks complete |

### Available Response Fields
```typescript
sunoData: [{
  id: string
  audioUrl: string        // Final audio URL
  streamAudioUrl: string  // Streaming audio URL (available earlier)
  sourceAudioUrl: string  // Source audio URL
  imageUrl: string
  duration: number
  // ...
}]
```

### Key Insight
When status = `FIRST_SUCCESS`:
- The first generated track is ready
- `streamAudioUrl` should be available for immediate playback
- User can start listening ~20-40 seconds earlier than waiting for `SUCCESS`

## Acceptance Criteria

1. **AC1**: When polling returns `FIRST_SUCCESS` status, extract `streamAudioUrl` from response
2. **AC2**: Update song status in database to `partial` (new status) with `streamAudioUrl`
3. **AC3**: Frontend polling detects `partial` status and enables audio playback immediately
4. **AC4**: Progress UI shows "Ready to play!" state while generation continues
5. **AC5**: When `SUCCESS` status arrives, update to final `audioUrl` and `completed` status
6. **AC6**: If user is already playing `streamAudioUrl`, seamlessly continue (no interruption)
7. **AC7**: Handle case where `FIRST_SUCCESS` audio differs from final `SUCCESS` audio gracefully

## Tasks / Subtasks

- [ ] **Task 1: Update Suno API types** (AC: 1)
  - [ ] Verify `streamAudioUrl` field is captured in `SunoTaskStatusResponse`
  - [ ] Add `FIRST_SUCCESS` to status union type if not present

- [ ] **Task 2: Update song table schema** (AC: 2)
  - [ ] Add `stream_audio_url` column to `song` table (nullable)
  - [ ] Add `partial` to status enum (generating → partial → completed)
  - [ ] Create migration file

- [ ] **Task 3: Update polling fallback in `/api/songs/[id]`** (AC: 1, 2)
  - [ ] Handle `FIRST_SUCCESS` status in addition to `SUCCESS`
  - [ ] When `FIRST_SUCCESS`: save `streamAudioUrl` to `stream_audio_url`, set status to `partial`
  - [ ] When `SUCCESS`: save final `audioUrl`, download to storage, set status to `completed`

- [ ] **Task 4: Update webhook handler** (AC: 1, 2)
  - [ ] Handle `FIRST_SUCCESS` callback if Suno sends intermediate callbacks
  - [ ] Maintain idempotency (don't overwrite `completed` with `partial`)

- [ ] **Task 5: Update frontend polling logic** (AC: 3, 4)
  - [ ] In `homepage-songs.tsx`: detect `partial` status
  - [ ] Enable playback when `partial` with `streamAudioUrl` available
  - [ ] Continue polling until `completed`
  - [ ] Update progress UI to show "Ready to play!" state

- [ ] **Task 6: Update SongCard component** (AC: 3, 4)
  - [ ] Add visual state for `partial` (playable but still generating)
  - [ ] Show play button when audio available
  - [ ] Show subtle "finalizing..." indicator

- [ ] **Task 7: Handle audio URL transition** (AC: 5, 6, 7)
  - [ ] If user started playing `streamAudioUrl` and `SUCCESS` arrives:
    - Option A: Let current playback continue until song ends
    - Option B: Seamlessly switch to final URL at current position
  - [ ] Decide on approach and implement

- [ ] **Task 8: Testing** (AC: all)
  - [ ] Test `FIRST_SUCCESS` → `SUCCESS` flow
  - [ ] Test playback during partial state
  - [ ] Test error handling if `FIRST_SUCCESS` arrives but no `streamAudioUrl`
  - [ ] Test concurrent polling with playback

## Dev Notes

### Current Implementation Gap
The current polling in `/api/songs/[id]/route.ts` only checks for:
- `SUCCESS` → mark completed
- `CREATE_TASK_FAILED`, `GENERATE_AUDIO_FAILED`, etc. → mark failed

It does NOT handle `FIRST_SUCCESS` which could provide audio 20-40 seconds earlier.

### Architecture Decision Needed
**Question**: Should we download `streamAudioUrl` to Supabase Storage like we do with final `audioUrl`?

Options:
1. **Use directly**: Just store Suno's `streamAudioUrl` in DB, don't download
   - Pro: Faster, no storage cost
   - Con: URL may expire, depends on Suno availability

2. **Download and store**: Download to storage like final audio
   - Pro: Consistent, reliable
   - Con: Extra storage, extra latency, may be replaced soon anyway

**Recommendation**: Use Suno's `streamAudioUrl` directly for `partial` status (don't download), only download final `audioUrl` on `SUCCESS`.

### Testing Strategy
- Mock Suno API responses with different status sequences
- Test UI transitions between states
- Verify no audio glitches when transitioning

### References

- [Source: Suno API Get Music Generation Details](https://docs.sunoapi.org/suno-api/get-music-generation-details)
- [Source: src/lib/api/suno.ts] - Current Suno API wrapper with types
- [Source: src/app/api/songs/[id]/route.ts] - Polling fallback implementation
- [Source: src/app/api/webhooks/suno/route.ts] - Webhook handler
- [Source: src/components/homepage-songs.tsx] - Frontend polling logic

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/stories/3-11-implement-early-audio-playback-with-first-success.context.xml`

### Agent Model Used

Claude Opus 4.5

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-11-28 | Story drafted based on Suno API research | Amelia (Dev Agent) |
