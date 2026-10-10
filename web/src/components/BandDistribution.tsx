import type { Band, SimulateResponse } from '../api/types'
import { bandOf, type Thresholds } from '../lib/derive'

const BANDS: { band: Band; label: string; colour: string }[] = [
  { band: 'green', label: 'On track', colour: 'var(--mint)' },
  { band: 'yellow', label: 'Watch', colour: 'var(--amber)' },
  { band: 'red', label: 'Critical', colour: 'var(--red)' },
]

// Counts come from villages[].band (risk-based plan) and, per vehicle, from the
// risk-based buffers with the band thresholds. Bar widths are count / total.
export function BandDistribution({ data, thresholds }: { data: SimulateResponse; thresholds?: Thresholds }) {
  const total = data.villages.length
  const count = (b: Band) => data.villages.filter((v) => v.band === b).length
  const risk = data.methods.risk_based
  return (
    <article className="panel">
      <div className="panel-head">
        <h2>Buffer bands, last run</h2>
        <span className="subtle-meta">{data.meta.scenario}, risk-based plan</span>
      </div>
      <div className="panel-body">
        {BANDS.map(({ band, label, colour }) => (
          <div key={band} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 60px', gap: 10, alignItems: 'center', margin: '8px 0' }}>
            <span>{label}</span>
            <div className="bar-track" aria-hidden="true">
              <div style={{ width: `${total ? (count(band) / total) * 100 : 0}%`, height: '100%', background: colour, borderRadius: 4 }} />
            </div>
            <span>{count(band)} of {total}</span>
          </div>
        ))}
        {thresholds && (
          <div aria-label="Bands per vehicle" className="table-wrap" role="region" tabIndex={0}>
            <table className="risk-table">
              <thead>
                <tr><th scope="col">Vehicle</th><th scope="col">On track</th><th scope="col">Watch</th><th scope="col">Critical</th><th scope="col">Stops</th></tr>
              </thead>
              <tbody>
                {risk.routes.filter((r) => r.stops.length > 0).map((r) => {
                  const bands = r.stops.map((id) => bandOf(risk.buffers[id], thresholds))
                  return (
                    <tr key={r.vehicle_id}>
                      <td>Vehicle {r.vehicle_id}</td>
                      <td>{bands.filter((b) => b === 'green').length}</td>
                      <td>{bands.filter((b) => b === 'yellow').length}</td>
                      <td>{bands.filter((b) => b === 'red').length}</td>
                      <td>{r.stops.length}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </article>
  )
}

export default BandDistribution
