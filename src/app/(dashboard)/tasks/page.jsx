'use client'

import { useCallback, useEffect, useState } from 'react'

import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import TasksWorkspace from '@/views/tasks/TasksWorkspace'

export default function Page() {
  const [tasks, setTasks] = useState(null)
  const [projects, setProjects] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks', { cache: 'no-store' })
      const data = await res.json()

      if (data.ok) {
        setTasks(data.tasks)
        setProjects(data.projects)
        setError(null)
      } else {
        setError(data.error ?? 'Unknown error')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Advance a task status — calls PATCH, updates local state optimistically
  const handleAdvanceTask = useCallback(async (taskId, nextStatus) => {
    // Optimistic update
    setTasks(current =>
      current.map(t => {
        if (t.id !== taskId) return t
        const today = new Date().toISOString().slice(0, 10)
        const actor = nextStatus === 'finished' ? 'Yanir' : t.assignedTo

        return {
          ...t,
          status: nextStatus,
          updated: today,
          activityLog: [...(t.activityLog ?? []), `${today} - Status changed to ${nextStatus} by ${actor}`],
        }
      })
    )

    // Persist to server
    try {
      const res = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, status: nextStatus }),
      })

      if (!res.ok) {
        console.error('[tasks] PATCH failed, re-fetching')
        fetchTasks()
      }
    } catch (err) {
      console.error('[tasks] PATCH error:', err)
      fetchTasks()
    }
  }, [fetchTasks])

  if (loading) {
    return (
      <div className='flex justify-center items-center py-24'>
        <CircularProgress />
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex flex-col items-center gap-3 py-24'>
        <i className='tabler-alert-circle text-4xl text-error' />
        <Typography color='error'>{error}</Typography>
        <Button variant='tonal' onClick={fetchTasks}>Retry</Button>
      </div>
    )
  }

  return (
    <TasksWorkspace
      initialTasks={tasks}
      projects={projects}
      onAdvanceTask={handleAdvanceTask}
    />
  )
}
