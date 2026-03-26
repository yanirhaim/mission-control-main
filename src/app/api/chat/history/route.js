import { NextResponse } from 'next/server'

/**
 * GET /api/chat/history?sessionKey=...&limit=50
 * Mock endpoint — returns normalized message history.
 * Replace with real gateway integration once backend is ready.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const sessionKey = searchParams.get('sessionKey')
  const limit = Number(searchParams.get('limit') || 50)

  if (!sessionKey) {
    return NextResponse.json({ ok: false, error: 'sessionKey is required', messages: [] }, { status: 400 })
  }

  const now = Date.now()
  const min = m => new Date(now - m * 60 * 1000).toISOString()

  // Mock conversation data keyed by session
  const mockMessages = {
    'agent:main:main': [
      { id: 'm1', parentId: null, timestamp: min(120), role: 'user', text: 'Luchito, give me a status update on the sprint.' },
      { id: 'm2', parentId: 'm1', timestamp: min(119), role: 'assistant', text: 'All hands on deck. Mantis is finishing the chat backend, Rocket wrapped the API scaffold yesterday, and Grok is running QA on infra monitoring. Two tasks are queued for next cycle.' },
      { id: 'm3', parentId: 'm2', timestamp: min(95), role: 'user', text: 'Any blockers?' },
      { id: 'm4', parentId: 'm3', timestamp: min(94), role: 'assistant', text: 'Nothing critical. The SSE proxy needs testing once the gateway token is rotated. I flagged it to Mantis.' }
    ],
    'agent:mantis:subagent:mock-uuid-1': [
      { id: 'm10', parentId: null, timestamp: min(60), role: 'user', text: '[PRJ-MISSIONCTRL][T004] Begin chat UI rebuild — replace static data layer with live API calls.' },
      { id: 'm11', parentId: 'm10', timestamp: min(59), role: 'assistant', text: 'Acknowledged. Starting with the session fetch and sidebar wiring. Will keep the existing Discord-style layout.' },
      { id: 'm12', parentId: 'm11', timestamp: min(45), role: 'assistant', text: 'Sidebar is now rendering from /api/chat/sessions. Moving to thread selection and history loading next.' },
      { id: 'm13', parentId: 'm12', timestamp: min(30), role: 'user', text: 'Make sure SSE connections clean up properly on thread switch.' },
      { id: 'm14', parentId: 'm13', timestamp: min(29), role: 'assistant', text: 'Good call. I have a cleanup return in the useEffect. Will verify no stale connections remain.' }
    ],
    'agent:rocket:subagent:mock-uuid-2': [
      { id: 'm20', parentId: null, timestamp: min(300), role: 'user', text: '[PRJ-MISSIONCTRL][T003] Scaffold the chat API routes for sessions, history, send, and SSE stream.' },
      { id: 'm21', parentId: 'm20', timestamp: min(299), role: 'assistant', text: 'On it. Creating four route files under src/app/api/chat/.' },
      { id: 'm22', parentId: 'm21', timestamp: min(250), role: 'assistant', text: 'All four routes are up. Sessions returns the workspace tree, history normalizes events, send fires into the agent loop, stream proxies SSE with auth headers.' },
      { id: 'm23', parentId: 'm22', timestamp: min(245), role: 'assistant', text: 'Task complete. Marking as needs_review.' }
    ],
    'agent:grok:subagent:mock-uuid-3': [
      { id: 'm30', parentId: null, timestamp: min(180), role: 'user', text: '[PRJ-INFRAOPS][T001] Set up monitoring dashboards and alerting for the gateway.' },
      { id: 'm31', parentId: 'm30', timestamp: min(179), role: 'assistant', text: 'Starting with latency metrics and error rate panels. Will add token usage tracking as a second pass.' },
      { id: 'm32', parentId: 'm31', timestamp: min(90), role: 'assistant', text: 'Dashboard is live with 4 panels: latency p50/p99, error rate, active sessions, and token burn rate. Setting up alert thresholds next.' }
    ],
    'agent:mantis:subagent:mock-uuid-4': [
      { id: 'm40', parentId: null, timestamp: min(45), role: 'user', text: 'Run a dependency audit across all packages.' },
      { id: 'm41', parentId: 'm40', timestamp: min(44), role: 'assistant', text: 'Scanning now. Will flag any outdated or vulnerable dependencies.' }
    ],
    'agent:star-lord:subagent:mock-uuid-5': []
  }

  const messages = (mockMessages[sessionKey] || []).slice(0, limit)

  return NextResponse.json({ ok: true, messages, cursor: null })
}
