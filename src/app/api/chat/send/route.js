import { NextResponse } from 'next/server'

/**
 * POST /api/chat/send
 * Mock endpoint — accepts a message to inject into a session.
 * Replace with real gateway integration once backend is ready.
 */
export async function POST(request) {
  const body = await request.json()
  const { sessionKey, message } = body

  if (!sessionKey || typeof sessionKey !== 'string') {
    return NextResponse.json({ ok: false, error: 'sessionKey is required' }, { status: 400 })
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ ok: false, error: 'message must be a non-empty string' }, { status: 400 })
  }

  // In the real implementation this calls invokeTool('sessions_send', ...)
  return NextResponse.json({ ok: true })
}
