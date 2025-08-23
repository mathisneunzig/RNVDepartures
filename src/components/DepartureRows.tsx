import { Fragment } from 'react'
import { TableRow, TableCell, Stack, Typography, IconButton, Collapse, Box } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import LineBadge from './LineBadge'
import FavoriteToggleButton from './FavoriteToggleButton'
import { fmt } from '../utils/time'
import { delayColor } from '../utils/colors'
import type { Row } from './DeparturesTypes'
import type { FavKey } from '../hooks/favorites'

export default function DepartureRows({
  row,
  isOpen,
  favKey,
  onToggle,
}: {
  row: Row
  isOpen: boolean
  favKey: FavKey
  onToggle: () => void
}) {
  return (
    <Fragment>
      {row.planned && (
      <TableRow hover>
        <TableCell>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <LineBadge label={row.line} bg={row.bg} type={row.type} />
            <Typography variant="h6" color="text.primary">{row.destination || '–'}</Typography>
          </Stack>
        </TableCell>
        <TableCell><Typography variant="h6">{fmt(row.planned)}</Typography></TableCell>
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h6" sx={{ color: delayColor(row.delay) }}>
              {fmt(row.realtime)}
            </Typography>
            {row.delay !== 0 && (
              <Typography variant="h6" sx={{ color: delayColor(row.delay) }}>
                ({row.delay > 0 ? `+${row.delay}` : row.delay} min)
              </Typography>
            )}
          </Stack>
        </TableCell>
        <TableCell align="right">
          <Typography variant="h6">{row.minutes === 0 ? 'sofort' : `${row.minutes} min`}</Typography>
        </TableCell>
        <TableCell align="right">
          <FavoriteToggleButton favKey={favKey} />
        </TableCell>
        <TableCell width={48}>
          <IconButton size="small" onClick={onToggle}>
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      )}

      <TableRow>
        <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box sx={{ px: 6, py: 1.5, bgcolor: 'action.hover' }}>
              <Stack spacing={0.5}>
                {row.allStops
                  .slice(row.allStops.findIndex(s => s.hafasID === row.stationId) + 1)
                  .map((s, idx) => (
                    <Stack key={idx} direction="row" spacing={2} justifyContent="space-between">
                      <Typography variant="body1">{s.name || '—'}</Typography>
                      <Typography variant="body1" sx={{ minWidth: 120, textAlign: 'right' }}>
                        {fmt(s.realtimeDeparture?.isoString || s.plannedDeparture?.isoString)}
                      </Typography>
                    </Stack>
                  ))
                }
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}
