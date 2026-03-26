import { promises as fs } from 'fs'
import path from 'path'

import { NextResponse } from 'next/server'

import { agentDisplayName, agentColor } from '@/lib/agents'
import { projects as mockProjects, tasks as mockTasks } from '@/data/mock/tasks'

const VAULT_PROJECTS_DIR = '/root/.openclaw/workspace/vault/projects'

// In-memory state store — persists across requests within a single server process.
// On first load: seeded from vault (if populated) or mock data.
// Mutations via PATCH update this store AND write back to vault when possible.
let stateCache = null

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)

  if (!match) return {}
  const fm = {}

  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':')

    if (colon === -1) continue
    fm[line.slice(0, colon).trim()] = line.slice(colon + 1).trim()
  }

  return fm
}

async function loadFromVault() {
  try {
    await fs.access(VAULT_PROJECTS_DIR)
  } catch {
    return null
  }

  const projectDirs = await fs.readdir(VAULT_PROJECTS_DIR)

  if (projectDirs.length === 0) return null

  const projects = []
  const tasks = []

  for (const dir of projectDirs) {
    const dirPath = path.join(VAULT_PROJECTS_DIR, dir)
    const stat = await fs.stat(dirPath)

    if (!stat.isDirectory()) continue

    let projectMeta = { projectId: dir, projectName: dir, status: 'active' }

    try {
      const content = await fs.readFile(path.join(dirPath, '_PROJECT.md'), 'utf8')
      const fm = parseFrontmatter(content)

      if (fm.projectId) projectMeta.projectId = fm.projectId
      if (fm.projectName) projectMeta.projectName = fm.projectName
      if (fm.status) projectMeta.status = fm.status
    } catch { /* no _PROJECT.md */ }

    projects.push(projectMeta)

    const files = await fs.readdir(dirPath)

    for (const file of files) {
      if (!file.match(/^T\d+.*\.md$/)) continue

      try {
        const content = await fs.readFile(path.join(dirPath, file), 'utf8')
        const fm = parseFrontmatter(content)

        const deliverableMatch = content.match(/## Deliverable\n([\s\S]*?)(?:\n##|$)/)
        const activityMatch = content.match(/## Activity Log\n([\s\S]*?)(?:\n##|$)/)
        const criteriaMatch = content.match(/## Acceptance Criteria\n([\s\S]*?)(?:\n##|$)/)

        const rawAssignedTo = fm.assignedTo || 'unassigned'

        tasks.push({
          id: fm.taskId || file.replace('.md', ''),
          title: fm.title || file.replace('.md', ''),
          projectId: fm.projectId || projectMeta.projectId,
          projectName: fm.projectName || projectMeta.projectName,
          status: fm.status || 'in_queue',
          assignedTo: rawAssignedTo,
          assignedToDisplay: agentDisplayName(rawAssignedTo),
          assignedToColor: agentColor(rawAssignedTo),
          created: fm.created || '',
          updated: fm.updated || '',
          dependsOn: fm.dependsOn || null,
          description: fm.description || '',
          notes: fm.notes || '',
          acceptanceCriteria: criteriaMatch
            ? criteriaMatch[1].split('\n').map(l => l.replace(/^[-*]\s*/, '').trim()).filter(Boolean)
            : [],
          activityLog: activityMatch
            ? activityMatch[1].split('\n').map(l => l.replace(/^[-*]\s*/, '').trim()).filter(Boolean)
            : [],
          deliverable: deliverableMatch ? deliverableMatch[1].trim() : '',
          _vaultPath: path.join(dirPath, file),
        })
      } catch (err) {
        console.warn(`[tasks] skipping ${file}:`, err.message)
      }
    }
  }

  return { projects, tasks }
}

async function getState() {
  if (stateCache) return stateCache

  const vaultData = await loadFromVault()
  const source = vaultData ? 'vault' : 'mock'

  stateCache = {
    source,
    projects: vaultData ? vaultData.projects : mockProjects,
    tasks: (vaultData ? vaultData.tasks : mockTasks).map(t => ({
      ...t,
      assignedToDisplay: agentDisplayName(t.assignedTo),
      assignedToColor: agentColor(t.assignedTo),
    })),
  }

  return stateCache
}

export async function GET() {
  try {
    const state = await getState()

    return NextResponse.json({ ok: true, source: state.source, projects: state.projects, tasks: state.tasks })
  } catch (err) {
    console.error('[GET /api/tasks]', err)

    return NextResponse.json(
      { ok: false, error: err.message, source: 'error', projects: mockProjects, tasks: mockTasks },
      { status: 500 }
    )
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json()
    const { taskId, status } = body

    if (!taskId || !status) {
      return NextResponse.json({ ok: false, error: 'taskId and status are required' }, { status: 400 })
    }

    const validStatuses = ['in_queue', 'in_progress', 'needs_review', 'finished']

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ ok: false, error: `Invalid status: ${status}` }, { status: 400 })
    }

    const state = await getState()
    const task = state.tasks.find(t => t.id === taskId)

    if (!task) {
      return NextResponse.json({ ok: false, error: `Task not found: ${taskId}` }, { status: 404 })
    }

    const today = new Date().toISOString().slice(0, 10)
    const actor = status === 'finished' ? 'Yanir' : task.assignedTo
    const logEntry = `${today} - Status changed to ${status} by ${actor}`

    task.status = status
    task.updated = today
    task.activityLog = [...(task.activityLog ?? []), logEntry]

    // Write back to vault file if it has a path
    if (task._vaultPath) {
      try {
        let content = await fs.readFile(task._vaultPath, 'utf8')

        content = content.replace(/^(status:\s*).*$/m, `$1${status}`)
        content = content.replace(/^(updated:\s*).*$/m, `$1${today}`)

        content = content.replace(
          /(## Activity Log\n[\s\S]*?)(\n## |\n$|$)/,
          (_, logSection, after) => `${logSection.trimEnd()}\n- ${logEntry}${after}`
        )

        await fs.writeFile(task._vaultPath, content, 'utf8')
      } catch (err) {
        console.warn('[tasks PATCH] vault write failed:', err.message)
      }
    }

    return NextResponse.json({ ok: true, task })
  } catch (err) {
    console.error('[PATCH /api/tasks]', err)

    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}

// Allow resetting state cache (e.g. after vault changes)
export async function DELETE() {
  stateCache = null

  return NextResponse.json({ ok: true, message: 'State cache cleared' })
}
