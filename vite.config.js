import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    copyPublicDir: true,
    emptyOutDir: true,
    outDir: '../www'
  }
})
