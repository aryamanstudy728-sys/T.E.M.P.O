import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import '../../styles/map.css'
import type { LatLngTuple } from 'leaflet'
import type { Centre, Village, RoutePlan } from '../../api/types'
import { bandOf, type Thresholds } from '../../lib/derive'
import { MapControls } from './MapControls'
import { buildVillageIcon, buildCentreIcon } from './markerIcon'
import { RouteLines } from './RouteLines'

interface VillageMapProps {
  centre: Centre
  villages: Village[]
  routes: RoutePlan[]
  numbered?: boolean
  highlightVehicleId?: number
  buffers?: Record<string, number> // selected method's buffers; village.buffer_h is risk-based only
  thresholds?: Thresholds
}

function FitBounds({ positions }: { positions: LatLngTuple[] }) {
  const map = useMap()
  useEffect(() => {
    if (positions.length > 1) {
      map.fitBounds(positions, { padding: [20, 20] })
    }
  }, [map, positions])
  return null
}

export function VillageMap({
  centre,
  villages,
  routes,
  numbered = false,
  highlightVehicleId,
  buffers,
  thresholds,
}: VillageMapProps) {
  const highlightedRoute = routes.find((r) => r.vehicle_id === highlightVehicleId)
  const stopOrder = new Map(highlightedRoute?.stops.map((id, idx) => [id, idx + 1]) ?? [])

  const allPositions = useMemo<LatLngTuple[]>(
    () => [[centre.lat, centre.lon], ...villages.map((v) => [v.lat, v.lon] as LatLngTuple)],
    [centre, villages],
  )

  return (
    <MapContainer
      center={[centre.lat, centre.lon]}
      zoom={11}
      scrollWheelZoom={false}
      className="village-map"
      attributionControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <RouteLines
        centre={centre}
        villages={villages}
        routes={routes}
        highlightVehicleId={highlightVehicleId}
      />
      <Marker position={[centre.lat, centre.lon]} icon={buildCentreIcon(centre.name)} />
      {villages.map((v) => {
        // Use the selected method's buffer when thresholds are known; otherwise the risk-based values.
        const useMethod = buffers !== undefined && thresholds !== undefined && buffers[v.id] !== undefined
        const buf = useMethod ? buffers[v.id] : v.buffer_h
        const band = useMethod ? bandOf(buf, thresholds) : v.band
        return (
          <Marker
            key={v.id}
            position={[v.lat, v.lon]}
            icon={buildVillageIcon(band, buf, numbered ? stopOrder.get(v.id) : undefined)}
          />
        )
      })}
      <FitBounds positions={allPositions} />
      <MapControls fitPositions={allPositions} />
    </MapContainer>
  )
}

export default VillageMap