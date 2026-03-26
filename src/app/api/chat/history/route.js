import { NextResponse } from 'next/server'

import { invokeTool } from '@/lib/openclaw'

/**
 * GET /api/chat/history
 * Query params:
 *   - sessionKey (required)
 *   - limit      (default 50)
 *   - cursor     (optional)
 *   - includeTools (default false)
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url)

  const sessionKey = searchParams.get('sessionKey')
  const limit = searchParams.get('limit') ?? '50'
  const cursor = searchParams.get('cursor')
  const includeTools = searchParams.get('includeTools') ?? 'false'

  if (!sessionKey) {
    return NextResponse.json(
      { ok: false, error: 'sessionKey is required', messages: [] },
      { status: 400 }
    )
  }

  try {
    const data = await invokeTool('sessions_history', {
      sessionKey,
      limit: Number(limit),
      ...(cursor && { cursor }),
      includeTools: includeTools === 'true',
    })

    const rawEvents = data?.events ?? data?.messages ?? []
    const nextCursor = data?.cursor ?? null

    const messages = []

    for (const event of rawEvents) {
      // Keep only message events
      if (event.type !== 'message') continue

      const role = event.message?.role
      if (role !== 'user' && role !== 'assistant') continue

      // Extract text from first content block
      let text = null
      try {
        text = event.message?.content?.[0]?.text ?? null
      } catch {
        // unexpected content shape — skip silently
        continue
      }

      // Drop if null or empty
      if (!text || text.trim() === '') continue

      messages.push({
        id: event.id,
        parentId: event.parentId ?? null,
        timestamp: event.timestamp,
        role,
        text,
      })
    }

    return NextResponse.json({ ok: true, messages, cursor: nextCursor })
  } catch (err) {
    console.error('[/api/chat/history] error:', err.message)
    return NextResponse.json(
      { ok: false, error: err.message, messages: [] },
      { status: 500 }
    )
  }
}
