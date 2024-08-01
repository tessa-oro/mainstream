import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Server specific configurations
    watch: {
      // Watch specific configurations
      ignored: ['**/node_modules/**', '**/.git/**']
    }
  },
})
