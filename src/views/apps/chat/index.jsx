'use client'

import { useMemo, useRef, useState } from 'react'

import Backdrop from '@mui/material/Backdrop'
import useMediaQuery from '@mui/material/useMediaQuery'
import classNames from 'classnames'

import { useSettings } from '@core/hooks/useSettings'
import { commonLayoutClasses } from '@layouts/utils/layoutClasses'
import SidebarLeft from './SidebarLeft'
import ChatContent from './ChatContent'
import { initialChatData } from './data'

const cloneInitialData = () => structuredClone(initialChatData)

const ChatWrapper = () => {
  const [chatStore, setChatStore] = useState(cloneInitialData)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messageInputRef = useRef(null)
  const { settings } = useSettings()
  const isBelowLgScreen = useMediaQuery(theme => theme.breakpoints.down('lg'))
  const isBelowMdScreen = useMediaQuery(theme => theme.breakpoints.down('md'))
  const isBelowSmScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))

  const activeWorkspace = useMemo(
    () => chatStore.workspaces.find(workspace => workspace.id === chatStore.activeWorkspaceId) || chatStore.workspaces[0],
    [chatStore.activeWorkspaceId, chatStore.workspaces]
  )

  const activeChannel = useMemo(
    () => activeWorkspace?.channels.find(channel => channel.id === chatStore.activeChannelId) || activeWorkspace?.channels[0],
    [activeWorkspace, chatStore.activeChannelId]
  )

  const activeThread = useMemo(
    () => activeChannel?.threads.find(thread => thread.id === chatStore.activeThreadId) || activeChannel?.threads[0],
    [activeChannel, chatStore.activeThreadId]
  )

  const selectWorkspace = workspaceId => {
    setChatStore(prev => {
      const workspace = prev.workspaces.find(item => item.id === workspaceId)

      if (!workspace) return prev

      const currentChannelExists = workspace.channels.some(channel => channel.id === prev.activeChannelId)

      return {
        ...prev,
        activeWorkspaceId: workspaceId,
        activeChannelId: currentChannelExists ? prev.activeChannelId : workspace.channels[0]?.id,
        activeThreadId: currentChannelExists
          ? prev.activeThreadId
          : workspace.channels[0]?.threads[0]?.id
      }
    })
  }

  const selectThread = (channelId, threadId) => {
    setChatStore(prev => ({
      ...prev,
      activeChannelId: channelId,
      activeThreadId: threadId,
      workspaces: prev.workspaces.map(workspace => ({
        ...workspace,
        channels: workspace.channels.map(channel =>
          channel.id === channelId
            ? {
                ...channel,
                threads: channel.threads.map(thread => (thread.id === threadId ? { ...thread, unread: 0 } : thread))
              }
            : channel
        )
      }))
    }))
  }

  const sendMsg = msg => {
    setChatStore(prev => ({
      ...prev,
      workspaces: prev.workspaces.map(workspace => ({
        ...workspace,
        channels: workspace.channels.map(channel =>
          channel.id === prev.activeChannelId
            ? {
                ...channel,
                threads: channel.threads.map(thread =>
                  thread.id === prev.activeThreadId
                    ? {
                        ...thread,
                        messages: [
                          ...thread.messages,
                          {
                            id: `${thread.id}-${thread.messages.length + 1}`,
                            senderId: prev.profileUser.id,
                            message: msg,
                            time: new Date()
                          }
                        ]
                      }
                    : thread
                )
              }
            : channel
        )
      }))
    }))
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
        chatStore={chatStore}
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
        chatStore={chatStore}
        activeWorkspace={activeWorkspace}
        activeChannel={activeChannel}
        activeThread={activeThread}
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
