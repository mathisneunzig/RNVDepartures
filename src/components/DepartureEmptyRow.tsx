import { TableRow, TableCell, Typography } from '@mui/material'

export default function DeparturesEmptyRow() {
  return (
    <TableRow>
      <TableCell colSpan={6}>
        <Typography variant="body2" color="text.secondary">Keine Abfahrten gefunden.</Typography>
      </TableCell>
    </TableRow>
  )
}
