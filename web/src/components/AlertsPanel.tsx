import { Link } from 'react-router-dom'
import type { Alert } from '../api/types'

interface AlertsPanelProps {
  alerts: Alert[]
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <section className="alerts-panel">
      <div className="rail-title-row">
        <h2>Actionable alerts</h2>
        <Link to="/alerts">View all</Link>
      </div>
      <ul className="alerts-list" role="list">
        {alerts.map((alert) => (
          <li key={`${alert.kind}-${alert.village_id}`} className="alert-row">
            <span className="alert-indicator" />
            <div className="alert-content">
              <div className="alert-message">{alert.message}</div>
              <div className="alert-meta">{alert.village_id} · {alert.kind} · {alert.severity}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default AlertsPanel