import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'

export async function render(url, manifest) {
  const app = createSSRApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(ElementPlus)
  app.use(router)

  // 라우터가 준비될 때까지 대기
  router.push(url)
  await router.isReady()

  const ctx = {}
  const html = await renderToString(app, ctx)

  return { html }
}