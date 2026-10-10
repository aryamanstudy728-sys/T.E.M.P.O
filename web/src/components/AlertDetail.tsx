import type { Alert, MethodKey, SimulateResponse } from '../api/types'

const BAND_LABEL = { green: 'On track', yellow: 'Watch', red: 'Critical' } as const
const METHODS: MethodKey[] = ['fixed', 'nearest', 'risk_based']

export function AlertDetail({ alert, data }: { alert: Alert | null; data: SimulateResponse }) {
  if (!alert) {
    return (
      <aside className="detail-panel" aria-label="Alert detail">
        <div className="detail-body"><div className="context-empty">Select an alert to see its detail.</div></div>
      </aside>
    )
  }
  const village = data.villages.find((v) => v.id === alert.village_id)
  // derived from methods.*.breaching_ids
  const breachingIn = METHODS.filter((m) => data.methods[m].breaching_ids.includes(alert.village_id))
  return (
    <aside className="detail-panel" aria-label="Alert detail">
      <div className="detail-head">
        <div className="detail-headline">
          <span className="detail-title">Alert detail</span>
          <span className={`severity ${alert.severity}`}><span className="sev-dot" />{alert.severity}</span>
        </div>
        <div className="detail-overline">{alert.village_id}</div>
      </div>
      <div className="detail-body">
        <div className="detail-event">{alert.kind}</div>
        <p className="detail-message">{alert.message}</p>
        <div className="detail-fields">
          <div className="detail-field"><span className="field-label">Village</span><span className="field-value">{village?.name ?? alert.village_id}</span></div>
          <div className="detail-field"><span className="field-label">Band (risk-based plan)</span><span className="field-value">{village ? BAND_LABEL[village.band] : '—'}</span></div>
          <div className="detail-field"><span className="field-label">Buffer (risk-based plan)</span><span className="field-value">{village ? `${village.buffer_h.toFixed(1)} h` : '—'}</span></div>
          <div className="detail-field"><span className="field-label">Breaching under</span><span className="field-value">{breachingIn.length ? breachingIn.join(', ') : 'no method'}</span></div>
        </div>
      </div>
    </aside>
  )
}

export default AlertDetail
