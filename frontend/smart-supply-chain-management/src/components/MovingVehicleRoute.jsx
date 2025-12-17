import { Marker } from "react-leaflet"
import { useEffect } from "react"

export default function MovingVehicleRoute({
  route,
  icon,
  vehicleIndex,
  setVehicleIndex
}) {
  useEffect(() => {
    if (!route || !route.geometry) return

    const interval = setInterval(() => {
      setVehicleIndex(prev => {
        if (prev >= route.geometry.length - 1) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [route]) // 👈 re-runs cleanly on route switch

  if (!route || !route.geometry || route.geometry.length === 0) {
    return null
  }

  const point = route.geometry[vehicleIndex]
  if (!point) return null   // 🛡️ safety guard

  const position = [point[1], point[0]] // lat, lng

  return <Marker position={position} icon={icon} />
}
