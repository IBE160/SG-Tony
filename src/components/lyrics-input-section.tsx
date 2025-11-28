'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { Loader2, Sparkles, Wand2 } from 'lucide-react'

interface LyricsInputSectionProps {
  lyrics: string
  onLyricsChange: (lyrics: string) => void
  concept: string
  onConceptChange: (concept: string) => void
  onGenerateLyrics: () => Promise<void>
  onOptimizeLyrics: () => Promise<void>
  isGenerating: boolean
  isOptimizing: boolean
  selectedGenre: { id: string; name: string } | null
}

export function LyricsInputSection({
  lyrics,
  onLyricsChange,
  concept,
  onConceptChange,
  onGenerateLyrics,
  onOptimizeLyrics,
  isGenerating,
  isOptimizing,
  selectedGenre
}: LyricsInputSectionProps) {
  // Dual-mode state: false = AI generation mode (default), true = custom text mode
  const [isCustomTextMode, setIsCustomTextMode] = useState(false)

  // In AI mode, we use 'concept' for the description. In custom mode, we use 'lyrics' for the actual text
  // The textarea content changes based on mode:
  // - AI mode: shows concept/description, generates lyrics from it
  // - Custom mode: shows actual lyrics/custom text

  const isConceptValid = concept.length >= 10 && concept.length <= 500
  const canGenerate = selectedGenre && isConceptValid && !isGenerating && !isOptimizing

  // Dynamic labels and placeholders based on mode
  const textareaLabel = isCustomTextMode
    ? 'Skriv sangteksten din'
    : 'Beskriv sangen'

  const textareaPlaceholder = isCustomTextMode
    ? 'Skriv eller lim inn sangteksten din her...'
    : 'F.eks: Bursdagssang til Per som alltid kommer for sent og snakker om båten sin...'

  // In AI mode, textarea shows concept (description). In custom mode, it shows lyrics (actual text)
  const textareaValue = isCustomTextMode ? lyrics : concept
  const handleTextareaChange = (value: string) => {
    if (isCustomTextMode) {
      onLyricsChange(value)
    } else {
      onConceptChange(value)
    }
  }

  // Handle AI generation - generates lyrics and puts them in the textarea
  const handleGenerateLyrics = async () => {
    await onGenerateLyrics()
    // After generation, lyrics will be set via onLyricsChange from parent
    // We stay in AI mode but the lyrics are now available
  }

  // Check if there's content to optimize (either in lyrics or from generated text)
  const hasContent = lyrics.trim().length > 0

  return (
    <div className="space-y-2">
      {/* Header: Dynamic label + "Egen tekst" toggle */}
      <div className="flex items-center justify-between">
        <label
          htmlFor="lyrics-input"
          className="text-sm font-medium text-gray-700"
        >
          {textareaLabel}
        </label>
        <div className="flex items-center gap-2">
          <Switch
            id="custom-text-toggle"
            checked={isCustomTextMode}
            onCheckedChange={setIsCustomTextMode}
            disabled={isGenerating || isOptimizing}
            className="data-[state=checked]:bg-[#06D6A0]"
          />
          <label
            htmlFor="custom-text-toggle"
            className="text-sm text-gray-600 cursor-pointer"
          >
            Egen tekst
          </label>
        </div>
      </div>

      {/* Main Textarea with relative positioning for the optimize link */}
      <div className="relative">
        <Textarea
          id="lyrics-input"
          placeholder={textareaPlaceholder}
          value={textareaValue}
          onChange={(e) => handleTextareaChange(e.target.value)}
          disabled={isGenerating || isOptimizing}
          className={cn(
            'min-h-[200px] font-mono text-sm leading-relaxed resize-none whitespace-pre-wrap pb-8',
            textareaValue && 'bg-white',
            !textareaValue && 'bg-gray-50',
            (isGenerating || isOptimizing) && 'opacity-50'
          )}
        />

        {/* "Optimaliser tekst" link - positioned bottom-right, only when content exists */}
        {hasContent && !isGenerating && !isOptimizing && (
          <button
            onClick={onOptimizeLyrics}
            className="absolute bottom-2 right-2 text-xs text-gray-500 hover:text-[#E94560] flex items-center gap-1 transition-colors"
          >
            <Wand2 className="h-3 w-3" />
            Optimaliser tekst
          </button>
        )}
      </div>

      {/* Status messages */}
      {isGenerating && (
        <p className="text-xs text-[#E94560] flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Genererer norsk sangtekst...
        </p>
      )}

      {isOptimizing && (
        <p className="text-xs text-[#E94560] flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Optimaliserer uttale...
        </p>
      )}

      {/* "✨ Lag tekst" button - only visible in AI mode (not custom text mode) */}
      {!isCustomTextMode && (
        <div className="flex items-center justify-end pt-2">
          <Button
            onClick={handleGenerateLyrics}
            disabled={!canGenerate}
            size="sm"
            className="bg-[#E94560] hover:bg-[#D62839] text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Genererer...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Lag tekst
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
