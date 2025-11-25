# How to Apply Genre Migrations

This guide explains how to apply the genre migrations and seed data for **Story 3.10: Add Genre Prompt Templates to Database**.

## Prerequisites

- Access to your Supabase project dashboard
- Supabase project URL and service role key configured in `.env.local`

## Step-by-Step Instructions

### Step 1: Apply the Migration (Add gradient_colors Column)

1. **Open Supabase SQL Editor:**
   - Go to https://supabase.com/dashboard
   - Select your project (Musikkfabrikken)
   - Navigate to SQL Editor → New Query

2. **Copy and paste the migration SQL:**
   - Open the file: `supabase/migrations/20251125_add_genre_gradient_colors.sql`
   - Copy the entire contents
   - Paste into the Supabase SQL Editor

3. **Run the migration:**
   - Click "Run" button in SQL Editor
   - Verify success message appears
   - Check that no errors occurred

### Step 2: Update Genres with Norwegian-Optimized Data

After the migration is applied, run the Node.js update script:

```bash
node scripts/update-genres-with-gradients.js
```

**What this script does:**
- ✅ Validates that the `gradient_colors` column exists
- ✅ Updates all 8 Norwegian-optimized genres with:
  - Norwegian display names (Countryrock, Norsk pop, Folkeballade, etc.)
  - Optimized Suno prompt templates ("Norwegian vocals", "Norwegian flow", etc.)
  - Playful Nordic gradient color schemes
- ✅ Deactivates non-Norwegian-optimized genres (indie-pop, blues-rock)
- ✅ Provides detailed output showing all changes

**Expected output:**
```
🎨 Updating genres with Norwegian-optimized prompts and gradient colors...

📋 Checking database schema...
✅ Database schema is up to date

🔄 Processing: 🎸 Countryrock
   ✅ Updated
🔄 Processing: 🎤 Norsk pop
   ✅ Updated
...

📋 Active Norwegian-optimized genres:
  1. 🎸 Countryrock
     Prompt: "Country, rock, anthem, twangy guitar, catchy fiddle, drum, bass, Norwegian vocals"
     Gradient: #E94560 → #FFC93C
  ...

✨ Summary:
   • 0 genres inserted
   • 8 genres updated
   • 8 total active genres

🎉 Genres successfully updated with Norwegian optimization!
```

### Step 3: Verify the Changes

1. **Check Supabase Table Editor:**
   - Go to Table Editor → genre
   - Verify 8 active genres with Norwegian names
   - Check that `gradient_colors` column has JSON data

2. **Test in the app:**
   - Run `npm run dev`
   - Open the genre carousel component
   - Verify genres display with Norwegian names and gradient backgrounds

## Troubleshooting

### Error: "gradient_colors column not found"

**Cause:** Migration has not been applied yet.

**Solution:** Complete Step 1 above (apply the SQL migration in Supabase SQL Editor).

### Error: "Missing Supabase environment variables"

**Cause:** `.env.local` file is missing or doesn't have the required variables.

**Solution:**
1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase URL and service role key:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
3. Get these values from: Supabase Dashboard → Settings → API

### Genres look wrong in the database

**Solution:** Re-run the update script:
```bash
node scripts/update-genres-with-gradients.js
```

The script is idempotent and can be run multiple times safely.

## What Gets Created

### 8 Norwegian-Optimized Genres

1. **🎸 Countryrock** (country-rock)
   - Prompt: "Country, rock, anthem, twangy guitar, catchy fiddle, drum, bass, Norwegian vocals"
   - Gradient: Red → Yellow

2. **🎤 Norsk pop** (norwegian-pop)
   - Prompt: "Pop, Norwegian, catchy melody, electronic, upbeat, modern production"
   - Gradient: Navy → Red

3. **🪕 Folkeballade** (folk-ballad)
   - Prompt: "Folk, acoustic, Norwegian traditional, heartfelt, storytelling"
   - Gradient: Green → Yellow

4. **🎉 Festlåt** (party-anthem)
   - Prompt: "Dance, party, energetic, sing-along, festive, Norwegian celebration"
   - Gradient: Yellow → Red

5. **🎤 Rap/Hip-Hop** (rap-hiphop)
   - Prompt: "Hip-hop, rap, Norwegian flow, urban, rhythmic, modern beats"
   - Gradient: Navy → Purple

6. **🎸 Rockballade** (rock-ballad)
   - Prompt: "Rock, ballad, emotional, guitar solo, powerful vocals, Norwegian"
   - Gradient: Purple → Red

7. **💃 Dans/Elektronisk** (electronic-dance)
   - Prompt: "Electronic, dance, EDM, synth, energetic, club, Norwegian vocals"
   - Gradient: Green → Blue

8. **🎹 Singer-Songwriter** (singer-songwriter)
   - Prompt: "Acoustic, intimate, storytelling, piano, guitar, heartfelt, Norwegian"
   - Gradient: Orange → Brown

## Database Schema

After applying the migration, the `genre` table will have:

```sql
CREATE TABLE genre (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,  -- Internal identifier (e.g., "country-rock")
  display_name TEXT NOT NULL,  -- User-facing label (e.g., "Countryrock")
  description TEXT,            -- Optional help text
  emoji TEXT,                  -- Icon for UI (e.g., "🎸")
  suno_prompt_template TEXT NOT NULL,  -- Suno API prompt
  gradient_colors JSONB,       -- {"from": "#E94560", "to": "#FFC93C"}
  sort_order INTEGER,          -- Display order in UI
  is_active BOOLEAN            -- Enable/disable genre
);
```

## Next Steps

After successfully applying the migration and running the update script:

1. ✅ Mark tasks 1-3 complete in Story 3.10
2. ✅ Task 4: Validate prompt templates with founder (review the 8 genres)
3. ✅ Task 5: Test genre prompts with Suno API (generate test songs)
4. ✅ Task 6: Update genre UI components to use database data

## Support

If you encounter issues:
1. Check the Supabase logs in Dashboard → Logs
2. Verify environment variables are correct
3. Ensure you have service role permissions
4. Review the migration SQL for syntax errors

---

**Story:** 3.10 - Add Genre Prompt Templates to Database
**Created:** 2025-11-25
**Epic:** 3 - Norwegian Song Creation (CORE)
