import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig( {
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rolldownOptions: {
      input: {
        'index.html': 'index.html',
        '404.html': '404.html',
      },
    },
  },
} )
