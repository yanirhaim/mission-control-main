/**
 * Shared agent registry — single source of truth for all agent metadata.
 * Used by /api/agents, /api/tasks, and any view that needs to resolve
 * an agent ID to a display name, color, role, or department.
 */

export const AGENT_REGISTRY = {
  main: {
    name: 'Luchito',
    role: 'CEO',
    department: 'Leadership',
    color: '#7C3AED',
    emoji: '🦁',
  },
  mantis: {
    name: 'Mantis',
    role: 'Engineering Lead',
    department: 'Engineering',
    color: '#2563EB',
    emoji: '🪲',
  },
  rocket: {
    name: 'Rocket',
    role: 'Engineer',
    department: 'Engineering',
    color: '#0F766E',
    emoji: '🚀',
  },
  'star-lord': {
    name: 'Star Lord',
    role: 'Architect',
    department: 'Engineering',
    color: '#1D4ED8',
    emoji: '⭐',
  },
  grok: {
    name: 'Grok',
    role: 'QA',
    department: 'Engineering',
    color: '#0284C7',
    emoji: '🔬',
  },
}

export const DEPARTMENT_COLOR = {
  Leadership: 'secondary',
  Engineering: 'info',
  Product: 'success',
  Operations: 'primary',
  Support: 'error',
}

/**
 * Resolve an agent ID to its display name.
 * Falls back to the raw ID if not found in the registry.
 * @param {string} agentId
 * @returns {string}
 */
export function agentDisplayName(agentId) {
  return AGENT_REGISTRY[agentId]?.name ?? agentId
}

/**
 * Resolve an agent ID to its avatar color.
 * Falls back to a neutral grey if not found.
 * @param {string} agentId
 * @returns {string}
 */
export function agentColor(agentId) {
  return AGENT_REGISTRY[agentId]?.color ?? '#6B7280'
}

/**
 * Build an SVG data-URI avatar for an agent.
 * @param {string} agentId
 * @returns {string} data:image/svg+xml URI
 */
export function buildAgentAvatar(agentId) {
  const name = agentDisplayName(agentId)
  const color = agentColor(agentId)

  const initials = name
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320"><rect width="320" height="320" fill="${color}"/><text x="50%" y="53%" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-family="Arial,sans-serif" font-size="108" font-weight="700">${initials}</text></svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
