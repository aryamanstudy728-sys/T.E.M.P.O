import type { Centre, RoutePlan, Village } from '../api/types'
import { bandOf, type Thresholds } from '../lib/derive'

const BAND_LABEL = { green: 'On track', yellow: 'Watch', red: 'Critical' } as const

interface Props {
  title: string
  route: RoutePlan
  villages: Village[]
  centre: Centre
  buffers: Record<string, number> // this method's buffers
  thresholds?: Thresholds
}

export function RouteTable({ title, route, villages, centre, buffers, thresholds }: Props) {
  const vMap = new Map(villages.map((v) => [v.id, v]))
  return (
    <div className="table-panel" style={{ flex: 1, minWidth: 0 }}>
      <div className="panel-head">
        <div>
          <h2 className="panel-title">{title}</h2>
          <div className="panel-subtitle">Vehicle {route.vehicle_id} · {route.stops.length} stops · {route.time_h.toFixed(1)} h</div>
        </div>
      </div>
      <div className="table-wrap" tabIndex={0} role="region" aria-label={`${title} stops`}>
        <table>
          <thead>
            <tr>
              <th scope="col">Seq</th><th scope="col">Stop</th><th scope="col">Volume</th>
              <th scope="col">Initial temp</th><th scope="col">Buffer</th><th scope="col">Risk</th>
            </tr>
          </thead>
          <tbody>
            {route.stops.map((id, idx) => {
              const v = vMap.get(id)
              const b = buffers[id]
              if (!v || b === undefined) return null
              const band = thresholds ? bandOf(b, thresholds) : null
              return (
                <tr key={id}>
                  <td className="seq">{String(idx + 1).padStart(2, '0')}</td>
                  <td><span className="stop-name">{v.name}</span><span className="stop-id">{v.id}</span></td>
                  <td className="volume">{v.volume_l} L</td>
                  <td className="temp">{v.milk_temp_c} °C</td>
                  <td className={`tsb ${band ?? ''}`}>{b.toFixed(1)} h</td>
                  <td>{band && <span className={`risk-label ${band}`}>{BAND_LABEL[band]}</span>}</td>
                </tr>
              )
            })}
            <tr>
              <td className="seq">{String(route.stops.length + 1).padStart(2, '0')}</td>
              <td><span className="stop-name">{centre.name}</span><span className="stop-id">{centre.id}</span></td>
              <td className="empty-data">—</td><td className="empty-data">—</td><td className="empty-data">—</td>
              <td><span className="risk-label destination">Destination</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RouteTable
