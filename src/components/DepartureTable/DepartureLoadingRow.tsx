import { TableRow, TableCell, Stack, Typography } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

export default function DeparturesLoadingRow() {
  return (
    <TableRow>
      <TableCell colSpan={6}>
        <Stack direction="row" spacing={1} alignItems="center">
          <AccessTimeIcon fontSize="small" />
          <Typography variant="body2" color="text.secondary">Lade Abfahrten…</Typography>
        </Stack>
      </TableCell>
    </TableRow>
  )
}
