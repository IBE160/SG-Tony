'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Default genres to display in 2x2 grid (reduces decision paralysis)
const DEFAULT_GENRES = ['Country', 'Norsk pop', 'Rap/Hip-Hop', 'Dans/Elektronisk']

interface GradientColors {
  from: string
  to: string
}

interface Genre {
  id: string
  name: string
  display_name: string
  emoji: string | null
  sort_order: number
  gradient_colors: GradientColors | null
}

// Type guard for gradient colors
function isGradientColors(value: unknown): value is GradientColors {
  return (
    typeof value === 'object' &&
    value !== null &&
    'from' in value &&
    'to' in value &&
    typeof (value as GradientColors).from === 'string' &&
    typeof (value as GradientColors).to === 'string'
  )
}

interface GenreSelectionProps {
  onGenreSelect?: (genreId: string, genreName: string) => void
  defaultSelectedId?: string
  selectedGenreId?: string | null  // Controlled mode - sync with parent
  className?: string
}

export function GenreSelection({
  onGenreSelect,
  defaultSelectedId,
  selectedGenreId,
  className = ''
}: GenreSelectionProps) {
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(defaultSelectedId || null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAllGenres, setShowAllGenres] = useState(false)

  // Sync with parent's selectedGenreId (controlled mode)
  useEffect(() => {
    if (selectedGenreId !== undefined) {
      setSelectedId(selectedGenreId)
    }
  }, [selectedGenreId])

  // Fetch genres from database
  useEffect(() => {
    let isMounted = true

    async function fetchGenres() {
      try {
        const supabase = createClient()
        const { data, error} = await supabase
          .from('genre')
          .select('id, name, display_name, emoji, sort_order, gradient_colors')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })

        if (!isMounted) return

        if (error) {
          console.error('Failed to fetch genres:', error)
          setError('Kunne ikke laste sjangre. Vennligst prøv igjen.')
          setIsLoading(false)
          return
        }

        // Convert Supabase data to Genre type with proper gradient_colors typing
        const convertedGenres: Genre[] = (data || []).map(row => ({
          ...row,
          gradient_colors: isGradientColors(row.gradient_colors) ? row.gradient_colors : null
        }))

        setGenres(convertedGenres)
        setIsLoading(false)

        // Auto-select first DEFAULT genre if none selected
        const defaultGenresList = convertedGenres.filter(g => DEFAULT_GENRES.includes(g.name)).slice(0, 4)
        if (!selectedId && defaultGenresList.length > 0) {
          setSelectedId(defaultGenresList[0].id)
          onGenreSelect?.(defaultGenresList[0].id, defaultGenresList[0].name)
        }
      } catch (err) {
        if (!isMounted) return
        console.error('Unexpected error fetching genres:', err)
        setError('En uventet feil oppstod.')
        setIsLoading(false)
      }
    }

    fetchGenres()

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount - onGenreSelect and selectedId intentionally excluded

  const handleGenreClick = (genre: Genre) => {
    setSelectedId(genre.id)
    onGenreSelect?.(genre.id, genre.name)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, genre: Genre) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleGenreClick(genre)
    }
  }

  if (isLoading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="grid grid-cols-2 gap-3">
          {/* Loading skeleton - 4 items in 2x2 grid */}
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-[70px] rounded-lg bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`w-full ${className}`}>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    )
  }

  // Filter to show only 4 default genres (2x2 grid)
  const displayGenres = showAllGenres
    ? genres
    : genres.filter(g => DEFAULT_GENRES.includes(g.name)).slice(0, 4)

  return (
    <div role="radiogroup" aria-label="Velg sjanger" className={`w-full ${className}`}>
      <div className="space-y-3">
        {/* Genre Grid - Fixed 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          {displayGenres.map((genre) => {
            const isSelected = selectedId === genre.id
            const gradientFrom = genre.gradient_colors?.from || '#FF6B35'
            const gradientTo = genre.gradient_colors?.to || '#FF006E'

            return (
              <Button
                key={genre.id}
                onClick={() => handleGenreClick(genre)}
                onKeyDown={(e) => handleKeyDown(e, genre)}
                variant={isSelected ? 'default' : 'outline'}
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`
                    : 'white',
                }}
                className={cn(
                  "h-[70px] w-full px-4 py-5 rounded-lg",
                  "text-[15px] font-bold",
                  "transition-all duration-200",
                  "flex items-center justify-center",
                  isSelected
                    ? 'border-[3px] border-primary text-white hover:opacity-90'
                    : 'border border-gray-300 text-gray-800 hover:border-primary/50 hover:bg-gray-50',
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                )}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
              >
                <span className="truncate">{genre.display_name}</span>
              </Button>
            )
          })}
        </div>

        {/* Add Genre Button */}
        {!showAllGenres && (
          <Button
            variant="outline"
            onClick={() => setShowAllGenres(true)}
            className="w-full h-[52px] border-2 border-dashed border-border-focus hover:bg-surface hover:border-primary/50 transition-all"
          >
            + Legg til sjanger
          </Button>
        )}
      </div>
    </div>
  )
}
