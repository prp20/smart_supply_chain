import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],

  // DEV ONLY (docker-compose dev mode)
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://backend:8001",
        changeOrigin: true
      }
    }
  },

  // PROD BUILD
  build: {
    outDir: "dist"
  }
})
