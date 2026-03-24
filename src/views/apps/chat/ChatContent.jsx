import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import CustomAvatar from '@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'
import ChatLog from './ChatLog'
import SendMsgForm from './SendMsgForm'

const DetailPanel = ({ activeChannel, activeThread }) => (
  <aside className='hidden xl:flex xl:w-[320px] xl:flex-col border-s bg-backgroundPaper'>
    <div className='border-b px-5 py-5'>
      <Typography className='text-[11px] font-semibold uppercase tracking-[0.18em] text-textSecondary'>
        Thread Detail
      </Typography>
      <Typography className='mt-2 text-sm font-semibold text-primary'>#{activeChannel.name}</Typography>
      <Typography className='mt-2 text-xl font-semibold text-textPrimary'>{activeThread.title}</Typography>
      <Typography className='mt-2 text-sm leading-6 text-textSecondary'>{activeThread.summary}</Typography>
    </div>

    <div className='space-y-6 overflow-y-auto px-5 py-5'>
      <section>
        <Typography className='mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-textSecondary'>
          Pinned
        </Typography>
        <div className='space-y-2'>
          {activeThread.pinned.map(item => (
            <div key={item} className='rounded-2xl border bg-backgroundDefault px-4 py-3'>
              <Typography className='text-sm font-medium text-textPrimary'>{item}</Typography>
            </div>
          ))}
        </div>
      </section>

      <Divider />
    </div>
  </aside>
)

const ChatContent = props => {
  const { chatStore, activeWorkspace, activeChannel, activeThread, setSidebarOpen, isBelowMdScreen, messageInputRef, onSend } = props

  if (!activeWorkspace || !activeChannel || !activeThread) {
    return null
  }

  const threadMembers = chatStore.members.filter(member => activeThread.participants.includes(member.id))

  return (
    <div className='flex min-is-0 grow bg-backgroundChat'>
      <div className='flex min-is-0 grow flex-col'>
        <div className='flex items-center justify-between gap-4 border-b bg-backgroundPaper px-5 py-4'>
          <div className='flex items-center gap-3 min-is-0'>
            {isBelowMdScreen ? (
              <IconButton color='secondary' onClick={() => setSidebarOpen(true)}>
                <i className='tabler-layout-sidebar-left-expand text-xl' />
              </IconButton>
            ) : null}
            <div className='flex is-11 bs-11 items-center justify-center rounded-2xl bg-[var(--mui-palette-action-hover)] text-primary'>
              <i className={activeChannel.kind === 'announce' ? 'tabler-speakerphone text-xl' : 'tabler-hash text-xl'} />
            </div>
            <div className='min-is-0'>
              <Typography className='truncate text-sm font-semibold text-primary'>#{activeChannel.name}</Typography>
              <Typography className='truncate text-lg font-semibold text-textPrimary'>{activeThread.title}</Typography>
              <Typography className='truncate text-sm text-textSecondary'>{activeThread.summary}</Typography>
            </div>
          </div>

          <div className='hidden items-center gap-2 md:flex'>
            <AvatarGroup max={4} className='items-center pull-up'>
              {threadMembers.map(member =>
                member.avatar ? (
                  <Avatar key={member.id} alt={member.fullName} src={member.avatar} className='is-[30px] bs-[30px]' />
                ) : (
                  <CustomAvatar key={member.id} color={member.avatarColor} skin='light' size={30}>
                    {getInitials(member.fullName)}
                  </CustomAvatar>
                )
              )}
            </AvatarGroup>
          </div>
        </div>

        <ChatLog chatStore={chatStore} activeChannel={activeChannel} activeThread={activeThread} />

        <SendMsgForm
          activeThread={activeThread}
          messageInputRef={messageInputRef}
          onSend={onSend}
        />
      </div>

      <DetailPanel activeChannel={activeChannel} activeThread={activeThread} />
    </div>
  )
}

export default ChatContent
