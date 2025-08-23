import { TableRow, TableCell, Stack, Typography, IconButton } from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import LineBadge from "./LineBadge"
import FavoriteToggleButton from "./FavoriteToggleButton"
import { fmt } from "../../utils/time"
import { delayColor } from "../../utils/colors"
import { DepartureRowProps } from "./types"

export default function DepartureRowMain({ row, favKey, isOpen, onToggle }: DepartureRowProps) {
  if (!row.planned) return null
  return (
    <TableRow hover>
      <TableCell>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <LineBadge label={row.line} bg={row.bg} type={row.type} />
          <Typography variant="h6" color="text.primary">{row.destination || "–"}</Typography>
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
        <Typography variant="h6">{row.minutes === 0 ? "sofort" : `${row.minutes} min`}</Typography>
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
  )
}
