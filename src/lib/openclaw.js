/**
 * OpenClaw Gateway client for server-side use in Next.js API routes.
 * Calls /tools/invoke on the local gateway at 127.0.0.1:18789.
 */

const GATEWAY_URL = 'http://127.0.0.1:18789/tools/invoke'
const GATEWAY_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || 'f2b11de8bcfaa7333502a58002af1010e4a200d4372088f5'

/**
 * Invoke an OpenClaw tool via the gateway HTTP API.
 * @param {string} tool - Tool name (e.g. 'sessions_list')
 * @param {object} args - Tool arguments
 * @returns {Promise<any>} - The result.details value, or result.content[0].text parsed as JSON
 */
export async function invokeTool(tool, args = {}) {
  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GATEWAY_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tool, args }),
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gateway error ${res.status}: ${text}`)
  }

  const body = await res.json()

  if (!body.ok) {
    throw new Error(`Tool error: ${body.error?.message ?? JSON.stringify(body.error)}`)
  }

  // Prefer structured details if available, otherwise parse the text content
  if (body.result?.details !== undefined) {
    return body.result.details
  }

  const text = body.result?.content?.[0]?.text
  if (text) {
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }

  return body.result
}
