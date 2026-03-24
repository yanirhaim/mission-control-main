'use client'

import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'

import { statusConfig } from './taskUtils'

const sectionTitleStyles = {
  fontWeight: 600,
  color: 'text.primary'
}

const getNextAction = ({ task, isBlocked }) => {
  if (!task) return null

  if (task.status === 'in_queue') {
    return {
      label: 'Move To In Progress',
      nextStatus: 'in_progress',
      disabled: isBlocked
    }
  }

  if (task.status === 'in_progress') {
    return {
      label: 'Send To Review',
      nextStatus: 'needs_review',
      disabled: false
    }
  }

  if (task.status === 'needs_review') {
    return {
      label: 'Approve As Finished',
      nextStatus: 'finished',
      disabled: false
    }
  }

  return null
}

const TaskDrawer = ({ open, task, isBlocked, dependencyTask, onClose, onAdvanceTask }) => {
  const nextAction = getNextAction({ task, isBlocked })

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 360, sm: 460 } } }}
    >
      {task ? (
        <>
          <Box className='flex items-start justify-between gap-4 pli-6 plb-5 border-be'>
            <div>
              <Typography variant='h5' className='mbs-1'>
                {task.title}
              </Typography>
              <Typography color='text.secondary' className='mbs-2'>
                {task.id}
              </Typography>
              <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
                <Chip size='small' variant='tonal' label={task.projectId} />
                <Chip
                  size='small'
                  color={statusConfig[task.status].color}
                  variant='tonal'
                  label={statusConfig[task.status].label}
                />
                {isBlocked ? (
                  <Chip
                    size='small'
                    color='warning'
                    variant='tonal'
                    icon={<i className='tabler-clock-hour-4 text-base' />}
                    label='Waiting'
                  />
                ) : null}
              </Stack>
            </div>
            <IconButton size='small' onClick={onClose}>
              <i className='tabler-x text-xl text-textPrimary' />
            </IconButton>
          </Box>

          <Box className='p-6'>
            <Stack spacing={4}>
              <Stack spacing={2}>
                <Typography sx={sectionTitleStyles}>Metadata</Typography>
                <Stack spacing={1.5}>
                  <Typography color='text.secondary'>
                    Assigned to: <Typography component='span' color='text.primary'>{task.assignedTo}</Typography>
                  </Typography>
                  <Typography color='text.secondary'>
                    Project: <Typography component='span' color='text.primary'>{task.projectName}</Typography>
                  </Typography>
                  <Typography color='text.secondary'>
                    Created: <Typography component='span' color='text.primary'>{task.created}</Typography>
                  </Typography>
                  <Typography color='text.secondary'>
                    Updated: <Typography component='span' color='text.primary'>{task.updated}</Typography>
                  </Typography>
                  <Typography color='text.secondary'>
                    Depends on:{' '}
                    <Typography component='span' color='text.primary'>
                      {dependencyTask ? `${dependencyTask.id} - ${dependencyTask.title}` : 'None'}
                    </Typography>
                  </Typography>
                </Stack>
                {isBlocked && dependencyTask ? (
                  <Typography color='warning.main' variant='body2' className='flex items-center gap-1'>
                    <i className='tabler-clock-hour-4 text-base' />
                    This task is waiting until {dependencyTask.id} is marked finished.
                  </Typography>
                ) : null}
              </Stack>

              <Divider />

              <Stack spacing={1.5}>
                <Typography sx={sectionTitleStyles}>Description</Typography>
                <Typography color='text.secondary'>{task.description}</Typography>
              </Stack>

              <Stack spacing={1.5}>
                <Typography sx={sectionTitleStyles}>Acceptance Criteria</Typography>
                <List dense disablePadding>
                  {task.acceptanceCriteria.map(item => (
                    <ListItem key={item} disableGutters sx={{ alignItems: 'flex-start', py: 0.5 }}>
                      <ListItemText primary={`- ${item}`} primaryTypographyProps={{ color: 'text.secondary' }} />
                    </ListItem>
                  ))}
                </List>
              </Stack>

              <Stack spacing={1.5}>
                <Typography sx={sectionTitleStyles}>Notes</Typography>
                <Typography color='text.secondary'>{task.notes || 'No notes yet.'}</Typography>
              </Stack>

              {task.deliverable ? (
                <Stack spacing={1.5}>
                  <Typography sx={sectionTitleStyles}>Deliverable</Typography>
                  <Typography color='text.secondary'>{task.deliverable}</Typography>
                </Stack>
              ) : null}

              <Stack spacing={1.5}>
                <Typography sx={sectionTitleStyles}>Activity Log</Typography>
                <List dense disablePadding>
                  {task.activityLog.map(item => (
                    <ListItem key={item} disableGutters sx={{ alignItems: 'flex-start', py: 0.5 }}>
                      <ListItemText primary={item} primaryTypographyProps={{ color: 'text.secondary' }} />
                    </ListItem>
                  ))}
                </List>
              </Stack>

              <Divider />

              <Stack spacing={2}>
                <Typography sx={sectionTitleStyles}>Workflow Actions</Typography>
                {nextAction ? (
                  <Button
                    variant='contained'
                    onClick={() => onAdvanceTask(task.id, nextAction.nextStatus)}
                    disabled={nextAction.disabled}
                  >
                    {nextAction.label}
                  </Button>
                ) : (
                  <Typography color='text.secondary'>No further action is available for this task right now.</Typography>
                )}
              </Stack>
            </Stack>
          </Box>
        </>
      ) : null}
    </Drawer>
  )
}

export default TaskDrawer
