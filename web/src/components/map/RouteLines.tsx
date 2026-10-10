import { Polyline } from 'react-leaflet'
import type { LatLngTuple } from 'leaflet'
import type { Centre, Village, RoutePlan } from '../../api/types'

interface RouteLinesProps {
  centre: Centre
  villages: Village[]
  routes: RoutePlan[]
  highlightVehicleId?: number
}

// SVG stroke attributes cannot use CSS variables, so this is the design's --mint value.
const ROUTE_COLOUR = '#45d9b1'

const STYLES = [
  { dash: '6,6', weight: 3 },
  { dash: '2,4', weight: 2.5 },
  { dash: '10,2,2,2', weight: 2.5 },
  { dash: '4,4', weight: 2 },
  { dash: '1,6', weight: 2 },
]

export function RouteLines({ centre, villages, routes, highlightVehicleId }: RouteLinesProps) {
  const vMap = new Map(villages.map((v) => [v.id, v]))

  return (
    <>
      {routes.map((route, idx) => {
        const isHighlighted = highlightVehicleId ? route.vehicle_id === highlightVehicleId : true
        const coords: LatLngTuple[] = [[centre.lat, centre.lon]]

        for (const stopId of route.stops) {
          const v = vMap.get(stopId)
          if (!v) {
            console.warn(`RouteLines: missing village id ${stopId}`)
            continue
          }
          coords.push([v.lat, v.lon])
        }
        coords.push([centre.lat, centre.lon])

        if (coords.length < 3) return null

        const style = STYLES[idx % STYLES.length]
        const opacity = isHighlighted ? 0.9 : 0.35
        const color = ROUTE_COLOUR

        return (
          <Polyline
            key={route.vehicle_id}
            positions={coords}
            color={color}
            weight={style.weight}
            dashArray={style.dash}
            opacity={opacity}
            lineCap="round"
            lineJoin="round"
          />
        )
      })}
    </>
  )
}

export default RouteLines