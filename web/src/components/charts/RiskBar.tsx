import type { BandCounts } from '../../lib/derive'
import '../../styles/charts.css'

interface RiskBarProps {
  label: string
  counts: BandCounts
}

function RiskBar({ label, counts }: RiskBarProps) {
  const total = counts.green + counts.yellow + counts.red
  const pct = (n: number) => (total === 0 ? 0 : (n / total) * 100)
  const g = pct(counts.green)
  const y = pct(counts.yellow)
  const r = pct(counts.red)

  const showNumber = (p: number) => p >= 8

  const sentence = `${counts.green} on track · ${counts.yellow} watch · ${counts.red} critical`

  return (
    <div className="risk-bar-item" role="img" aria-label={sentence}>
      <div className="risk-bar-row">
        <span className="risk-bar-label">{label}</span>
        <div className="risk-bar-track">
          {g > 0 && (
            <span className="risk-bar-segment green" style={{ width: `${g}%` }}>
              {showNumber(g) && counts.green}
            </span>
          )}
          {y > 0 && (
            <span className="risk-bar-segment yellow" style={{ width: `${y}%` }}>
              {showNumber(y) && counts.yellow}
            </span>
          )}
          {r > 0 && (
            <span className="risk-bar-segment red" style={{ width: `${r}%` }}>
              {showNumber(r) && counts.red}
            </span>
          )}
          {total === 0 && <span className="risk-bar-segment" style={{ width: '100%', background: 'var(--line)' }} />}
        </div>
      </div>
      <div className="risk-bar-legend">
        <span className="risk-bar-legend-item">
          <span className="risk-bar-legend-dot green" />
          On track
        </span>
        <span className="risk-bar-legend-item">
          <span className="risk-bar-legend-dot yellow" />
          Watch
        </span>
        <span className="risk-bar-legend-item">
          <span className="risk-bar-legend-dot red" />
          Critical
        </span>
      </div>
      <div className="risk-bar-sentence" style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
        {sentence}
      </div>
    </div>
  )
}

export default RiskBar