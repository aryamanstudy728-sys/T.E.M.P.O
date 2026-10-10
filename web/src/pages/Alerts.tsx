import { useState } from 'react'
import { useLastResult } from '../api/hooks'
import type { Alert } from '../api/types'
import AlertDetail from '../components/AlertDetail'
import { EmptyState } from '../components/states'
import Icon from '../components/Icon'
import '../styles/kombai-alerts.css'

const key = (a: Alert) => `${a.kind}-${a.village_id}`

export function Alerts() {
  const { data } = useLastResult()
  const [filter, setFilter] = useState<string>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (!data) {
    return (
      <div className="alert-app page-alerts">
        <main className="page">
          <h1>Alert center</h1>
          <EmptyState>Run a scenario on the Dashboard first.</EmptyState>
        </main>
      </div>
    )
  }

  const alerts = data.alerts
  // derived from alerts[].severity: only severities that actually occur
  const severities = Array.from(new Set(alerts.map((a) => a.severity)))
  const shown = filter === 'all' ? alerts : alerts.filter((a) => a.severity === filter)
  const selected = alerts.find((a) => key(a) === selectedId) ?? null

  return (
    <div className="alert-app page-alerts">
      <main className="page">
        <div className="page-heading">
          <div>
            <h1>Alert center</h1>
            <p>Alerts the engine derived from the last run, under the risk-based plan.</p>
          </div>
        </div>

        <section aria-label="Alert totals" className="metrics">
          <div className="metric">
            <span className="metric-label">Total alerts</span>
            <span className="metric-value">{alerts.length}</span>
          </div>
          {severities.map((s) => (
            <div className="metric" key={s}>
              <span className="metric-label">{s}</span>
              <span className={`metric-value ${s}`}>{alerts.filter((a) => a.severity === s).length}</span>
            </div>
          ))}
        </section>

        <div className="work-grid">
          <section aria-labelledby="all-alerts-title" className="work-panel">
            <div className="panel-head">
              <span className="panel-title" id="all-alerts-title">All alerts</span>
              <span className="panel-meta">Showing {shown.length} of {alerts.length}</span>
            </div>
            <div className="controls">
              <div aria-label="Filter by severity" className="filters" role="group">
                {['all', ...severities].map((s) => (
                  <button key={s} type="button" className={`filter-btn${filter === s ? ' active' : ''}`} aria-pressed={filter === s} onClick={() => setFilter(s)}>
                    {s === 'all' ? 'All' : s}
                  </button>
                ))}
              </div>
            </div>
            {shown.length === 0 ? (
              <EmptyState>No alerts for this run.</EmptyState>
            ) : (
              <div className="table-scroll" tabIndex={0} role="region" aria-label="Alerts table">
                <table aria-label="Alerts from the last run" className="alert-table">
                  <thead>
                    <tr><th>Event</th><th>Severity</th><th>Message</th><th>Village</th></tr>
                  </thead>
                  <tbody>
                    {shown.map((a) => (
                      <tr
                        key={key(a)}
                        className={`alert-row${key(a) === selectedId ? ' selected' : ''}`}
                        tabIndex={0}
                        aria-selected={key(a) === selectedId}
                        onClick={() => setSelectedId(key(a))}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedId(key(a)) } }}
                      >
                        <td>
                          <div className="event-cell">
                            <span className="event-icon"><Icon name="alert-triangle" /></span>
                            <span className="event-copy"><span className="event-name">{a.kind}</span></span>
                          </div>
                        </td>
                        <td><span className={`severity ${a.severity}`}><span className="sev-dot" />{a.severity}</span></td>
                        <td className="message-cell">{a.message}</td>
                        <td className="mono">{a.village_id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          <AlertDetail alert={selected} data={data} />
        </div>
      </main>
    </div>
  )
}

export default Alerts
