<template>
  <div class="stock-container">
    <!-- 헤더 -->
    <header class="stock-header">
      <h2>📊 주요 지수</h2>
      <button @click="fetchStockIndices" class="refresh-btn" :disabled="loading">
        <span class="refresh-icon" :class="{ 'spinning': loading }">⟳</span>
      </button>
    </header>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading">
      <el-skeleton animated :rows="2" />
    </div>

    <!-- 주요 지수 카드 -->
    <div v-else class="stock-cards">
      <el-card v-for="(value, key) in indices" :key="key" class="stock-card" shadow="hover">
        <div class="index-title">{{ key }}</div>
        <div class="index-value" :class="{ 'up': value.change > 0, 'down': value.change < 0 }">
          {{ formatNumber(value.price) }}
          <span class="change-percent">
            <span class="change-arrow">{{ value.change > 0 ? '▲' : value.change < 0 ? '▼' : '●' }}</span>
            {{ Math.abs(value.change).toFixed(2) }}%
          </span>
        </div>
        <div class="last-updated">
          마지막 업데이트: {{ getFormattedTime() }}
        </div>
      </el-card>
    </div>

    <!-- 에러 메시지 -->
    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="fetchStockIndices" class="retry-btn">재시도</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";

// API 엔드포인트 설정
const API_ENDPOINTS = {
  NASDAQ: "/api/nasdaq2",
  DOW: "/api/dow2"
};

// 초기 상태 - 로딩 표시
const indices = ref({
  NASDAQ: { price: "로딩 중...", change: 0 },
  DOW: { price: "로딩 중...", change: 0 },
});
const loading = ref(true);
const error = ref("");
const lastUpdated = ref(new Date());
const retryCount = ref(0);
const MAX_RETRIES = 3;

// API 호출 함수
const fetchStockIndices = async (retry = 0) => {
  if (retry === 0) {
    loading.value = true;
    error.value = "";
  }
  
  try {
    // API 요청
    const [nasdaqResponse, dowResponse] = await Promise.all([
      axios.get(API_ENDPOINTS.NASDAQ, { timeout: 5000 }),
      axios.get(API_ENDPOINTS.DOW, { timeout: 5000 }),
    ]);

    if (nasdaqResponse.data && nasdaqResponse.data.regularMarketPrice) {
      indices.value.NASDAQ = {
        price: nasdaqResponse.data.regularMarketPrice.toFixed(2),
        change: ((nasdaqResponse.data.regularMarketPrice - nasdaqResponse.data.previousClose) / nasdaqResponse.data.previousClose) * 100,
      };
    } else {
      throw new Error("NASDAQ 데이터 형식이 올바르지 않습니다.");
    }
    
    if (dowResponse.data && dowResponse.data.regularMarketPrice) {
      indices.value.DOW = {
        price: dowResponse.data.regularMarketPrice.toFixed(2),
        change: ((dowResponse.data.regularMarketPrice - dowResponse.data.previousClose) / dowResponse.data.previousClose) * 100,
      };
    } else {
      throw new Error("DOW 데이터 형식이 올바르지 않습니다.");
    }
    
    lastUpdated.value = new Date();
    retryCount.value = 0;  // 성공하면 재시도 횟수 초기화
    
  } catch (err) {
    console.error("API 호출 오류:", err.message);
    
    // API 오류 시 폴백 데이터 설정
    if (retry < MAX_RETRIES) {
      console.log(`재시도 중... (${retry + 1}/${MAX_RETRIES})`);
      setTimeout(() => fetchStockIndices(retry + 1), 1000);
      return;
    }
    
    // 모든 재시도 실패 시
    error.value = "데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해 주세요.";
    retryCount.value = retry;
    
    // 폴백 데이터
    indices.value.NASDAQ = { price: 15835.62, change: 1.25 };
    indices.value.DOW = { price: 36845.25, change: -0.45 };
    
  } finally {
    if (retry === 0 || retry === MAX_RETRIES) {
      loading.value = false;
    }
  }
};

const formatNumber = (num) => {
  if (typeof num !== 'number') return num;
  
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B"; // 십억 단위
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M"; // 백만 단위
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K"; // 천 단위
  
  return num.toLocaleString();
};

const getFormattedTime = () => {
  const now = lastUpdated.value;
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

onMounted(() => {
  fetchStockIndices();
  
  // 5분마다 자동 새로고침
  const refreshInterval = setInterval(() => {
    fetchStockIndices();
  }, 300000);
  
  // 컴포넌트 언마운트 시 인터벌 제거
  onBeforeUnmount(() => {
    clearInterval(refreshInterval);
  });
});
</script>

<style scoped>
.stock-container {
  max-width: 100%;
  padding: 15px;
  background-color: #2d3748;
  color: #f7fafc;
  border-radius: 12px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  transition: all 0.3s ease;
}

.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stock-header h2 {
  font-size: 1.4rem;
  margin: 0;
  font-weight: 600;
}

.refresh-btn {
  background: transparent;
  border: none;
  color: #ffcc00;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  transform: rotate(180deg);
}

.refresh-btn:disabled {
  color: #666;
  cursor: not-allowed;
}

.refresh-icon {
  display: inline-block;
  transition: transform 0.5s ease;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
}

.error-message {
  text-align: center;
  color: #e53e3e;
  font-size: 1rem;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.retry-btn {
  background-color: #e53e3e;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background-color: #c53030;
}

.stock-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.stock-card {
  background-color: #4a5568;
  color: #e2e8f0;
  text-align: center;
  border-radius: 8px;
  padding: 15px;
  font-size: 1.1rem;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stock-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.stock-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

.stock-card:has(.index-value.up)::before {
  background-color: #48bb78;
}

.stock-card:has(.index-value.down)::before {
  background-color: #f56565;
}

.index-title {
  font-weight: bold;
  margin-bottom: 12px;
  font-size: 1.2rem;
  color: #fff;
}

.index-value {
  font-size: 1.8rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.change-percent {
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 4px;
}

.change-arrow {
  font-size: 0.8rem;
}

.last-updated {
  font-size: 0.8rem;
  color: #a0aec0;
  margin-top: 10px;
  text-align: right;
}

/* 상승: 녹색 */
.index-value.up {
  color: #48bb78;
}

.index-value.up .change-percent {
  background-color: rgba(72, 187, 120, 0.1);
}

/* 하락: 빨간색 */
.index-value.down {
  color: #f56565;
}

.index-value.down .change-percent {
  background-color: rgba(245, 101, 101, 0.1);
}

/* 애니메이션 효과 */
.stock-card {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .index-value {
    font-size: 1.5rem;
    flex-direction: column;
    gap: 5px;
  }
  
  .stock-card {
    padding: 12px;
  }
  
  .stock-header h2 {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .stock-container {
    padding: 10px;
  }
  
  .index-title {
    font-size: 1rem;
  }
  
  .index-value {
    font-size: 1.3rem;
  }
}
</style>
