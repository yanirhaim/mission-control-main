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
    avatar: '/images/avatars/luchito.png',
  },
  mantis: {
    name: 'Mantis',
    role: 'Engineering Lead',
    department: 'Engineering',
    color: '#2563EB',
    emoji: '🪲',
    avatar: '/images/avatars/mantis.png',
  },
  rocket: {
    name: 'Rocket',
    role: 'Engineer',
    department: 'Engineering',
    color: '#0F766E',
    emoji: '🚀',
    avatar: '/images/avatars/rocket.png',
  },
  'star-lord': {
    name: 'Star Lord',
    role: 'Architect',
    department: 'Engineering',
    color: '#1D4ED8',
    emoji: '⭐',
    avatar: '/images/avatars/starlord.png',
  },
  grok: {
    name: 'Grok',
    role: 'QA',
    department: 'Engineering',
    color: '#0284C7',
    emoji: '🔬',
    avatar: '/images/avatars/grok.png',
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
 * Resolve an agent ID to its avatar image path.
 * Falls back to null if not found.
 * @param {string} agentId
 * @returns {string|null}
 */
export function agentAvatar(agentId) {
  return AGENT_REGISTRY[agentId]?.avatar ?? null
}

/**
 * Build an avatar for an agent — returns the image path if available,
 * otherwise falls back to an SVG data-URI with initials.
 * @param {string} agentId
 * @returns {string}
 */
export function buildAgentAvatar(agentId) {
  const img = agentAvatar(agentId)

  if (img) return img

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
