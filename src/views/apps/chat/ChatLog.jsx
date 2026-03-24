import { useRef, useEffect, useCallback } from 'react'

import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import PerfectScrollbar from 'react-perfect-scrollbar'

import CustomAvatar from '@core/components/mui/Avatar'
import { getInitials } from '@/utils/getInitials'

const ChatLog = ({ chatStore, activeChannel, activeThread }) => {
  const scrollRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    if (!scrollRef.current?._container) return

    scrollRef.current._container.scrollTop = scrollRef.current._container.scrollHeight
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [activeThread, scrollToBottom])

  return (
    <PerfectScrollbar ref={scrollRef} options={{ wheelPropagation: false }} className='min-is-0 grow'>
      <div className='mx-auto flex w-full max-w-[980px] flex-col gap-1 px-4 py-6 md:px-8'>
        {activeThread.messages.map(message => {
          const sender = chatStore.members.find(member => member.id === message.senderId)

          return (
            <div key={message.id} className='flex gap-4 rounded-3xl px-4 py-4'>
              {sender?.avatar ? (
                <Avatar alt={sender.fullName} src={sender.avatar} className='is-11 bs-11' />
              ) : (
                <CustomAvatar color={sender?.avatarColor} skin='light' size={44}>
                  {getInitials(sender?.fullName)}
                </CustomAvatar>
              )}

              <div className='min-is-0 flex-auto'>
                <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
                  <Typography className='text-sm font-semibold text-textPrimary'>{sender?.fullName}</Typography>
                  <Typography className='text-xs text-textSecondary'>{sender?.role}</Typography>
                  <Typography className='text-xs text-textDisabled'>
                    {new Date(message.time).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    })}
                  </Typography>
                </div>

                <Typography className='mt-1 whitespace-pre-wrap text-[15px] leading-7 text-textPrimary' style={{ wordBreak: 'break-word' }}>
                  {message.message}
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
