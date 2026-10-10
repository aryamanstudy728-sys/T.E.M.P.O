import type { Methods, MethodKey } from '../api/types'

export type { MethodKey }
export const METHOD_LABELS: Record<MethodKey, string> = {
  fixed: 'Fixed route',
  nearest: 'Nearest first',
  risk_based: 'Risk-based',
}

interface Props {
  methods: Methods
  selected: MethodKey
  onSelect: (m: MethodKey) => void
  atRisk: number // derived from villages[].band
}

// Numbers are shown exactly as returned; time_h to one decimal. No winner is computed.
export function MethodCells({ methods, selected, onSelect, atRisk }: Props) {
  return (
    <div className="metrics" role="group" aria-label="Pickup methods compared">
      {(Object.keys(METHOD_LABELS) as MethodKey[]).map((key) => {
        const m = methods[key]
        return (
          <button
            key={key}
            type="button"
            className={`metric${selected === key ? ' accent' : ''}`}
            onClick={() => onSelect(key)}
            aria-pressed={selected === key}
          >
            <div className="metric-label">{METHOD_LABELS[key]}</div>
            <div className="metric-value">{m.breaches}<small> breaching</small></div>
            <div className="metric-detail">volume at risk {m.volume_at_risk_l} L, total route time {m.time_h.toFixed(1)} h{m.over_ceiling.length > 0 ? `, ${m.over_ceiling.length} over the ceiling` : ''}</div>
          </button>
        )
      })}
      <div className="metric">
        <div className="metric-label">At-risk villages</div>
        <div className="metric-value critical">{atRisk}</div>
        <div className="metric-detail">yellow or red, risk-based plan</div>
      </div>
    </div>
  )
}

export default MethodCells
