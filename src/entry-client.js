import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import '../src/cssmain.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// 컴포넌트 import
import Loading from './components/loading.vue'
import HWHChat from './components/HWHChat.vue'

const app = createApp(App)
const pinia = createPinia()

// Element Plus Icons 전역 등록
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 플러그인 등록
app.use(pinia)
app.use(ElementPlus)
app.use(router)

// 컴포넌트 등록 (HMR 중복 방지 가드)
if (!app._context.components['Loading']) {
  app.component('Loading', Loading)
}
if (!app._context.components['HWHChat']) {
  app.component('HWHChat', HWHChat)
}

// 글로벌 에러 핸들러
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.error('Error info:', info)

  // 500 에러 페이지로 리다이렉트
  if (router.currentRoute.value.name !== 'Error500') {
    router.push('/500')
  }
}

// API 요청 에러 처리를 위한 글로벌 함수
app.config.globalProperties.$handleApiError = (error) => {
  if (error.response) {
    const status = error.response.status
    if (status === 404) {
      router.push({ name: 'Error404' })
    } else if (status >= 500) {
      router.push({ name: 'Error500' })
    }
  } else if (error.request) {
    // 네트워크 에러
    router.push({ name: 'Error500' })
  }
}

// 라우터가 준비되면 앱 마운트
router.isReady().then(() => {
  app.mount('#app')
})