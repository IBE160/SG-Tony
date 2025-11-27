'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ConceptInput } from '@/components/concept-input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { Loader2, Sparkles, Eye, Wand2 } from 'lucide-react'

interface LyricsInputSectionProps {
  lyrics: string
  onLyricsChange: (lyrics: string) => void
  pronunciationEnabled: boolean
  onPronunciationToggle: (enabled: boolean) => void
  concept: string
  onConceptChange: (concept: string) => void
  onGenerateLyrics: () => Promise<void>
  onOptimizeLyrics: () => Promise<void>
  onOpenDiffViewer: () => void
  isGenerating: boolean
  isOptimizing: boolean
  hasPhoneticChanges: boolean
  hasOriginalLyrics: boolean
  selectedGenre: { id: string; name: string } | null
}

export function LyricsInputSection({
  lyrics,
  onLyricsChange,
  pronunciationEnabled,
  onPronunciationToggle,
  concept,
  onConceptChange,
  onGenerateLyrics,
  onOptimizeLyrics,
  onOpenDiffViewer,
  isGenerating,
  isOptimizing,
  hasPhoneticChanges,
  hasOriginalLyrics,
  selectedGenre
}: LyricsInputSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [generatedPreview, setGeneratedPreview] = useState('')

  const isConceptValid = concept.length >= 10 && concept.length <= 500
  const canGenerate = selectedGenre && isConceptValid && !isGenerating && !isOptimizing

  const handleOpenModal = () => {
    setGeneratedPreview('')
    setIsModalOpen(true)
  }

  const handleGenerateInModal = async () => {
    await onGenerateLyrics()
    // The lyrics will be set via onLyricsChange, but we want to show preview first
    // We'll capture the generated text by checking lyrics after generation
  }

  const handleAcceptGenerated = () => {
    // Lyrics are already set by onGenerateLyrics, just close modal
    setIsModalOpen(false)
    setGeneratedPreview('')
  }

  const handleCancelGenerated = () => {
    setIsModalOpen(false)
    setGeneratedPreview('')
  }

  return (
    <div className="space-y-2">
      {/* Header: Tekst label + Norsk uttale switch (inline like screenshot) */}
      <div className="flex items-center justify-between">
        <label
          htmlFor="lyrics-input"
          className="text-sm font-medium text-gray-700"
        >
          Tekst
        </label>
        <div className="flex items-center gap-2">
          <Switch
            id="pronunciation-toggle"
            checked={pronunciationEnabled}
            onCheckedChange={onPronunciationToggle}
            disabled={isGenerating || isOptimizing}
            className="data-[state=checked]:bg-[#06D6A0]"
          />
          <label
            htmlFor="pronunciation-toggle"
            className="text-sm text-gray-600 cursor-pointer"
          >
            Norsk uttale
          </label>
        </div>
      </div>

      {/* Main Textarea */}
      <Textarea
        id="lyrics-input"
        placeholder="Skriv sangteksten din her..."
        value={lyrics}
        onChange={(e) => onLyricsChange(e.target.value)}
        disabled={isGenerating || isOptimizing}
        className={cn(
          'min-h-[200px] font-mono text-sm leading-relaxed resize-none whitespace-pre-wrap',
          lyrics && 'bg-white',
          !lyrics && 'bg-gray-50',
          (isGenerating || isOptimizing) && 'opacity-50'
        )}
      />

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

      {/* Action buttons below textarea (like screenshot) */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {/* Optimize button - show when lyrics exist and can be optimized */}
        {lyrics && !isGenerating && !isOptimizing && !hasOriginalLyrics && pronunciationEnabled && (
          <Button
            onClick={onOptimizeLyrics}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            Optimaliser
          </Button>
        )}

        {/* Preview phonetic changes */}
        {lyrics && hasOriginalLyrics && hasPhoneticChanges && !isGenerating && !isOptimizing && (
          <Button
            onClick={onOpenDiffViewer}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <Eye className="mr-2 h-4 w-4" />
            Forhåndsvis endringer
          </Button>
        )}

        {/* Generate Lyrics button */}
        <Button
          onClick={handleOpenModal}
          variant="ghost"
          size="sm"
          disabled={isGenerating || isOptimizing}
          className="text-[#E94560] hover:text-[#D62839] hover:bg-pink-50"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Generer tekst
        </Button>
      </div>

      {/* AI Generation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#E94560]" />
              Generer tekst med AI
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {!selectedGenre && (
              <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                Velg en sjanger først for å generere tekst
              </p>
            )}

            {selectedGenre && (
              <p className="text-sm text-gray-600">
                Sjanger: <span className="font-medium">{selectedGenre.name}</span>
              </p>
            )}

            <ConceptInput
              value={concept}
              onChange={onConceptChange}
              disabled={isGenerating}
            />

            {/* Preview of generated lyrics (if any in main textarea) */}
            {lyrics && !isGenerating && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Forhåndsvisning
                </label>
                <div className="p-3 bg-gray-50 rounded-lg max-h-[200px] overflow-y-auto">
                  <pre className="text-sm font-mono whitespace-pre-wrap text-gray-800">
                    {lyrics}
                  </pre>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleCancelGenerated}
                variant="outline"
                className="flex-1"
                disabled={isGenerating}
              >
                Avbryt
              </Button>

              {!lyrics || isGenerating ? (
                <Button
                  onClick={handleGenerateInModal}
                  disabled={!canGenerate}
                  className="flex-1 bg-[#E94560] hover:bg-[#D62839]"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Genererer...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generer
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleAcceptGenerated}
                  className="flex-1 bg-[#06D6A0] hover:bg-[#05C090]"
                >
                  Godkjenn
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
