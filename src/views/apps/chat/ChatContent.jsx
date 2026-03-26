import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

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
      {activeThread.taskId && (
        <Typography className='mt-1 text-xs text-textSecondary'>{activeThread.taskId}</Typography>
      )}
    </div>

    <div className='space-y-6 overflow-y-auto px-5 py-5'>
      <section>
        <Typography className='mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-textSecondary'>
          Actions
        </Typography>
        <div className='space-y-2'>
          <a href='/tasks' className='block rounded-2xl border bg-backgroundDefault px-4 py-3 no-underline'>
            <Typography className='text-sm font-medium text-primary'>Open task for details</Typography>
          </a>
        </div>
      </section>

      <Divider />
    </div>
  </aside>
)

const ChatContent = props => {
  const {
    activeWorkspace,
    activeChannel,
    activeThread,
    messages,
    messagesLoading,
    setSidebarOpen,
    isBelowMdScreen,
    messageInputRef,
    onSend
  } = props

  if (!activeWorkspace || !activeChannel || !activeThread) {
    return null
  }

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
              <i className='tabler-hash text-xl' />
            </div>
            <div className='min-is-0'>
              <Typography className='truncate text-sm font-semibold text-primary'>#{activeChannel.name}</Typography>
              <Typography className='truncate text-lg font-semibold text-textPrimary'>{activeThread.title}</Typography>
            </div>
          </div>
        </div>

        {messagesLoading ? (
          <div className='flex grow items-center justify-center'>
            <CircularProgress size={32} />
          </div>
        ) : (
          <ChatLog
            messages={messages}
            activeThread={activeThread}
            activeWorkspace={activeWorkspace}
          />
        )}

        <SendMsgForm
          activeThread={activeThread}
          threadStatus={activeThread.status}
          messageInputRef={messageInputRef}
          onSend={onSend}
        />
      </div>

      <DetailPanel activeChannel={activeChannel} activeThread={activeThread} />
    </div>
  )
}

export default ChatContent
