export const statusOrder = ['in_queue', 'in_progress', 'needs_review', 'finished']

export const statusConfig = {
  in_queue: { color: 'warning', label: 'In Queue', icon: 'tabler-clock-hour-4' },
  in_progress: { color: 'info', label: 'In Progress', icon: 'tabler-loader-2' },
  needs_review: { color: 'secondary', label: 'Needs Review', icon: 'tabler-eye-check' },
  finished: { color: 'success', label: 'Finished', icon: 'tabler-circle-check' }
}

export const blockingOptions = [
  { value: 'all', label: 'All Tasks' },
  { value: 'blocked', label: 'Blocked Only' },
  { value: 'unblocked', label: 'Unblocked Only' }
]

export const formatDate = value =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).format(new Date(value))

export const getDependencyTask = (task, allTasks) => allTasks.find(candidate => candidate.id === task.dependsOn) || null

export const isTaskBlocked = (task, allTasks) => {
  const dependencyTask = getDependencyTask(task, allTasks)

  if (!dependencyTask) return false

  return dependencyTask.status !== 'finished'
}
