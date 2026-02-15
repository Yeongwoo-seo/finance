import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages: https://yeongwoo-seo.github.io/finance/ 는 /finance/ 경로이므로 필수
  // (Firebase Hosting 쓰면 여기를 base: '/' 로 바꾸고 다시 빌드)
  base: '/finance/',
})
