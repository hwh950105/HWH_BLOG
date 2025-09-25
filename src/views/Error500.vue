<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-animation">
        <h1 class="error-code">500</h1>
        <div class="error-icon">
          <el-icon :size="120" color="#E6A23C">
            <Tools />
          </el-icon>
        </div>
      </div>

      <div class="error-content">
        <h2 class="error-title">서버 내부 오류</h2>
        <p class="error-message">
          죄송합니다. 서버에서 문제가 발생했습니다.<br>
          잠시 후 다시 시도해주세요.
        </p>

        <div class="error-suggestions">
          <h3>문제 해결 방법:</h3>
          <ul>
            <li>페이지를 새로고침해보세요</li>
            <li>몇 분 후 다시 시도해보세요</li>
            <li>문제가 지속되면 관리자에게 문의하세요</li>
          </ul>
        </div>

        <div class="error-actions">
          <el-button type="warning" @click="refreshPage" size="large">
            <el-icon><Refresh /></el-icon>
            새로고침
          </el-button>
          <el-button type="primary" @click="goHome" size="large">
            <el-icon><House /></el-icon>
            홈으로 돌아가기
          </el-button>
        </div>

        <div class="error-details" v-if="showDetails">
          <el-collapse v-model="activeCollapse">
            <el-collapse-item title="오류 세부사항" name="details">
              <div class="error-info">
                <p><strong>시간:</strong> {{ new Date().toLocaleString() }}</p>
                <p><strong>페이지:</strong> {{ currentPath }}</p>
                <p><strong>브라우저:</strong> {{ userAgent }}</p>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <div class="toggle-details">
          <el-button link @click="showDetails = !showDetails">
            {{ showDetails ? '세부사항 숨기기' : '세부사항 보기' }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Tools, Refresh, House } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const showDetails = ref(false)
const activeCollapse = ref([])
const currentPath = route.fullPath
const userAgent = navigator.userAgent

const refreshPage = () => {
  window.location.reload()
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff7b7b 0%, #e67e22 100%);
  padding: 20px;
}

.error-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 60px 40px;
  max-width: 700px;
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
  color: #E6A23C;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  animation: shake 2s infinite;
}

.error-icon {
  margin-top: 20px;
  opacity: 0.8;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
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
  background: #fff3cd;
  border-radius: 10px;
  border-left: 4px solid #E6A23C;
}

.error-suggestions h3 {
  margin: 0 0 15px 0;
  color: #856404;
}

.error-suggestions ul {
  margin: 0;
  padding-left: 20px;
}

.error-suggestions li {
  margin-bottom: 8px;
  color: #856404;
}

.error-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.error-details {
  margin: 20px 0;
  text-align: left;
}

.error-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.error-info p {
  margin: 5px 0;
  color: #495057;
}

.toggle-details {
  margin-top: 20px;
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