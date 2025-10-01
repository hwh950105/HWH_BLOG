<template>
  <div class="common-layout" :class="{ 'light-mode': !isDarkMode }">
    <el-container>
      <!-- 사이드바 -->
      <el-aside class="aside" width="280px" :class="{ 'mobile-open': isMobileMenuOpen }">
        <div class="aside-content">
          <div class="nav-section">
            <h1 class="blog-title" @click="goHome">HWH BLOG</h1>
            <nav class="nav-menu">
              <router-link to="/" class="nav-link">🔥 Home</router-link>
              <!-- <router-link to="/about" class="nav-link">👋 About</router-link>-->
              <!-- <router-link to="/resume" class="nav-link">📄 Resume</router-link>  -->

              <router-link to="/Coin" class="nav-link">🪙 Coin</router-link>
              <router-link to="/Notionlist" class="nav-link">🗊 Note</router-link>
              <router-link to="/Gitlist" class="nav-link">💿 Git</router-link>
            </nav>
          </div>
          <!-- 뮤직 플레이어는 이제 Home.vue에서 처리 -->
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
              <el-switch
                v-model="isDarkMode"
                class="theme-switch"
                active-text="🌙"
                inactive-text="☀️"
                @change="toggleTheme"
              />
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
          &copy; 2025 HWH BLOG
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
    <button class="chat-toggle-button" @click="toggleChat">💬</button>

    <!-- 뮤직 토글 버튼 -->
    <!-- <button class="music-toggle-button" @click="toggleMusic">🎵</button> -->

    <!-- 뮤직 플레이어 -->
    <!-- <YTMusicPlayer v-if="isMusicVisible" /> -->

    <!-- 사이드바 오버레이 -->
    <div class="sidebar-overlay" v-if="isMobileMenuOpen" @click="toggleMobileMenu"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router'
import Loading from './components/loading.vue';
import HWHChat from './components/HWHChat.vue';
import { useLoadingStore } from '@/stores/loading';
import { useThemeStore } from '@/stores/theme';

const router = useRouter()
const headertitle = ref('HWH BLOG');
const LoadingStore = useLoadingStore();
const themeStore = useThemeStore();
const isChatVisible = ref(false);
const isMobileMenuOpen = ref(false);
const currentDate = ref('');
const isDarkMode = ref(themeStore.isDarkMode);

const goHome = () => {
  router.push('/');
};

// 초기 다크 모드 클래스 보장
if (themeStore.isDarkMode) {
  document.body.classList.add('dark-mode');
  document.body.classList.remove('light-mode');
} else {
  document.body.classList.add('light-mode');
  document.body.classList.remove('dark-mode');
}

const toggleTheme = () => {
  themeStore.toggleTheme();
};

const toggleChat = () => {
  isChatVisible.value = !isChatVisible.value;
};


const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
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
    LoadingStore.OFF();
  }, 1500);

  updateCurrentDate();
  setInterval(updateCurrentDate, 86400000);
});
</script>

<style scoped>
/* Fluid Modernism Layout */
.common-layout {
  background: var(--color-bg);
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  display: flex;
  overflow: hidden;
  position: relative;

  /* Animated background */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(240, 147, 251, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 60%, rgba(79, 172, 254, 0.06) 0%, transparent 50%);
    animation: floatBackground 20s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  /* Glass morphism overlay */
  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: var(--blur-sm);
    pointer-events: none;
    z-index: 1;
  }
}

/* Fluid Sidebar with Glass Morphism */
.aside {
  background: var(--color-surface-1);
  backdrop-filter: var(--blur-lg);
  color: var(--text-primary);
  width: 280px;
  padding: var(--space-6) var(--space-4);
  border-right: 1px solid var(--color-border);
  box-shadow: var(--shadow-xl), var(--shadow-glow);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 1000;
  transition: all 0.4s var(--ease-fluid);

  /* Organic border */
  border-radius: 0 var(--radius-xl) var(--radius-xl) 0;

  /* Floating effect */
  &::before {
    content: '';
    position: absolute;
    top: var(--space-4);
    left: var(--space-2);
    right: var(--space-2);
    bottom: var(--space-4);
    background: rgba(255, 255, 255, 0.02);
    border-radius: var(--radius-lg);
    border: 1px solid rgba(255, 255, 255, 0.05);
    pointer-events: none;
  }
}

.aside-content {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 40px);
  justify-content: flex-start;
}

/* 메인 컨테이너 */
.main-container {
  margin-left: 280px;
  width: calc(100% - 280px);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  position: relative;
  height: 100vh;
  border-left: none;
  background: transparent;
}

.nav-section {
  flex-grow: 1;
  margin-bottom: var(--space-6);
}

.blog-title {
  font-size: 1.75rem;
  font-weight: 900;
  font-variation-settings: 'wght' 900;
  text-align: center;
  margin-bottom: var(--space-8);
  color: var(--text-primary);
  letter-spacing: -0.02em;
  background: var(--color-primary);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
  position: relative;

  /* Animated underline */
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: var(--color-accent);
    border-radius: var(--radius-sm);
    animation: pulse 2s ease-in-out infinite;
  }
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.nav-menu a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 1.05rem;
  font-weight: 500;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-organic);
  transition: all 0.3s var(--ease-fluid);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  position: relative;
  backdrop-filter: var(--blur-sm);

  /* Hover glow effect */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--color-primary);
    border-radius: var(--radius-organic);
    opacity: 0;
    transition: opacity 0.3s var(--ease-fluid);
    z-index: -1;
  }
}

.nav-menu a:hover {
  color: var(--text-primary);
  transform: translateX(var(--space-2)) scale(1.02);
  box-shadow: var(--shadow-md), var(--shadow-glow);

  &::before {
    opacity: 0.1;
  }
}

.nav-menu a.router-link-active {
  background: var(--color-primary);
  color: white;
  font-weight: 600;
  border: 1px solid rgba(102, 126, 234, 0.3);
  transform: translateX(var(--space-2)) scale(1.05);
  box-shadow: var(--shadow-lg), var(--shadow-glow);

  &::before {
    opacity: 0.2;
  }
}

.nav-menu a.router-link-active::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--color-accent);
  border-radius: 2px;
}

/* Fluid Header with Glass Morphism */
.header {
  background: var(--color-surface-1);
  backdrop-filter: var(--blur-md);
  color: var(--text-primary);
  box-shadow: var(--shadow-lg);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  padding-left: 0;

  /* Floating effect */
  &::before {
    content: '';
    position: absolute;
    inset: var(--space-2);
    background: rgba(255, 255, 255, 0.02);
    border-radius: var(--radius-lg);
    border: 1px solid rgba(255, 255, 255, 0.05);
    pointer-events: none;
  }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 100%;
}

.header-content h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
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

/* Fluid Main Content */
.main {
  flex: 1;
  padding: 0 var(--space-6) var(--space-6) 0;
  margin: 0;
  background: transparent;
  min-height: calc(100vh - 120px);
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  height: calc(100vh - 120px);
  transition: all 0.3s var(--ease-fluid);
  z-index: 10;
}

.post-container {
  background: var(--color-surface-2) !important;
  padding: var(--space-8);
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-2xl), var(--shadow-glow);
  min-height: calc(100vh - 160px);
  overflow-y: auto;
  position: relative;
  height: calc(100vh - 160px);
  transition: none !important;
  margin-left: 0;
  z-index: 1;
}

.post-container::before,
.post-container::after {
  display: none !important;
}

/* 푸터 */
.footer {
  background-color: #1f1f1f;
  color: #cccccc;
  text-align: center;
  padding: 15px;
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
  background-color: #2c2c2c;
  z-index: 1000;
  overflow: hidden;
}

/* Fluid Chat Button */
.chat-toggle-button {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  width: 64px;
  height: 64px;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl), var(--shadow-glow);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.4s var(--ease-bounce);
  z-index: 1100;
  backdrop-filter: var(--blur-sm);

  /* Pulsing animation */
  &::before {
    content: '';
    position: absolute;
    inset: -4px;
    background: var(--color-accent);
    border-radius: var(--radius-xl);
    opacity: 0.3;
    animation: pulse 2s ease-in-out infinite;
    z-index: -1;
  }
}

/* Music Toggle Button */
.music-toggle-button {
  position: fixed;
  bottom: var(--space-6);
  left: var(--space-6);
  width: 64px;
  height: 64px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl), var(--shadow-glow);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.4s var(--ease-bounce);
  z-index: 1100;
  backdrop-filter: var(--blur-sm);

  /* Pulsing animation */
  &::before {
    content: '';
    position: absolute;
    inset: -4px;
    background: var(--color-primary);
    border-radius: var(--radius-xl);
    opacity: 0.3;
    animation: musicPulse 3s ease-in-out infinite;
    z-index: -1;
  }

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: var(--shadow-2xl), var(--shadow-glow);
  }
}

/* Music Modal */
.music-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: modalFadeIn 0.3s ease;
}

.music-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: var(--blur-md);
}

.music-modal-content {
  background: var(--color-surface-1);
  backdrop-filter: var(--blur-lg);
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-2xl), var(--shadow-glow);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  position: relative;
  z-index: 1201;
  animation: modalSlideIn 0.4s var(--ease-bounce);

  /* Glass morphism */
  &::before {
    content: '';
    position: absolute;
    inset: 1px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%);
    border-radius: var(--radius-2xl);
    pointer-events: none;
  }
}

.music-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6);
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid var(--color-border);
}

.music-modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
}

.music-close-btn {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border: none;
  border-radius: var(--radius-sm);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s var(--ease-fluid);
  font-size: 18px;
  font-weight: bold;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
}

.music-modal-body {
  padding: var(--space-6);
  max-height: calc(80vh - 100px);
  overflow-y: auto;
}

/* Modal Animations */
@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes musicPulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.6; }
}

.chat-toggle-button:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: var(--shadow-2xl), var(--shadow-glow);
}

.chat-toggle-button:active {
  transform: scale(0.95);
}

/* Fluid Mobile Menu Toggle */
.mobile-menu-toggle {
  display: none;
  position: fixed;
  top: var(--space-4);
  left: var(--space-4);
  width: 44px;
  height: 44px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 20px;
  cursor: pointer;
  z-index: 1200;
  transition: all 0.4s var(--ease-bounce);
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg), var(--shadow-glow);
  backdrop-filter: var(--blur-sm);
}

.mobile-menu-toggle:hover {
  background-color: #ffd633;
}

.mobile-menu-toggle:active {
  transform: scale(0.95);
}

/* 사이드바 오버레이 */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  transition: opacity 0.3s ease;
}

/* Fluid Scrollbar Styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-accent);
  box-shadow: var(--shadow-glow);
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .aside {
    width: 240px;
    border-right: 0;
    box-shadow: none;
  }
  .main-container {
    margin-left: 240px;
    width: calc(100% - 240px);
    border-left: none;
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
  .mobile-menu-toggle {
    display: flex;
  }
  .aside.mobile-open {
    transform: translateX(0);
  }
  .sidebar-overlay {
    display: block;
  }
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

  /* Mobile Music Button */
  .music-toggle-button {
    width: 56px;
    height: 56px;
    bottom: var(--space-4);
    left: var(--space-4);
    font-size: 20px;
  }

  .music-modal-content {
    width: 95%;
    max-height: 85vh;
  }

  .music-modal-header,
  .music-modal-body {
    padding: var(--space-4);
  }
}

/* Fluid Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes floatBackground {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(5px) rotate(-1deg); }
}

@keyframes floatParticles {
  0%, 100% { opacity: 0.5; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-10px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.6; }
}

.post-container {
  animation: none !important;
}

/* 테마 스위치 스타일 */
.theme-switch {
  margin-right: 15px;
}

/* 라이트 모드 */
.light-mode {
  background-color: #f5f5f5;
  color: #333333;
}

.light-mode .aside {
  background-color: #ffffff;
  color: #333333;
  border-right: 1px solid #e0e0e0;
}

.light-mode .main-container {
  background-color: #ffffff;
}

.light-mode .header {
  background: linear-gradient(90deg, #ffffff, #f5f5f5);
  color: #333333;
  border-bottom: 1px solid #e0e0e0;
}

.light-mode .nav-menu a {
  color: #333333;
}

.light-mode .nav-menu a:hover {
  background-color: #f0f0f0;
  color: #333333;
}

.light-mode .nav-menu a.router-link-active {
  background-color: #e0e0e0;
  color: #333333;
}

.light-mode .blog-title {
  color: #666666;
}

.light-mode .header-content h2 {
  color: #666666;
}

.light-mode .current-date {
  color: #666666;
}

.light-mode .post-container {
  background: rgba(255, 255, 255, 0.9) !important;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.light-mode .mobile-menu-toggle {
  background: var(--color-primary);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.light-mode .chat-toggle-button {
  background: var(--color-accent);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 터치 최적화 */
@media (hover: none) and (pointer: coarse) {
  .nav-menu a:hover {
    transform: none;
  }

  .nav-menu a:active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }

  .chat-toggle-button:hover {
    transform: none;
  }

  .chat-toggle-button:active {
    transform: scale(0.9);
  }

  .mobile-menu-toggle:active {
    transform: scale(0.9);
  }
}

/* 접근성 개선 */
.nav-menu a:focus {
  outline: 2px solid var(--color-accent-solid);
  outline-offset: 2px;
}

.mobile-menu-toggle:focus {
  outline: 2px solid var(--color-accent-solid);
  outline-offset: 2px;
}

.chat-toggle-button:focus {
  outline: 2px solid var(--color-accent-solid);
  outline-offset: 2px;
}

/* 가로 모드 대응 */
@media (max-width: 768px) and (orientation: landscape) {
  .chat-modal {
    max-height: 60vh;
  }

  .post-container {
    min-height: calc(100vh - 140px);
    height: calc(100vh - 140px);
  }

  .main {
    height: calc(100vh - 90px);
    min-height: calc(100vh - 90px);
  }
}

/* 성능 최적화 */
@media (max-width: 768px) {
  .aside,
  .post-container,
  .mobile-menu-toggle {
    will-change: transform;
  }

  /* 애니메이션 간소화 */
  .nav-menu a {
    transition: background-color 0.2s ease, transform 0.1s ease;
  }

  .chat-toggle-button::before,
  .music-toggle-button::before {
    animation-duration: 3s;
  }
}
</style>
