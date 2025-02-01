import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'; // path 모듈 가져오

// https://vite.dev/config/

export default defineConfig({
  plugins: [vue()],
  build: {
    // 경고 임계값을 1500 kB로 설정 (필요에 따라 조정)
    chunkSizeWarningLimit: 1600,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // '@'가 'src'를 가리키도록 설정
    },
  },
});