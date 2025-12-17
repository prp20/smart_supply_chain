import { MapContainer, TileLayer, Marker } from "react-leaflet"
import { useEffect, useState } from "react"
import axios from "axios"
import L from "leaflet"
import TrafficHeatmap from "./TrafficHeatmap"
import WeatherLayer from "./WeatherLayer"
import TemperatureOverlay from "./TemperatureOverlay"
import MovingVehicle from "./MovingVehicle"
import MovingVehicleRoute from "./MovingVehicleRoute"
import AIDecisionPanel from "./AIDecisionPanel"
import RouteLayer from "./RouteLayer"
import { isTrafficAhead } from "../utils/trafficDetection"
import { generateAlternateRoute } from "../utils/reroute"
import { calculateRouteDistance } from "../utils/routeMetrics"
import RouteTrafficLayer from "./RouteTrafficLayer"

window.L = L

const API = import.meta.env.VITE_API_URL || "http://localhost:8001"

const vehicleIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [30, 30],
})

export default function Map() {
  const [vehicles, setVehicles] = useState([])
  const [traffic, setTraffic] = useState([])
  const [weather, setWeather] = useState(null)
  const [route, setRoute] = useState(null)
  const [vehicleIndex, setVehicleIndex] = useState(0)
  const [isRerouted, setIsRerouted] = useState(false)
  const [originalRoute, setOriginalRoute] = useState(null)
  const [reroutedRoute, setReroutedRoute] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [isTrafficDetected, setIsTrafficDetected] = useState(false)


  useEffect(() => {
    axios.get(`${API}/new_vehicles`).then(res => setVehicles(res.data))
    axios.get('http://localhost:8003/traffic').then(res => setTraffic(res.data))
    axios.get(`${API}/weather`).then(res => setWeather(res.data))
    axios.post(`${API}/cal_route`, {
      start: { lat: 12.9716, lng: 77.5946 },
      end: { lat: 12.9352, lng: 77.6245 },
    }).then(res => {
      setRoute(res.data)
      setOriginalRoute(res.data)
      return axios.post(`${API}/route_traffic`, res.data)
      })
      .then(res => setTraffic(res.data)) // SAVE original
  }, [])
    useEffect(() => {
      if (!route || traffic.length === 0) return

      const interval = setInterval(() => {
        console.log("🚚 Vehicle index:", vehicleIndex)
        console.log("🚦 Traffic points:", traffic.slice(0, 3))

        const detected = isTrafficAhead(
          vehicleIndex,
          route,
          traffic
        )

        if (detected && !isTrafficDetected) {
          console.log("🚨 TRAFFIC DETECTED AHEAD")
          setIsTrafficDetected(true)
        }
      }, 500)

      return () => clearInterval(interval)
    }, [vehicleIndex, route, traffic])
    useEffect(() => {
  if (
    !isTrafficDetected ||
    !route ||
    !originalRoute ||
    isRerouted
  ) return

  console.log("🔁 REROUTING NOW...")

  const newRoute = generateAlternateRoute(route)

  // 📏 Metrics
  const originalDistance = calculateRouteDistance(originalRoute.geometry)
  const newDistance = calculateRouteDistance(newRoute.geometry)

  const avgSpeedKmH = 40
  const timeSaved =
    ((originalDistance - newDistance) / avgSpeedKmH) * 60

  setMetrics({
    originalDistance: originalDistance.toFixed(2),
    newDistance: newDistance.toFixed(2),
    distanceDelta: (originalDistance - newDistance).toFixed(2),
    estimatedTimeSaved: timeSaved.toFixed(1),
    reason: "Heavy traffic detected ahead",
  })

  // 🔁 SWITCH ROUTE
  setVehicleIndex(0)
  setRoute(newRoute)
  setReroutedRoute(newRoute)
  setIsRerouted(true)

}, [isTrafficDetected])









  // useEffect(() => {
  //   if (!route || !originalRoute || isRerouted) return

  //   const interval = setInterval(() => {
  //     if (isTrafficAhead(vehicleIndex, route, traffic)) {
  //       const newRoute = generateAlternateRoute(route)

  //       const originalDistance = calculateRouteDistance(originalRoute.geometry)
  //       const newDistance = calculateRouteDistance(newRoute.geometry)

  //       const avgSpeedKmH = 40
  //       const timeSaved =
  //         ((originalDistance - newDistance) / avgSpeedKmH) * 60

  //       setMetrics({
  //         originalDistance: originalDistance.toFixed(2),
  //         newDistance: newDistance.toFixed(2),
  //         distanceDelta: (originalDistance - newDistance).toFixed(2),
  //         estimatedTimeSaved: timeSaved.toFixed(1),
  //         reason: "Heavy traffic detected ahead"
  //       })

  //       setVehicleIndex(0)          // ✅ RESET INDEX
  //       setRoute(newRoute)
  //       setReroutedRoute(newRoute)
  //       setIsRerouted(true)
  //     }
  //         }, 2000)

  //   return () => clearInterval(interval)
  // }, [route, traffic, vehicleIndex])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setVehicles(prev =>
  //       prev.map(v => {
  //         if (
  //           typeof v.lat !== "number" ||
  //           typeof v.lng !== "number" ||
  //           typeof v.speed !== "number" ||
  //           typeof v.bearing !== "number"
  //         ) {
  //           return v
  //         }

  //         const rad = (v.bearing * Math.PI) / 180

  //         return {
  //           ...v,
  //           lat: v.lat + Math.cos(rad) * v.speed,
  //           lng: v.lng + Math.sin(rad) * v.speed,
  //         }
  //       })
  //     )
  //   }, 100)

  //   return () => clearInterval(interval)
  // }, [])

  return (
    <MapContainer
      center={[12.9716, 77.5946]}
      zoom={13}
      style={{ height: "100vh", width: "100vw" }}
    >
      {/* <AIDecisionPanel metrics={metrics} /> */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {originalRoute && (
  <RouteLayer
    route={originalRoute}
    color="#444"
    weight={4}
    opacity={0.4}
  />
)}

{route && (
  <RouteLayer
    route={route}
    color={isRerouted ? "lime" : "blue"}
    weight={6}
  />
)}
      {traffic.length > 0 && <RouteTrafficLayer traffic={traffic} />}
      {weather && <WeatherLayer weather={weather} />}
      {weather && <TemperatureOverlay temp={weather.temperature} />}

      {route && (
        <MovingVehicleRoute
          route={route}
          icon={vehicleIcon}
          vehicleIndex={vehicleIndex}
          setVehicleIndex={setVehicleIndex}
        />
      )}
    </MapContainer>
  )
}
