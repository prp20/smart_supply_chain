// Haversine distance (km)
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)))
}

export function calculateRouteDistance(geometry) {
  let distance = 0

  for (let i = 1; i < geometry.length; i++) {
    const [lng1, lat1] = geometry[i - 1]
    const [lng2, lat2] = geometry[i]
    distance += haversine(lat1, lng1, lat2, lng2)
  }

  return distance // km
}
