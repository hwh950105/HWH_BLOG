<template>
  <div class="common-layout">
    <el-container>
      <!-- 사이드바 -->
      <el-aside class="aside" width="280px" :class="{ 'mobile-open': isMobileMenuOpen }">
        <div class="aside-content">
          <div class="nav-section">
            <h1 class="blog-title">HWH BLOG</h1>
            <nav class="nav-menu">
              <router-link to="/" class="nav-link">🔥 Home</router-link>
              <router-link to="/Coin" class="nav-link">🪙 Coin</router-link>
              <router-link to="/Notionlist" class="nav-link">🗊 Note</router-link>
              <router-link to="/Gitlist" class="nav-link">💿 Git</router-link>
            </nav>
          </div>
          <div class="music-player-section">
            <YTMusicPlayer />
          </div>
        </div>
      </el-aside>

      <!-- 모바일 메뉴 토글 버튼 -->
      <button class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="메뉴 열기">
        <span>☰</span>
      </button>

      <!-- 메인 콘텐츠 -->
      <el-container class="main-container">
        <!-- 헤더 -->
        <el-header class="header">
          <div class="header-content">
            <h2>{{ headertitle }}</h2>
            <div class="header-actions">
              <span class="current-date">{{ currentDate }}</span>
            </div>
          </div>
        </el-header>

        <!-- 메인 -->
        <el-main class="main">
          <div class="post-container">
            <router-view></router-view>
          </div>
        </el-main>

        <!-- 푸터 -->
        <el-footer class="footer">
          &copy; 2023 HWH BLOG - All Rights Reserved
        </el-footer>
      </el-container>
    </el-container>

    <!-- 로딩 컴포넌트 -->
    <div class="my-loader" v-show="LoadingStore.isLoading">
      <Loading />
    </div>

    <!-- HWHChat 컴포넌트 -->
    <HWHChat v-if="isChatVisible" class="chat-modal" />

    <!-- 채팅 토글 버튼 -->
    <button class="chat-toggle-button" @click="toggleChat">
      💬
    </button>

    <!-- 사이드바 오버레이 -->
    <div class="sidebar-overlay" v-if="isMobileMenuOpen" @click="toggleMobileMenu"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Loading from './components/loading.vue'; // 로딩 컴포넌트 가져오기
import HWHChat from './components/HWHChat.vue'; // HWHChat 컴포넌트 가져오기
import YTMusicPlayer from './components/YTMusicPlayer.vue';
import { useLoadingStore } from '@/stores/loading';

const headertitle = ref('HWH BLOG');
const LoadingStore = useLoadingStore();
const isChatVisible = ref(false); // 채팅 창 표시 여부
const isMobileMenuOpen = ref(false); // 모바일 메뉴 표시 여부
const currentDate = ref('');

const toggleChat = () => {
  isChatVisible.value = !isChatVisible.value; // 버튼 클릭 시 토글
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value; // 모바일 메뉴 토글
};

const updateCurrentDate = () => {
  const now = new Date();
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    weekday: 'long' 
  };
  currentDate.value = now.toLocaleDateString('ko-KR', options);
};

LoadingStore.ON();
onMounted(() => {
  setTimeout(() => {
    LoadingStore.OFF(); // 1.5초 후 로딩 상태 해제
  }, 1500);
  
  // 현재 날짜 표시
  updateCurrentDate();
  // 매일 자정에 날짜 업데이트
  setInterval(updateCurrentDate, 86400000);
});
</script>

<style scoped>
/* 전체 레이아웃 */
.common-layout {
  background-color: #141414;
  color: #ffffff;
  font-family: 'Inter', Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  overflow: hidden;
}

/* 사이드바 */
.aside {
  background-color: #1f1f1f;
  color: #ffffff;
  width: 280px; /* 고정 너비로 변경 */
  padding: 20px 10px;
  border-right: 0; /* 테두리 제거 */
  box-shadow: none; /* 그림자 완전 제거 */
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 1000;
  transition: transform 0.3s ease;
}

.aside-content {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 40px);
  justify-content: space-between;
}

/* 메인 컨테이너 */
.main-container {
  margin-left: 280px; /* 사이드바 너비와 정확히 일치 */
  width: calc(100% - 280px); /* 나머지 전체 너비 */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  position: relative;
  height: 100vh;
  border-left: none; /* 왼쪽 테두리 제거 */
  background-color: #1f1f1f; /* 사이드바와 같은 배경색 */
}

.nav-section {
  flex-grow: 1;
  margin-bottom: 20px;
}

.music-player-section {
  margin-top: auto;
  padding-top: 20px;
  width: 100%;
  margin-bottom: 20px;
}

.blog-title {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  color: #ffcc00; /* 블로그 타이틀 강조 */
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.nav-menu a {
  color: #ffffff;
  text-decoration: none;
  font-size: 1.2rem;
  padding: 10px;
  border-radius: 8px;
  transition: background 0.3s, color 0.3s;
}

.nav-menu a:hover {
  background-color: #ffcc00; /* 강조 색상 */
  color: #141414;
}

.nav-menu a.router-link-active {
  background-color: #ffcc00;
  color: #141414;
  font-weight: bold;
}

/* 헤더 */
.header {
  background: linear-gradient(90deg, #1f1f1f, #282828);
  color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 헤더 그림자 */
  border-bottom: 1px solid #2c2c2c;
  position: sticky;
  top: 0;
  z-index: 100;
  padding-left: 0; /* 왼쪽 패딩 제거 */
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 100%;
}

.header-content h2 {
  font-size: 1.5rem;
  font-weight: 500;
  color: #ffcc00; /* 헤더 타이틀 강조 */
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.current-date {
  color: #cccccc;
  font-size: 0.9rem;
}

/* 메인 콘텐츠 */
.main {
  flex: 1;
  padding: 0 20px 20px 0; /* 왼쪽, 위 패딩 제거 */
  margin: 0; /* 마진 제거 */
  background-color: #181818;
  min-height: calc(100vh - 120px);
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  height: calc(100vh - 120px);
  transition: background-color 0.3s ease;
}

.post-container {
  background-color: #242424;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  min-height: calc(100vh - 160px);
  overflow-y: auto;
  position: relative;
  height: calc(100vh - 160px);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  margin-left: 0; /* 왼쪽 마진 제거 */
}

.post-title {
  font-size: 1.8rem;
  margin-bottom: 10px;
  color: #ffcc00; /* 타이틀 강조 */
}

.post-excerpt {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 20px;
  color: #cccccc; /* 부드러운 텍스트 색상 */
}

.cta-button {
  background-color: #ffcc00; /* 주요 액션 색상 */
  color: #141414;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.cta-button:hover {
  background-color: #ffd633;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* 버튼 그림자 */
}

/* 푸터 */
.footer {
  background-color: #1f1f1f;
  color: #cccccc;
  text-align: center;
  padding: the15px;
  font-size: 0.9rem;
  border-top: 1px solid #2c2c2c;
  height: 50px;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

/* 채팅 모달 스타일 */
.chat-modal {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 480px;
  max-height: 80vh;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  background-color: #2c2c2c; /* 채팅 배경색 */
  z-index: 1000; /* 최상위에 표시 */
  overflow: hidden;
}

/* 채팅 창이 사라질 때 애니메이션 */
.chat-modal.hidden {
  transform: translateY(20px);
  opacity: 0;
}

/* 채팅 토글 버튼 스타일 */
.chat-toggle-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: #ffcc00;
  color: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
  z-index: 1100; /* 버튼이 항상 위에 */
}

.chat-toggle-button:hover {
  background-color: #ffd633;
  transform: scale(1.1);
}

.chat-toggle-button:active {
  transform: scale(0.95);
}

/* 모바일 메뉴 토글 버튼 스타일 */
.mobile-menu-toggle {
  display: none; /* 기본적으로 숨김 */
  position: fixed;
  top: 15px;
  left: 15px;
  width: 40px;
  height: 40px;
  background-color: #ffcc00;
  color: #141414;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  z-index: 1200;
  transition: all 0.3s ease;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.mobile-menu-toggle:hover {
  background-color: #ffd633;
}

.mobile-menu-toggle:active {
  transform: scale(0.95);
}

/* 사이드바 오버레이 */
.sidebar-overlay {
  display: none; /* 기본적으로 숨김 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  transition: opacity 0.3s ease;
}

/* 스크롤바 스타일링 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1f1f1f;
}

::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #444;
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .aside {
    width: 240px;
    border-right: 0; /* 테두리 제거 */
    box-shadow: none; /* 그림자 제거 */
  }
  
  .main-container {
    margin-left: 240px;
    width: calc(100% - 240px);
    border-left: none; /* 왼쪽 테두리 제거 */
  }
}

@media (max-width: 768px) {
  .aside {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    width: 240px;
  }
  
  .main-container {
    margin-left: 0;
    width: 100%;
  }
  
  /* 모바일 환경에서 토글 버튼 표시 */
  .mobile-menu-toggle {
    display: flex;
  }
  
  .aside.mobile-open {
    transform: translateX(0);
  }
  
  /* 사이드바가 열릴 때 오버레이 표시 */
  .sidebar-overlay {
    display: block;
  }
  
  /* 채팅 모달 조정 */
  .chat-modal {
    width: 90%;
    max-width: 350px;
    right: 5%;
  }
  
  .header-content {
    padding: 0 10px;
  }
  
  .current-date {
    display: none;
  }
}

/* 작은 모바일 기기 */
@media (max-width: 480px) {
  .chat-modal {
    bottom: 70px;
    max-height: 70vh;
  }
  
  .chat-toggle-button {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
  
  .header-content h2 {
    font-size: 1.2rem;
  }
  
  .blog-title {
    font-size: 1.5rem;
  }
  
  .post-container {
    padding: 15px;
  }
}

/* 애니메이션 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.post-container {
  animation: fadeIn 0.5s ease;
}
</style>
