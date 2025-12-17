import { MapContainer, TileLayer, Marker } from "react-leaflet"
import { useEffect, useState } from "react"
import axios from "axios"
import L from "leaflet"
import TrafficHeatmap from "./TrafficHeatmap"
import WeatherLayer from "./WeatherLayer"
import TemperatureOverlay from "./TemperatureOverlay"
import MovingVehicle from "./MovingVehicle"
import AIDecisionPanel from "./AIDecisionPanel"
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

  useEffect(() => {
    axios.get(`${API}/new_vehicles`).then(res => setVehicles(res.data))
    axios.get(`${API}/traffic`).then(res => setTraffic(res.data))
    axios.get(`${API}/weather`).then(res => setWeather(res.data))
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev =>
        prev.map(v => {
          if (
            typeof v.lat !== "number" ||
            typeof v.lng !== "number" ||
            typeof v.speed !== "number" ||
            typeof v.bearing !== "number"
          ) {
            return v
          }

          const rad = (v.bearing * Math.PI) / 180

          return {
            ...v,
            lat: v.lat + Math.cos(rad) * v.speed,
            lng: v.lng + Math.sin(rad) * v.speed,
          }
        })
      )
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <MapContainer
      center={[12.9716, 77.5946]}
      zoom={13}
      style={{ height: "100vh", width: "100vw" }}
    >
      <AIDecisionPanel />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {traffic.length > 0 && <TrafficHeatmap points={traffic} />}
      {weather && <WeatherLayer weather={weather} />}
      {weather && <TemperatureOverlay temp={weather.temperature} />}

      {vehicles
        .filter(v => typeof v.lat === "number" && typeof v.lng === "number")
        .map(v => (
          <MovingVehicle
            key={v.id}
            vehicle={v}
            icon={vehicleIcon}
          />
      ))}
    </MapContainer>
  )
}
