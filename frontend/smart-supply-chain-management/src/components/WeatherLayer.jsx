import { useEffect, useRef } from "react"
import { useMap } from "react-leaflet"

export default function WeatherLayer({ weather }) {
  const canvasRef = useRef(null)
  const map = useMap()

  useEffect(() => {
    if (!weather || weather.condition !== "rain") return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    const resize = () => {
      canvas.width = map.getSize().x
      canvas.height = map.getSize().y
    }

    resize()
    map.on("resize", resize)

    const drops = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 4 + Math.random() * 4,
    }))

    let animationFrame

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = "rgba(173,216,230,0.6)"
      ctx.lineWidth = 1

      drops.forEach(d => {
        ctx.beginPath()
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x, d.y + 10)
        ctx.stroke()

        d.y += d.speed
        if (d.y > canvas.height) d.y = 0
      })

      animationFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrame)
      map.off("resize", resize)
    }
  }, [weather, map])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 500,
      }}
    />
  )
}
