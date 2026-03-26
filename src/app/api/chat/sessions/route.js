import { NextResponse } from 'next/server'

import { invokeTool } from '@/lib/openclaw'

const LABEL_REGEX = /^\[([A-Z0-9-]+)\]\[([A-Z0-9-]+)\]\s*(.+)?/

/**
 * GET /api/chat/sessions
 * Returns full workspace/channel/thread tree for the chat sidebar.
 */
export async function GET() {
  // --- Fetch live sessions ---
  let liveSessions = []
  let sessionsOk = true

  try {
    const data = await invokeTool('sessions_list', { messageLimit: 0 })
    liveSessions = data?.sessions ?? []
  } catch (err) {
    console.error('[/api/chat/sessions] sessions_list failed:', err.message)
    sessionsOk = false
  }

  // Build a set of active session keys for quick lookup
  const activeSessionKeys = new Set(liveSessions.map(s => s.key))

  // --- Fetch tasks ---
  let tasks = []
  let projects = []
  let tasksOk = true

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/tasks`, { cache: 'no-store' })
    const data = await res.json()
    tasks = data?.tasks ?? []
    projects = data?.projects ?? []
  } catch (err) {
    console.error('[/api/chat/sessions] /api/tasks fetch failed:', err.message)
    tasksOk = false
  }

  // Build maps for fast lookup
  const taskById = {}
  for (const task of tasks) {
    taskById[task.id] = task
  }

  const projectById = {}
  for (const project of projects) {
    projectById[project.projectId] = project
  }

  // --- Determine thread status ---
  function getThreadStatus(taskId, sessionKeyExists) {
    if (!tasksOk || !taskId) {
      return 'active'
    }

    const task = taskById[taskId]

    if (!task) {
      return sessionKeyExists ? 'active' : 'queued'
    }

    switch (task.status) {
      case 'in_progress':
        return 'active'
      case 'in_queue':
        return 'queued'
      case 'needs_review':
      case 'finished':
        return 'completed'
      default:
        return sessionKeyExists ? 'active' : 'queued'
    }
  }

  // --- Parse sessions into threads ---
  // Channels keyed by projectId → { threads }
  const channelMap = {} // projectId → thread[]
  const uncategorizedThreads = []

  for (const session of liveSessions) {
    const sessionKey = session.key
    const label = session.label ?? ''
    const agentId = sessionKey.split(':')[1] ?? 'unknown'

    const match = LABEL_REGEX.exec(label)

    if (match) {
      const projectId = match[1]
      const taskId = `${match[1]}-${match[2]}`
      const rawTitle = match[3]?.trim()
      const title = rawTitle ? `${match[2]} — ${rawTitle}` : taskId

      const thread = {
        sessionKey,
        title,
        taskId,
        projectId,
        status: getThreadStatus(taskId, true),
        agentId,
      }

      if (!channelMap[projectId]) channelMap[projectId] = []
      channelMap[projectId].push(thread)
    } else {
      uncategorizedThreads.push({
        sessionKey,
        title: label || sessionKey,
        taskId: null,
        projectId: null,
        status: 'active',
        agentId,
      })
    }
  }

  // --- Also add queued/completed task threads (no active session) ---
  if (tasksOk) {
    for (const task of tasks) {
      const { id: taskId, projectId, title, status } = task

      // Skip tasks that already have a live session thread
      const alreadyPresent = channelMap[projectId]?.some(t => t.taskId === taskId)
      if (alreadyPresent) continue

      // Only include non-active task statuses as "cold" threads
      if (status === 'in_queue' || status === 'needs_review' || status === 'finished') {
        if (!channelMap[projectId]) channelMap[projectId] = []

        channelMap[projectId].push({
          sessionKey: null,
          title: `${taskId.split('-').slice(1).join('-')} — ${title}`,
          taskId,
          projectId,
          status: getThreadStatus(taskId, false),
          agentId: task.assignedTo ?? 'unassigned',
        })
      } else if (status === 'in_progress') {
        // in_progress with no matching live session — still show as active
        if (!channelMap[projectId]) channelMap[projectId] = []

        channelMap[projectId].push({
          sessionKey: null,
          title: `${taskId.split('-').slice(1).join('-')} — ${title}`,
          taskId,
          projectId,
          status: 'active',
          agentId: task.assignedTo ?? 'unassigned',
        })
      }
    }
  }

  // --- Build Dev workspace channels ---
  const devChannels = []

  for (const [projectId, threads] of Object.entries(channelMap)) {
    const project = projectById[projectId]
    devChannels.push({
      id: projectId,
      name: project?.projectName ?? projectId,
      threads,
    })
  }

  // Always include Uncategorized channel
  devChannels.push({
    id: 'uncategorized',
    name: 'Uncategorized',
    threads: uncategorizedThreads,
  })

  // --- Luchito workspace (always present) ---
  const luchito = {
    id: 'luchito',
    name: 'Luchito',
    channels: [
      {
        id: 'direct',
        name: 'direct',
        threads: [
          {
            sessionKey: 'agent:main:main',
            title: 'Direct line',
            taskId: null,
            projectId: null,
            status: 'active',
            agentId: 'main',
          },
        ],
      },
    ],
  }

  const dev = {
    id: 'dev',
    name: 'Dev',
    channels: devChannels,
  }

  return NextResponse.json({ ok: true, workspaces: [dev, luchito] })
}
