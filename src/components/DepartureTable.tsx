import { useState } from 'react'
import { Table, TableBody, TableContainer, Paper } from '@mui/material'
import DeparturesTableHead from './DepartureTableHead.tsx'
import DeparturesLoadingRow from './DepartureLoadingRow.tsx'
import DeparturesEmptyRow from './DepartureEmptyRow.tsx'
import DepartureRows from './DepartureRows.tsx'
import type { Row } from './DepartureTypes.tsx'
import { favKeyOf } from './DepartureKeys.tsx'

export default function DeparturesTable({ loading, rows }: { loading: boolean; rows: Row[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>({})

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="medium">
        <DeparturesTableHead />
        <TableBody>
          {loading && <DeparturesLoadingRow />}
          {!loading && rows.length === 0 && <DeparturesEmptyRow />}
          {!loading && rows.map(r => {
            const key = favKeyOf(r)
            const isOpen = !!open[key]
            return (
              <DepartureRows
                key={key}
                row={r}
                isOpen={isOpen}
                favKey={key}
                onToggle={() => setOpen(o => ({ ...o, [key]: !o[key] }))}
              />
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
