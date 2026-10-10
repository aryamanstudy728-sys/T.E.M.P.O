import type { Village } from '../../api/types'
import { bandOf, type Thresholds } from '../../lib/derive'

const LABEL = { green: 'On track', yellow: 'Watch', red: 'Critical' } as const

interface Props { villages: Village[]; buffers?: Record<string, number>; thresholds?: Thresholds }

// Text alternative to the map: every village, its band and its buffer.
export function VillageList({ villages, buffers, thresholds }: Props) {
  return (
    <ul className="visually-hidden" aria-label="Villages on map">
      {villages.map((v) => {
        const use = buffers && thresholds && buffers[v.id] !== undefined
        const buf = use ? buffers[v.id] : v.buffer_h
        const band = use ? bandOf(buf, thresholds) : v.band
        return <li key={v.id}>{v.name} · {LABEL[band]} · {buf.toFixed(1)} h buffer</li>
      })}
    </ul>
  )
}

export default VillageList
