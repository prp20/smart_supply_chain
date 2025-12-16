export default function AgentPanel({ decisions }) {
  return (
    <div style={{
      position: "absolute",
      top: "10px",
      right: "10px",
      background: "rgba(0,0,0,0.8)",
      color: "white",
      padding: "10px",
      borderRadius: "8px",
      width: "250px",
      maxHeight: "300px",
      overflowY: "auto",
      fontSize: "14px",
      zIndex: 1000
    }}>
      <h4 style={{marginBottom: "8px"}}>🤖 AI Decisions</h4>
      {decisions.map((d, i) => (
        <div key={i} style={{marginBottom: "4px"}}>
          🚚 {d.vehicle_id}: {d.decision} ({Math.round(d.confidence*100)}%)
        </div>
      ))}
    </div>
  )
}
