import { createRouter, createWebHistory } from 'vue-router';

import { useLoadingStore } from '@/stores/loading'; // 스토어 가져오기

// SSR 지원을 위한 동적 import 컴포넌트들
const Home = () => import('../views/Home.vue')
const Coin = () => import('../views/Coin.vue')
const Note = () => import('../views/Note.vue')
const Notionlist = () => import('../views/Notionlist.vue')
const Gitlist = () => import('../views/Gitlist.vue')
const Chat = () => import('../views/Chat.vue')
const Error500 = () => import('../views/Error500.vue')
const Error404 = () => import('../views/Error404.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '퇴근하고싶다 - 홈',
      description: 'Vue 3 + Vite로 구축된 개인 블로그 메인 페이지'
    }
  },
  {
    path: '/Coin',
    name: 'Coin',
    component: Coin,
    meta: {
      title: '암호화폐 - 퇴근하고싶다',
      description: '실시간 암호화폐 시세 정보'
    }
  },
  {
    path: '/Note/:id',
    name: 'Note',
    component: Note,
    meta: {
      title: '노트 - 퇴근하고싶다',
      description: 'Notion 기반 블로그 포스트'
    }
  },
  {
    path: '/Notionlist',
    name: 'Notionlist',
    component: Notionlist,
    meta: {
      title: '블로그 목록 - 퇴근하고싶다',
      description: 'Notion 블로그 포스트 목록'
    }
  },
  {
    path: '/Gitlist',
    name: 'Gitlist',
    component: Gitlist,
    meta: {
      title: 'GitHub 프로젝트 - 퇴근하고싶다',
      description: 'GitHub 프로젝트 목록'
    }
  },
  {
    path: '/Chat',
    name: 'Chat',
    component: Chat,
    meta: {
      title: '채팅 - 퇴근하고싶다',
      description: '실시간 채팅'
    }
  },
  {
    path: '/500',
    name: 'Error500',
    component: Error500,
    meta: {
      title: '서버 오류 - 퇴근하고싶다',
      description: '서버 내부 오류가 발생했습니다'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Error404',
    component: Error404,
    meta: {
      title: '페이지를 찾을 수 없음 - 퇴근하고싶다',
      description: '요청하신 페이지를 찾을 수 없습니다'
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const loadingStore = useLoadingStore(); // Pinia 스토어 인스턴스
  loadingStore.ON(); // 페이지 전환 시작 시 로딩 활성화

  // 메타 태그 업데이트 (클라이언트 사이드에서만)
  if (typeof window !== 'undefined') {
    // 페이지 타이틀 업데이트
    if (to.meta.title) {
      document.title = to.meta.title;
    }

    // 메타 태그 업데이트
    if (to.meta.description) {
      const descriptionMeta = document.querySelector('meta[name="description"]');
      if (descriptionMeta) {
        descriptionMeta.setAttribute('content', to.meta.description);
      }

      // OG 태그 업데이트
      const ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
      if (ogDescriptionMeta) {
        ogDescriptionMeta.setAttribute('content', to.meta.description);
      }

      const ogTitleMeta = document.querySelector('meta[property="og:title"]');
      if (ogTitleMeta && to.meta.title) {
        ogTitleMeta.setAttribute('content', to.meta.title);
      }
    }
  }

  next();
});

router.afterEach(() => {
  const loadingStore = useLoadingStore();
  setTimeout(() => {
    loadingStore.OFF(); // 페이지 전환 완료 후 로딩 비활성화
  }, 500); // 약간의 딜레이를 추가하여 자연스러운 전환 효과
});

export default router;
