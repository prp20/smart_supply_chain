export function isTrafficAhead(vehicleIndex, route, trafficPoints) {
  if (!route || !trafficPoints.length) return false

  const lookAheadDistance = 15 // number of route points ahead

  const upcomingRoutePoints = route.geometry.slice(
    vehicleIndex,
    vehicleIndex + lookAheadDistance
  )

  for (const traffic of trafficPoints) {
    for (const point of upcomingRoutePoints) {
      const [lng, lat] = point

      const distance =
        Math.abs(lat - traffic.lat) +
        Math.abs(lng - traffic.lng)

      if (distance < 0.0005) {
        return true
      }
    }
  }

  return false
}
