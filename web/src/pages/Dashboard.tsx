import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useSimulate, useLastResult, useThresholds } from '../api/hooks'
import type { MethodKey, SimulateRequest } from '../api/types'
import { DEFAULT_REQUEST } from '../lib/defaults'
import { countAtRiskVillages } from '../lib/derive'
import Controls from '../components/Controls'
import VillageMap from '../components/map/VillageMap'
import MapLegend from '../components/map/MapLegend'
import VillageList from '../components/map/VillageList'
import SelectedVehicle from '../components/SelectedVehicle'
import Explanation from '../components/Explanation'
import AlertsPanel from '../components/AlertsPanel'
import FleetTable from '../components/FleetTable'
import MethodCells from '../components/MethodCells'
import { ResultFrame, ErrorMessage, EmptyState } from '../components/states'
import Icon from '../components/Icon'
import '../styles/kombai-dashboard.css'

export function Dashboard() {
  const queryClient = useQueryClient()
  const simulate = useSimulate()
  const { data } = useLastResult()
  const thresholds = useThresholds()
  const [method, setMethod] = useState<MethodKey>('risk_based')
  // Keep the form values when the user comes back from another page.
  const [request, setRequest] = useState<SimulateRequest>(
    () => queryClient.getQueryData<SimulateRequest>(['simulate', 'lastRequest']) ?? DEFAULT_REQUEST,
  )

  const run = () => simulate.mutate(request)
  const selected = data?.methods[method]
  const vehicle = selected?.routes.find((r) => r.stops.length > 0)

  return (
    <div className="tempo-screen page-dashboard">
      <main className="page-wrap" id="dashboard">
        <section aria-labelledby="page-title" className="page-head">
          <div>
            <h1 id="page-title">Operations dashboard</h1>
            <p>Village cooling-window buffer and pickup order for one chilling centre.</p>
          </div>
        </section>

        <Controls
          request={request}
          onChange={setRequest}
          onRun={run}
          loading={simulate.isPending}
          errorMessage={simulate.isError ? simulate.error.message : null}
        />

        {simulate.isError && <ErrorMessage message={simulate.error.message} onRetry={run} />}
        {!data && !simulate.isError && <EmptyState>Choose a scenario and press Run.</EmptyState>}

        {data && selected && (
          <ResultFrame busy={simulate.isPending}>
            <MethodCells
              methods={data.methods}
              selected={method}
              onSelect={setMethod}
              atRisk={countAtRiskVillages(data.villages)}
            />
            <section className="work-grid">
              <section className="map-panel" id="fleet-map">
                <div className="map-head">
                  <h2 className="panel-title">Village map</h2>
                  <div className="panel-meta">
                    <span className="map-tag">
                      <Icon name="map-pin" /> {data.meta.scenario}, {data.meta.ambient_c} °C, {data.meta.vehicles} vehicles, {data.meta.n_villages} villages
                    </span>
                  </div>
                </div>
                <div className="map-canvas">
                  <VillageMap
                    centre={data.centre}
                    villages={data.villages}
                    routes={selected.routes}
                    highlightVehicleId={vehicle?.vehicle_id}
                    buffers={selected.buffers}
                    thresholds={thresholds}
                  />
                </div>
                <MapLegend bandThresholds={thresholds} />
                <VillageList villages={data.villages} buffers={selected.buffers} thresholds={thresholds} />
              </section>
              <aside className="rail">
                {vehicle && <SelectedVehicle vehicle={vehicle} villages={data.villages} buffers={selected.buffers} thresholds={thresholds} />}
                <Explanation text={data.explanation.text} source={data.explanation.source} />
                <AlertsPanel alerts={data.alerts} />
              </aside>
            </section>
            <section className="fleet-panel" id="routes">
              <div className="fleet-head"><h2>Vehicles</h2></div>
              <FleetTable routes={selected.routes} buffers={selected.buffers} thresholds={thresholds} />
            </section>
          </ResultFrame>
        )}
      </main>
    </div>
  )
}

export default Dashboard
