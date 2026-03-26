const minutesAgo = minutes => new Date(Date.now() - minutes * 60 * 1000)

export const initialChatData = {
  profileUser: {
    id: 1,
    avatar: '/images/avatars/luchito.png',
    fullName: 'Luchito',
    role: 'CEO',
    status: 'online'
  },
  members: [
    {
      id: 1,
      fullName: 'Luchito',
      role: 'CEO',
      avatar: '/images/avatars/luchito.png',
      status: 'online'
    },
    {
      id: 2,
      fullName: 'Mantis',
      role: 'Engineering Lead',
      avatar: '/images/avatars/mantis.png',
      status: 'offline'
    },
    {
      id: 3,
      fullName: 'Rocket',
      role: 'Engineer',
      avatar: '/images/avatars/rocket.png',
      status: 'busy'
    },
    {
      id: 8,
      fullName: 'Star Lord',
      role: 'Architect',
      avatar: '/images/avatars/starlord.png',
      status: 'online'
    },
    {
      id: 11,
      fullName: 'Grok',
      role: 'QA',
      avatar: '/images/avatars/grok.png',
      status: 'online'
    },
    {
      id: 12,
      fullName: 'Yanir',
      role: 'Founder',
      avatarColor: 'primary',
      status: 'online'
    }
  ],
  workspaces: [
    {
      id: 'mc',
      name: 'Mission Control',
      label: 'MC',
      accent: '#5865F2',
      channels: [
        {
          id: 'launch-ops',
          name: 'launch-ops',
          kind: 'text',
          threads: [
            {
              id: 'launch-checklist',
              title: 'Launch checklist v7',
              summary: 'Go-live sequencing, owner handoffs, and blockers.',
              unread: 4,
              participants: [1, 2, 3, 8],
              pinned: ['Escalation matrix', 'Rollback owner map', 'Support comms draft'],
              messages: [
                {
                  id: 'launch-1',
                  senderId: 3,
                  message: 'Pushed the final launch states. Need FE sign-off on the command panel spacing.',
                  time: minutesAgo(165)
                },
                {
                  id: 'launch-2',
                  senderId: 2,
                  message: 'Spacing pass is clean. I still want one more responsive check under 1280px.',
                  time: minutesAgo(151)
                },
                {
                  id: 'launch-3',
                  senderId: 8,
                  message: 'Support rota is assigned. I pinned the escalation matrix and rollback owner map.',
                  time: minutesAgo(120)
                },
                {
                  id: 'launch-4',
                  senderId: 1,
                  message: 'Ship it after the last mobile QA pass. Keep this thread focused on launch-critical updates only.',
                  time: minutesAgo(92)
                }
              ]
            },
            {
              id: 'rollback-plan',
              title: 'Rollback owner map',
              summary: 'Fallback triggers, owner chain, and handoff timing.',
              unread: 1,
              participants: [1, 8],
              pinned: ['Rollback matrix'],
              messages: [
                {
                  id: 'rollback-1',
                  senderId: 8,
                  message: 'I want approval on who calls rollback if payment latency crosses the threshold.',
                  time: minutesAgo(74)
                },
                {
                  id: 'rollback-2',
                  senderId: 1,
                  message: 'Ops owns the call, engineering confirms blast radius within 3 minutes.',
                  time: minutesAgo(61)
                }
              ]
            }
          ]
        },
        {
          id: 'design-review',
          name: 'design-review',
          kind: 'text',
          threads: [
            {
              id: 'shell-direction',
              title: 'Shell direction',
              summary: 'Navigation, density, and structure decisions for the collaboration shell.',
              unread: 1,
              participants: [1, 2, 3, 12],
              pinned: ['Type scale notes', 'Motion references'],
              messages: [
                {
                  id: 'design-1',
                  senderId: 12,
                  message: 'The current left rail is clean, but it still reads too much like generic SaaS.',
                  time: minutesAgo(240)
                },
                {
                  id: 'design-2',
                  senderId: 3,
                  message: 'Agreed. The channel list should feel denser and more operational, less card-based.',
                  time: minutesAgo(212)
                },
                {
                  id: 'design-3',
                  senderId: 1,
                  message: 'Structure like Discord is right. Styling should stay ours.',
                  time: minutesAgo(43)
                }
              ]
            }
          ]
        },
        {
          id: 'announcements',
          name: 'announcements',
          kind: 'announce',
          threads: [
            {
              id: 'quarterly-brief',
              title: 'Quarterly review move',
              summary: 'Stakeholder-facing updates and schedule changes.',
              unread: 0,
              participants: [1, 11],
              pinned: ['Weekly cadence', 'Roadmap deck'],
              messages: [
                {
                  id: 'announce-1',
                  senderId: 11,
                  message: 'Quarterly review moved to Thursday, 14:00. Slides lock one hour earlier.',
                  time: minutesAgo(310)
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'rd',
      name: 'Research Deck',
      label: 'RD',
      accent: '#3BA55C',
      channels: [
        {
          id: 'insights',
          name: 'insights',
          kind: 'text',
          threads: [
            {
              id: 'ops-signals',
              title: 'Ops user signals',
              summary: 'Raw user signals and synthesis notes.',
              unread: 2,
              participants: [1, 12, 8],
              pinned: ['Interview clips', 'Jobs to be done'],
              messages: [
                {
                  id: 'insights-1',
                  senderId: 12,
                  message: 'Ops users keep asking for a single place to track decisions, owners, and time-sensitive chatter.',
                  time: minutesAgo(130)
                },
                {
                  id: 'insights-2',
                  senderId: 8,
                  message: 'That matches what I hear internally. They want chat, but with more structure around channels and context.',
                  time: minutesAgo(115)
                }
              ]
            }
          ]
        },
        {
          id: 'field-notes',
          name: 'field-notes',
          kind: 'text',
          threads: [
            {
              id: 'command-room-language',
              title: 'Command room language',
              summary: 'Loose notes from calls, demos, and support sessions.',
              unread: 0,
              participants: [1, 8],
              pinned: ['Customer language'],
              messages: [
                {
                  id: 'field-1',
                  senderId: 8,
                  message: 'People naturally describe this as a command room, not a chat page.',
                  time: minutesAgo(55)
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  activeWorkspaceId: 'mc',
  activeChannelId: 'launch-ops',
  activeThreadId: 'launch-checklist'
}
