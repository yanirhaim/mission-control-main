import { useState } from 'react'

import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'

import CustomAvatar from '@core/components/mui/Avatar'
import CustomChip from '@core/components/mui/Chip'
import OptionMenu from '@core/components/option-menu'
import AvatarWithBadge from './AvatarWithBadge'

export const statusObj = {
  busy: 'error',
  away: 'warning',
  online: 'success',
  offline: 'secondary'
}

const ScrollWrapper = ({ children, isBelowLgScreen }) => {
  if (isBelowLgScreen) {
    return <div className='overflow-y-auto overflow-x-hidden bs-full'>{children}</div>
  }

  return <PerfectScrollbar options={{ wheelPropagation: false }}>{children}</PerfectScrollbar>
}

const WorkspaceAvatar = ({ workspace, isActive, onClick }) => (
  <button
    type='button'
    aria-label={workspace.name}
    onClick={onClick}
    className={classnames(
      'relative flex items-center justify-center is-12 bs-12 rounded-[1.35rem] border-0 transition-all duration-200 appearance-none',
      isActive ? 'rounded-[1rem] translate-y-0' : 'hover:rounded-[1rem] hover:-translate-y-0.5'
    )}
    style={{
      background: isActive ? workspace.accent : 'var(--mui-palette-action-hover)',
      color: isActive ? 'white' : 'var(--mui-palette-text-primary)'
    }}
  >
    <span className='text-sm font-semibold tracking-[0.16em]'>{workspace.label}</span>
    <span
      className={classnames(
        'absolute -start-5 bs-5 w-1 rounded-e-full bg-primary transition-all duration-200',
        isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
      )}
    />
  </button>
)

const ThreadCard = ({ thread, isActive, onClick }) => (
  <button
    type='button'
    onClick={onClick}
    className={classnames(
      'flex w-full items-center gap-2 border-0 bg-transparent px-0 py-1 text-left transition-colors appearance-none',
      isActive ? 'text-textPrimary' : 'text-textSecondary hover:text-textPrimary'
    )}
  >
    <span className='relative block h-5 w-4 shrink-0'>
      <span className='absolute start-1 top-0 h-3.5 w-3 rounded-es-[10px] border-b border-s border-current opacity-45' />
    </span>
    <Typography
      className={classnames('truncate text-[13px]', isActive ? 'font-medium text-textPrimary' : 'text-inherit')}
    >
      {thread.title}
    </Typography>
    {thread.unread > 0 ? <CustomChip round='true' label={thread.unread} color='error' size='small' className='mis-auto' /> : null}
  </button>
)

const SidebarLeft = props => {
  const {
    chatStore,
    activeWorkspace,
    activeChannel,
    activeThread,
    selectWorkspace,
    selectThread,
    sidebarOpen,
    setSidebarOpen,
    isBelowLgScreen,
    isBelowMdScreen,
    isBelowSmScreen
  } = props

  const drawerWidth = isBelowSmScreen ? '100%' : 420
  const [collapsedChannels, setCollapsedChannels] = useState({})

  const isChannelOpen = channelId => collapsedChannels[channelId] !== false

  const toggleChannel = channelId => {
    setCollapsedChannels(prev => ({
      ...prev,
      [channelId]: prev[channelId] === false
    }))
  }

  return (
    <Drawer
      open={!isBelowMdScreen || sidebarOpen}
      onClose={() => setSidebarOpen(false)}
      className='bs-full'
      variant={!isBelowMdScreen ? 'permanent' : 'persistent'}
      ModalProps={{ disablePortal: true, keepMounted: true }}
      sx={{
        zIndex: isBelowMdScreen && sidebarOpen ? 11 : 10,
        position: !isBelowMdScreen ? 'static' : 'absolute',
        '& .MuiDrawer-paper': {
          overflow: 'hidden',
          boxShadow: 'none',
          width: drawerWidth,
          border: 0,
          position: !isBelowMdScreen ? 'static' : 'absolute',
          backgroundColor: 'var(--mui-palette-background-default)'
        }
      }}
    >
      <div className='flex bs-full min-is-0'>
        <div className='flex w-[88px] flex-col items-center gap-3 border-e px-4 py-4 bg-backgroundPaper'>
          <button
            type='button'
            className='flex is-12 bs-12 items-center justify-center rounded-[1rem] bg-primary text-[var(--mui-palette-primary-contrastText)] shadow-primarySm'
            aria-label='Home workspace'
          >
            <i className='tabler-rocket text-[22px]' />
          </button>

          <Divider flexItem />

          {chatStore.workspaces.map(workspace => (
            <WorkspaceAvatar
              key={workspace.id}
              workspace={workspace}
              isActive={workspace.id === activeWorkspace?.id}
              onClick={() => {
                selectWorkspace(workspace.id)
                if (isBelowMdScreen) setSidebarOpen(false)
              }}
            />
          ))}
        </div>

        <div className='flex min-is-0 grow flex-col bg-backgroundPaper'>
          <ScrollWrapper isBelowLgScreen={isBelowLgScreen}>
            <div className='space-y-7 px-4 py-5'>
              {activeWorkspace?.channels.map(channel => (
                <section key={channel.id}>
                  <button
                    type='button'
                    onClick={() => toggleChannel(channel.id)}
                    className='mb-2 flex w-full items-center justify-between rounded-xl border-0 bg-transparent px-2 py-1.5 text-left hover:bg-[var(--mui-palette-action-hover)] appearance-none'
                  >
                    <div className='flex items-center gap-2'>
                      <i
                        className={channel.kind === 'announce' ? 'tabler-speakerphone text-base text-textSecondary' : 'tabler-hash text-base text-textSecondary'}
                      />
                      <Typography className='text-sm font-semibold text-textPrimary'>#{channel.name}</Typography>
                    </div>
                    <i
                      className={classnames(
                        'tabler-chevron-right text-sm text-textSecondary transition-transform',
                        isChannelOpen(channel.id) && 'rotate-90'
                      )}
                    />
                  </button>

                  <Collapse in={isChannelOpen(channel.id)} timeout='auto' unmountOnExit>
                    <div className='space-y-0.5 pl-7'>
                      {channel.threads.map(thread => (
                        <ThreadCard
                          key={thread.id}
                          thread={thread}
                          isActive={channel.id === activeChannel?.id && thread.id === activeThread?.id}
                          onClick={() => {
                            selectThread(channel.id, thread.id)
                            if (isBelowMdScreen) setSidebarOpen(false)
                          }}
                        />
                      ))}
                    </div>
                  </Collapse>
                </section>
              ))}
            </div>
          </ScrollWrapper>

          <div className='mt-auto flex items-center gap-3 border-t bg-backgroundDefault px-4 py-3'>
            <AvatarWithBadge
              alt={chatStore.profileUser.fullName}
              src={chatStore.profileUser.avatar}
              badgeColor={statusObj[chatStore.profileUser.status]}
            />
            <div className='min-is-0 flex-auto'>
              <Typography className='truncate text-sm font-semibold text-textPrimary'>{chatStore.profileUser.fullName}</Typography>
              <Typography className='truncate text-xs text-textSecondary'>{chatStore.profileUser.role}</Typography>
            </div>
            <OptionMenu
              iconClassName='text-textSecondary'
              options={['Profile', 'Mute Notifications', 'Preferences']}
            />
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default SidebarLeft
