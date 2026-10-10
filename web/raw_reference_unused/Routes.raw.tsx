import Icon from '../../components/Icon'
import '../../styles/kombai-routes.css'

export function RoutesRaw() {
  return (
    
    <div id="tempo-shell" className="page-routes">
                <main className="content">
            <div className="page-head">
                <div>
                    <h1 className="page-title">
                        Route management
                    </h1>
                    <p className="page-desc">
                        Review the collection sequence and act on stops with limited thermal margin.
                    </p>
                </div>
                <div className="head-actions">
                    <button aria-label="Selected vehicle: Tanker 02" className="vehicle-select" type="button">
                        <span>
                            <strong>
                                Tanker 02
                            </strong>
                            <span className="vehicle-id">
                                VEH-002 · Selected vehicle
                            </span>
                        </span>
                        <Icon name="chevron-down" />
                    </button>
                    <button className="primary-button" type="button">
                        <Icon name="route" />
                        Optimize route
                    </button>
                </div>
            </div>
            <div className="demo-banner" role="note">
                <span className="demo-flag">
                    <Icon name="alert-triangle" />
                    Demo scenario · not live
                </span>
                <span className="demo-copy">
                    Route values below are sample scenario data for review—not current dispatch readings.
                </span>
            </div>
            <p className="state-note" data-dynamic="true" data-reason="text displayed when API data is unreachable">
                API data is unavailable. Current route, vehicle status and freshness are unknown; sample values are shown only to demonstrate the route workflow.
            </p>
            <section aria-label="Priority stop action" className="priority-strip">
                <span className="priority-icon">
                    <Icon name="thermometer" />
                </span>
                <div className="priority-copy">
                    <div className="priority-title">
                        Critical unvisited stop · Village Collection Center 3
                    </div>
                    <div className="priority-desc">
                        Sequence 03 · estimated arrival 05:44 ·
                        <strong>
                            0.4 h modeled TSB
                        </strong>
                        falls below the prototype’s estimated 0.5 h red-band threshold.
                    </div>
                </div>
                <button className="reroute-button" type="button">
                    <Icon name="route" />
                    Reroute
                </button>
            </section>
            <div className="main-grid">
                <section aria-labelledby="stops-title" className="table-panel">
                    <div className="panel-head">
                        <div>
                            <h2 className="panel-title" id="stops-title">
                                Collection route
                            </h2>
                            <div className="panel-subtitle">
                                Tanker 02 · village pickups followed by Bulk Milk Cooler 1
                            </div>
                        </div>
                        <div className="route-count">
                            <strong>
                                5
                            </strong>
                            stops
                            <span aria-hidden="true">
                                ·
                            </span>
                            <span>
                                4 collection centers + 1 BMC
                            </span>
                        </div>
                    </div>
                    <div className="route-mobile-hint">
                        Scroll horizontally to compare arrival, volume and thermal fields →
                    </div>
                    <div aria-label="Scrollable route stop details" className="table-wrap" tabIndex={0}>
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">
                                        Seq.
                                    </th>
                                    <th scope="col">
                                        Stop
                                    </th>
                                    <th scope="col">
                                        Estimated
                                    </th>
                                    <th scope="col">
                                        Actual
                                    </th>
                                    <th scope="col">
                                        Collected
                                    </th>
                                    <th scope="col">
                                        Initial temp.
                                    </th>
                                    <th scope="col">
                                        TSB
                                    </th>
                                    <th scope="col">
                                        Risk / state
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="seq">
                                        01
                                    </td>
                                    <td>
                                        <span className="stop-name">
                                            Village Collection Center 4
                                        </span>
                                        <span className="stop-id">
                                            VCC-004 · collected
                                        </span>
                                    </td>
                                    <td className="time" data-dynamic="true" data-reason="value dynamically fetched from route data">
                                        04:35
                                    </td>
                                    <td className="time actual-recorded" data-dynamic="true" data-reason="value dynamically fetched from route data">
                                        04:41
                                    </td>
                                    <td className="volume" data-dynamic="true" data-reason="value dynamically fetched from route data">
                                        738.8 L
                                    </td>
                                    <td className="temp" data-dynamic="true" data-reason="value dynamically fetched from route data">
                                        35.8 °C
                                        <span className="estimate-mark">
                                            *
                                        </span>
                                    </td>
                                    <td className="tsb watch" data-dynamic="true" data-reason="value dynamically fetched from route data">
                                        2.1 h
                                        <span className="estimate-mark">
                                            *
                                        </span>
                                    </td>
                                    <td>
                                        <span className="risk-label watch">
                                            <span className="risk-dot">
                                            </span>
                                            Warning · collected
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="seq">
                                        02
                                    </td>
                                    <td>
                                        <span className="stop-name">
                                            Village Collection Center 1
                                        </span>
                                        <span className="stop-id">
                                            VCC-001 · upcoming
                                        </span>
                                    </td>
                                    <td className="time">
                                        05:10
                                    </td>
                                    <td className="empty-data">
                                        Not recorded
                                    </td>
                                    <td className="empty-data">
                                        Not collected
                                    </td>
                                    <td className="empty-data">
                                        Not recorded
                                    </td>
                                    <td className="empty-data">
                                        Not calculated
                                    </td>
                                    <td>
                                        <span className="risk-label pending">
                                            <span className="risk-dot">
                                            </span>
                                            Unscored
                                        </span>
                                    </td>
                                </tr>
                                <tr className="priority-row">
                                    <td className="seq">
                                        03
                                    </td>
                                    <td>
                                        <span className="stop-name">
                                            Village Collection Center 3
                                        </span>
                                        <span className="stop-id">
                                            VCC-003 · next priority
                                        </span>
                                    </td>
                                    <td className="time" data-dynamic="true" data-reason="value dynamically fetched from route data">
                                        05:44
                                    </td>
                                    <td className="empty-data">
                                        Not recorded
                                    </td>
                                    <td className="empty-data">
                                        Not collected
                                    </td>
                                    <td className="temp" data-dynamic="true" data-reason="value dynamically fetched from route data">
                                        29.6 °C
                                        <span className="estimate-mark">
                                            *
                                        </span>
                                    </td>
                                    <td className="tsb critical" data-dynamic="true" data-reason="value dynamically fetched from route data">
                                        0.4 h
                                        <span className="estimate-mark">
                                            *
                                        </span>
                                    </td>
                                    <td>
                                        <span className="risk-label critical">
                                            <span className="risk-dot">
                                            </span>
                                            Critical · unvisited
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="seq">
                                        04
                                    </td>
                                    <td>
                                        <span className="stop-name">
                                            Village Collection Center 2
                                        </span>
                                        <span className="stop-id">
                                            VCC-002 · upcoming
                                        </span>
                                    </td>
                                    <td className="time">
                                        06:16
                                    </td>
                                    <td className="empty-data">
                                        Not recorded
                                    </td>
                                    <td className="empty-data">
                                        Not collected
                                    </td>
                                    <td className="empty-data">
                                        Not recorded
                                    </td>
                                    <td className="empty-data">
                                        Not calculated
                                    </td>
                                    <td>
                                        <span className="risk-label pending">
                                            <span className="risk-dot">
                                            </span>
                                            Unscored
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="seq">
                                        05
                                    </td>
                                    <td>
                                        <span className="stop-name">
                                            Bulk Milk Cooler 1
                                        </span>
                                        <span className="stop-id">
                                            BMC-001 · destination
                                        </span>
                                    </td>
                                    <td className="time">
                                        06:48
                                    </td>
                                    <td className="empty-data">
                                        Not recorded
                                    </td>
                                    <td className="empty-data">
                                        —
                                    </td>
                                    <td className="empty-data">
                                        —
                                    </td>
                                    <td className="empty-data">
                                        —
                                    </td>
                                    <td>
                                        <span className="risk-label destination">
                                            <span className="risk-dot">
                                            </span>
                                            Destination
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="table-foot">
                        <div aria-label="Risk legend" className="legend">
                            <span className="legend-item">
                                <span className="risk-dot" style={{ background: "var(--mint)" }}>
                                </span>
                                Green · &gt;2.5 h
                            </span>
                            <span className="legend-item">
                                <span className="risk-dot" style={{ background: "var(--yellow)" }}>
                                </span>
                                Yellow · 0.5–2.5 h
                            </span>
                            <span className="legend-item">
                                <span className="risk-dot" style={{ background: "var(--red)" }}>
                                </span>
                                Red · &lt;0.5 h
                            </span>
                            <span className="legend-item">
                                <span className="risk-dot" style={{ background: "#7c8985" }}>
                                </span>
                                Unscored · no payload
                            </span>
                        </div>
                        <div className="table-note">
                            * Sample values · not live or verified
                        </div>
                    </div>
                </section>
                <aside aria-label="Selected vehicle and route context" className="rail">
                    <section aria-labelledby="map-title" className="rail-panel">
                        <div className="rail-heading">
                            <h2 id="map-title">
                                Route map
                            </h2>
                            <span className="map-label">
                                <Icon name="map-pin" />
                                Pune area · schematic
                            </span>
                        </div>
                        <div className="map-stage">
                            <span className="map-tag pune">
                                Pune collection area
                            </span>
                            <span className="map-tag collector">
                                Sequence shown · sample geometry
                            </span>
                            {/* MAP */}
                        </div>
                        <div className="map-foot">
                            <div className="map-key">
                                <span>
                                    <i className="line-key">
                                    </i>
                                    Completed
                                </span>
                                <span>
                                    <i className="line-key planned">
                                    </i>
                                    Planned
                                </span>
                            </div>
                            <span>
                                Red marker · priority
                            </span>
                        </div>
                    </section>
                    <section aria-labelledby="vehicle-title" className="rail-panel">
                        <div className="vehicle-summary">
                            <div className="vehicle-summary-title" id="vehicle-title">
                                <span className="truck-mark">
                                    <Icon name="truck" />
                                </span>
                                <span>
                                    Tanker 02
                                    <span className="vehicle-summary-meta" data-dynamic="true" data-reason="status dynamically fetched from vehicle telemetry">
                                        VEH-002 · status unavailable
                                    </span>
                                </span>
                            </div>
                            <div className="summary-stats">
                                <div className="summary-stat">
                                    <span>
                                        Collection stops
                                    </span>
                                    <strong>
                                        04
                                    </strong>
                                </div>
                                <div className="summary-stat">
                                    <span>
                                        Route endpoint
                                    </span>
                                    <strong style={{ font: "600 13px 'DM Sans',sans-serif" }}>
                                        BMC-001
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section aria-labelledby="simulation-title" className="rail-panel simulation">
                        <div className="simulation-head">
                            <h2 id="simulation-title">
                                Optimization change
                            </h2>
                            <span className="sim-tag">
                                Simulated · not applied
                            </span>
                        </div>
                        <div className="simulation-content">
                            <div className="change-line">
                                <span className="change-icon">
                                    <Icon name="arrow-up-right" />
                                </span>
                                <span>
                                    Move
                                    <strong>
                                        Village Collection Center 3
                                    </strong>
                                    from stop 03 to stop 02.
                                </span>
                            </div>
                            <p className="change-reason">
                                Reason: modeled TSB is 0.4 h; prioritizing this stop moves it ahead of an unscored pickup.
                            </p>
                            <div className="sim-metrics">
                                <div className="sim-metric">
                                    <span>
                                        Time saved · model output
                                    </span>
                                    <strong data-dynamic="true" data-reason="value dynamically calculated by simulation engine">
                                        0 min
                                    </strong>
                                </div>
                                <div className="sim-metric">
                                    <span>
                                        Risk reduction · model output
                                    </span>
                                    <strong data-dynamic="true" data-reason="value dynamically calculated by simulation engine">
                                        0.0%
                                    </strong>
                                </div>
                            </div>
                            <div className="sim-note">
                                Example only. Reordering does not lower the modeled risk band in this preview; no route change has been applied.
                            </div>
                        </div>
                    </section>
                    <p className="threshold-note">
                        <strong>
                            Model note:
                        </strong>
                        TSB bands are documented prototype estimates, not validated safety limits. Blank fields mean no collection payload is recorded.
                    </p>
                </aside>
            </div>
        </main>
    </div>
    
  )
}

export default RoutesRaw
