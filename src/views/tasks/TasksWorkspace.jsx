'use client'

import { startTransition, useDeferredValue, useMemo, useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import TablePagination from '@mui/material/TablePagination'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import CustomAvatar from '@core/components/mui/Avatar'
import CustomTextField from '@core/components/mui/TextField'

import tableStyles from '@core/styles/table.module.css'

import TasksKanbanBoard from './TasksKanbanBoard'
import TaskDrawer from './TaskDrawer'
import { blockingOptions, formatDate, getDependencyTask, isTaskBlocked, statusConfig } from './taskUtils'

const TasksWorkspace = ({ initialTasks, projects, onAdvanceTask }) => {
  const [tasks, setTasks] = useState(initialTasks)
  const [viewMode, setViewMode] = useState('list')
  const [search, setSearch] = useState('')
  const [projectFilter, setProjectFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [assigneeFilter, setAssigneeFilter] = useState('all')
  const [blockingFilter, setBlockingFilter] = useState('all')
  const [rowsPerPage, setRowsPerPage] = useState(6)
  const [page, setPage] = useState(0)
  const [selectedTaskId, setSelectedTaskId] = useState(initialTasks[0]?.id ?? null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const deferredSearch = useDeferredValue(search.trim().toLowerCase())

  const assignees = useMemo(() => [...new Set(tasks.map(task => task.assignedTo))].sort(), [tasks])

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch =
        deferredSearch.length === 0 ||
        task.id.toLowerCase().includes(deferredSearch) ||
        task.title.toLowerCase().includes(deferredSearch) ||
        task.projectId.toLowerCase().includes(deferredSearch) ||
        task.projectName.toLowerCase().includes(deferredSearch)

      const matchesProject = projectFilter === 'all' || task.projectId === projectFilter
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesAssignee = assigneeFilter === 'all' || task.assignedTo === assigneeFilter
      const blocked = isTaskBlocked(task, tasks)

      const matchesBlocking =
        blockingFilter === 'all' ||
        (blockingFilter === 'blocked' && blocked) ||
        (blockingFilter === 'unblocked' && !blocked)

      return matchesSearch && matchesProject && matchesStatus && matchesAssignee && matchesBlocking
    })
  }, [assigneeFilter, blockingFilter, deferredSearch, projectFilter, statusFilter, tasks])

  const paginatedTasks = useMemo(() => {
    const start = page * rowsPerPage

    return filteredTasks.slice(start, start + rowsPerPage)
  }, [filteredTasks, page, rowsPerPage])

  const selectedTask = tasks.find(task => task.id === selectedTaskId) || null
  const selectedDependencyTask = selectedTask ? getDependencyTask(selectedTask, tasks) : null
  const selectedTaskBlocked = selectedTask ? isTaskBlocked(selectedTask, tasks) : false

  const openTask = taskId => {
    setSelectedTaskId(taskId)
    setDrawerOpen(true)
  }

  const handleAdvanceTask = (taskId, nextStatus) => {
    startTransition(() => {
      setTasks(currentTasks =>
        currentTasks.map(task => {
          if (task.id !== taskId) return task

          const today = new Date().toISOString().slice(0, 10)
          const actor = nextStatus === 'finished' ? 'Yanir' : task.assignedTo
          const statusLine = `${today} - Status changed to ${nextStatus} by ${actor}`

          return {
            ...task,
            status: nextStatus,
            updated: today,
            activityLog: [...task.activityLog, statusLine]
          }
        })
      )
    })

    // Persist to API if callback provided
    if (onAdvanceTask) {
      onAdvanceTask(taskId, nextStatus)
    }
  }

  const handleFilterChange = setter => event => {
    setter(event.target.value)
    setPage(0)
  }

  return (
    <>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4'>
          <div>
            <Typography variant='h4' color='text.primary'>
              Tasks
            </Typography>
            <Typography color='text.secondary'>
              Cross-project task operations, review flow, and dependency tracking.
            </Typography>
          </div>
          <Tabs
            value={viewMode}
            onChange={(_, value) => setViewMode(value)}
            variant='scrollable'
            scrollButtons='auto'
            sx={{ minHeight: 0, '& .MuiTab-root': { minHeight: 40 } }}
          >
            <Tab icon={<i className='tabler-list-details text-lg' />} iconPosition='start' value='list' label='List' />
            <Tab icon={<i className='tabler-layout-kanban text-lg' />} iconPosition='start' value='kanban' label='Kanban' />
          </Tabs>
        </div>

        <Card>
          <CardContent className='flex justify-between flex-wrap items-start gap-4'>
            {viewMode === 'list' ? (
              <div className='flex items-center gap-2'>
                <Typography className='hidden sm:block'>Show</Typography>
                <CustomTextField
                  select
                  value={rowsPerPage}
                  onChange={event => {
                    setRowsPerPage(Number(event.target.value))
                    setPage(0)
                  }}
                  className='is-[84px]'
                >
                  <MenuItem value={6}>6</MenuItem>
                  <MenuItem value={12}>12</MenuItem>
                  <MenuItem value={24}>24</MenuItem>
                </CustomTextField>
              </div>
            ) : (
              <Chip size='small' variant='tonal' label={`${filteredTasks.length} visible tasks`} />
            )}

            <div className='flex flex-col lg:flex-row max-lg:is-full items-start lg:items-center gap-4'>
              <CustomTextField
                value={search}
                onChange={event => {
                  setSearch(event.target.value)
                  setPage(0)
                }}
                placeholder='Search task, project, or ID'
                className='max-lg:is-full lg:is-[260px]'
              />

              <CustomTextField
                select
                value={projectFilter}
                onChange={handleFilterChange(setProjectFilter)}
                className='max-lg:is-full lg:is-[190px]'
              >
                <MenuItem value='all'>All Projects</MenuItem>
                {projects.map(project => (
                  <MenuItem key={project.projectId} value={project.projectId}>
                    {project.projectId}
                  </MenuItem>
                ))}
              </CustomTextField>

              <CustomTextField
                select
                value={statusFilter}
                onChange={handleFilterChange(setStatusFilter)}
                className='max-lg:is-full lg:is-[170px]'
              >
                <MenuItem value='all'>All Statuses</MenuItem>
                {Object.entries(statusConfig).map(([value, config]) => (
                  <MenuItem key={value} value={value}>
                    {config.label}
                  </MenuItem>
                ))}
              </CustomTextField>

              <CustomTextField
                select
                value={assigneeFilter}
                onChange={handleFilterChange(setAssigneeFilter)}
                className='max-lg:is-full lg:is-[170px]'
              >
                <MenuItem value='all'>All Assignees</MenuItem>
                {assignees.map(assignee => (
                  <MenuItem key={assignee} value={assignee}>
                    {assignee}
                  </MenuItem>
                ))}
              </CustomTextField>

              <CustomTextField
                select
                value={blockingFilter}
                onChange={handleFilterChange(setBlockingFilter)}
                className='max-lg:is-full lg:is-[160px]'
              >
                {blockingOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </CustomTextField>
            </div>
          </CardContent>
        </Card>

        {viewMode === 'list' ? (
          <Card>
            <div className='overflow-x-auto'>
              <table className={tableStyles.table}>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Project</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Depends On</th>
                    <th>Updated</th>
                    <th align='right'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTasks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className='text-center py-8'>
                        No tasks match the current filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedTasks.map(task => {
                      const dependencyTask = getDependencyTask(task, tasks)
                      const blocked = isTaskBlocked(task, tasks)

                      return (
                        <tr
                          key={task.id}
                          className='cursor-pointer hover:bg-[var(--mui-palette-action-hover)]'
                          onClick={() => openTask(task.id)}
                        >
                          <td>
                            <div className='flex flex-col'>
                              <Typography color='text.primary' className='font-medium'>
                                {task.title}
                              </Typography>
                              <Typography variant='body2' color='primary.main'>
                                {task.id}
                              </Typography>
                              {blocked ? (
                                <Typography variant='body2' color='warning.main' className='flex items-center gap-1'>
                                  <i className='tabler-clock-hour-4 text-sm' />
                                  Waiting on dependency
                                </Typography>
                              ) : null}
                            </div>
                          </td>
                          <td>
                            <div className='flex flex-col'>
                              <Typography color='text.primary'>{task.projectName}</Typography>
                              <Typography variant='body2'>{task.projectId}</Typography>
                            </div>
                          </td>
                          <td>
                            <div className='flex items-center gap-3'>
                              <CustomAvatar size={28} skin='light' color='primary'>
                                {task.assignedTo.slice(0, 2).toUpperCase()}
                              </CustomAvatar>
                              <Typography color='text.primary'>{task.assignedTo}</Typography>
                            </div>
                          </td>
                          <td>
                            <Chip
                              size='small'
                              variant='tonal'
                              color={statusConfig[task.status].color}
                              icon={<i className={`${statusConfig[task.status].icon} text-base`} />}
                              label={statusConfig[task.status].label}
                            />
                          </td>
                          <td>
                            {dependencyTask ? (
                              <div className='flex flex-col'>
                                <Typography color='text.primary'>{dependencyTask.id}</Typography>
                                <Typography
                                  variant='body2'
                                  color={blocked ? 'warning.main' : 'success.main'}
                                  className='flex items-center gap-1'
                                >
                                  <i
                                    className={`${blocked ? 'tabler-clock-hour-4' : 'tabler-circle-check'} text-sm`}
                                  />
                                  {blocked ? 'Waiting for finish' : 'Dependency met'}
                                </Typography>
                              </div>
                            ) : (
                              <Typography color='text.secondary'>None</Typography>
                            )}
                          </td>
                          <td>
                            <Typography color='text.primary'>{formatDate(task.updated)}</Typography>
                          </td>
                          <td align='right' onClick={event => event.stopPropagation()}>
                            <Tooltip title='Open task'>
                              <IconButton size='small' onClick={() => openTask(task.id)}>
                                <i className='tabler-eye text-textSecondary' />
                              </IconButton>
                            </Tooltip>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            <TablePagination
              component='div'
              count={filteredTasks.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, nextPage) => setPage(nextPage)}
              onRowsPerPageChange={event => {
                setRowsPerPage(Number(event.target.value))
                setPage(0)
              }}
              rowsPerPageOptions={[6, 12, 24]}
            />
          </Card>
        ) : (
          <TasksKanbanBoard tasks={filteredTasks} allTasks={tasks} onOpenTask={openTask} />
        )}

        <div className='flex flex-wrap gap-3'>
          <Chip size='small' variant='tonal' label={`${tasks.length} total tasks`} />
          <Chip
            size='small'
            variant='tonal'
            color='warning'
            label={`${tasks.filter(task => isTaskBlocked(task, tasks)).length} blocked`}
          />
          <Chip
            size='small'
            variant='tonal'
            color='secondary'
            label={`${tasks.filter(task => task.status === 'needs_review').length} awaiting review`}
          />
        </div>
      </div>

      <TaskDrawer
        open={drawerOpen}
        task={selectedTask}
        isBlocked={selectedTaskBlocked}
        dependencyTask={selectedDependencyTask}
        onClose={() => setDrawerOpen(false)}
        onAdvanceTask={handleAdvanceTask}
      />
    </>
  )
}

export default TasksWorkspace
