export const dynamic = 'force-dynamic'

const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || 'c300a92484f98da23fc7d16d4c9124f76f38bcb7717c279d'

/**
 * GET /api/chat/stream/[encodedSessionKey]
 * Proxies the gateway SSE stream for a session to the browser.
 * encodedSessionKey: URL-encoded session key (e.g. agent%3Amain%3Amain)
 */
export async function GET(request, { params }) {
  const sessionKey = decodeURIComponent(params.encodedSessionKey)
  const gatewayUrl = `http://127.0.0.1:18789/sessions/${encodeURIComponent(sessionKey)}/history?follow=1`

  let upstream

  try {
    upstream = await fetch(gatewayUrl, {
      headers: {
        Authorization: `Bearer ${GATEWAY_TOKEN}`,
      },
    })
  } catch (err) {
    console.error('[/api/chat/stream] gateway fetch failed:', err.message)
    return new Response('Gateway unreachable', { status: 502 })
  }

  if (!upstream.ok) {
    return new Response('Gateway error', { status: upstream.status })
  }

  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
