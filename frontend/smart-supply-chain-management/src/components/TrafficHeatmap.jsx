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
      radius: 35,
      blur: 20,
      maxZoom: 17,
      gradient: {
        0.4: "yellow",
        0.7: "orange",
        1.0: "red"
      }
    })

    heatLayer.addTo(map)

    return () => {
      map.removeLayer(heatLayer)
    }
  }, [points, map])

  return null
}
