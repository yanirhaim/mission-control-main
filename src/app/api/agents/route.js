import { NextResponse } from 'next/server'

import { AGENT_REGISTRY, DEPARTMENT_COLOR, buildAgentAvatar } from '@/lib/agents'
import { invokeTool } from '@/lib/openclaw'

function extractAgentId(session) {
  const key = session.key ?? ''
  const label = session.label ?? ''
  const parts = key.split(':')

  // Subagent sessions: key = "agent:main:subagent:UUID", label = "mantis-vault-populate"
  if (key.includes(':subagent:') && label) {
    const labelLower = label.toLowerCase()

    for (const agentId of Object.keys(AGENT_REGISTRY)) {
      if (labelLower.startsWith(agentId)) return agentId
    }

    return label.split('-')[0]
  }

  // Main session: "agent:main:main" → "main"
  if (parts.length >= 3) {
    const third = parts[2]

    return third === 'main' ? parts[1] : third
  }

  return parts[parts.length - 1]
}

export async function GET() {
  // Fetch live sessions
  let liveSessions = []

  try {
    const data = await invokeTool('sessions_list', { messageLimit: 0 })

    liveSessions = data?.sessions ?? []
  } catch (err) {
    console.error('[/api/agents] sessions_list failed:', err.message)
  }

  // Build a map: agentId → live session (if exists)
  const sessionByAgentId = {}

  for (const session of liveSessions) {
    const agentId = extractAgentId(session)

    if (!sessionByAgentId[agentId] || session.updatedAt > sessionByAgentId[agentId].updatedAt) {
      sessionByAgentId[agentId] = session
    }
  }

  // Merge registry + live sessions
  const seenIds = new Set()
  const agents = []

  // 1. Registry agents (always present)
  for (const [agentId, meta] of Object.entries(AGENT_REGISTRY)) {
    seenIds.add(agentId)
    const session = sessionByAgentId[agentId]

    const isRunning = session?.status === 'running'
    const hasSession = !!session

    agents.push({
      id: session?.sessionId ?? `registry-${agentId}`,
      sessionKey: session?.key ?? null,
      agentId,
      name: meta.name,
      role: meta.role,
      department: meta.department,
      departmentColor: DEPARTMENT_COLOR[meta.department] ?? 'primary',
      color: meta.color,
      status: isRunning ? 'Active' : hasSession ? 'Idle' : 'Sleeping',
      statusColor: isRunning ? 'success' : hasSession ? 'warning' : 'default',
      model: session?.model ?? null,
      channel: session?.lastChannel ?? session?.channel ?? null,
      totalTokens: session?.totalTokens ?? 0,
      estimatedCostUsd: session?.estimatedCostUsd ?? 0,
      lastSeen: session?.updatedAt ? new Date(session.updatedAt).toISOString() : null,
      avatar: buildAgentAvatar(agentId),
    })
  }

  // 2. Any live sessions NOT in registry (unknown/ad-hoc agents)
  for (const session of liveSessions) {
    const agentId = extractAgentId(session)

    if (seenIds.has(agentId)) continue
    seenIds.add(agentId)

    const isRunning = session.status === 'running'

    agents.push({
      id: session.sessionId,
      sessionKey: session.key,
      agentId,
      name: agentId,
      role: 'Agent',
      department: 'Operations',
      departmentColor: 'primary',
      color: '#6B7280',
      status: isRunning ? 'Active' : 'Idle',
      statusColor: isRunning ? 'success' : 'warning',
      model: session.model ?? null,
      channel: session.lastChannel ?? session.channel ?? null,
      totalTokens: session.totalTokens ?? 0,
      estimatedCostUsd: session.estimatedCostUsd ?? 0,
      lastSeen: session.updatedAt ? new Date(session.updatedAt).toISOString() : null,
      avatar: buildAgentAvatar(agentId),
    })
  }

  return NextResponse.json({ ok: true, agents })
}
