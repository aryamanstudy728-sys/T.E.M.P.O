import { useMap } from 'react-leaflet'
import type { LatLngTuple } from 'leaflet'
import Icon from '../Icon'

interface MapControlsProps {
  fitPositions?: LatLngTuple[]
}

export function MapControls({ fitPositions }: MapControlsProps) {
  const map = useMap()

  return (
    <div className="map-controls" role="group" aria-label="Map zoom controls">
      <button
        className="map-control-btn"
        aria-label="Zoom in"
        onClick={() => map.zoomIn()}
      >
        <Icon name="plus" size={16} />
      </button>
      <button
        className="map-control-btn"
        aria-label="Zoom out"
        onClick={() => map.zoomOut()}
      >
        <Icon name="minus" size={16} />
      </button>
      {fitPositions && fitPositions.length > 0 && (
        <button
          className="map-control-btn"
          aria-label="Fit all markers"
          onClick={() => map.fitBounds(fitPositions, { padding: [20, 20] })}
        >
          <Icon name="maximize" size={16} />
        </button>
      )}
    </div>
  )
}

export default MapControls