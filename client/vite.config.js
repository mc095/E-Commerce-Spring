import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss()],
  server: {
    // This proxy configuration tells Vite's development server
    // to forward any requests that start with '/api'
    // to your Spring Boot backend, which typically runs on port 8080.
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Your Spring Boot backend URL
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Rewrite the path if necessary (often not needed if backend path matches)
        // Optionally, if you have issues with CORS or authentication:
        // secure: false, // Set to true for HTTPS backends, false for HTTP
        // ws: true, // Enable websocket proxying
      },
    },
  },
});