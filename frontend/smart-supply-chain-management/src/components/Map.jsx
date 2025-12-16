import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import L from "leaflet"
import AgentPanel from "./AgentPanel"
import "../App.css"

export default function Map() {
  const [vehicles, setVehicles] = useState([])
  const [routes, setRoutes] = useState([])
  const [traffic, setTraffic] = useState([])
  const [decisions, setDecisions] = useState([])
  const [weather, setWeather] = useState([])

  const vehiclesRef = useRef([])

  // Fetch vehicles every 2 seconds from backend
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await axios.get("http://localhost:8001/vehicles")
      // Initialize vehicles with lat/lng if first fetch
      const updated = res.data.map(v => {
        const prev = vehiclesRef.current.find(x => x.id === v.id)
        return {
          ...v,
          lat: prev?.lat ?? v.latitude,
          lng: prev?.lng ?? v.longitude,
        }
      })
      vehiclesRef.current = updated
      setVehicles(updated)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Smooth vehicle animation
  useEffect(() => {
    let animationFrame

    const animate = () => {
      setVehicles(prev => {
        const updated = prev.map(v => {
          const nextIndex = (v.current_index + 1) % v.route.length
          const [lat1, lng1] = v.route[v.current_index]
          const [lat2, lng2] = v.route[nextIndex]

          const t = 0.02 // interpolation factor, smaller = slower
          const lat = v.lat + (lat2 - lat1) * t
          const lng = v.lng + (lng2 - lng1) * t

          return { ...v, lat, lng, current_index: nextIndex }
        })
        vehiclesRef.current = updated
        return updated
      })
      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  // Fetch routes
  useEffect(() => {
    axios.get("http://localhost:8001/routes").then(res => setRoutes(res.data))
  }, [])

  // Fetch traffic
  useEffect(() => {
    axios.get("http://localhost:8001/traffic").then(res => setTraffic(res.data))
  }, [])

  // Fetch AI decisions
  useEffect(() => {
    axios.get("http://localhost:8001/decisions").then(res => setDecisions(res.data))
  }, [])

  // Fetch weather
  useEffect(() => {
    axios.get("http://localhost:8001/weather").then(res => setWeather(res.data))
  }, [])

  // Rain icon
  const rainIcon = L.divIcon({ className: "rain-drop" })

  return (
    <div style={{ position: "relative" }}>
      <MapContainer
        center={[12.9716, 77.5946]}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Weather */}
        {weather.map((w, i) => (
          <Marker key={i} position={[w.lat, w.lng]} icon={rainIcon} />
        ))}

        {/* Traffic */}
        {traffic.map(t => (
          <Polyline
            key={t.segment_id}
            positions={t.coordinates}
            color={
              t.severity === "high"
                ? "red"
                : t.severity === "medium"
                ? "orange"
                : "green"
            }
            weight={6}
          />
        ))}

        {/* Routes */}
        {routes.map(r => (
          <Polyline key={r.vehicle_id} positions={r.route} color="blue" weight={4} />
        ))}

        {/* Vehicles */}
        {vehicles.map(vehicle => (
          <Marker
            key={vehicle.id}
            position={[vehicle.lat, vehicle.lng]}
          >
            <Popup>
              🚚 {vehicle.id} <br />
              Status: {vehicle.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* AI Decisions panel */}
      <AgentPanel decisions={decisions} />
    </div>
  )
}
