import { Marker } from "react-leaflet"
import { useEffect, useRef } from "react"

export default function MovingVehicle({ vehicle, icon }) {
  const markerRef = useRef(null)

  useEffect(() => {
    if (!markerRef.current) return

    markerRef.current.setLatLng([vehicle.lat, vehicle.lng])
  }, [vehicle.lat, vehicle.lng])

  return (
    <Marker
      ref={markerRef}
      position={[vehicle.lat, vehicle.lng]}
      icon={icon}
    />
  )
}
