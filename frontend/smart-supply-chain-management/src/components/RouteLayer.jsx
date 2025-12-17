import { Polyline } from "react-leaflet"

/**
 * route.geometry comes from backend
 * Format from OSRM:
 *   [[lng, lat], [lng, lat], ...]
 */
export default function RouteLayer({ route }) {
  if (!route || !route.geometry) return null

  // Convert [lng, lat] → [lat, lng]
  const path = route.geometry.map(point => [
    point[1],
    point[0],
  ])

  return (
    <Polyline
      positions={path}
      color="blue"
      weight={5}
      opacity={0.7}
    />
  )
}
