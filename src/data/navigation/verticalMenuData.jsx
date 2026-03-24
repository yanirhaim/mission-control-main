const verticalMenuData = () => [
  {
    label: 'Home',
    href: '/home',
    icon: 'tabler-smart-home'
  },
  {
    label: 'Work',
    isSection: true,
    children: [
      {
        label: 'Projects',
        icon: 'tabler-folders',
        href: '/projects'
      },
      {
        label: 'Tasks',
        icon: 'tabler-checklist',
        href: '/tasks'
      }
    ]
  },
  {
    label: 'Agents',
    isSection: true,
    children: [
      {
        label: 'Employees',
        icon: 'tabler-users',
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

export default verticalMenuData
