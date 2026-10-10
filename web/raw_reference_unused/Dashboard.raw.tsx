import { useState } from 'react'
import Icon from '../../components/Icon'
import MapPanel from '../../components/map/MapPanel'
import SelectedVehicle from '../../components/SelectedVehicle'
import Explanation from '../../components/Explanation'
import AlertsPanel from '../../components/AlertsPanel'
import FleetTable from '../../components/FleetTable'
import '../../styles/kombai-dashboard.css'
import { useLastResult } from '../../api/hooks'
import { countAtRiskVillages } from '../../lib/derive'

type MethodKey = 'fixed' | 'nearest' | 'risk_based'

const METHOD_LABELS: Record<MethodKey, string> = {
  fixed: 'Fixed route',
  nearest: 'Nearest first',
  risk_based: 'Risk-based',
}

export function DashboardRaw() {
  const simulateResponse = useLastResult()
  const [selectedMethod, setSelectedMethod] = useState<MethodKey>('fixed')

  const data = simulateResponse.data
  const methods = data?.methods ?? { fixed: null, nearest: null, risk_based: null }
  const villages = data?.villages ?? []
  const centre = data?.centre

  const methodKeys: MethodKey[] = ['fixed', 'nearest', 'risk_based']
  const atRiskCount = countAtRiskVillages(villages)

  const selectedMethodData = methods[selectedMethod]
  const selectedVehicle = selectedMethodData?.routes[0]

  return (
    <div className="tempo-screen page-dashboard">
      <main className="page-wrap" id="dashboard">
        <section aria-labelledby="page-title" className="page-head">
          <div>
            <h1 id="page-title">Operations dashboard</h1>
            <p>Milk collection, thermal risk and fleet movement across active routes.</p>
          </div>
          <div className="head-note">
            <Icon name="info-circle" />
            Live readings unavailable · showing a demo scenario
          </div>
        </section>

        <div className="metrics" role="group" aria-label="Routing methods">
          {methodKeys.map((key) => {
            const m = methods[key]
            return (
              <button
                key={key}
                className={`metric ${selectedMethod === key ? 'selected' : ''}`}
                onClick={() => setSelectedMethod(key)}
                aria-pressed={selectedMethod === key}
              >
                <div className="metric-label">{METHOD_LABELS[key]}</div>
                <div className="metric-value critical">
                  {m?.breaching ?? 0}
                  <small> breaching</small>
                </div>
                <div className="metric-detail">
                  volume at risk {m?.volume_at_risk_l ?? 0} L, route {m?.time_h?.toFixed(1) ?? '-'} h
                </div>
              </button>
            )
          })}
          <div className="metric">
            <div className="metric-label">At-risk villages</div>
            <div className="metric-value critical">{atRiskCount}</div>
            <div className="metric-detail">red or yellow band</div>
          </div>
        </div>

        <div className="demo-strip" role="status">
          <Icon name="alert-circle" />
          <span>
            Telemetry is offline. Values and route positions below are for a
            <strong>Demo scenario · not live</strong>; they do not represent current field conditions.
          </span>
        </div>

        <section aria-label="Fleet map and dispatch details" className="work-grid">
          <section aria-labelledby="map-title" className="map-panel" id="fleet-map">
            <div className="map-head">
              <h2 className="panel-title" id="map-title">Fleet map</h2>
              <div className="panel-meta">
                <span className="map-tag">
                  <Icon name="map-pin" />
                  Scenario locations
                </span>
                <button aria-label="Map options" className="icon-button">
                  <Icon name="adjustments-horizontal" />
                </button>
              </div>
            </div>
            {centre && selectedMethodData && (
              <div className="map-canvas" role="img">
                <MapPanel
                  result={data!}
                  selectedMethod={selectedMethodData}
                  highlightVehicleId={selectedVehicle?.vehicle_id}
                />
              </div>
            )}
          </section>
          <aside aria-label="Selected vehicle and operational alerts" className="rail">
            {selectedVehicle && (
              <SelectedVehicle vehicle={selectedVehicle} villages={villages} />
            )}
            <Explanation
              text={simulateResponse.explanation?.text ?? ''}
              source={simulateResponse.explanation?.source ?? 'template'}
            />
            <AlertsPanel alerts={simulateResponse.alerts ?? []} />
          </aside>
        </section>

        <section aria-labelledby="fleet-title" className="fleet-panel" id="routes">
          <div className="fleet-head">
            <h2 id="fleet-title">Fleet vehicles</h2>
            <span className="fleet-source">Demo scenario · not live</span>
          </div>
          {selectedMethodData && (
            <FleetTable routes={selectedMethodData.routes} villages={villages} />
          )}
          <div className="table-hint">Route details remain available in the full-width table; scroll horizontally to compare all fields.</div>
        </section>
      </main>
    </div>
  )
}

export default DashboardRaw