import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Important: allow access from Docker container
    port: 5173,
    strictPort: true, // fail if port is in use
    proxy: {
      "/api": {
        target: "http://localhost:8001",
        changeOrigin: true
      }
    }
  },
   build: {
    outDir: 'dist', // output folder for production build
  }
})
