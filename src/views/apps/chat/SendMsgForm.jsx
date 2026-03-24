import { useEffect, useState } from 'react'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

import CustomTextField from '@core/components/mui/TextField'
import CustomIconButton from '@core/components/mui/IconButton'

const SendMsgForm = ({ activeThread, messageInputRef, onSend }) => {
  const [msg, setMsg] = useState('')

  const handleSendMsg = event => {
    event.preventDefault()

    if (!msg.trim()) return

    onSend(msg)
    setMsg('')
  }

  useEffect(() => {
    setMsg('')
  }, [activeThread?.id])

  return (
    <div className='border-t bg-backgroundPaper px-4 py-4 md:px-6'>
      <form autoComplete='off' onSubmit={handleSendMsg}>
        <CustomTextField
          fullWidth
          multiline
          maxRows={5}
          placeholder={`Reply in ${activeThread?.title}`}
          value={msg}
          onChange={e => setMsg(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              handleSendMsg(e)
            }
          }}
          inputRef={messageInputRef}
          sx={{
            '& fieldset': { border: 0 },
            '& .MuiOutlinedInput-root': {
              borderRadius: '22px',
              background: 'var(--mui-palette-background-default)',
              boxShadow: 'var(--mui-customShadows-xs) !important',
              paddingInline: '8px',
              paddingBlock: '6px'
            }
          }}
          slotProps={{
            input: {
              startAdornment: (
                <div className='mr-2 flex items-center gap-1 text-textSecondary'>
                  <IconButton size='small'>
                    <i className='tabler-plus text-lg' />
                  </IconButton>
                </div>
              ),
              endAdornment: (
                <div className='ml-2 flex items-center gap-1'>
                  <IconButton size='small'>
                    <i className='tabler-gif text-lg text-textSecondary' />
                  </IconButton>
                  <IconButton size='small'>
                    <i className='tabler-mood-smile text-lg text-textSecondary' />
                  </IconButton>
                  <CustomIconButton variant='contained' color='primary' type='submit'>
                    <i className='tabler-arrow-up text-base' />
                  </CustomIconButton>
                </div>
              )
            }
          }}
        />
      </form>
    </div>
  )
}

export default SendMsgForm
