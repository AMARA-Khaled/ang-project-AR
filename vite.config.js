import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    },
    minify: 'esbuild',
    // Target modern browsers for smaller bundle
    target: 'es2020',
    // Copy public folder assets as-is
    copyPublicDir: true,
  },
  server: {
    // Enable HTTPS for AR testing (required for some AR features)
    // https: true,
    host: true, // Allow external access for mobile testing
    port: 3000,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  // Optimize static assets
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  // Ensure public directory is correctly configured
  publicDir: 'public',
})
