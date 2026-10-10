import L from 'leaflet'

export type Band = 'green' | 'yellow' | 'red'

const BAND_LABEL: Record<Band, string> = {
  green: 'Safe',
  yellow: 'Watch',
  red: 'Critical',
}

const BAND_VAR: Record<Band, string> = {
  green: 'var(--mint)',
  yellow: 'var(--amber)',
  red: 'var(--red)',
}

export function buildVillageIcon(band: Band, bufferH: number, seq?: number): L.DivIcon {
  const color = BAND_VAR[band] ?? BAND_VAR.green
  const label = BAND_LABEL[band] ?? BAND_LABEL.green
  const seqBadge = seq != null
    ? `<span class="marker-seq">${String(seq).padStart(2, '0')}</span>`
    : ''

  const html = `
    <div class="marker-village" style="--marker-color:${color};">
      ${seqBadge}
      <div class="marker-body">
        <span class="marker-buffer">${bufferH.toFixed(1)} h</span>
        <span class="marker-band">${label}</span>
      </div>
      <div class="marker-triangle"></div>
    </div>
  `

  return L.divIcon({
    html,
    className: 'tempo-village-marker',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

export function buildCentreIcon(name = 'BMC'): L.DivIcon {
  const html = `
    <div class="marker-centre">
      <div class="marker-centre-label">★ ${name}</div>
      <div class="marker-centre-triangle"></div>
    </div>
  `

  return L.divIcon({
    html,
    className: 'tempo-centre-marker',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}