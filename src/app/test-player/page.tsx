'use client'

import { SongPlayerCard } from '@/components/song-player-card'

export default function TestPlayerPage() {
  // Test data - you can replace with actual song data
  const testSong = {
    songId: 'test-123',
    title: 'Test Norwegian Song',
    genre: 'Country Rock',
    // Using a test audio file - replace with actual audio URL from Supabase
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 354, // 5:54 in seconds
    createdAt: new Date().toISOString(),
    genreEmoji: '🎸'
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Song Player Card Test</h1>
          <p className="text-muted-foreground">
            Testing the song player card component with all features
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Song Player</h2>
          <SongPlayerCard {...testSong} />
        </div>

        <div className="space-y-2 text-sm">
          <h3 className="font-semibold">Features to test:</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>✓ Play/pause button functionality</li>
            <li>✓ Waveform visualization</li>
            <li>✓ Scrubbing (click on waveform or drag slider)</li>
            <li>✓ Volume control (desktop only - visible on screens &gt; md)</li>
            <li>✓ Time display (current/total)</li>
            <li>✓ Keyboard controls:</li>
            <ul className="list-disc list-inside ml-6">
              <li>Space: Play/pause</li>
              <li>Arrow Left: Rewind 5 seconds</li>
              <li>Arrow Right: Forward 5 seconds</li>
              <li>Arrow Up: Volume up 10%</li>
              <li>Arrow Down: Volume down 10%</li>
            </ul>
            <li>✓ Responsive design (mobile/desktop)</li>
            <li>✓ Norwegian text (labels, time format)</li>
            <li>✓ Loading state</li>
            <li>✓ Error handling</li>
          </ul>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> This test uses a sample audio file. In production,
            replace with actual song URLs from Supabase Storage.
          </p>
        </div>
      </div>
    </div>
  )
}
