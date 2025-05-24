import { defineConfig } from 'vite'
import path from 'path'
import basicSsl from '@vitejs/plugin-basic-ssl'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/munchkin-companion/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
        additionalData: `@use "${path.resolve(__dirname, './src/assets/scss/variables.scss')}" as *;`,
      },
    },
  },
  plugins: [
    vue(),
    basicSsl(),
  ],
  server: {
    https: true,
    port: 443,
  },
})
