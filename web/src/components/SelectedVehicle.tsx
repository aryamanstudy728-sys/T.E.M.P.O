import type { Village, RoutePlan } from '../api/types'
import { bandOf, getWorstStop, type Thresholds } from '../lib/derive'

const LABEL = { green: 'On track', yellow: 'Watch', red: 'Critical' } as const
const COLOUR = { green: 'mint', yellow: 'amber', red: 'red' } as const

interface Props { vehicle: RoutePlan; villages: Village[]; buffers: Record<string, number>; thresholds?: Thresholds }

export function SelectedVehicle({ vehicle, villages, buffers, thresholds }: Props) {
  const vMap = new Map(villages.map((v) => [v.id, v]))
  const worst = getWorstStop(vehicle, buffers)
  const worstBand = worst && thresholds ? bandOf(worst.buffer, thresholds) : null
  return (
    <section className="selected-panel">
      <div className="selected-top">
        <div className="selected-heading">Selected vehicle</div>
        {worstBand && <span className="risk-chip">{LABEL[worstBand]}</span>}
      </div>
      <div className="vehicle-name">Vehicle {vehicle.vehicle_id}</div>
      <div className="vehicle-sub"><span className="mono">Route {vehicle.time_h.toFixed(1)} h</span></div>
      <ul className="stops-list">
        {vehicle.stops.map((id, idx) => {
          const v = vMap.get(id)
          const b = buffers[id]
          if (!v || b === undefined) return null
          const band = thresholds ? bandOf(b, thresholds) : null
          return (
            <li key={id} className="stop-row">
              <span className="stop-seq">{String(idx + 1).padStart(2, '0')}</span>
              <span className="stop-name">{v.name}</span>
              {band && <span className="stop-band" style={{ color: `var(--${COLOUR[band]})` }}>{LABEL[band]}</span>}
              <span className="stop-buffer">{b.toFixed(1)} h</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default SelectedVehicle
