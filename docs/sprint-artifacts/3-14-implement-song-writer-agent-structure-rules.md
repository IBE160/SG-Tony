# Story 3.14: Implement Song Writer Agent Structure Rules

Status: review

## Story

As a **user creating Norwegian songs**,
I want **AI-generated lyrics to follow proper song structure with Suno formatting**,
So that **the generated songs have professional structure, flow naturally, and produce better results in Suno**.

## Acceptance Criteria

1. **AC #1**: Song structure randomly alternates between:
   - Structure A: Verse → Chorus → Verse → Chorus
   - Structure B: Verse → Chorus → Verse → Chorus → Bridge → Chorus

2. **AC #2**: User can override structure via prompt (e.g., "lag en sang med intro" or "uten bridge")

3. **AC #3**: All lyrics include Suno formatting tags: `[Verse 1]`, `[Chorus]`, `[Bridge]`, `[Outro]`, etc.

4. **AC #4**: Lyrics written exclusively in Norwegian Bokmål - NO English words

5. **AC #5**: Tone adapts to prompt "vibe":
   - Humorous prompts → playful, teasing lyrics
   - Emotional prompts → respectful, sincere lyrics
   - Party prompts → energetic, fun lyrics
   - Romantic prompts → heartfelt, genuine lyrics

6. **AC #6**: Lyrics balance three elements:
   - Rhyme (not forced, natural flow)
   - Story (coherent narrative that makes sense)
   - Catchiness (memorable phrases, singable lines)

7. **AC #7**: Humor style adapts to context:
   - Subtle irony / wordplay (tørr humor)
   - Absurd / silly (tullete)
   - Self-deprecating / relatable (hverdagslig)

8. **AC #8**: Line/verse length is flexible - prioritize story quality over rigid constraints

## Tasks / Subtasks

- [x] Task 1: Create song writer system prompt (AC: #1-#8)
  - [x] 1.1 Create `src/lib/prompts/song-writer-system-prompt.ts` with full prompt specification
  - [x] 1.2 Define structure randomization logic (A vs B)
  - [x] 1.3 Document Suno tag formatting rules
  - [x] 1.4 Define vibe detection guidelines
  - [x] 1.5 Document humor style adaptation rules

- [x] Task 2: Update lyric generation API (AC: #1, #2, #3)
  - [x] 2.1 Update `/api/lyrics/generate/route.ts` to use new system prompt
  - [x] 2.2 Implement structure override detection from user prompt
  - [x] 2.3 Ensure Suno tags are always included in output

- [x] Task 3: Testing and validation (AC: #4-#8)
  - [x] 3.1 Test with humorous prompts (birthday, teasing)
  - [x] 3.2 Test with emotional prompts (loss, memories)
  - [x] 3.3 Test with party prompts (russ, celebration)
  - [x] 3.4 Test with romantic prompts (love, anniversary)
  - [x] 3.5 Verify no English words in output
  - [x] 3.6 Verify Suno tags present in all outputs

## Dev Notes

### Song Writer Agent Specification

This defines how the GPT-4 lyric generation agent should write Norwegian songs.

### Song Structure Rules

**Default Structures (Random Selection):**

| Structure | Format | Usage |
|-----------|--------|-------|
| A (50%) | Verse 1 → Chorus → Verse 2 → Chorus | Shorter, punchier songs |
| B (50%) | Verse 1 → Chorus → Verse 2 → Chorus → Bridge → Chorus | Fuller, more dynamic songs |

**User Override Keywords:**
- "med intro" → Add `[Intro]`
- "med outro" → Add `[Outro]`
- "uten bridge" → Use Structure A
- "med bridge" → Use Structure B
- "kort sang" → Structure A, fewer lines
- "lang sang" → Structure B, more verses

### Suno Tag Format

Always include these tags in output:

```
[Verse 1]
First verse lyrics here
Multiple lines as needed

[Chorus]
Catchy repeated section
Memorable hook

[Verse 2]
Second verse continues story
Builds on first verse

[Bridge]
Contrast section
Different perspective or twist

[Outro]
Optional closing
Fade out or final statement
```

### Vibe Detection Guidelines

The AI should infer tone from context, not keyword matching:

| Prompt Example | Detected Vibe | Resulting Style |
|----------------|---------------|-----------------|
| "Bursdagssang til Per som alltid kommer for sent" | Humorous, teasing | Playful jokes about lateness, friendly roasting |
| "Sang om å miste bestemor" | Emotional, respectful | Warm memories, gratitude, gentle sadness |
| "Fest-sang for russefeiringen" | Party, energetic | High energy, fun, celebratory, possibly silly |
| "Kjærlighetssang til kona mi" | Romantic, sincere | Heartfelt, genuine emotion, specific details |
| "Sang om jobben min som er kjedelig" | Self-deprecating | Relatable humor, ironic observations |

### Humor Style Adaptation

| Style | When to Use | Example |
|-------|-------------|---------|
| Tørr humor (dry/ironic) | Subtle teasing, workplace, everyday situations | "Han kommer alltid presis... til neste dag" |
| Tullete (absurd/silly) | Party songs, children's songs, pure fun | "Danser med en elg i badekaret" |
| Hverdagslig (relatable) | Personal stories, self-deprecating | "Glemte lua igjen, for femte gang i dag" |

### Language Rules

**MANDATORY: Bokmål Only**
- NO English words or phrases
- NO "yeah", "baby", "love", "oh my" etc.
- Use Norwegian equivalents: "ja", "kjære", "kjærlighet", "å nei"

**Word Choice:**
- Natural, spoken Norwegian
- Avoid overly formal language
- Match vocabulary to song vibe (party = casual, romantic = warmer)

### Balance Triangle

Every song must balance three elements:

```
        RHYME
         /\
        /  \
       /    \
      /______\
   STORY    CATCHY
```

**Priority Order:**
1. **Story** - Must make sense, have coherent narrative
2. **Catchy** - Memorable chorus, singable phrases
3. **Rhyme** - Natural rhymes, never forced

**Anti-patterns to Avoid:**
- Forcing bad rhymes that break the story
- Nonsense lyrics just to rhyme
- Repetitive filler words
- Generic phrases with no meaning

### System Prompt Template

```typescript
export const SONG_WRITER_SYSTEM_PROMPT = `
Du er en norsk låtskriver som lager sangtekster på Bokmål for AI-musikk (Suno).

## STRUKTUR
Velg tilfeldig mellom:
- Struktur A: [Verse 1] → [Chorus] → [Verse 2] → [Chorus]
- Struktur B: [Verse 1] → [Chorus] → [Verse 2] → [Chorus] → [Bridge] → [Chorus]

Brukeren kan overstyre med spesifikke ønsker (f.eks. "med intro", "uten bridge").

## FORMATTERING
Bruk ALLTID Suno-tags:
[Verse 1], [Verse 2], [Chorus], [Bridge], [Intro], [Outro]

## SPRÅK
- KUN Bokmål - INGEN engelske ord
- Naturlig, muntlig norsk
- Tilpass ordvalg til sangens stemning

## STEMNING
Les brukerens prompt og føl stemningen:
- Humoristisk → Lekent, vennlig erting
- Emosjonell → Respektfullt, oppriktig
- Fest → Energisk, gøy
- Romantisk → Hjertelig, ekte

## HUMOR (når passende)
Tilpass humoren til konteksten:
- Tørr humor / ironi for subtile situasjoner
- Tullete / absurd for fest og moro
- Hverdagslig / relaterbar for personlige historier

## BALANSE
Prioriter i denne rekkefølgen:
1. HISTORIE - Teksten må gi mening og fortelle noe
2. FENGENDE - Refrenget må være minneverdig
3. RIM - Naturlige rim, aldri tvungne

## UNNGÅ
- Engelske ord (ingen "yeah", "baby", "love")
- Tvungne rim som ødelegger historien
- Generiske fraser uten mening
- Repetitivt fyll
`
```

### Project Structure Notes

- New file: `src/lib/prompts/song-writer-system-prompt.ts`
- Modified: `/api/lyrics/generate/route.ts`
- Alignment with existing prompt patterns in codebase

### References

- [Source: docs/architecture.md#ADR-006] - GPT-4 for lyric generation
- [Source: src/app/api/lyrics/generate] - Current lyrics API (to be updated)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/stories/3-14-implement-song-writer-agent-structure-rules.context.xml

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Implemented comprehensive song writer system prompt with structure randomization, Suno formatting, vibe detection, and humor adaptation
- Updated lyrics API to use new prompt system with structure override detection

### Completion Notes List

- Created `src/lib/prompts/song-writer-system-prompt.ts` with comprehensive Norwegian song writing prompt
- Implemented `getRandomStructure()` for 50/50 A/B structure selection
- Implemented `detectStructureOverrides()` for user keyword detection (med bridge, uten bridge, med intro, med outro, etc.)
- Updated `/api/lyrics/generate/route.ts` to use new system prompt and structure logic
- Increased max_tokens from 200 to 1000 to accommodate full song output
- All API tests verified: humorous, emotional, party, romantic prompts all produce correct Norwegian Bokmål lyrics with Suno tags
- Structure overrides working correctly: "kort sang uten bridge" produces Structure A, "med intro og outro" adds appropriate sections

### File List

**New Files:**
- `src/lib/prompts/song-writer-system-prompt.ts` - Comprehensive song writer system prompt with structure logic

**Modified Files:**
- `src/app/api/lyrics/generate/route.ts` - Updated to use new prompt system

**Test Files:**
- `scripts/test-song-writer-prompt.js` - Test script for prompt logic validation

