# Genre Prompt Template Validation

**Story:** 3.10 - Add Genre Prompt Templates to Database
**Created:** 2025-11-25
**Status:** Awaiting Founder Approval

## Purpose

This document is for the founder (BIP) to review and validate the 8 Norwegian-optimized Suno prompt templates before they are used for live song generation.

## Validation Criteria

✅ **Norwegian Optimization**: Does the prompt produce authentic Norwegian-sounding vocals?
✅ **Genre Authenticity**: Does the prompt match the musical characteristics of the genre?
✅ **Cultural Appropriateness**: Are the descriptors culturally appropriate for Norwegian users?
✅ **Suno Compatibility**: Will Suno understand and execute the prompt effectively?

---

## 8 Norwegian-Optimized Genre Prompts

### 1. 🎸 Countryrock
- **Display Name:** Countryrock
- **Internal Name:** country-rock
- **Suno Prompt:** "Country, rock, anthem, twangy guitar, catchy fiddle, drum, bass, Norwegian vocals"
- **Gradient:** Red → Yellow (#E94560 → #FFC93C)
- **Description:** Upbeat country with rock energy

**Founder Review:**
- [ ] ✅ Approve as-is
- [ ] ❌ Needs changes (specify below):

**Notes:**
_[Founder feedback here]_

---

### 2. 🎤 Norsk pop
- **Display Name:** Norsk pop
- **Internal Name:** norwegian-pop
- **Suno Prompt:** "Pop, Norwegian, catchy melody, electronic, upbeat, modern production"
- **Gradient:** Navy → Red (#0F3460 → #E94560)
- **Description:** Modern Norwegian pop music

**Founder Review:**
- [ ] ✅ Approve as-is
- [ ] ❌ Needs changes (specify below):

**Notes:**
_[Founder feedback here]_

---

### 3. 🪕 Folkeballade
- **Display Name:** Folkeballade
- **Internal Name:** folk-ballad
- **Suno Prompt:** "Folk, acoustic, Norwegian traditional, heartfelt, storytelling"
- **Gradient:** Green → Yellow (#06D6A0 → #FFC93C)
- **Description:** Acoustic folk with Norwegian tradition

**Founder Review:**
- [ ] ✅ Approve as-is
- [ ] ❌ Needs changes (specify below):

**Notes:**
_[Founder feedback here]_

---

### 4. 🎉 Festlåt
- **Display Name:** Festlåt
- **Internal Name:** party-anthem
- **Suno Prompt:** "Dance, party, energetic, sing-along, festive, Norwegian celebration"
- **Gradient:** Yellow → Red (#FFC93C → #E94560)
- **Description:** Energetic party songs for celebrations

**Founder Review:**
- [ ] ✅ Approve as-is
- [ ] ❌ Needs changes (specify below):

**Notes:**
_[Founder feedback here]_

---

### 5. 🎤 Rap/Hip-Hop
- **Display Name:** Rap/Hip-Hop
- **Internal Name:** rap-hiphop
- **Suno Prompt:** "Hip-hop, rap, Norwegian flow, urban, rhythmic, modern beats"
- **Gradient:** Navy → Purple (#0F3460 → #8B5CF6)
- **Description:** Norwegian rap with urban rhythmic flow

**Founder Review:**
- [ ] ✅ Approve as-is
- [ ] ❌ Needs changes (specify below):

**Notes:**
_[Founder feedback here]_

---

### 6. 🎸 Rockballade
- **Display Name:** Rockballade
- **Internal Name:** rock-ballad
- **Suno Prompt:** "Rock, ballad, emotional, guitar solo, powerful vocals, Norwegian"
- **Gradient:** Purple → Red (#8B5CF6 → #E94560)
- **Description:** Emotional rock with powerful vocals

**Founder Review:**
- [ ] ✅ Approve as-is
- [ ] ❌ Needs changes (specify below):

**Notes:**
_[Founder feedback here]_

---

### 7. 💃 Dans/Elektronisk
- **Display Name:** Dans/Elektronisk
- **Internal Name:** electronic-dance
- **Suno Prompt:** "Electronic, dance, EDM, synth, energetic, club, Norwegian vocals"
- **Gradient:** Green → Blue (#06D6A0 → #3B82F6)
- **Description:** High-energy electronic dance music

**Founder Review:**
- [ ] ✅ Approve as-is
- [ ] ❌ Needs changes (specify below):

**Notes:**
_[Founder feedback here]_

---

### 8. 🎹 Singer-Songwriter
- **Display Name:** Singer-Songwriter
- **Internal Name:** singer-songwriter
- **Suno Prompt:** "Acoustic, intimate, storytelling, piano, guitar, heartfelt, Norwegian"
- **Gradient:** Orange → Brown (#FB923C → #92400E)
- **Description:** Intimate acoustic storytelling

**Founder Review:**
- [ ] ✅ Approve as-is
- [ ] ❌ Needs changes (specify below):

**Notes:**
_[Founder feedback here]_

---

## Overall Assessment

**Total Genres:** 8
**Approved:** ___/8
**Needs Changes:** ___/8

### Final Founder Sign-Off

- [ ] ✅ **APPROVED**: All genre prompts are ready for production use
- [ ] ⚠️ **APPROVED WITH CHANGES**: Some prompts need minor adjustments (documented above)
- [ ] ❌ **NOT APPROVED**: Major revisions needed

**Founder Signature:** _________________
**Date:** _________________

---

## Next Steps After Validation

Once the founder approves these prompts:

1. ✅ Apply the migration to Supabase database
2. ✅ Run the update script to populate genres
3. ✅ Test each genre with Suno API (Task 5)
4. ✅ Verify genre carousel displays correctly (Task 6)

## Additional Notes

**Key Decisions Made:**

- **"Norwegian vocals" / "Norwegian flow" / "Norwegian" added** to most prompts to ensure authentic pronunciation
- **Norwegian display names** used where culturally appropriate (Countryrock, Norsk pop, Folkeballade, Festlåt, Rockballade, Dans/Elektronisk)
- **English display names** retained for international genres (Rap/Hip-Hop, Singer-Songwriter)
- **Playful Nordic color gradients** applied to match the UX design theme
- **8 genres total** to meet the "8-10 genres" acceptance criteria while maintaining quality focus

**Removed from original seed data:**
- Indie Pop (not distinctive enough for Norwegian optimization)
- Blues Rock (less relevant to Norwegian music culture)

These removals streamline the genre selection to focus on the most relevant and culturally appropriate options for Norwegian party song creation.

---

**For questions or feedback, contact the dev team or use this document to track approval status.**
