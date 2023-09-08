import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  root: 'src',
  build: {
    emptyOutDir: true,
    outDir: '../www'
  }
})
