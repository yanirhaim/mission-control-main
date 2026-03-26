'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import classNames from 'classnames'

import { useSettings } from '@core/hooks/useSettings'
import { commonLayoutClasses } from '@layouts/utils/layoutClasses'
import SidebarLeft from './SidebarLeft'
import ChatContent from './ChatContent'

const POLL_INTERVAL = 30_000

const ChatWrapper = () => {
  // ── Session / sidebar state ──
  const [workspaces, setWorkspaces] = useState(null)
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(null)
  const [activeChannelId, setActiveChannelId] = useState(null)
  const [activeThreadId, setActiveThreadId] = useState(null) // sessionKey
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── Message state ──
  const [messages, setMessages] = useState([])
  const [messagesLoading, setMessagesLoading] = useState(false)

  const messageInputRef = useRef(null)
  const { settings } = useSettings()
  const isBelowLgScreen = useMediaQuery(theme => theme.breakpoints.down('lg'))
  const isBelowMdScreen = useMediaQuery(theme => theme.breakpoints.down('md'))
  const isBelowSmScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ── Derived: active workspace / channel / thread ──
  const activeWorkspace = useMemo(
    () => workspaces?.find(ws => ws.id === activeWorkspaceId) ?? workspaces?.[0] ?? null,
    [workspaces, activeWorkspaceId]
  )

  const activeChannel = useMemo(
    () => activeWorkspace?.channels.find(ch => ch.id === activeChannelId) ?? activeWorkspace?.channels[0] ?? null,
    [activeWorkspace, activeChannelId]
  )

  const activeThread = useMemo(
    () => activeChannel?.threads.find(t => t.sessionKey === activeThreadId) ?? activeChannel?.threads[0] ?? null,
    [activeChannel, activeThreadId]
  )

  // ── Fetch sessions ──
  const fetchSessions = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true)

      const res = await fetch('/api/chat/sessions')
      const data = await res.json()

      if (!data.ok) throw new Error('Failed to load sessions')

      setWorkspaces(data.workspaces)
      setError(null)

      // Set defaults only on first load
      if (isInitial) {
        const firstWs = data.workspaces[0]
        const firstCh = firstWs?.channels[0]
        const firstTh = firstCh?.threads[0]

        setActiveWorkspaceId(firstWs?.id ?? null)
        setActiveChannelId(firstCh?.id ?? null)
        setActiveThreadId(firstTh?.sessionKey ?? null)
      }
    } catch (err) {
      if (isInitial) setError(err.message)
    } finally {
      if (isInitial) setLoading(false)
    }
  }, [])

  // Initial fetch + polling
  useEffect(() => {
    fetchSessions(true)

    const interval = setInterval(() => fetchSessions(false), POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [fetchSessions])

  // ── Load history when thread changes ──
  const loadHistory = useCallback(async sessionKey => {
    if (!sessionKey) return

    setMessagesLoading(true)

    try {
      const res = await fetch(`/api/chat/history?sessionKey=${encodeURIComponent(sessionKey)}&limit=50`)
      const data = await res.json()

      setMessages(data.messages ?? [])
    } catch {
      setMessages([])
    } finally {
      setMessagesLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeThread?.sessionKey) {
      loadHistory(activeThread.sessionKey)
    }
  }, [activeThread?.sessionKey, loadHistory])

  // ── SSE for live messages ──
  useEffect(() => {
    const sessionKey = activeThread?.sessionKey

    if (!sessionKey) return

    const encoded = encodeURIComponent(sessionKey)
    const es = new EventSource(`/api/chat/stream/${encoded}`)

    es.onmessage = event => {
      try {
        const msg = JSON.parse(event.data)

        if (msg.role === 'user' || msg.role === 'assistant') {
          setMessages(prev => {
            // Deduplicate by id
            if (prev.some(m => m.id === msg.id)) return prev

            return [...prev, msg]
          })
        }
      } catch {}
    }

    es.onerror = () => {
      es.close()
    }

    return () => es.close()
  }, [activeThread?.sessionKey])

  // ── Workspace selection ──
  const selectWorkspace = useCallback(workspaceId => {
    const ws = workspaces?.find(w => w.id === workspaceId)

    if (!ws) return

    setActiveWorkspaceId(workspaceId)
    setActiveChannelId(ws.channels[0]?.id ?? null)
    setActiveThreadId(ws.channels[0]?.threads[0]?.sessionKey ?? null)
  }, [workspaces])

  // ── Thread selection ──
  const selectThread = useCallback((channelId, sessionKey) => {
    setActiveChannelId(channelId)
    setActiveThreadId(sessionKey)
  }, [])

  // ── Send message ──
  const sendMsg = useCallback(async msg => {
    const sessionKey = activeThread?.sessionKey

    if (!sessionKey) return

    // Optimistic
    const optimistic = {
      id: `optimistic-${Date.now()}`,
      parentId: null,
      timestamp: new Date().toISOString(),
      role: 'user',
      text: msg
    }

    setMessages(prev => [...prev, optimistic])

    try {
      await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionKey, message: msg })
      })
    } catch {}

    // The SSE stream will deliver the real message and agent reply
  }, [activeThread?.sessionKey])

  // ── Loading state ──
  if (loading) {
    return (
      <div className={classNames(commonLayoutClasses.contentHeightFixed, 'flex items-center justify-center is-full')}>
        <CircularProgress />
      </div>
    )
  }

  // ── Error state ──
  if (error) {
    return (
      <div className={classNames(commonLayoutClasses.contentHeightFixed, 'flex flex-col items-center justify-center gap-4 is-full')}>
        <Typography color='error'>{error}</Typography>
        <Button variant='outlined' onClick={() => fetchSessions(true)}>
          Retry
        </Button>
      </div>
    )
  }

  const backdropOpen = isBelowMdScreen && sidebarOpen

  return (
    <div
      className={classNames(commonLayoutClasses.contentHeightFixed, 'flex is-full overflow-hidden rounded relative', {
        border: settings.skin === 'bordered',
        'shadow-md': settings.skin !== 'bordered'
      })}
    >
      <SidebarLeft
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        activeChannel={activeChannel}
        activeThread={activeThread}
        selectWorkspace={selectWorkspace}
        selectThread={selectThread}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isBelowLgScreen={isBelowLgScreen}
        isBelowMdScreen={isBelowMdScreen}
        isBelowSmScreen={isBelowSmScreen}
      />

      <ChatContent
        activeWorkspace={activeWorkspace}
        activeChannel={activeChannel}
        activeThread={activeThread}
        messages={messages}
        messagesLoading={messagesLoading}
        setSidebarOpen={setSidebarOpen}
        isBelowMdScreen={isBelowMdScreen}
        isBelowLgScreen={isBelowLgScreen}
        isBelowSmScreen={isBelowSmScreen}
        messageInputRef={messageInputRef}
        onSend={sendMsg}
      />

      <Backdrop open={backdropOpen} onClick={() => setSidebarOpen(false)} className='absolute z-10' />
    </div>
  )
}

export default ChatWrapper
