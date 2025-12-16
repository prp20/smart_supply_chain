import Map from "./components/Map"

function App() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          zIndex: 1000,
          background: "black",
          color: "white",
          padding: "10px"
        }}
      >
        🚚 Logistics Control Center
      </div>

      <Map />
    </>
  )
}

export default App
