# How to Edit Genre Prompts (After Migration)

**Story:** 3.10 - Add Genre Prompt Templates to Database
**Last Updated:** 2025-11-25

## Quick Reference

After you've applied the initial migration, you can edit genre prompt templates using three methods:

| Method | Best For | Difficulty | Version Controlled |
|--------|----------|------------|-------------------|
| **Supabase Table Editor** | Quick single edits | ⭐ Easy | ❌ No |
| **SQL UPDATE statements** | Bulk updates, precise control | ⭐⭐ Medium | ❌ No |
| **Update Script** | Multiple genres, repeatable changes | ⭐⭐⭐ Advanced | ✅ Yes |

---

## Method 1: Supabase Table Editor (Recommended for Quick Edits)

**When to use:** Tweaking one or two genre prompts quickly

### Steps:

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: Musikkfabrikken

2. **Navigate to Genre Table**
   - Click "Table Editor" in left sidebar
   - Select "genre" table

3. **Find the Genre to Edit**
   - Scroll or use search to find the genre (e.g., "country-rock")
   - Click on the row to open the editor

4. **Edit the Prompt Template**
   - Find the `suno_prompt_template` field
   - Click to edit
   - Modify the text (e.g., add "energetic tempo" or "powerful chorus")
   - Click "Save" or press Enter

5. **Verify the Change**
   - Refresh the table to confirm the update
   - Optional: Generate a test song to verify it works with Suno

### Example Edit:

**Before:**
```
Country, rock, anthem, twangy guitar, catchy fiddle, drum, bass, Norwegian vocals
```

**After (with your improvements):**
```
Country, rock, anthem, twangy guitar, catchy fiddle, drum, bass, Norwegian vocals, upbeat tempo, sing-along chorus, energetic performance
```

---

## Method 2: SQL UPDATE Statements (For Bulk or Precise Updates)

**When to use:** Updating multiple genres at once, or when you want SQL precision

### Steps:

1. **Open Supabase SQL Editor**
   - Go to Supabase Dashboard → SQL Editor
   - Click "New Query"

2. **Write UPDATE Statement**

**Template:**
```sql
UPDATE genre
SET suno_prompt_template = 'Your new optimized prompt here'
WHERE name = 'genre-internal-name';
```

**Example - Update Countryrock:**
```sql
UPDATE genre
SET suno_prompt_template = 'Country, rock, anthem, twangy guitar, catchy fiddle, drum, bass, Norwegian vocals, upbeat tempo, stadium energy'
WHERE name = 'country-rock';
```

**Example - Update Multiple Genres:**
```sql
-- Update Countryrock
UPDATE genre
SET suno_prompt_template = 'Country, rock, anthem, twangy guitar, catchy fiddle, drum, bass, Norwegian vocals, upbeat tempo, stadium energy'
WHERE name = 'country-rock';

-- Update Norsk pop
UPDATE genre
SET suno_prompt_template = 'Pop, Norwegian, catchy melody, electronic, upbeat, modern production, radio-friendly, polished vocals'
WHERE name = 'norwegian-pop';

-- Update Festlåt
UPDATE genre
SET suno_prompt_template = 'Dance, party, energetic, sing-along, festive, Norwegian celebration, uplifting, crowd chant, festival anthem'
WHERE name = 'party-anthem';
```

3. **Run the Query**
   - Click "Run" button
   - Check for success message
   - Verify "X rows affected"

4. **Verify Changes**
   - Go to Table Editor → genre table
   - Check that prompts were updated correctly

---

## Method 3: Update Script (For Version-Controlled Changes)

**When to use:** Want to track changes in Git, update multiple genres systematically

### Steps:

1. **Open the Update Script**
   - File: `scripts/update-genres-with-gradients.js`
   - Find the `genreUpdates` array (around line 26)

2. **Edit the Prompt Templates**

**Example:**
```javascript
const genreUpdates = [
  {
    name: 'country-rock',
    display_name: 'Countryrock',
    description: 'Upbeat country with rock energy',
    emoji: '🎸',
    suno_prompt_template: 'Country, rock, anthem, twangy guitar, catchy fiddle, drum, bass, Norwegian vocals, upbeat tempo, stadium energy',  // ← Edit this!
    gradient_colors: { from: '#E94560', to: '#FFC93C' },
    sort_order: 1,
    is_active: true
  },
  // ... other genres
]
```

3. **Run the Script**
```bash
node scripts/update-genres-with-gradients.js
```

4. **Review Output**
   - Script will show which genres were updated
   - Displays the final active genres with prompts

5. **Commit Changes (Optional)**
```bash
git add scripts/update-genres-with-gradients.js
git commit -m "Update genre prompts based on Suno testing"
```

---

## Best Practices

### ✅ Do's

- **Test after editing:** Generate a test song with the new prompt to verify it works
- **Be specific:** Suno responds well to concrete descriptors ("twangy guitar" vs "guitar")
- **Include Norwegian markers:** Keep "Norwegian vocals" or "Norwegian flow" in prompts for authentic pronunciation
- **Keep it concise:** 10-15 keywords is ideal, avoid essays
- **Use commas:** Separate keywords with commas for Suno parsing

### ❌ Don'ts

- **Don't remove "Norwegian" keywords:** This is critical for authentic vocals
- **Don't make prompts too long:** Suno may ignore later keywords
- **Don't use contradictory terms:** "slow, fast" will confuse the AI
- **Don't forget to save:** Always verify your changes were applied

---

## Common Edits You Might Want

### Adding Energy/Tempo Descriptors
```
Before: "Country, rock, anthem, twangy guitar, Norwegian vocals"
After:  "Country, rock, anthem, twangy guitar, Norwegian vocals, upbeat tempo, driving rhythm"
```

### Emphasizing Vocal Style
```
Before: "Folk, acoustic, Norwegian traditional, storytelling"
After:  "Folk, acoustic, Norwegian traditional, storytelling, intimate vocals, heartfelt delivery"
```

### Adding Production Elements
```
Before: "Pop, Norwegian, catchy melody, electronic, upbeat"
After:  "Pop, Norwegian, catchy melody, electronic, upbeat, polished production, radio-friendly, modern mix"
```

### Adding Emotional Tone
```
Before: "Rock, ballad, emotional, guitar solo, powerful vocals, Norwegian"
After:  "Rock, ballad, emotional, guitar solo, powerful vocals, Norwegian, melancholic, anthemic chorus, dramatic build"
```

---

## Verification Checklist

After editing prompts, verify:

- [ ] Prompt saved correctly in database (check Table Editor)
- [ ] "Norwegian vocals" or equivalent still present in prompt
- [ ] Prompt is concise (ideally <20 keywords)
- [ ] No contradictory descriptors (e.g., "fast, slow")
- [ ] Test song generated successfully with new prompt (optional but recommended)
- [ ] Test song sounds like the intended genre
- [ ] Norwegian pronunciation is still authentic in test song

---

## Troubleshooting

### Problem: Changes don't appear in UI

**Solution:**
1. Hard refresh your browser (Ctrl+Shift+R / Cmd+Shift+R)
2. Check dev server is running: `npm run dev`
3. Verify changes in Supabase Table Editor
4. Check browser console for errors

### Problem: Suno rejects the prompt

**Solution:**
1. Make prompt more concise (remove 5+ keywords)
2. Remove unusual special characters
3. Check for typos in music terminology
4. Test with a simpler version first

### Problem: Songs don't sound Norwegian anymore

**Solution:**
1. Re-add "Norwegian vocals" or "Norwegian flow" to prompt
2. Check phonetic optimization is enabled in UI
3. Test with known-working prompt to isolate issue

---

## Quick Edit Examples

### Countryrock - More Stadium Energy
```sql
UPDATE genre SET suno_prompt_template = 'Country, rock, anthem, twangy guitar, catchy fiddle, drum, bass, Norwegian vocals, stadium energy, sing-along chorus, upbeat tempo' WHERE name = 'country-rock';
```

### Festlåt - More Party Vibes
```sql
UPDATE genre SET suno_prompt_template = 'Dance, party, energetic, sing-along, festive, Norwegian celebration, uplifting, crowd chant, festival anthem, hands-in-the-air energy' WHERE name = 'party-anthem';
```

### Rockballade - More Emotional
```sql
UPDATE genre SET suno_prompt_template = 'Rock, ballad, emotional, guitar solo, powerful vocals, Norwegian, melancholic, anthemic chorus, dramatic build, heartfelt delivery' WHERE name = 'rock-ballad';
```

---

## Need Help?

- **Testing prompts:** See `GENRE-SUNO-TESTING-GUIDE.md`
- **Understanding genres:** See `GENRE-PROMPT-VALIDATION.md`
- **Technical issues:** Check story file `3-10-add-genre-prompt-templates-to-database.md`

---

**Remember:** Your 80k listener expertise is invaluable! Trust your instincts on what makes a great Suno prompt. The templates provided are a starting point - refine them based on what works best. 🎵
