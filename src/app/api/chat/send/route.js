import { NextResponse } from 'next/server'

import { invokeTool } from '@/lib/openclaw'

/**
 * POST /api/chat/send
 * Body: { sessionKey: string, message: string }
 * Sends a message to the specified session via the gateway.
 */
export async function POST(request) {
  let body

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const { sessionKey, message } = body ?? {}

  // Validate required fields
  if (!sessionKey || typeof sessionKey !== 'string') {
    return NextResponse.json(
      { ok: false, error: 'sessionKey is required' },
      { status: 400 }
    )
  }

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return NextResponse.json(
      { ok: false, error: 'message is required and must be non-empty' },
      { status: 400 }
    )
  }

  try {
    await invokeTool('sessions_send', {
      sessionKey,
      message: message.trim(),
      timeoutSeconds: 0,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[/api/chat/send] error:', err.message)
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    )
  }
}
