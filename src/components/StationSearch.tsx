import { useMemo, useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import stopsData from '../utils/stops.json'

type Station = {
  name: string
  hafasID: string
}

export default function StationSearch({
  value,
  onChange,
}: {
  value: string
  onChange: (hafasId: string) => void
}) {
  const options: Station[] = useMemo(() => {
    const list = (stopsData as any).stations as any[]
    return list.map(s => ({ name: s.name as string, hafasID: String(s.hafasID) }))
  }, [])

  const [input, setInput] = useState<string>('')

  const current = options.find(o => o.hafasID === value) || null

  return (
    <Autocomplete
      sx={{ minWidth: 320 }}
      options={options}
      getOptionLabel={(o) => `${o.name} (${o.hafasID})`}
      value={current}
      inputValue={input}
      onInputChange={(_e, v) => setInput(v)}
      onChange={(_e, v) => v && onChange(v.hafasID)}
      renderInput={(params) => <TextField {...params} label="Haltestelle suchen" size="small" />}
    />
  )
}
