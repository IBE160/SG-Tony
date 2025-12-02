/**
 * Audio Proxy API Route
 *
 * Proxies audio from external URLs (like Suno) to bypass CORS restrictions.
 * Streams audio directly without storing, for fast preview playback.
 *
 * @route GET /api/audio-proxy?url=<encoded-url>
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// Allowed domains for security (prevent open proxy abuse)
const ALLOWED_DOMAINS = [
  'cdn1.suno.ai',
  'cdn2.suno.ai',
  'cdn.suno.ai',
  'audiopipe.suno.ai',
  'suno.ai',
]

/**
 * Check if URL is from an allowed domain
 */
function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ALLOWED_DOMAINS.some(domain =>
      parsed.hostname === domain || parsed.hostname.endsWith('.' + domain)
    )
  } catch {
    return false
  }
}

/**
 * GET /api/audio-proxy
 *
 * Proxy audio from external URL to bypass CORS
 */
export async function GET(request: NextRequest) {
  try {
    // Validate authentication
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      )
    }

    // Get URL parameter
    const { searchParams } = new URL(request.url)
    const audioUrl = searchParams.get('url')

    if (!audioUrl) {
      return NextResponse.json(
        { error: { code: 'MISSING_URL', message: 'URL parameter required' } },
        { status: 400 }
      )
    }

    // Decode and validate URL
    const decodedUrl = decodeURIComponent(audioUrl)

    if (!isAllowedUrl(decodedUrl)) {
      return NextResponse.json(
        { error: { code: 'INVALID_URL', message: 'URL domain not allowed' } },
        { status: 403 }
      )
    }

    // Fetch audio from external URL
    const audioResponse = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AIMusikk/1.0)',
      },
      signal: AbortSignal.timeout(30000), // 30 second timeout
    })

    if (!audioResponse.ok) {
      return NextResponse.json(
        { error: { code: 'FETCH_FAILED', message: 'Failed to fetch audio' } },
        { status: 502 }
      )
    }

    // Get content type and length
    const contentType = audioResponse.headers.get('content-type') || 'audio/mpeg'
    const contentLength = audioResponse.headers.get('content-length')

    // Stream the response
    const headers: HeadersInit = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      'Access-Control-Allow-Origin': '*',
    }

    if (contentLength) {
      headers['Content-Length'] = contentLength
    }

    // Return streamed response
    return new NextResponse(audioResponse.body, {
      status: 200,
      headers,
    })

  } catch (error) {
    console.error('Audio proxy error:', error)

    return NextResponse.json(
      { error: { code: 'PROXY_ERROR', message: 'Failed to proxy audio' } },
      { status: 500 }
    )
  }
}
