import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '../src/cssmain.css';
import 'element-plus/theme-chalk/dark/css-vars.css'; 

import router from './router'; // default로 내보낸 router를 가져옴

import { createPinia } from 'pinia';



const app = createApp(App);
const pinia = createPinia();

// pinia 등록
app.use(pinia);
// Element Plus 등록
app.use(ElementPlus);
app.use(router);

// 컴포넌트 자동 등록
const components = import.meta.glob('./components/*.vue', { eager: true });

Object.entries(components).forEach(([path, module]) => {
  const componentName = path.split('/').pop().replace('.vue', ''); // 파일 이름 추출
  console.log('Registering component:', componentName); // 디버깅용 로그 추가
  app.component(componentName, module.default);
});


app.mount('#app');
