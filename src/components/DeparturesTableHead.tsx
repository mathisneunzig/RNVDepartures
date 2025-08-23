import { TableHead, TableRow, TableCell } from '@mui/material'

export default function DeparturesTableHead() {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Linie</TableCell>
        <TableCell>Geplant</TableCell>
        <TableCell>Echtzeit</TableCell>
        <TableCell align="right">in Min</TableCell>
        <TableCell align="right">Merken</TableCell>
        <TableCell />
      </TableRow>
    </TableHead>
  )
}
