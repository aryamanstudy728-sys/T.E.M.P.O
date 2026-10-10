import { Link } from 'react-router-dom'
import type { RoutePlan } from '../api/types'
import { bandOf, getWorstStop, type Thresholds } from '../lib/derive'
import Icon from './Icon'

const LABEL = { green: 'On track', yellow: 'Watch', red: 'Critical' } as const

interface Props { routes: RoutePlan[]; buffers: Record<string, number>; thresholds?: Thresholds }

export function FleetTable({ routes, buffers, thresholds }: Props) {
  return (
    <div className="fleet-table-wrap">
      <table className="fleet-table">
        <thead>
          <tr><th scope="col">Vehicle</th><th scope="col">Stops</th><th scope="col">Route risk</th><th scope="col">Action</th></tr>
        </thead>
        <tbody>
          {routes.map((route) => {
            const worst = getWorstStop(route, buffers)
            const band = worst && thresholds ? bandOf(worst.buffer, thresholds) : null
            return (
              <tr key={route.vehicle_id}>
                <td><div className="vehicle-cell"><Icon name="truck" /><strong>Vehicle {route.vehicle_id}</strong></div></td>
                <td>{route.stops.length}</td>
                <td>
                  {worst ? (
                    <span className={`risk-text ${band ?? ''}`}>{band ? `${LABEL[band]} · ` : ''}lowest buffer {worst.buffer.toFixed(1)} h</span>
                  ) : 'No stops'}
                </td>
                <td>
                  {route.stops.length > 0 && (
                    <Link className="route-link" to={`/routes?vehicle=${route.vehicle_id}`}>View route</Link>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default FleetTable
