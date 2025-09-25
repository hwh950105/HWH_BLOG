<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-animation">
        <h1 class="error-code">404</h1>
        <div class="error-icon">
          <el-icon :size="120" color="#409EFF">
            <Warning />
          </el-icon>
        </div>
      </div>

      <div class="error-content">
        <h2 class="error-title">페이지를 찾을 수 없습니다</h2>
        <p class="error-message">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>

        <div class="error-suggestions">
          <h3>다음을 확인해보세요:</h3>
          <ul>
            <li>URL이 올바른지 확인해주세요</li>
            <li>링크가 최신인지 확인해주세요</li>
            <li>홈페이지에서 다시 찾아보세요</li>
          </ul>
        </div>

        <div class="error-actions">
          <el-button type="primary" @click="goHome" size="large">
            <el-icon><House /></el-icon>
            홈으로 돌아가기
          </el-button>
          <el-button @click="goBack" size="large">
            <el-icon><ArrowLeft /></el-icon>
            이전 페이지
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Warning, House, ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.error-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 60px 40px;
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.error-animation {
  margin-bottom: 40px;
  position: relative;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  color: #409EFF;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  animation: bounce 2s infinite;
}

.error-icon {
  margin-top: 20px;
  opacity: 0.8;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.error-content {
  color: #2c3e50;
}

.error-title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #34495e;
}

.error-message {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
  color: #7f8c8d;
}

.error-suggestions {
  text-align: left;
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #409EFF;
}

.error-suggestions h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.error-suggestions ul {
  margin: 0;
  padding-left: 20px;
}

.error-suggestions li {
  margin-bottom: 8px;
  color: #5a6c7d;
}

.error-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .error-container {
    padding: 40px 20px;
    margin: 20px;
  }

  .error-code {
    font-size: 5rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .error-actions {
    flex-direction: column;
  }
}
</style>