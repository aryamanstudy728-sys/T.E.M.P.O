import type { Thresholds } from '../../lib/derive'

export function MapLegend({ bandThresholds }: { bandThresholds?: Thresholds }) {
  const g = bandThresholds?.greenH
  const r = bandThresholds?.redH
  return (
    <div className="map-legend" aria-label="Map legend">
      <div className="legend-group">
        <span className="legend-item"><span className="legend-mark band critical" />Critical{r != null ? ` below ${r} h` : ''}</span>
        <span className="legend-item"><span className="legend-mark band watch" />Watch{g != null && r != null ? ` ${r} to ${g} h` : ''}</span>
        <span className="legend-item"><span className="legend-mark band safe" />On track{g != null ? ` above ${g} h` : ''}</span>
        <span className="legend-item"><span className="legend-mark bmc" />Chilling centre</span>
      </div>
    </div>
  )
}

export default MapLegend
