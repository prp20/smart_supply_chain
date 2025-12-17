import { Rectangle } from "react-leaflet"

export default function TemperatureOverlay({ temp }) {
  if (typeof temp !== "number") return null

  let color = "rgba(0, 0, 255, 0.4)" // cold
  if (temp > 30) color = "rgba(255, 0, 0, 0.4)"
  else if (temp > 25) color = "rgba(255, 165, 0, 0.4)"

  return (
    <Rectangle
      bounds={[
        [12.95, 77.56],
        [13.00, 77.64]
      ]}
      pathOptions={{
        fillColor: color,
        fillOpacity: 0.5,
        stroke: false
      }}
    />
  )
}
