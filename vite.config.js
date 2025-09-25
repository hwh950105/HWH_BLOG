import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'; // path 모듈 가져오

// https://vite.dev/config/

export default defineConfig({
  plugins: [vue()],
  ssr: {
    noExternal: ['element-plus']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // '@'가 'src'를 가리키도록 설정
    },
  },
  esbuild: {
    // Production에서 console.log, debugger 제거
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  build: {
    // 청크 분할로 번들 최적화
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'firebase': ['firebase/app', 'firebase/database', 'firebase/analytics'],
          'vue-router': ['vue-router'],
          'pinia': ['pinia'],
          'chart': ['chart.js'],
          'vue-notion': ['vue-notion'],
        }
      }
    },
    // 청크 크기 경고 한도 증가
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});