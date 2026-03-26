import { NextResponse } from 'next/server'

/**
 * GET /api/chat/sessions
 * Mock endpoint — returns the workspace/channel/thread tree for the sidebar.
 * Replace with real gateway integration once backend is ready.
 */
export async function GET() {
  const data = {
    ok: true,
    workspaces: [
      {
        id: 'dev',
        name: 'Dev',
        label: 'DV',
        accent: '#3BA55C',
        channels: [
          {
            id: 'PRJ-MISSIONCTRL',
            name: 'Mission Control',
            threads: [
              {
                sessionKey: 'agent:mantis:subagent:mock-uuid-1',
                title: 'T004 - Chat UI rebuild',
                taskId: 'PRJ-MISSIONCTRL-T004',
                projectId: 'PRJ-MISSIONCTRL',
                status: 'active',
                agentId: 'mantis'
              },
              {
                sessionKey: 'agent:rocket:subagent:mock-uuid-2',
                title: 'T003 - API route scaffold',
                taskId: 'PRJ-MISSIONCTRL-T003',
                projectId: 'PRJ-MISSIONCTRL',
                status: 'completed',
                agentId: 'rocket'
              },
              {
                sessionKey: 'agent:star-lord:subagent:mock-uuid-5',
                title: 'T005 - Dashboard widgets',
                taskId: 'PRJ-MISSIONCTRL-T005',
                projectId: 'PRJ-MISSIONCTRL',
                status: 'queued',
                agentId: 'star-lord'
              }
            ]
          },
          {
            id: 'PRJ-INFRAOPS',
            name: 'Infra Ops',
            threads: [
              {
                sessionKey: 'agent:grok:subagent:mock-uuid-3',
                title: 'T001 - Monitoring setup',
                taskId: 'PRJ-INFRAOPS-T001',
                projectId: 'PRJ-INFRAOPS',
                status: 'active',
                agentId: 'grok'
              }
            ]
          },
          {
            id: 'uncategorized',
            name: 'Uncategorized',
            threads: [
              {
                sessionKey: 'agent:mantis:subagent:mock-uuid-4',
                title: 'Exploratory session — dependency audit',
                taskId: null,
                projectId: null,
                status: 'active',
                agentId: 'mantis'
              }
            ]
          }
        ]
      },
      {
        id: 'luchito',
        name: 'Luchito',
        label: 'LC',
        accent: '#7C3AED',
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
                agentId: 'main'
              }
            ]
          }
        ]
      }
    ]
  }

  return NextResponse.json(data)
}
