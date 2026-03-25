'use client'

import { useCallback, useEffect, useState } from 'react'

import Link from 'next/link'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

export default function Page() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetch('/api/agents', { cache: 'no-store' })
      const data = await res.json()

      if (data.ok) {
        setAgents(data.agents)
        setError(null)
      } else {
        setError(data.error ?? 'Unknown error')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setLastRefresh(new Date())
    }
  }, [])

  useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(fetchAgents, 15000)

    return () => clearInterval(interval)
  }, [fetchAgents])

  return (
    <Card>
      <CardContent className='flex flex-col gap-6'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div>
            <Typography variant='h5'>Agents</Typography>
            <Typography color='text.secondary'>
              {loading
                ? 'Loading active sessions…'
                : error
                  ? 'Could not load agent sessions'
                  : `${agents.length} agent${agents.length === 1 ? '' : 's'} across Mission Control`}
            </Typography>
          </div>
          <div className='flex items-center gap-2'>
            {lastRefresh && (
              <Typography variant='caption' color='text.secondary'>
                Updated {lastRefresh.toLocaleTimeString()}
              </Typography>
            )}
            <Tooltip title='Refresh'>
              <IconButton size='small' onClick={fetchAgents} disabled={loading}>
                <i className={`tabler-refresh text-base ${loading ? 'animate-spin' : ''}`} />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {loading && agents.length === 0 ? (
          <div className='flex justify-center py-12'>
            <CircularProgress />
          </div>
        ) : error && agents.length === 0 ? (
          <div className='flex flex-col items-center gap-3 py-12'>
            <i className='tabler-alert-circle text-4xl text-error' />
            <Typography color='error'>{error}</Typography>
            <Button variant='tonal' onClick={fetchAgents}>Retry</Button>
          </div>
        ) : (
          <Grid container spacing={6}>
            {agents.map(agent => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={agent.id}>
                <div className='border rounded bs-full overflow-hidden'>
                  <div className='pli-2 pbs-2'>
                    <div className='relative is-full overflow-hidden rounded aspect-square bg-actionHover'>
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className='absolute inset-0 is-full bs-full object-cover'
                      />
                    </div>
                  </div>

                  <div className='flex flex-col gap-4 p-5'>
                    <div className='flex items-center justify-between gap-3'>
                      <Chip
                        label={agent.department}
                        variant='tonal'
                        size='small'
                        color={agent.departmentColor}
                      />
                      <div className='flex items-center gap-1'>
                        <i
                          className={`tabler-circle-filled text-xs ${
                            agent.status === 'Active'
                              ? 'text-success'
                              : agent.status === 'Idle'
                                ? 'text-warning'
                                : 'text-textDisabled'
                          }`}
                        />
                        <Typography variant='body2' color='text.secondary'>
                          {agent.status}
                        </Typography>
                      </div>
                    </div>

                    <div className='flex flex-col gap-1'>
                      <Typography variant='h5'>{agent.name}</Typography>
                      <Typography color='text.primary'>{agent.role}</Typography>
                      {agent.model && (
                        <Typography variant='caption' color='text.secondary'>
                          {agent.model}
                        </Typography>
                      )}
                    </div>

                    {agent.channel && (
                      <div className='flex items-center gap-1 text-textSecondary'>
                        <i className='tabler-antenna-bars-5 text-sm' />
                        <Typography variant='caption' color='text.secondary'>
                          {agent.channel}
                        </Typography>
                        {agent.totalTokens > 0 && (
                          <Typography variant='caption' color='text.secondary' className='mli-auto'>
                            {(agent.totalTokens / 1000).toFixed(1)}k tokens
                          </Typography>
                        )}
                      </div>
                    )}

                    <Button
                      fullWidth
                      variant='tonal'
                      endIcon={<i className='tabler-message-circle' />}
                      href='/chat'
                      component={Link}
                    >
                      Message
                    </Button>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}
