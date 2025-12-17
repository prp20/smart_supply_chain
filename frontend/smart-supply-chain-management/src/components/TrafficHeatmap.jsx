import { useEffect } from "react"
import { useMap } from "react-leaflet"
import "leaflet.heat"

export default function TrafficHeatmap({ points }) {
  const map = useMap()

  useEffect(() => {
    if (!points || points.length === 0) return

    const heatPoints = points.map(p => [
      p.lat,
      p.lng,
      p.intensity // 🔥 BOOST visibility
    ])

    const heatLayer = window.L.heatLayer(heatPoints, {
      radius: 40,
      blur: 25,
      maxZoom: 17,
      minOpacity: 0.5,
    })

    heatLayer.addTo(map)

    return () => {
      map.removeLayer(heatLayer)
    }
  }, [points, map])

  return null
}
