'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import Avatar from '@mui/material/Avatar'

import { formatDate, getDependencyTask, isTaskBlocked, statusConfig, statusOrder } from './taskUtils'

import styles from './TasksKanbanBoard.module.css'

const EmptyColumn = ({ label }) => (
  <div className='flex flex-1 items-center justify-center rounded-xl border border-dashed border-[var(--mui-palette-divider)] p-6 text-center'>
    <Typography color='text.secondary'>No tasks in {label.toLowerCase()}.</Typography>
  </div>
)

const DependencyState = ({ task, dependencyTask, blocked, allTasks }) => {
  if (!dependencyTask) return null

  return (
    <Typography
      variant='body2'
      color={blocked ? 'warning.main' : 'success.main'}
      className='flex items-center gap-1'
    >
      <i className={`${blocked ? 'tabler-clock-hour-4' : 'tabler-circle-check'} text-sm`} />
      {blocked ? 'Waiting on dependency' : 'Dependency met'}
    </Typography>
  )
}

const KanbanTaskCard = ({ task, allTasks, onOpenTask }) => {
  const dependencyTask = getDependencyTask(task, allTasks)
  const blocked = isTaskBlocked(task, allTasks)

  return (
    <Card className={styles.taskCard} onClick={() => onOpenTask(task.id)}>
      <CardContent className='flex flex-col gap-3'>
        <Stack spacing={0.5}>
          <Typography color='text.primary' className='font-medium'>
            {task.title}
          </Typography>
          <Typography variant='body2' color='primary.main'>
            {task.id}
          </Typography>
        </Stack>

        <Chip size='small' variant='tonal' label={task.projectId} className='max-is-fit' />

        <div className='flex items-center gap-3'>
          <Avatar
            src={task.assignedToAvatar}
            alt={task.assignedToDisplay ?? task.assignedTo}
            sx={{ width: 28, height: 28 }}
          />
          <Typography color='text.primary'>{task.assignedToDisplay ?? task.assignedTo}</Typography>
        </div>

        <DependencyState task={task} dependencyTask={dependencyTask} blocked={blocked} allTasks={allTasks} />

        <Divider />

        <div className='flex items-center justify-between gap-3'>
          <Typography variant='body2' color='text.secondary'>
            Updated
          </Typography>
          <Typography variant='body2' color='text.primary'>
            {formatDate(task.updated)}
          </Typography>
        </div>

        {task.githubRepo ? (
          <a
            href={task.githubRepo}
            target='_blank'
            rel='noopener noreferrer'
            onClick={e => e.stopPropagation()}
            className='flex items-center gap-1.5 text-xs text-[var(--mui-palette-text-secondary)] hover:text-[var(--mui-palette-text-primary)] transition-colors'
          >
            <svg
              viewBox='0 0 24 24'
              width='14'
              height='14'
              fill='currentColor'
              aria-hidden='true'
            >
              <path d='M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.071 1.532 1.032 1.532 1.032.891 1.527 2.341 1.086 2.91.831.091-.646.349-1.086.635-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.641.699 1.028 1.592 1.028 2.683 0 3.842-2.338 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.337-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z' />
            </svg>
            View branch
          </a>
        ) : null}
      </CardContent>
    </Card>
  )
}

const TasksKanbanBoard = ({ tasks, allTasks, onOpenTask }) => {
  return (
    <div className={styles.board}>
      {statusOrder.map(status => {
        const columnTasks = tasks.filter(task => task.status === status)
        const config = statusConfig[status]

        return (
          <div key={status} className={styles.column}>
            <div className={`${styles.columnHeader} flex items-center justify-between gap-3 border-be p-4`}>
              <div className='flex items-center gap-2'>
                <Chip
                  size='small'
                  variant='tonal'
                  color={config.color}
                  icon={<i className={`${config.icon} text-base`} />}
                  label={config.label}
                />
              </div>
              <Typography color='text.secondary'>{columnTasks.length}</Typography>
            </div>

            <div className={`${styles.columnBody} p-4`}>
              {columnTasks.length === 0 ? (
                <EmptyColumn label={config.label} />
              ) : (
                columnTasks.map(task => (
                  <KanbanTaskCard key={task.id} task={task} allTasks={allTasks} onOpenTask={onOpenTask} />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TasksKanbanBoard
