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
        // 자동 청크 분할 사용 - external 모듈과 충돌 방지
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('element-plus')) {
              return 'element-plus';
            }
            if (id.includes('chart.js')) {
              return 'chart';
            }
            if (id.includes('vue-notion')) {
              return 'vue-notion';
            }
            return 'vendor';
          }
        }
      }
    },
    // 청크 크기 경고 한도 증가
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: true,
    port: 5173,
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    },
    proxy: {
      '/api': {
        target: 'https://jsonplaceholder.typicode.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});