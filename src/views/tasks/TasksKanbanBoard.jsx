'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import CustomAvatar from '@core/components/mui/Avatar'

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
          <CustomAvatar size={28} skin='light' color='primary'>
            {task.assignedTo.slice(0, 2).toUpperCase()}
          </CustomAvatar>
          <Typography color='text.primary'>{task.assignedTo}</Typography>
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
