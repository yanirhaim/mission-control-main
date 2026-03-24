const horizontalMenuData = () => [
  {
    label: 'Home',
    href: '/home',
    icon: 'tabler-smart-home'
  },
  {
    label: 'Projects',
    icon: 'tabler-folders',
    children: [
      {
        label: 'Projects',
        icon: 'tabler-circle',
        href: '/projects'
      },
      {
        label: 'Tasks',
        icon: 'tabler-circle',
        href: '/tasks'
      }
    ]
  },
  {
    label: 'Agents',
    icon: 'tabler-users',
    children: [
      {
        label: 'Employees',
        icon: 'tabler-circle',
        href: '/employees'
      },
      {
        label: 'Chat',
        icon: 'tabler-message-2',
        href: '/chat'
      }
    ]
  }
]

export default horizontalMenuData
