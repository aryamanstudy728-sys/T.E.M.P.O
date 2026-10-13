export interface MetricBarsProps {
  title: string
  unit: string
  values: Array<{ label: string; value: number }>
}

function MetricBars({ title, unit, values }: MetricBarsProps) {
  const maxValue = Math.max(...values.map(v => v.value), 0)
  const barWidth = 100 // percentage of container

  return (
    <section className="metric-bars-panel" aria-labelledby={title.toLowerCase().replace(/\s+/g, '-')}>
      <div className="metric-bars-head">
        <h3 id={title.toLowerCase().replace(/\s+/g, '-')} className="metric-bars-title">{title}</h3>
      </div>
      <div className="metric-bars-list" role="img" aria-label={`${title}: ${values.map(v => `${v.label} ${v.value}${unit}`).join(', ')}`}>
        {values.map((v, i) => {
          const pct = maxValue === 0 ? 0 : (v.value / maxValue) * 100
          const isRiskBased = v.label.toLowerCase() === 'risk-based'
          return (
            <div key={i} className="metric-bar-item">
              <span className="metric-bar-label">{v.label}</span>
              <div className="metric-bar-track" style={{ width: `${barWidth}%` }}>
                <span
                  className={`metric-bar-fill ${isRiskBased ? 'risk-based' : 'other'}`}
                  style={{ width: `${pct}%` }}
                >
                  <span className="metric-bar-value">{v.value.toFixed(v.value % 1 === 0 ? 0 : 1)} {unit}</span>
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default MetricBars