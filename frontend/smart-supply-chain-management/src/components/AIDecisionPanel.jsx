import { useEffect, useState } from "react"
import axios from "axios"

const API = import.meta.env.VITE_API_URL || "http://localhost:8001"

export default function AIDecisionPanel() {
  const [decisions, setDecisions] = useState([])

  useEffect(() => {
    const fetchDecisions = () => {
      axios.get(`${API}/decisions`).then(res => {
        setDecisions(prev => [...res.data, ...prev].slice(0, 10))
      })
    }

    fetchDecisions()
    const interval = setInterval(fetchDecisions, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div style={panelStyle}>
      <h3>🧠 AI Decision Timeline</h3>

      {decisions.map((d, i) => (
        <div key={i} style={eventStyle(d.type)}>
          <strong>{d.time}</strong> — {d.message}
        </div>
      ))}
    </div>
  )
}

/* ---------- styles ---------- */

const panelStyle = {
  position: "absolute",
  top: 20,
  right: 20,
  width: "300px",
  maxHeight: "80vh",
  overflowY: "auto",
  background: "#111",
  color: "#fff",
  padding: "12px",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.5)",
  zIndex: 1000,
  transition: "all 0.3s ease",
}

const eventStyle = (type) => ({
  padding: "8px",
  marginBottom: "8px",
  borderRadius: "4px",
  background:
    type === "traffic"
      ? "#7a1f1f"
      : type === "weather"
      ? "#1f3c7a"
      : "#1f7a3c",
})
