export function generateAlternateRoute(originalRoute) {
  if (!originalRoute) return null

  const offset = 0.002 // ≈ 200m

  const newGeometry = originalRoute.geometry.map(
    ([lng, lat], index) => {
      // Offset only middle portion
      if (index > 20 && index < originalRoute.geometry.length - 20) {
        return [lng + offset, lat + offset]
      }
      return [lng, lat]
    }
  )

  return {
    ...originalRoute,
    geometry: newGeometry,
  }
}
