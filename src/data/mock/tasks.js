export const projects = [
  {
    projectId: 'PRJ-MISSIONCTRL',
    projectName: 'Mission Control Core',
    status: 'active'
  },
  {
    projectId: 'PRJ-IMPOSTER',
    projectName: "Who's The Imposter",
    status: 'active'
  },
  {
    projectId: 'PRJ-OPENCLAW',
    projectName: 'OpenClaw Org Buildout',
    status: 'paused'
  }
]

export const tasks = [
  {
    id: 'PRJ-MISSIONCTRL-T001',
    title: 'Define task-based workflow rules',
    projectId: 'PRJ-MISSIONCTRL',
    projectName: 'Mission Control Core',
    status: 'finished',
    assignedTo: 'ceo-agent',
    created: '2026-03-18',
    updated: '2026-03-20',
    dependsOn: null,
    description:
      'Document the operating rules for projects, tasks, ownership, and review flow so all future work runs through a strict task system.',
    acceptanceCriteria: [
      'Lifecycle statuses are defined and mutually exclusive.',
      'Project and task ID conventions are documented.',
      'CEO and worker responsibilities are explicitly separated.'
    ],
    notes:
      'This task established the baseline workflow that the tasks screen now visualizes.',
    activityLog: [
      '2026-03-18 - Task created by Yanir',
      '2026-03-18 - Status changed to in_progress by ceo-agent',
      '2026-03-19 - Status changed to needs_review by ceo-agent',
      '2026-03-20 - Status changed to finished by Yanir'
    ],
    deliverable:
      'Workflow specification covering project/task hierarchy, status ownership, dependencies, and dispatch rules.'
  },
  {
    id: 'PRJ-MISSIONCTRL-T002',
    title: 'Design tasks list UX for operators',
    projectId: 'PRJ-MISSIONCTRL',
    projectName: 'Mission Control Core',
    status: 'needs_review',
    assignedTo: 'frontend-dev',
    created: '2026-03-20',
    updated: '2026-03-23',
    dependsOn: 'PRJ-MISSIONCTRL-T001',
    description:
      'Translate the workflow into a dashboard-friendly tasks experience that can scale from global operations view to project-specific review.',
    acceptanceCriteria: [
      'The tasks screen supports cross-project visibility.',
      'Blocked tasks are visible and cannot start early.',
      'Approval flow is separated from standard agent actions.'
    ],
    notes:
      'Invoice list layout chosen as the main inspiration. Board view intentionally deferred.',
    activityLog: [
      '2026-03-20 - Task created by ceo-agent',
      '2026-03-21 - Status changed to in_progress by frontend-dev',
      '2026-03-23 - Status changed to needs_review by frontend-dev'
    ],
    deliverable:
      'Annotated UI plan for the global tasks table, drawer review flow, and project filtering.'
  },
  {
    id: 'PRJ-MISSIONCTRL-T003',
    title: 'Implement tasks view v1',
    projectId: 'PRJ-MISSIONCTRL',
    projectName: 'Mission Control Core',
    status: 'in_progress',
    assignedTo: 'frontend-dev',
    created: '2026-03-23',
    updated: '2026-03-24',
    dependsOn: 'PRJ-MISSIONCTRL-T002',
    description:
      'Build the first production-ready tasks route with global filtering, review drawer, and workflow-safe state transitions.',
    acceptanceCriteria: [
      'All tasks load by default across projects.',
      'Status transitions follow the workflow rules.',
      'Approval is available only in Yanir approval mode.'
    ],
    notes:
      'This task depends on the UX plan being finished first, but the mock state still shows it in progress for the demo.',
    activityLog: [
      '2026-03-23 - Task created by ceo-agent',
      '2026-03-24 - Status changed to in_progress by frontend-dev'
    ],
    deliverable: ''
  },
  {
    id: 'PRJ-IMPOSTER-T004',
    title: 'Define movie category word list',
    projectId: 'PRJ-IMPOSTER',
    projectName: "Who's The Imposter",
    status: 'finished',
    assignedTo: 'product-manager',
    created: '2026-03-17',
    updated: '2026-03-18',
    dependsOn: null,
    description:
      'Create the initial movie category content set, balanced across difficulty levels and ready for implementation.',
    acceptanceCriteria: [
      'Word list covers easy, medium, and hard tiers.',
      'Entries are appropriate for the game audience.',
      'The list is ready for backend implementation.'
    ],
    notes:
      'Approved by Yanir after a small pass on overlap between medium and hard entries.',
    activityLog: [
      '2026-03-17 - Task created by ceo-agent',
      '2026-03-17 - Status changed to in_progress by product-manager',
      '2026-03-18 - Status changed to needs_review by product-manager',
      '2026-03-18 - Status changed to finished by Yanir'
    ],
    deliverable:
      'Movie category definition with tiered entries and notes on ambiguity handling.'
  },
  {
    id: 'PRJ-IMPOSTER-T005',
    title: 'Implement movie DB entries',
    projectId: 'PRJ-IMPOSTER',
    projectName: "Who's The Imposter",
    status: 'needs_review',
    assignedTo: 'backend-dev',
    created: '2026-03-18',
    updated: '2026-03-22',
    dependsOn: 'PRJ-IMPOSTER-T004',
    description:
      'Add the approved movie entries to the category data store and preserve the existing schema conventions.',
    acceptanceCriteria: [
      '20 movie entries exist with correct difficulty tags.',
      'No duplicate titles were introduced.',
      'Existing categories remain untouched.'
    ],
    notes:
      'Waiting for Yanir to verify content quality before the UI task can be finalized.',
    activityLog: [
      '2026-03-18 - Task created by ceo-agent',
      '2026-03-19 - Status changed to in_progress by backend-dev',
      '2026-03-22 - Status changed to needs_review by backend-dev'
    ],
    deliverable:
      'Database/category payload with 20 movie titles tagged by difficulty.'
  },
  {
    id: 'PRJ-IMPOSTER-T006',
    title: 'Update category selector UI',
    projectId: 'PRJ-IMPOSTER',
    projectName: "Who's The Imposter",
    status: 'in_queue',
    assignedTo: 'frontend-dev',
    created: '2026-03-18',
    updated: '2026-03-18',
    dependsOn: 'PRJ-IMPOSTER-T005',
    description:
      'Expose the new Movies category in the game flow once the backend content is approved and finalized.',
    acceptanceCriteria: [
      'Movies appears in the selector in the correct order.',
      'The selector uses the existing UI pattern.',
      'No unfinished category appears to players.'
    ],
    notes:
      'Blocked until the database task is approved and marked finished by Yanir.',
    activityLog: ['2026-03-18 - Task created by ceo-agent'],
    deliverable: ''
  },
  {
    id: 'PRJ-OPENCLAW-T001',
    title: 'Build company structure draft',
    projectId: 'PRJ-OPENCLAW',
    projectName: 'OpenClaw Org Buildout',
    status: 'in_queue',
    assignedTo: 'ops-strategy',
    created: '2026-03-22',
    updated: '2026-03-22',
    dependsOn: null,
    description:
      'Draft the initial department map, reporting lines, and role owners for the OpenClaw operating model.',
    acceptanceCriteria: [
      'Department list is complete for v1.',
      'Every department has an owner.',
      'Key cross-functional dependencies are identified.'
    ],
    notes:
      'Project is paused, so the task remains queued until Yanir reactivates the project.',
    activityLog: ['2026-03-22 - Task created by Yanir'],
    deliverable: ''
  }
]
