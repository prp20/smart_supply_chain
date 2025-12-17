export function isTrafficAhead(
  vehicleIndex,
  route,
  traffic,
  lookAheadPoints = 20
) {
  if (!route?.geometry?.length || !traffic?.length) return false

  const upcomingRoute = route.geometry.slice(
    vehicleIndex,
    vehicleIndex + lookAheadPoints
  )

  return traffic.some(t => {
    // ✅ SUPPORT BOTH FORMATS
    const lat = t.lat ?? t.location?.[1]
    const lng = t.lng ?? t.location?.[0]

    if (lat == null || lng == null) return false

    return upcomingRoute.some(([rLng, rLat]) => {
      const dLat = Math.abs(rLat - lat)
      const dLng = Math.abs(rLng - lng)

      return dLat < 0.0004 && dLng < 0.0004
    })
  })
}
