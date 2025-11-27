'use client'

import { useState, useCallback, useEffect } from 'react'
import { SongCard } from '@/components/song-card'
import { SongPlayerCard } from '@/components/song-player-card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useErrorToast } from '@/hooks/use-error-toast'
import type { Song } from '@/types/song'

const SONGS_PER_PAGE = 10

export function HomepageSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { showError } = useErrorToast()

  // Fetch songs for current page
  const fetchSongs = useCallback(async () => {
    setIsLoading(true)

    try {
      const offset = currentPage * SONGS_PER_PAGE
      const response = await fetch(
        `/api/songs?offset=${offset}&limit=${SONGS_PER_PAGE}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch songs')
      }

      const data = await response.json()
      const fetchedSongs = data.data || []

      setSongs(fetchedSongs)
      setHasMore(fetchedSongs.length === SONGS_PER_PAGE)
    } catch (error) {
      showError(error, {
        context: 'load-homepage-songs',
        onRetry: fetchSongs
      })
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, showError])

  // Load songs when page changes
  useEffect(() => {
    fetchSongs()
  }, [fetchSongs])

  // Handle song card click
  const handleSongClick = (song: Song) => {
    setSelectedSong(song)
    setIsModalOpen(true)
  }

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedSong(null), 200)
  }

  // Handle song deletion - refresh current page
  const handleSongDelete = () => {
    fetchSongs()
  }

  // Navigation handlers
  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPage(currentPage + 1)
    }
  }

  const hasPrevious = currentPage > 0

  // Loading state
  if (isLoading && songs.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  // Empty state
  if (!isLoading && songs.length === 0 && currentPage === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="text-5xl mb-4">🎵</div>
        <h3 className="text-lg font-semibold mb-2">Ingen sanger ennå</h3>
        <p className="text-gray-600 text-sm">
          Lag din første sang ovenfor, så vises den her!
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Songs grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            onClick={() => handleSongClick(song)}
          />
        ))}
      </div>

      {/* Loading overlay for page changes */}
      {isLoading && songs.length > 0 && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      )}

      {/* Pagination controls */}
      {(hasPrevious || hasMore) && (
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={!hasPrevious || isLoading}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Forrige
          </Button>
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={!hasMore || isLoading}
            className="flex items-center gap-2"
          >
            Neste
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Song Player Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-6">
          {selectedSong && selectedSong.audio_url && (
            <SongPlayerCard
              songId={selectedSong.id}
              title={selectedSong.title}
              genre={selectedSong.genre}
              audioUrl={selectedSong.audio_url}
              duration={selectedSong.duration_seconds}
              createdAt={selectedSong.created_at}
              isPreview={selectedSong.is_preview}
              onDelete={handleSongDelete}
              onClose={handleCloseModal}
            />
          )}
          {selectedSong && !selectedSong.audio_url && (
            <div className="text-center py-8 text-gray-600">
              Sangen er ikke klar ennå. Prøv igjen om litt.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
