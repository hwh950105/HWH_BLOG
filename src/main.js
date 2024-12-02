import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '../src/cssmain.css';
import 'element-plus/theme-chalk/dark/css-vars.css'; // 다크 테마 적용

import router from './router'; // default로 내보낸 router를 가져옴

const app = createApp(App);

// Element Plus 등록
app.use(ElementPlus);
app.use(router);

// 컴포넌트 자동 등록
const components = import.meta.glob('./components/*.vue', { eager: true });

Object.entries(components).forEach(([path, module]) => {
  const componentName = path.split('/').pop().replace('.vue', ''); // 파일 이름 추출
  app.component(componentName, module.default);
});

app.mount('#app');
