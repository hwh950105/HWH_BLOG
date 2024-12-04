import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'; // path 모듈 가져오

// https://vite.dev/config/

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // '@'가 'src'를 가리키도록 설정
    },
  },
});