'use client'

import { useState } from 'react'
import { GenreSelection } from '@/components/genre-selection'
import { ConceptInput } from '@/components/concept-input'
import { LyricsEditor } from '@/components/lyrics-editor'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [selectedGenre, setSelectedGenre] = useState<{
    id: string
    name: string
  } | null>(null)
  const [concept, setConcept] = useState('')
  const [lyrics, setLyrics] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleGenreSelect = (genreId: string, genreName: string) => {
    setSelectedGenre({ id: genreId, name: genreName })
  }

  const handleGenerateLyrics = async () => {
    if (!selectedGenre) {
      toast({
        variant: 'destructive',
        title: 'Ingen sjanger valgt',
        description: 'Vennligst velg en sjanger før du genererer tekst'
      })
      return
    }

    if (concept.length < 10) {
      toast({
        variant: 'destructive',
        title: 'Konsept for kort',
        description: 'Konseptet må være minst 10 tegn'
      })
      return
    }

    if (concept.length > 500) {
      toast({
        variant: 'destructive',
        title: 'Konsept for langt',
        description: 'Konseptet kan ikke være mer enn 500 tegn'
      })
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch('/api/lyrics/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          concept,
          genre: selectedGenre.name
        })
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error?.message || 'Kunne ikke generere tekst')
      }

      setLyrics(data.data.lyrics)

      toast({
        title: 'Tekst generert! ✨',
        description: 'AI har laget norsk sangtekst basert på konseptet ditt'
      })
    } catch (error) {
      console.error('Lyric generation error:', error)

      toast({
        variant: 'destructive',
        title: 'Generering feilet',
        description:
          error instanceof Error
            ? error.message
            : 'Kunne ikke generere tekst. Prøv igjen.'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const isGenerateDisabled =
    !selectedGenre || concept.length < 10 || concept.length > 500 || isGenerating

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-24">
      <div className="z-10 w-full max-w-3xl">
        <h1 className="text-4xl font-bold mb-2 text-center md:text-left">
          Musikkfabrikken
        </h1>
        <p className="text-lg mb-8 text-center md:text-left text-gray-600">
          Lag morsomme norske sanger med AI - autentisk norsk uttale!
        </p>

        {/* Genre Selection Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">
            Velg sjanger
          </h2>
          <GenreSelection onGenreSelect={handleGenreSelect} />
        </div>

        {/* Concept Input Section */}
        <div className="mb-8">
          <ConceptInput
            value={concept}
            onChange={setConcept}
            disabled={isGenerating}
          />
        </div>

        {/* Generate Button */}
        <div className="mb-8">
          <Button
            onClick={handleGenerateLyrics}
            disabled={isGenerateDisabled}
            className="w-full h-12 text-base"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Genererer tekst...
              </>
            ) : (
              'Generer tekst med AI'
            )}
          </Button>
        </div>

        {/* Lyrics Editor Section */}
        {(lyrics || isGenerating) && (
          <div className="mb-8">
            <LyricsEditor
              value={lyrics}
              onChange={setLyrics}
              disabled={isGenerating}
              placeholder={
                isGenerating
                  ? 'Genererer norsk sangtekst...'
                  : 'Genererte tekster vil vises her...'
              }
            />
          </div>
        )}
      </div>
    </main>
  )
}
