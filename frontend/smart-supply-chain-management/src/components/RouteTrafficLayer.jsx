import { CircleMarker } from "react-leaflet"

export default function RouteTrafficLayer({ traffic }) {
  if (!traffic || traffic.length === 0) return null

  return (
    <>
      {traffic.map((t, idx) => (
        <CircleMarker
          key={idx}
          center={[t.lat, t.lng]}
          radius={10 + t.intensity * 2}
          pathOptions={{
            color: "red",
            fillColor: "red",
            fillOpacity: 0.6,
          }}
        />
      ))}
    </>
  )
}
