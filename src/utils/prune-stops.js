import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const file = process.argv[2] || 'src/utils/stops.json'
const filepath = resolve(process.cwd(), file)
const src = await readFile(filepath, 'utf8')
const data = JSON.parse(src)

const isArrayRoot = Array.isArray(data)
const stations = isArrayRoot ? data : (data.stations || [])

const pruned = stations
  .map(s => ({ name: s?.name ?? null, hafasID: s?.hafasID ?? null }))
  .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '', 'de', { numeric: true, sensitivity: 'base' }))

const out = isArrayRoot ? pruned : { stations: pruned }
await writeFile(filepath, JSON.stringify(out, null, 2) + '\n')