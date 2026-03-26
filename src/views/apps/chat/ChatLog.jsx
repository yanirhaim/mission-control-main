import { useRef, useEffect, useCallback } from 'react'

import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import PerfectScrollbar from 'react-perfect-scrollbar'

import { AGENT_REGISTRY, buildAgentAvatar, agentDisplayName } from '@/lib/agents'

/**
 * Resolve sender display info from message role, thread agentId, and workspace.
 *
 * - role "assistant" → the thread's agent (from AGENT_REGISTRY)
 * - role "user" in luchito workspace → Yanir (operator)
 * - role "user" in dev workspace → "System" / operator injection
 */
const resolveSender = (message, activeThread, activeWorkspace) => {
  if (message.role === 'assistant') {
    const agentId = activeThread?.agentId
    const agent = AGENT_REGISTRY[agentId]

    return {
      name: agent?.name ?? agentDisplayName(agentId),
      role: agent?.role ?? 'Agent',
      avatar: buildAgentAvatar(agentId)
    }
  }

  // role === 'user'
  if (activeWorkspace?.id === 'luchito') {
    return {
      name: 'Yanir',
      role: 'Operator',
      avatar: null
    }
  }

  // Dev workspace — user messages are system/operator injections
  return {
    name: 'System',
    role: 'Operator injection',
    avatar: null
  }
}

const ChatLog = ({ messages, activeThread, activeWorkspace }) => {
  const scrollRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    if (!scrollRef.current?._container) return

    scrollRef.current._container.scrollTop = scrollRef.current._container.scrollHeight
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [activeThread?.sessionKey, messages.length, scrollToBottom])

  return (
    <PerfectScrollbar ref={scrollRef} options={{ wheelPropagation: false }} className='min-is-0 grow'>
      <div className='mx-auto flex w-full max-w-[980px] flex-col gap-1 px-4 py-6 md:px-8'>
        {messages.map(message => {
          const sender = resolveSender(message, activeThread, activeWorkspace)

          return (
            <div key={message.id} className='flex gap-4 rounded-3xl px-4 py-4'>
              {sender.avatar ? (
                <Avatar alt={sender.name} src={sender.avatar} className='is-11 bs-11' />
              ) : (
                <Avatar className='is-11 bs-11' sx={{ bgcolor: 'var(--mui-palette-primary-main)', fontSize: '1rem' }}>
                  {sender.name[0]}
                </Avatar>
              )}

              <div className='min-is-0 flex-auto'>
                <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
                  <Typography className='text-sm font-semibold text-textPrimary'>{sender.name}</Typography>
                  <Typography className='text-xs text-textSecondary'>{sender.role}</Typography>
                  <Typography className='text-xs text-textDisabled'>
                    {new Date(message.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    })}
                  </Typography>
                </div>

                <Typography className='mt-1 whitespace-pre-wrap text-[15px] leading-7 text-textPrimary' style={{ wordBreak: 'break-word' }}>
                  {message.text}
                </Typography>
              </div>
            </div>
          )
        })}
      </div>
    </PerfectScrollbar>
  )
}

export default ChatLog
