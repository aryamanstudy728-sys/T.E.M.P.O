import Icon from '../../components/Icon'
import '../../styles/kombai-alerts.css'

export function AlertsRaw() {
  return (
    
    <div className="alert-app page-alerts">
                <main className="page">
            <div className="page-heading">
                <div>
                    <h1>
                        Alert center
                    </h1>
                    <p>
                        Review milk-safety, route, and facility events.
                    </p>
                </div>
                <div className="heading-note">
                    <Icon name="clock-exclamation" />
                    <span>
                        Live alert feed unavailable
                    </span>
                </div>
            </div>
            <div className="data-notice" role="status">
                <Icon name="alert-triangle" />
                <div>
                    <strong>
                        Live alerts are unavailable.
                    </strong>
                    <span>
                        Demo records are shown for layout only; they do not describe current route or milk conditions.
                    </span>
                </div>
            </div>
            <section aria-label="Alert totals" className="metrics">
                <div className="metric">
                    <span className="metric-label">
                        Total alerts
                    </span>
                    <span className="metric-value">
                        06
                    </span>
                </div>
                <div className="metric">
                    <span className="metric-label">
                        Critical
                    </span>
                    <span className="metric-value critical">
                        02
                    </span>
                </div>
                <div className="metric">
                    <span className="metric-label">
                        Warning
                    </span>
                    <span className="metric-value warning">
                        02
                    </span>
                </div>
                <div className="metric">
                    <span className="metric-label">
                        Info
                    </span>
                    <span className="metric-value info">
                        02
                    </span>
                </div>
                <div className="metric">
                    <span className="metric-label">
                        Unacknowledged
                    </span>
                    <span className="metric-value mint">
                        03
                    </span>
                </div>
            </section>
            <div className="work-grid">
                <section aria-labelledby="all-alerts-title" className="work-panel">
                    <div className="panel-head">
                        <span className="panel-title" id="all-alerts-title">
                            All alerts
                        </span>
                        <span className="panel-meta">
                            6 demo records
                        </span>
                    </div>
                    <div className="controls">
                        <label className="searchbox">
                            <Icon name="search" />
                            <input aria-label="Search alerts" id="alert-search" placeholder="Search message, vehicle, or VCC" type="search" />
                        </label>
                        <div aria-label="Filter by severity" className="filters" role="group">
                            <button aria-pressed="true" className="filter-btn active" data-filter="all">
                                All
                                <span>
                                    06
                                </span>
                            </button>
                            <button aria-pressed="false" className="filter-btn" data-filter="critical">
                                Critical
                                <span>
                                    02
                                </span>
                            </button>
                            <button aria-pressed="false" className="filter-btn" data-filter="warning">
                                Warning
                                <span>
                                    02
                                </span>
                            </button>
                            <button aria-pressed="false" className="filter-btn" data-filter="info">
                                Info
                                <span>
                                    02
                                </span>
                            </button>
                        </div>
                        <span className="result-count" data-dynamic="true" data-reason="text rewritten by filter/search handler to reflect matching row count" id="result-count">
                            Showing 6
                        </span>
                    </div>
                    <div className="table-scroll">
                        <table aria-label="Alert records in demo scenario" className="alert-table">
                            <colgroup>
                                <col style={{ width: "142px" }} />
                                <col style={{ width: "85px" }} />
                                <col style={{ width: "auto" }} />
                                <col style={{ width: "83px" }} />
                                <col style={{ width: "76px" }} />
                                <col style={{ width: "122px" }} />
                                <col style={{ width: "113px" }} />
                                <col style={{ width: "106px" }} />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>
                                        Event
                                    </th>
                                    <th>
                                        Severity
                                    </th>
                                    <th>
                                        Message
                                    </th>
                                    <th>
                                        Vehicle
                                    </th>
                                    <th>
                                        VCC
                                    </th>
                                    <th>
                                        Timestamp
                                    </th>
                                    <th>
                                        State
                                    </th>
                                    <th>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody id="alert-rows">
                                <tr aria-label="Select thermal risk alert for VEH-017" className="alert-row selected" data-message="Thermal buffer below 0.5 h at the next collection stop" data-severity="critical" data-state="Unacknowledged" data-time="08 Oct 2026 · 08:42 IST" data-type="thermal_risk" data-vcc="VCC-014" data-vehicle="VEH-017" role="button" tabIndex={0}>
                                    <td>
                                        <div className="event-cell">
                                            <span className="event-icon">
                                                <Icon name="temperature" />
                                            </span>
                                            <span className="event-copy">
                                                <span className="event-name">
                                                    Thermal risk
                                                </span>
                                                <span className="event-code">
                                                    thermal_risk
                                                </span>
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="severity critical">
                                            <span className="sev-dot">
                                            </span>
                                            Critical
                                        </span>
                                    </td>
                                    <td className="message-cell">
                                        Thermal buffer below 0.5 h at next stop
                                    </td>
                                    <td className="mono">
                                        VEH-017
                                    </td>
                                    <td className="mono">
                                        VCC-014
                                    </td>
                                    <td className="mono">
                                        08 Oct 2026
                                        <br />
                                        <span className="muted-value">
                                            08:42 IST
                                        </span>
                                    </td>
                                    <td>
                                        <span className="ack-state pending" data-dynamic="true" data-reason="children and class rewritten by acknowledge handler">
                                            <Icon name="hourglass" />
                                            Unacknowledged
                                        </span>
                                    </td>
                                    <td>
                                        <button className="ack-btn" data-dynamic="true" data-reason="label and disabled state rewritten by acknowledge handler" type="button">
                                            Acknowledge
                                        </button>
                                    </td>
                                </tr>
                                <tr aria-label="Select adulteration alert for VEH-006" className="alert-row" data-message="Fat reading changed beyond the demo screening threshold" data-severity="critical" data-state="Acknowledged" data-time="07 Oct 2026 · 07:16 IST" data-type="adulteration" data-vcc="VCC-021" data-vehicle="VEH-006" role="button" tabIndex={0}>
                                    <td>
                                        <div className="event-cell">
                                            <span className="event-icon">
                                                <Icon name="test-pipe-2" />
                                            </span>
                                            <span className="event-copy">
                                                <span className="event-name">
                                                    Adulteration
                                                </span>
                                                <span className="event-code">
                                                    adulteration
                                                </span>
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="severity critical">
                                            <span className="sev-dot">
                                            </span>
                                            Critical
                                        </span>
                                    </td>
                                    <td className="message-cell">
                                        Fat reading changed beyond the demo screening threshold
                                    </td>
                                    <td className="mono">
                                        VEH-006
                                    </td>
                                    <td className="mono">
                                        VCC-021
                                    </td>
                                    <td className="mono">
                                        07 Oct 2026
                                        <br />
                                        <span className="muted-value">
                                            07:16 IST
                                        </span>
                                    </td>
                                    <td>
                                        <span className="ack-state done">
                                            <Icon name="check" />
                                            Acknowledged
                                        </span>
                                    </td>
                                    <td>
                                        <button className="ack-btn" disabled type="button">
                                            Acknowledged
                                        </button>
                                    </td>
                                </tr>
                                <tr aria-label="Select weather spike alert for VEH-024" className="alert-row" data-message="Heat advisory may affect the western collection loop" data-severity="warning" data-state="Unacknowledged" data-time="06 Oct 2026 · 10:05 IST" data-type="weather_spike" data-vcc="—" data-vehicle="VEH-024" role="button" tabIndex={0}>
                                    <td>
                                        <div className="event-cell">
                                            <span className="event-icon">
                                                <Icon name="sun-high" />
                                            </span>
                                            <span className="event-copy">
                                                <span className="event-name">
                                                    Weather spike
                                                </span>
                                                <span className="event-code">
                                                    weather_spike
                                                </span>
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="severity warning">
                                            <span className="sev-dot">
                                            </span>
                                            Warning
                                        </span>
                                    </td>
                                    <td className="message-cell">
                                        Heat advisory may affect the western collection loop
                                    </td>
                                    <td className="mono">
                                        VEH-024
                                    </td>
                                    <td className="muted-value">
                                        —
                                    </td>
                                    <td className="mono">
                                        06 Oct 2026
                                        <br />
                                        <span className="muted-value">
                                            10:05 IST
                                        </span>
                                    </td>
                                    <td>
                                        <span className="ack-state pending" data-dynamic="true" data-reason="children and class rewritten by acknowledge handler">
                                            <Icon name="hourglass" />
                                            Unacknowledged
                                        </span>
                                    </td>
                                    <td>
                                        <button className="ack-btn" data-dynamic="true" data-reason="label and disabled state rewritten by acknowledge handler" type="button">
                                            Acknowledge
                                        </button>
                                    </td>
                                </tr>
                                <tr aria-label="Select BMC overload alert" className="alert-row" data-message="Intake queue is above the demo operating threshold" data-severity="warning" data-state="Acknowledged" data-time="05 Oct 2026 · 09:31 IST" data-type="bmc_overload" data-vcc="VCC-008" data-vehicle="—" role="button" tabIndex={0}>
                                    <td>
                                        <div className="event-cell">
                                            <span className="event-icon">
                                                <Icon name="snowflake" />
                                            </span>
                                            <span className="event-copy">
                                                <span className="event-name">
                                                    BMC overload
                                                </span>
                                                <span className="event-code">
                                                    bmc_overload
                                                </span>
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="severity warning">
                                            <span className="sev-dot">
                                            </span>
                                            Warning
                                        </span>
                                    </td>
                                    <td className="message-cell">
                                        Intake queue is above the demo operating threshold
                                    </td>
                                    <td className="muted-value">
                                        —
                                    </td>
                                    <td className="mono">
                                        VCC-008
                                    </td>
                                    <td className="mono">
                                        05 Oct 2026
                                        <br />
                                        <span className="muted-value">
                                            09:31 IST
                                        </span>
                                    </td>
                                    <td>
                                        <span className="ack-state done">
                                            <Icon name="check" />
                                            Acknowledged
                                        </span>
                                    </td>
                                    <td>
                                        <button className="ack-btn" disabled type="button">
                                            Acknowledged
                                        </button>
                                    </td>
                                </tr>
                                <tr aria-label="Select route change alert for VEH-011" className="alert-row" data-message="Collection sequence updated after road access change" data-severity="info" data-state="Unacknowledged" data-time="04 Oct 2026 · 06:54 IST" data-type="route_change" data-vcc="VCC-003" data-vehicle="VEH-011" role="button" tabIndex={0}>
                                    <td>
                                        <div className="event-cell">
                                            <span className="event-icon">
                                                <Icon name="route" />
                                            </span>
                                            <span className="event-copy">
                                                <span className="event-name">
                                                    Route change
                                                </span>
                                                <span className="event-code">
                                                    route_change
                                                </span>
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="severity info">
                                            <span className="sev-dot">
                                            </span>
                                            Info
                                        </span>
                                    </td>
                                    <td className="message-cell">
                                        Collection sequence updated after road access change
                                    </td>
                                    <td className="mono">
                                        VEH-011
                                    </td>
                                    <td className="mono">
                                        VCC-003
                                    </td>
                                    <td className="mono">
                                        04 Oct 2026
                                        <br />
                                        <span className="muted-value">
                                            06:54 IST
                                        </span>
                                    </td>
                                    <td>
                                        <span className="ack-state pending" data-dynamic="true" data-reason="children and class rewritten by acknowledge handler">
                                            <Icon name="hourglass" />
                                            Unacknowledged
                                        </span>
                                    </td>
                                    <td>
                                        <button className="ack-btn" data-dynamic="true" data-reason="label and disabled state rewritten by acknowledge handler" type="button">
                                            Acknowledge
                                        </button>
                                    </td>
                                </tr>
                                <tr aria-label="Select route change alert for VEH-003" className="alert-row" data-message="Vehicle arrival recorded at the bulk milk cooler" data-severity="info" data-state="Acknowledged" data-time="03 Oct 2026 · 08:19 IST" data-type="route_change" data-vcc="VCC-002" data-vehicle="VEH-003" role="button" tabIndex={0}>
                                    <td>
                                        <div className="event-cell">
                                            <span className="event-icon">
                                                <Icon name="truck-delivery" />
                                            </span>
                                            <span className="event-copy">
                                                <span className="event-name">
                                                    Route change
                                                </span>
                                                <span className="event-code">
                                                    route_change
                                                </span>
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="severity info">
                                            <span className="sev-dot">
                                            </span>
                                            Info
                                        </span>
                                    </td>
                                    <td className="message-cell">
                                        Vehicle arrival recorded at the bulk milk cooler
                                    </td>
                                    <td className="mono">
                                        VEH-003
                                    </td>
                                    <td className="mono">
                                        VCC-002
                                    </td>
                                    <td className="mono">
                                        03 Oct 2026
                                        <br />
                                        <span className="muted-value">
                                            08:19 IST
                                        </span>
                                    </td>
                                    <td>
                                        <span className="ack-state done">
                                            <Icon name="check" />
                                            Acknowledged
                                        </span>
                                    </td>
                                    <td>
                                        <button className="ack-btn" disabled type="button">
                                            Acknowledged
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                <aside aria-label="Selected alert detail" className="detail-panel">
                    <div className="detail-head">
                        <div className="detail-headline">
                            <span className="detail-title">
                                Selected alert
                            </span>
                            <span className="detail-overline">
                                DEMO RECORD
                            </span>
                        </div>
                        <span className="severity critical" data-dynamic="true" data-reason="class and children rewritten by selection change handler">
                            <span className="sev-dot">
                            </span>
                            Critical
                        </span>
                    </div>
                    <div className="detail-body">
                        <div className="detail-event" data-dynamic="true" data-reason="text replaced from selected row by selection handler" id="detail-event">
                            Thermal risk
                        </div>
                        <p className="detail-message" data-dynamic="true" data-reason="text replaced from selected row by selection handler" id="detail-message">
                            Thermal buffer below 0.5 h at the next collection stop
                        </p>
                        <div className="detail-fields">
                            <div className="detail-field">
                                <span className="field-label">
                                    Vehicle
                                </span>
                                <span className="field-value" data-dynamic="true" data-reason="text replaced from selected row by selection handler" id="detail-vehicle">
                                    VEH-017
                                </span>
                            </div>
                            <div className="detail-field">
                                <span className="field-label">
                                    VCC
                                </span>
                                <span className="field-value" data-dynamic="true" data-reason="text replaced from selected row by selection handler" id="detail-vcc">
                                    VCC-014
                                </span>
                            </div>
                            <div className="detail-field">
                                <span className="field-label">
                                    Timestamp
                                </span>
                                <span className="field-value" data-dynamic="true" data-reason="text replaced from selected row by selection handler" id="detail-time">
                                    08 Oct 2026 · 08:42 IST
                                </span>
                            </div>
                            <div className="detail-field">
                                <span className="field-label">
                                    State
                                </span>
                                <span className="field-value" data-dynamic="true" data-reason="text replaced by selection and acknowledge handlers" id="detail-state">
                                    Unacknowledged
                                </span>
                            </div>
                        </div>
                        <div className="route-context">
                            <div className="context-title">
                                Route context
                            </div>
                            <div className="context-empty">
                                <Icon name="info-circle" />
                                Stop sequence is not included in this alert record.
                            </div>
                        </div>
                        <button className="detail-action" data-dynamic="true" data-reason="label and disabled state rewritten by acknowledge and selection handlers" id="detail-ack" type="button">
                            Acknowledge alert
                        </button>
                        <p className="small-note">
                            Acknowledging records that you have seen the alert; it does not resolve a hazard.
                        </p>
                    </div>
                </aside>
            </div>
            <div className="footer-note">
                <span>
                    Demo data is illustrative only; risk thresholds are not a verified safety assessment.
                </span>
                <span>
                    All timestamps shown as recorded in the demo scenario · IST
                </span>
            </div>
        </main>
    </div>
    
    
  )
}

export default AlertsRaw
