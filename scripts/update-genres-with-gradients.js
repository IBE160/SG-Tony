#!/usr/bin/env node
/**
 * Update genres with Norwegian-optimized prompts and gradient colors
 * Story 3.10: Add Genre Prompt Templates to Database
 *
 * This script:
 * 1. Adds gradient_colors column if it doesn't exist
 * 2. Updates all genres with Norwegian-optimized Suno prompts
 * 3. Updates display names to Norwegian where appropriate
 * 4. Adds gradient color schemes matching Playful Nordic theme
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('   Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Norwegian-optimized genre configurations based on founder's 80k listener expertise
const genreUpdates = [
  {
    name: 'country-rock',
    display_name: 'Countryrock',
    description: 'Upbeat country with rock energy',
    emoji: '🎸',
    suno_prompt_template: 'Country, rock, anthem, twangy guitar, catchy fiddle, drum, bass, Norwegian vocals',
    gradient_colors: { from: '#E94560', to: '#FFC93C' },
    sort_order: 1,
    is_active: true
  },
  {
    name: 'norwegian-pop',
    display_name: 'Norsk pop',
    description: 'Modern Norwegian pop music',
    emoji: '🎤',
    suno_prompt_template: 'Pop, Norwegian, catchy melody, electronic, upbeat, modern production',
    gradient_colors: { from: '#0F3460', to: '#E94560' },
    sort_order: 2,
    is_active: true
  },
  {
    name: 'folk-ballad',
    display_name: 'Folkeballade',
    description: 'Acoustic folk with Norwegian tradition',
    emoji: '🪕',
    suno_prompt_template: 'Folk, acoustic, Norwegian traditional, heartfelt, storytelling',
    gradient_colors: { from: '#06D6A0', to: '#FFC93C' },
    sort_order: 3,
    is_active: true
  },
  {
    name: 'party-anthem',
    display_name: 'Festlåt',
    description: 'Energetic party songs for celebrations',
    emoji: '🎉',
    suno_prompt_template: 'Dance, party, energetic, sing-along, festive, Norwegian celebration',
    gradient_colors: { from: '#FFC93C', to: '#E94560' },
    sort_order: 4,
    is_active: true
  },
  {
    name: 'rap-hiphop',
    display_name: 'Rap/Hip-Hop',
    description: 'Norwegian rap with urban rhythmic flow',
    emoji: '🎤',
    suno_prompt_template: 'Hip-hop, rap, Norwegian flow, urban, rhythmic, modern beats',
    gradient_colors: { from: '#0F3460', to: '#8B5CF6' },
    sort_order: 5,
    is_active: true
  },
  {
    name: 'rock-ballad',
    display_name: 'Rockballade',
    description: 'Emotional rock with powerful vocals',
    emoji: '🎸',
    suno_prompt_template: 'Rock, ballad, emotional, guitar solo, powerful vocals, Norwegian',
    gradient_colors: { from: '#8B5CF6', to: '#E94560' },
    sort_order: 6,
    is_active: true
  },
  {
    name: 'electronic-dance',
    display_name: 'Dans/Elektronisk',
    description: 'High-energy electronic dance music',
    emoji: '💃',
    suno_prompt_template: 'Electronic, dance, EDM, synth, energetic, club, Norwegian vocals',
    gradient_colors: { from: '#06D6A0', to: '#3B82F6' },
    sort_order: 7,
    is_active: true
  },
  {
    name: 'singer-songwriter',
    display_name: 'Singer-Songwriter',
    description: 'Intimate acoustic storytelling',
    emoji: '🎹',
    suno_prompt_template: 'Acoustic, intimate, storytelling, piano, guitar, heartfelt, Norwegian',
    gradient_colors: { from: '#FB923C', to: '#92400E' },
    sort_order: 8,
    is_active: true
  }
]

async function updateGenresWithGradients() {
  try {
    console.log('🎨 Updating genres with Norwegian-optimized prompts and gradient colors...\n')

    // First, check if gradient_colors column exists
    console.log('📋 Checking database schema...')
    const { data: existingGenres, error: fetchError } = await supabase
      .from('genre')
      .select('*')
      .limit(1)

    if (fetchError) {
      console.error('❌ Error fetching genres:', fetchError)
      process.exit(1)
    }

    // Check if gradient_colors field exists
    const hasGradientColors = existingGenres && existingGenres.length > 0 &&
      'gradient_colors' in existingGenres[0]

    if (!hasGradientColors) {
      console.log('⚠️  gradient_colors column not found')
      console.log('   You need to run the migration first:')
      console.log('   supabase/migrations/20251125_add_genre_gradient_colors.sql')
      console.log('\n   To apply it, run this SQL in your Supabase SQL Editor:')
      console.log('   https://supabase.com/dashboard/project/_/sql/new\n')
      process.exit(1)
    }

    console.log('✅ Database schema is up to date\n')

    // Update each genre
    let updatedCount = 0
    let insertedCount = 0

    for (const genre of genreUpdates) {
      console.log(`🔄 Processing: ${genre.emoji} ${genre.display_name}`)

      // Check if genre exists
      const { data: existing } = await supabase
        .from('genre')
        .select('name')
        .eq('name', genre.name)
        .single()

      if (existing) {
        // Update existing genre
        const { error: updateError } = await supabase
          .from('genre')
          .update(genre)
          .eq('name', genre.name)

        if (updateError) {
          console.error(`   ❌ Error updating ${genre.name}:`, updateError)
        } else {
          console.log(`   ✅ Updated`)
          updatedCount++
        }
      } else {
        // Insert new genre
        const { error: insertError } = await supabase
          .from('genre')
          .insert([genre])

        if (insertError) {
          console.error(`   ❌ Error inserting ${genre.name}:`, insertError)
        } else {
          console.log(`   ✅ Inserted (new)`)
          insertedCount++
        }
      }
    }

    // Clean up old genres that don't match the Norwegian-optimized list
    console.log('\n🧹 Cleaning up old genres...')
    const genreNames = genreUpdates.map(g => g.name)

    const { data: allGenres } = await supabase
      .from('genre')
      .select('name, display_name')

    const oldGenres = allGenres?.filter(g => !genreNames.includes(g.name)) || []

    if (oldGenres.length > 0) {
      console.log(`   Found ${oldGenres.length} old genres to deactivate:`)
      oldGenres.forEach(g => console.log(`   - ${g.display_name}`))

      for (const oldGenre of oldGenres) {
        await supabase
          .from('genre')
          .update({ is_active: false })
          .eq('name', oldGenre.name)
      }
      console.log(`   ✅ Deactivated ${oldGenres.length} old genres`)
    }

    // Fetch and display all active genres
    console.log('\n📋 Active Norwegian-optimized genres:')
    const { data: finalGenres } = await supabase
      .from('genre')
      .select('display_name, emoji, suno_prompt_template, gradient_colors, sort_order')
      .eq('is_active', true)
      .order('sort_order')

    finalGenres?.forEach((g, i) => {
      const gradientFrom = g.gradient_colors?.from || 'N/A'
      const gradientTo = g.gradient_colors?.to || 'N/A'
      console.log(`  ${i + 1}. ${g.emoji} ${g.display_name}`)
      console.log(`     Prompt: "${g.suno_prompt_template}"`)
      console.log(`     Gradient: ${gradientFrom} → ${gradientTo}`)
    })

    console.log(`\n✨ Summary:`)
    console.log(`   • ${insertedCount} genres inserted`)
    console.log(`   • ${updatedCount} genres updated`)
    console.log(`   • ${finalGenres?.length || 0} total active genres`)
    console.log(`\n🎉 Genres successfully updated with Norwegian optimization!`)

  } catch (err) {
    console.error('❌ Unexpected error:', err)
    process.exit(1)
  }
}

updateGenresWithGradients()
