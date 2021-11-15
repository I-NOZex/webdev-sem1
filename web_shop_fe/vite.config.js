import { defineConfig } from "vite"

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    minify: false, // leave output code readable
    polyfillModulePreload: false, // https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill
  },
  publicDir: '../public' 
})