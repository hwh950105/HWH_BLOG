import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Coin from '../views/Coin.vue';
import Note from '../views/Note.vue';
import Notionlist from '../views/Notionlist.vue';
import Gitlist from '../views/Gitlist.vue';
import Chat from '../views/Chat.vue';

import { useLoadingStore } from '@/stores/loading'; // 스토어 가져오기

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/Coin', name: 'Coin', component: Coin },
  {
    path: '/Note/:id',
    name: 'Note',
    component: Note
  },  
  {
    path: '/Notionlist',
    name: 'Notionlist',
    component: Notionlist
  },
  {
    path: '/Gitlist',
    name: 'Gitlist',
    component: Gitlist
  },
  {
    path: '/Chat',
    name: 'Chat',
    component: Chat
  },
  
  

];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const loadingStore = useLoadingStore(); // Pinia 스토어 인스턴스
  loadingStore.ON(); // 페이지 전환 시작 시 로딩 활성화
  next();
});

router.afterEach(() => {
  const loadingStore = useLoadingStore();
  setTimeout(() => {
    loadingStore.OFF(); // 페이지 전환 완료 후 로딩 비활성화
  }, 500); // 약간의 딜레이를 추가하여 자연스러운 전환 효과
});

export default router;
