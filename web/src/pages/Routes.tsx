import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLastResult, useThresholds, useRouteCeiling } from '../api/hooks'
import { bandOf, getTimeDifference, getWorstStop, bandCounts, bufferSeries, routeTimes } from '../lib/derive'
import type { MethodKey } from '../api/types'
import RouteTable from '../components/RouteTable'
import VillageMap from '../components/map/VillageMap'
import VillageList from '../components/map/VillageList'
import { EmptyState } from '../components/states'
import Icon from '../components/Icon'
import RiskBar from '../components/charts/RiskBar'
import BufferLines from '../components/charts/BufferLines'
import VehicleTimes from '../components/charts/VehicleTimes'
import '../styles/kombai-routes.css'
import '../styles/charts.css'

const LABELS: Record<MethodKey, string> = { fixed: 'Fixed', nearest: 'Nearest', risk_based: 'Risk-based' }
const BAND_LABEL = { green: 'On track', yellow: 'Watch', red: 'Critical' } as const

export function Routes() {
  const { data } = useLastResult()
  const thresholds = useThresholds()
  const ceiling = useRouteCeiling()
  const [method, setMethod] = useState<MethodKey>('risk_based')
  const [compare, setCompare] = useState(false)
  const [params, setParams] = useSearchParams()

  if (!data) {
    return (
      <div id="tempo-shell" className="page-routes">
        <main className="content">
          <h1 className="page-title">Route management</h1>
          <EmptyState>Run a scenario on the Dashboard first.</EmptyState>
        </main>
      </div>
    )
  }

  const { methods, villages, centre, meta } = data
  const ids = methods[method].routes.filter((r) => r.stops.length > 0).map((r) => String(r.vehicle_id))
  const wanted = params.get('vehicle')
  const vehicleId = wanted && ids.includes(wanted) ? wanted : ids[0]
  const routeOf = (m: MethodKey) => methods[m].routes.find((r) => String(r.vehicle_id) === vehicleId)
  const route = routeOf(method)
  const fixed = routeOf('fixed')
  const buffers = methods[method].buffers
  const priority = route ? getWorstStop(route, buffers) : null
  const priorityVillage = priority ? villages.find((v) => v.id === priority.id) : undefined
  const priorityBand = priority && thresholds ? bandOf(priority.buffer, thresholds) : null

  const bandLabels = { fixed: 'Fixed', nearest: 'Nearest', risk_based: 'Risk-based' } as const
  const methodKeys: MethodKey[] = ['fixed', 'nearest', 'risk_based']

  const riskBars = methodKeys.map((m) => {
    const counts = bandCounts(methods[m].buffers, thresholds?.greenH ?? 2.5, thresholds?.redH ?? 0.5)
    return <RiskBar key={m} label={bandLabels[m]} counts={counts} />
  })

  const bufferLinesSeries = methodKeys
    .map((m) => {
      const r = methods[m].routes.find((rt) => String(rt.vehicle_id) === vehicleId)
      if (!r) return null
      return {
        method: m,
        label: bandLabels[m],
        points: bufferSeries(r, methods[m].buffers),
      }
    })
    .filter((s): s is NonNullable<typeof s> => s !== null)

  const vehicleTimes = routeTimes(methods[method])

  return (
    <div id="tempo-shell" className="page-routes">
      <main className="content">
        <div className="page-head">
          <div>
            <h1 className="page-title">Route management</h1>
            <p className="page-desc">Pickup order for each vehicle, with each stop's buffer.</p>
          </div>
          <div className="head-actions">
            <label htmlFor="vehicle-select" className="visually-hidden">Vehicle</label>
            <select id="vehicle-select" value={vehicleId ?? ''} onChange={(e) => setParams({ vehicle: e.target.value }, { replace: true })}>
              {ids.map((id) => <option key={id} value={id}>Vehicle {id}</option>)}
            </select>
            <div className="method-segmented" role="group" aria-label="Routing method">
              {(Object.keys(LABELS) as MethodKey[]).map((m) => (
                <button key={m} type="button" className={method === m ? 'active' : ''} aria-pressed={method === m} onClick={() => setMethod(m)}>
                  {LABELS[m]}
                </button>
              ))}
            </div>
            <label className="compare-toggle">
              <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} /> Compare
            </label>
          </div>
        </div>

        {priority && priorityVillage && !compare && (
          <section className="priority-strip">
            <span className="priority-icon"><Icon name="thermometer" /></span>
            <div className="priority-copy">
              <div className="priority-title">Priority stop · {priorityVillage.name}</div>
              <div className="priority-desc">
                Sequence {String(priority.index + 1).padStart(2, '0')} · buffer <strong>{priority.buffer.toFixed(1)} h</strong>{priorityBand ? ` · ${BAND_LABEL[priorityBand]}` : ''}
              </div>
            </div>
          </section>
        )}

        <section className="risk-bar-panel" aria-labelledby="risk-bar-title">
          <div className="risk-bar-panel-head">
            <div>
              <h2 id="risk-bar-title" className="risk-bar-panel-title">Villages by risk band</h2>
              <p className="risk-bar-panel-subtitle">Scenario {meta.scenario} · seed {meta.seed}</p>
            </div>
            <span className="risk-bar-panel-caption">{methods[method].routes.length} vehicles · {villages.length} villages</span>
          </div>
          <div className="risk-bar-list">
            {riskBars}
          </div>
        </section>

        {bufferLinesSeries.length > 0 && (
          <section className="buffer-lines-panel" aria-labelledby="buffer-lines-title">
            <div className="buffer-lines-panel-head">
              <div>
                <h2 id="buffer-lines-title" className="buffer-lines-panel-title">Buffer along the route (selected vehicle)</h2>
                <p className="buffer-lines-panel-subtitle">Scenario {meta.scenario} · seed {meta.seed}</p>
              </div>
            </div>
            <BufferLines
              series={bufferLinesSeries}
              greenH={thresholds?.greenH ?? 2.5}
              redH={thresholds?.redH ?? 0.5}
            />
          </section>
        )}

        <section className="vehicle-times-panel" aria-labelledby="vehicle-times-title">
          <div className="vehicle-times-panel-head">
            <div>
              <h2 id="vehicle-times-title" className="vehicle-times-panel-title">Route time per vehicle</h2>
              <p className="vehicle-times-panel-subtitle">{LABELS[method]} · Scenario {meta.scenario} · seed {meta.seed}</p>
            </div>
          </div>
          <VehicleTimes times={vehicleTimes} ceiling={ceiling} />
        </section>

        <div className="main-grid" style={{ gridTemplateColumns: compare ? 'repeat(3, 1fr)' : '1fr 344px' }}>
          {compare ? (
            (Object.keys(LABELS) as MethodKey[]).map((m) => {
              const r = routeOf(m)
              return r ? <RouteTable key={m} title={LABELS[m]} route={r} villages={villages} centre={centre} buffers={methods[m].buffers} thresholds={thresholds} /> : null
            })
          ) : (
            <>
              {route && <RouteTable title={`Collection route, ${LABELS[method]}`} route={route} villages={villages} centre={centre} buffers={buffers} thresholds={thresholds} />}
              <aside className="rail">
                <section className="rail-panel">
                  <div className="rail-heading"><h2>Route map</h2></div>
                  <div className="map-stage">
                    <VillageMap centre={centre} villages={villages} routes={methods[method].routes} numbered highlightVehicleId={route?.vehicle_id} buffers={buffers} thresholds={thresholds} />
                  </div>
                  <div className="map-foot">
                    <span className="threshold-note">
                      {thresholds ? `Critical below ${thresholds.redH} h · Watch ${thresholds.redH} to ${thresholds.greenH} h · On track above ${thresholds.greenH} h` : 'Markers show buffer in hours and the band word.'}
                    </span>
                  </div>
                  <VillageList villages={villages} buffers={buffers} thresholds={thresholds} />
                </section>
                {route && (
                  <section className="rail-panel">
                    <div className="vehicle-summary-title">
                      <span className="truck-mark"><Icon name="truck" /></span>
                      <span>Vehicle {vehicleId} · {route.stops.length} stops · {route.time_h.toFixed(1)} h</span>
                    </div>
                  </section>
                )}
                <section className="rail-panel simulation">
                  <div className="simulation-head"><h2>Explanation</h2></div>
                  <div className="simulation-content">
                    <p>{data.explanation.text}</p>
                    {route && fixed && (
                      <p className="sim-note">Route time vs fixed: {getTimeDifference(route, fixed) >= 0 ? '+' : ''}{getTimeDifference(route, fixed).toFixed(1)} h</p>
                    )}
                  </div>
                </section>
              </aside>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default Routes
