import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [react()],
  resolve: {
    alias: {
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },

})