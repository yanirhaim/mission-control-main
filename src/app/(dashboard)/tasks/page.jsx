import { projects, tasks } from '@/data/mock/tasks'
import TasksWorkspace from '@/views/tasks/TasksWorkspace'

export default function Page() {
  return <TasksWorkspace initialTasks={tasks} projects={projects} />
}
