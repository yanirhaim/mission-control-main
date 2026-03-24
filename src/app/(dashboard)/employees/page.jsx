import Link from 'next/link'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const departmentColor = {
  Operations: 'primary',
  Product: 'success',
  Engineering: 'info',
  People: 'warning',
  Finance: 'secondary',
  Support: 'error'
}

const employees = [
  {
    id: 1,
    name: 'Ava Patel',
    role: 'Operations Lead',
    department: 'Operations',
    status: 'On site',
    image: createAvatar('Ava Patel', '#0F766E')
  },
  {
    id: 2,
    name: 'Lucas Reed',
    role: 'Senior Product Designer',
    department: 'Product',
    status: 'Remote',
    image: createAvatar('Lucas Reed', '#7C3AED')
  },
  {
    id: 3,
    name: 'Mia Chen',
    role: 'Frontend Engineer',
    department: 'Engineering',
    status: 'Hybrid',
    image: createAvatar('Mia Chen', '#2563EB')
  },
  {
    id: 4,
    name: 'Noah Kim',
    role: 'People Partner',
    department: 'People',
    status: 'Traveling',
    image: createAvatar('Noah Kim', '#D97706')
  },
  {
    id: 5,
    name: 'Sofia Alvarez',
    role: 'Finance Manager',
    department: 'Finance',
    status: 'Remote',
    image: createAvatar('Sofia Alvarez', '#BE185D')
  },
  {
    id: 6,
    name: 'Ethan Brooks',
    role: 'Customer Support Lead',
    department: 'Support',
    status: 'On call',
    image: createAvatar('Ethan Brooks', '#DC2626')
  }
]

function createAvatar(name, background) {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">
      <rect width="320" height="320" fill="${background}" />
      <text
        x="50%"
        y="53%"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="#ffffff"
        font-family="Arial, sans-serif"
        font-size="108"
        font-weight="700"
      >
        ${initials}
      </text>
    </svg>
  `

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export default function Page() {
  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <Typography variant='h5'>Employees</Typography>
            <Typography>{`Total ${employees.length} active team members across Mission Control`}</Typography>
          </div>
        </div>

        <Grid container spacing={6}>
          {employees.map(employee => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={employee.id}>
              <div className='border rounded bs-full overflow-hidden'>
                <div className='pli-2 pbs-2'>
                  <Link href='/employees' className='flex'>
                    <div className='relative is-full overflow-hidden rounded aspect-square bg-actionHover'>
                      <img
                        src={employee.image}
                        alt={employee.name}
                        className='absolute inset-0 is-full bs-full object-cover'
                      />
                    </div>
                  </Link>
                </div>

                <div className='flex flex-col gap-4 p-5'>
                  <div className='flex items-center justify-between gap-3'>
                    <Chip
                      label={employee.department}
                      variant='tonal'
                      size='small'
                      color={departmentColor[employee.department]}
                    />
                    <div className='flex items-center gap-1 text-textSecondary'>
                      <i className='tabler-activity-heartbeat text-base text-success' />
                      <Typography color='text.secondary'>{employee.status}</Typography>
                    </div>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <Link href='/employees' className='hover:text-primary'>
                      <Typography variant='h5'>{employee.name}</Typography>
                    </Link>
                    <Typography color='text.primary'>{employee.role}</Typography>
                  </div>

                  <div className='flex flex-wrap gap-4'>
                    <Button
                      fullWidth
                      variant='tonal'
                      endIcon={<i className='tabler-message-circle' />}
                      href='/chat'
                    >
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}
