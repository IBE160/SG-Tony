# Genre Prompt Testing Guide for Suno API

**Story:** 3.10 - Add Genre Prompt Templates to Database
**Created:** 2025-11-25
**Purpose:** Test each Norwegian-optimized genre prompt with Suno API to verify effectiveness

## Testing Objectives

1. ✅ **Verify Suno accepts all prompt templates** (no syntax errors or rejections)
2. ✅ **Assess audio quality** for each genre (clear vocals, appropriate instrumentation)
3. ✅ **Validate Norwegian pronunciation** (authentic Norwegian sound, not American)
4. ✅ **Confirm genre authenticity** (output matches genre expectations)
5. ✅ **Document any needed refinements** to prompt templates

---

## Testing Prerequisites

Before running tests, ensure:

- [ ] Migration applied: `20251125_add_genre_gradient_colors.sql`
- [ ] Update script run: `node scripts/update-genres-with-gradients.js`
- [ ] Suno API configured: `SUNO_API_KEY` set in `.env.local`
- [ ] Genre carousel displays 8 Norwegian-optimized genres
- [ ] Founder has reviewed and approved prompts (see GENRE-PROMPT-VALIDATION.md)

---

## Test Plan: 8 Genre Prompts

### Test Song Parameters

For each genre, generate a test song with these parameters:

- **Lyrics:** "La oss synge en sang om Norge / Med glede og musikk / Dette er vår norske drøm / Sammen deler vi denne tid"
  - (Translation: "Let's sing a song about Norway / With joy and music / This is our Norwegian dream / Together we share this time")
- **Mode:** Full song (not preview)
- **Credits:** Use test credits or development account
- **Phonetic optimization:** ON (default)

---

### Test Case Template

For each genre, use this template to document results:

```markdown
## Test: [Genre Name]

**Suno Prompt:** [prompt template from database]
**Test Date:** [date]
**Song ID:** [Suno song ID]
**Audio URL:** [link to generated audio]

### Results

**✅ / ❌ Suno Acceptance:**
- [ ] Prompt accepted without errors
- Notes: _[any warnings or issues]_

**✅ / ❌ Audio Quality:**
- [ ] Clear vocals (no distortion or artifacts)
- [ ] Appropriate instrumentation for genre
- [ ] Professional production quality
- Notes: _[quality observations]_

**✅ / ❌ Norwegian Pronunciation:**
- [ ] Sounds authentically Norwegian
- [ ] No American/English accent detected
- [ ] Phonetic optimization effective
- Notes: _[pronunciation observations]_

**✅ / ❌ Genre Authenticity:**
- [ ] Matches genre musical characteristics
- [ ] Emotional tone appropriate for genre
- [ ] Tempo and rhythm fit genre expectations
- Notes: _[genre fit observations]_

### Refinements Needed

- [ ] No changes needed
- [ ] Minor prompt adjustments: _[specify]_
- [ ] Major prompt rewrite: _[specify]_

### Founder Review

- [ ] Approved for production use
- [ ] Needs revision
```

---

## 8 Test Cases

### 1. 🎸 Countryrock

**Suno Prompt:** "Country, rock, anthem, twangy guitar, catchy fiddle, drum, bass, Norwegian vocals"
**Expected Output:** Upbeat country rock with prominent guitar, fiddle, and energetic Norwegian vocals

_[Document test results using template above]_

---

### 2. 🎤 Norsk pop

**Suno Prompt:** "Pop, Norwegian, catchy melody, electronic, upbeat, modern production"
**Expected Output:** Modern pop with catchy hooks, electronic elements, upbeat tempo

_[Document test results using template above]_

---

### 3. 🪕 Folkeballade

**Suno Prompt:** "Folk, acoustic, Norwegian traditional, heartfelt, storytelling"
**Expected Output:** Acoustic folk with traditional elements, heartfelt vocals, storytelling vibe

_[Document test results using template above]_

---

### 4. 🎉 Festlåt

**Suno Prompt:** "Dance, party, energetic, sing-along, festive, Norwegian celebration"
**Expected Output:** High-energy party song with sing-along quality, festive atmosphere

_[Document test results using template above]_

---

### 5. 🎤 Rap/Hip-Hop

**Suno Prompt:** "Hip-hop, rap, Norwegian flow, urban, rhythmic, modern beats"
**Expected Output:** Hip-hop with Norwegian rap flow, urban beats, rhythmic delivery

_[Document test results using template above]_

---

### 6. 🎸 Rockballade

**Suno Prompt:** "Rock, ballad, emotional, guitar solo, powerful vocals, Norwegian"
**Expected Output:** Emotional rock ballad with guitar solos, powerful Norwegian vocals

_[Document test results using template above]_

---

### 7. 💃 Dans/Elektronisk

**Suno Prompt:** "Electronic, dance, EDM, synth, energetic, club, Norwegian vocals"
**Expected Output:** Electronic dance music with synth, club energy, Norwegian vocals

_[Document test results using template above]_

---

### 8. 🎹 Singer-Songwriter

**Suno Prompt:** "Acoustic, intimate, storytelling, piano, guitar, heartfelt, Norwegian"
**Expected Output:** Intimate acoustic performance with piano/guitar, heartfelt Norwegian vocals

_[Document test results using template above]_

---

## Testing Workflow

### Step 1: Generate Test Songs

For each genre:

1. Select genre in the genre carousel
2. Enter test lyrics (Norwegian text above)
3. Enable "Uttalelse Bokmål" (phonetic optimization)
4. Click "Generate Song with AI"
5. Wait for generation (~2-3 minutes)
6. Record Song ID and audio URL

### Step 2: Evaluate Each Song

Listen to each generated song and assess:

- **Suno Acceptance:** Did it generate without errors?
- **Audio Quality:** Professional sound quality?
- **Norwegian Pronunciation:** Authentic Norwegian accent?
- **Genre Authenticity:** Matches genre characteristics?

### Step 3: Document Results

Fill in the test case template for each genre with:

- Results checklist (✅ or ❌)
- Detailed observations in notes sections
- Any refinements needed

### Step 4: Refine Prompts if Needed

If tests reveal issues:

1. Update the prompt template in the database
2. Re-run the test for that genre
3. Document changes in the test case notes
4. Get founder approval for revised prompt

### Step 5: Final Approval

Once all 8 genres pass testing:

- [ ] Mark Story 3.10 as complete
- [ ] Update sprint status: `ready-for-dev` → `in-progress` → `review` → `done`
- [ ] Confirm genre carousel displays all genres correctly
- [ ] Notify founder that genres are production-ready

---

## Testing Success Criteria

**All 8 genres must meet these criteria to pass:**

✅ **100% Suno Acceptance Rate** - All prompts generate songs without errors
✅ **8/8 Audio Quality Pass** - All songs have professional production quality
✅ **8/8 Norwegian Pronunciation Pass** - All songs sound authentically Norwegian
✅ **8/8 Genre Authenticity Pass** - All songs match their genre characteristics

**If any genre fails:**
- Refine the prompt template
- Re-test until passing
- Get founder approval for changes

---

## Known Considerations

**Norwegian Pronunciation:**
- Key test: Does "Norge" sound like "NOR-geh" (Norwegian) or "NOR-jay" (American)?
- Phonetic optimization should make it sound clearly Norwegian

**Genre Consistency:**
- Each genre should have distinct musical characteristics
- No two genres should sound too similar
- Variety is important for user experience

**Cultural Appropriateness:**
- Songs should feel appropriate for Norwegian party/celebration context
- Language should be natural Norwegian Bokmål
- No cultural mismatches or inappropriate references

---

## Post-Testing Actions

After all tests complete successfully:

1. **Update Story File:** Document test results in `3-10-add-genre-prompt-templates-to-database.md`
2. **Mark Tasks Complete:**
   - [x] Task 1: Create database seed script
   - [x] Task 2: Define genre data structure
   - [x] Task 3: Create seed execution script
   - [x] Task 4: Validate prompt templates with founder
   - [x] Task 5: Test genre prompts with Suno API
   - [x] Task 6: Update genre UI components
3. **Update Story Status:** Mark as `review` in sprint-status.yaml
4. **Run Code Review:** Execute code-review workflow if needed

---

**For questions or issues during testing, contact the dev team or refer to the Suno API documentation at https://docs.sunoapi.org**
