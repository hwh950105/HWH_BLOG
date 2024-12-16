<template>
  <div class="common-layout">
    <el-container>
      <!-- 사이드바 -->
      <el-aside class="aside">
        <div class="aside-content">
          <h1 class="blog-title">^,^</h1>
          <nav class="nav-menu">
            <router-link to="/" class="nav-link">🔥 Home</router-link>
            <router-link to="/Coin" class="nav-link">🪙 Coin</router-link>
            <router-link to="/Notionlist" class="nav-link">🗊 Note</router-link>
            <router-link to="/Gitlist" class="nav-link">💿 Git</router-link>
          </nav>
        </div>
      </el-aside>

      <!-- 메인 콘텐츠 -->
      <el-container>
        <!-- 헤더 -->
        <el-header class="header">
          <div class="header-content">
            <h2>{{ headertitle.value }}</h2>
          </div>
        </el-header>

        <!-- 메인 -->
        <el-main class="main">
          <div class="post-container">
            <router-view></router-view> <!-- 라우터 뷰 -->
          </div>
        </el-main>

        <!-- 푸터 -->
        <el-footer class="footer">
          &copy; 음.... &copy;
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
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Loading from './components/loading.vue'; // 로딩 컴포넌트 가져오기
import HWHChat from './components/HWHChat.vue'; // HWHChat 컴포넌트 가져오기
import { useLoadingStore } from '@/stores/loading';

const headertitle = ref('음.sss..ss');
const LoadingStore = useLoadingStore();
const isChatVisible = ref(false); // 채팅 창 표시 여부

const toggleChat = () => {
  isChatVisible.value = !isChatVisible.value; // 버튼 클릭 시 토글
};

LoadingStore.ON();
onMounted(() => {
  setTimeout(() => {
    LoadingStore.OFF(); // 4초 후 로딩 상태 해제
  }, 1500);
});
</script>

<style scoped>
/* 전체 레이아웃 */
.common-layout {
  background-color: #141414; /* 진한 다크 배경 */
  color: #ffffff;
  font-family: 'Inter', Arial, sans-serif; /* 현대적인 폰트 */
  height: 100vh;
  display: flex;
}

/* 사이드바 */
.aside {
  background-color: #1f1f1f; /* 사이드바 배경 */
  color: #ffffff;
  width: 250px;
  padding: 20px;
  border-right: 1px solid #2c2c2c; /* 경계선 */
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2); /* 입체감 */
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

/* 헤더 */
.header {
  background: linear-gradient(90deg, #1f1f1f, #282828);
  color: #ffffff;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 헤더 그림자 */
}

.header-content h2 {
  font-size: 1.5rem;
  letter-spacing: 3px;
  font-weight: 500;
  color: #ffcc00; /* 헤더 타이틀 강조 */
}

/* 메인 콘텐츠 */
.main {
  padding: 3px;
  background-color: #181818; /* 메인 배경 */
  flex-grow: 1;
  border-radius: 8px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5); /* 내부 그림자 */
  color: #e0e0e0;
}

.post-container {
  background-color: #242424; /* 게시글 카드 배경 */
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* 카드 그림자 */
  gap: 20px;
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
  padding: 15px;
  font-size: 0.9rem;
  border-top: 1px solid #2c2c2c;
}

/* 채팅 모달 스타일 */
.chat-modal {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 480px;
  max-height: 80vh;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  background-color: #2c2c2c; /* 채팅 배경색 */
  z-index: 1000; /* 최상위에 표시 */
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  /* transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out; */
  z-index: 1100; /* 버튼이 항상 위에 */
}

.chat-toggle-button:hover {
  background-color: #ffcc0033;
  transform: scale(1.1);
}

.chat-toggle-button:active {
  transform: scale(0.95);
}

</style>
