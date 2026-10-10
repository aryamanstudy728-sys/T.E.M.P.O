import Icon from '../../components/Icon'
import '../../styles/kombai-analytics.css'

export function AnalyticsRaw() {
  return (
    
    <div className="tempo-ui page-analytics">
                <main className="content">
            <div className="title-row">
                <div>
                    <h1>
                        Analytics &amp; insights
                    </h1>
                    <p>
                        Thermal safety and fleet performance for the current collection round.
                    </p>
                </div>
                <div className="demo-note" role="note">
                    <Icon name="alert-triangle" />
                    <span>
                        Representative demo values — not live observations. Risk thresholds and model inputs are estimates, not a safety certification.
                    </span>
                </div>
            </div>
            <section aria-label="Current round summary" className="summary-strip">
                <div className="summary-item">
                    <span className="summary-label">
                        Average TSB
                    </span>
                    <div className="summary-value">
                        4.1
                        <small>
                            hours
                        </small>
                    </div>
                </div>
                <div className="summary-item">
                    <span className="summary-label">
                        Safe stops
                    </span>
                    <div className="summary-value tone-mint">
                        18
                        <small>
                            of 26
                        </small>
                    </div>
                </div>
                <div className="summary-item">
                    <span className="summary-label">
                        Warning stops
                    </span>
                    <div className="summary-value tone-amber">
                        6
                        <small>
                            of 26
                        </small>
                    </div>
                </div>
                <div className="summary-item">
                    <span className="summary-label">
                        Critical stops
                    </span>
                    <div className="summary-value tone-red">
                        2
                        <small>
                            of 26
                        </small>
                    </div>
                </div>
            </section>
            <div className="analysis-layout">
                <section aria-label="Thermal and vehicle comparisons" className="main-column">
                    <article className="panel">
                        <div className="panel-head">
                            <div>
                                <h2>
                                    Thermal risk distribution
                                </h2>
                                <p>
                                    Route-stop count by estimated remaining TSB buffer
                                </p>
                            </div>
                            <span className="subtle-meta">
                                26 stops
                            </span>
                        </div>
                        <div className="panel-body">
                            <div aria-label="Among 26 demo stops, 18 are in the safe band, 6 in the warning band, and 2 in the critical band" className="risk-list" role="img">
                                <div className="risk-row">
                                    <div className="risk-label">
                                        <strong>
                                            Safe
                                        </strong>
                                        <span>
                                            Above 2.5 hours
                                        </span>
                                    </div>
                                    <div className="bar-track">
                                        <div className="bar-fill safe" style={{ width: "69.2%" }}>
                                        </div>
                                    </div>
                                    <div className="risk-count">
                                        <strong>
                                            18
                                        </strong>
                                        69.2%
                                    </div>
                                </div>
                                <div className="risk-row">
                                    <div className="risk-label">
                                        <strong>
                                            Warning
                                        </strong>
                                        <span>
                                            0.5–2.5 hours
                                        </span>
                                    </div>
                                    <div className="bar-track">
                                        <div className="bar-fill warning" style={{ width: "23.1%" }}>
                                        </div>
                                    </div>
                                    <div className="risk-count">
                                        <strong>
                                            6
                                        </strong>
                                        23.1%
                                    </div>
                                </div>
                                <div className="risk-row">
                                    <div className="risk-label">
                                        <strong>
                                            Critical
                                        </strong>
                                        <span>
                                            Under 0.5 hours
                                        </span>
                                    </div>
                                    <div className="bar-track">
                                        <div className="bar-fill critical" style={{ width: "7.7%" }}>
                                        </div>
                                    </div>
                                    <div className="risk-count">
                                        <strong>
                                            2
                                        </strong>
                                        7.7%
                                    </div>
                                </div>
                            </div>
                            <div className="risk-foot">
                                <span>
                                    Share of stops in this demo round
                                </span>
                                <strong>
                                    26 total stops
                                </strong>
                            </div>
                        </div>
                    </article>
                    <article className="panel">
                        <div className="panel-head">
                            <div>
                                <h2>
                                    Per-vehicle risk breakdown
                                </h2>
                                <p>
                                    Stops by estimated thermal risk band
                                </p>
                            </div>
                            <span className="subtle-meta">
                                3 demo vehicles
                            </span>
                        </div>
                        <div className="table-hint">
                            Swipe horizontally to compare all columns →
                        </div>
                        <div aria-label="Per-vehicle risk breakdown table" className="table-wrap" role="region" tabIndex={0}>
                            <table className="risk-table">
                                <thead>
                                    <tr>
                                        <th scope="col">
                                            Vehicle
                                        </th>
                                        <th className="tone-mint" scope="col">
                                            Safe
                                        </th>
                                        <th className="tone-amber" scope="col">
                                            Warning
                                        </th>
                                        <th className="tone-red" scope="col">
                                            Critical
                                        </th>
                                        <th scope="col">
                                            Stops
                                        </th>
                                        <th scope="col">
                                            Risk score
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <span className="vehicle-name">
                                                <span className="vehicle-symbol">
                                                    <Icon name="truck" />
                                                </span>
                                                <strong>
                                                    Tanker 1
                                                </strong>
                                            </span>
                                        </td>
                                        <td className="risk-number tone-mint">
                                            7
                                        </td>
                                        <td className="risk-number tone-amber">
                                            2
                                        </td>
                                        <td className="risk-number tone-red">
                                            0
                                        </td>
                                        <td className="risk-number">
                                            9
                                        </td>
                                        <td className="risk-score">
                                            7%
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="vehicle-name">
                                                <span className="vehicle-symbol">
                                                    <Icon name="truck" />
                                                </span>
                                                <strong>
                                                    Tanker 2
                                                </strong>
                                            </span>
                                        </td>
                                        <td className="risk-number tone-mint">
                                            5
                                        </td>
                                        <td className="risk-number tone-amber">
                                            2
                                        </td>
                                        <td className="risk-number tone-red">
                                            1
                                        </td>
                                        <td className="risk-number">
                                            8
                                        </td>
                                        <td className="risk-score">
                                            21%
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span className="vehicle-name">
                                                <span className="vehicle-symbol">
                                                    <Icon name="truck" />
                                                </span>
                                                <strong>
                                                    Tanker 3
                                                </strong>
                                            </span>
                                        </td>
                                        <td className="risk-number tone-mint">
                                            6
                                        </td>
                                        <td className="risk-number tone-amber">
                                            2
                                        </td>
                                        <td className="risk-number tone-red">
                                            1
                                        </td>
                                        <td className="risk-number">
                                            9
                                        </td>
                                        <td className="risk-score">
                                            19%
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td>
                                            Total
                                        </td>
                                        <td className="risk-number tone-mint">
                                            18
                                        </td>
                                        <td className="risk-number tone-amber">
                                            6
                                        </td>
                                        <td className="risk-number tone-red">
                                            2
                                        </td>
                                        <td className="risk-number">
                                            26
                                        </td>
                                        <td>
                                            —
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div className="panel-body" style={{ paddingTop: "12px" }}>
                            <p className="subtle-meta" style={{ margin: "0" }}>
                                Risk score follows the current app calculation: warning stops count 1, critical stops count 3, divided by 3 per stop.
                            </p>
                        </div>
                    </article>
                </section>
                <aside aria-label="Fleet utilization and model references" className="support-rail">
                    <section className="panel">
                        <div className="panel-head">
                            <div>
                                <h2>
                                    Fleet utilization
                                </h2>
                                <p>
                                    Current milk volume against total capacity
                                </p>
                            </div>
                        </div>
                        <div className="panel-body">
                            <div className="util-top">
                                <div>
                                    <div className="summary-value tone-mint">
                                        74.6
                                        <small>
                                            %
                                        </small>
                                    </div>
                                    <span className="subtle-meta">
                                        Utilized
                                    </span>
                                </div>
                                <span className="subtle-meta">
                                    Demo round
                                </span>
                            </div>
                            <div aria-label="17,096 liters out of 22,917 liters, 74.6 percent capacity utilization" className="util-track" role="img">
                                <div className="util-fill">
                                </div>
                            </div>
                            <div className="util-denom">
                                <span>
                                    17,096 L loaded
                                </span>
                                <span>
                                    22,917 L capacity
                                </span>
                            </div>
                            <div className="rail-stat-row">
                                <span>
                                    Available capacity
                                </span>
                                <strong>
                                    5,821 L
                                </strong>
                            </div>
                        </div>
                    </section>
                    <section className="panel">
                        <div className="panel-head">
                            <div>
                                <h2>
                                    Adulteration thresholds
                                </h2>
                                <p>
                                    Current detection settings
                                </p>
                            </div>
                            <span className="estimate-label">
                                <Icon name="info-circle" />
                                Estimates
                            </span>
                        </div>
                        <div className="panel-body">
                            <div className="threshold-list">
                                <div className="threshold-row">
                                    <div>
                                        <div className="threshold-name">
                                            Volume increase
                                        </div>
                                        <div className="threshold-desc">
                                            Potential water addition
                                        </div>
                                    </div>
                                    <div className="threshold-value">
                                        &gt; +2.0%
                                    </div>
                                </div>
                                <div className="threshold-row">
                                    <div>
                                        <div className="threshold-name">
                                            Fat percentage drop
                                        </div>
                                        <div className="threshold-desc">
                                            Possible dilution or skimming
                                        </div>
                                    </div>
                                    <div className="threshold-value">
                                        &gt; 0.3%
                                    </div>
                                </div>
                                <div className="threshold-row">
                                    <div>
                                        <div className="threshold-name">
                                            SNF percentage drop
                                        </div>
                                        <div className="threshold-desc">
                                            Possible dilution
                                        </div>
                                    </div>
                                    <div className="threshold-value">
                                        &gt; 0.3%
                                    </div>
                                </div>
                                <div className="threshold-row">
                                    <div>
                                        <div className="threshold-name">
                                            Density
                                        </div>
                                        <div className="threshold-desc">
                                            Possible contamination
                                        </div>
                                    </div>
                                    <div className="threshold-value">
                                        &lt; 1.026
                                    </div>
                                </div>
                            </div>
                            <p className="model-caution">
                                Detection limits are
                                <strong>
                                    estimated settings
                                </strong>
                                from this demo model. A flag is not a confirmed finding.
                            </p>
                        </div>
                    </section>
                    <section className="panel">
                        <div className="panel-head">
                            <div>
                                <h2>
                                    TSB model reference
                                </h2>
                                <p>
                                    Estimated thermal safety buffer
                                </p>
                            </div>
                        </div>
                        <div className="panel-body">
                            <p className="model-copy">
                                The displayed buffer estimates remaining time before the modeled quality limit, minus time to reach cooling.
                            </p>
                            <div className="formula-box">
                                TSB
                                <sub>
                                    hours
                                </sub>
                                = (θ
                                <sub>
                                    critical
                                </sub>
                                − (T
                                <sub>
                                    initial
                                </sub>
                                − T
                                <sub>
                                    base
                                </sub>
                                )) / (k × (T
                                <sub>
                                    ambient
                                </sub>
                                − T
                                <sub>
                                    base
                                </sub>
                                ) × β
                                <sub>
                                    insulation
                                </sub>
                                )
                            </div>
                            <div className="formula-vars">
                                <div>
                                    <strong>
                                        T
                                        <sub>
                                            base
                                        </sub>
                                    </strong>
                                    · 4°C
                                </div>
                                <div>
                                    <strong>
                                        k
                                    </strong>
                                    · 0.15
                                </div>
                                <div>
                                    <strong>
                                        θ
                                        <sub>
                                            critical
                                        </sub>
                                    </strong>
                                    · 850 degree-hours
                                </div>
                                <div>
                                    <strong>
                                        β
                                    </strong>
                                    · 0.4–1.0
                                </div>
                            </div>
                            <p className="model-caution">
                                Model parameters and risk bands are
                                <strong>
                                    estimates
                                </strong>
                                in this MVP, not certified safety limits.
                            </p>
                        </div>
                    </section>
                </aside>
            </div>
        </main>
    </div>
    
  )
}

export default AnalyticsRaw
