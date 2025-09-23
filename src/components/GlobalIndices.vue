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

// API 엔드포인트 설정 (서버리스: 무료, 토큰 불필요)
const INDICES_API = "/api/indices";

// 초기 상태 - 로딩 표시 (카드가 바로 렌더되도록 모든 키 준비)
const indices = ref({
  NASDAQ: { price: "로딩 중...", change: 0 },
  DOW: { price: "로딩 중...", change: 0 },
  SP500: { price: "로딩 중...", change: 0 },
  KOSPI: { price: "로딩 중...", change: 0 },
  NIKKEI225: { price: "로딩 중...", change: 0 },
  HANGSENG: { price: "로딩 중...", change: 0 },
  FTSE100: { price: "로딩 중...", change: 0 },
  DAX: { price: "로딩 중...", change: 0 },
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
    const { data } = await axios.get(INDICES_API, { timeout: 6000 });

    const map = (x) => ({
      price: Number(x.regularMarketPrice).toFixed(2),
      change: ((x.regularMarketPrice - x.previousClose) / x.previousClose) * 100,
    });

    const converted = Object.fromEntries(
      Object.entries(data || {}).map(([k, v]) => [k, map(v)])
    );

    // 기존 키 유지 + 수신 데이터만 덮어쓰기
    indices.value = { ...indices.value, ...converted };
    
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

    // 폴백 데이터 (대표 값 샘플)
    indices.value = {
      NASDAQ: { price: 15835.62, change: 1.25 },
      DOW: { price: 36845.25, change: -0.45 },
      SP500: { price: 4720.15, change: 0.32 },
      KOSPI: { price: 2620.45, change: -0.28 },
      NIKKEI225: { price: 36550.30, change: 0.40 },
      HANGSENG: { price: 16680.20, change: -0.15 },
      FTSE100: { price: 7725.10, change: 0.12 },
      DAX: { price: 17080.55, change: 0.20 },
    };
    
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
  padding: var(--space-3);
  background: var(--color-surface-1);
  color: var(--text-primary);
  border-radius: var(--radius-lg);
  min-height: 180px;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  transition: all var(--ease-fluid) 0.3s;
  border: 1px solid var(--color-border);
  backdrop-filter: var(--blur-md);
  box-shadow: var(--shadow-md);
}

.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-divider);
}

.stock-header h2 {
  font-size: 1rem;
  margin: 0;
  color: var(--color-primary-solid);
  background: var(--color-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.refresh-btn {
  background: transparent;
  border: none;
  color: var(--color-primary-solid);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--ease-fluid) 0.3s;
  border-radius: var(--radius-sm);
  padding: var(--space-2);
}

.refresh-btn:hover {
  transform: rotate(180deg) scale(1.1);
  background: var(--color-surface-2);
}

.refresh-btn:disabled {
  color: var(--text-muted);
  cursor: not-allowed;
  opacity: 0.5;
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
  gap: var(--space-4);
  padding: var(--space-3);
}

.error-message {
  text-align: center;
  color: var(--color-warning-solid);
  font-size: 1rem;
  margin-top: var(--space-5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.retry-btn {
  background: var(--color-warning);
  color: var(--text-primary);
  border: none;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--ease-fluid) 0.3s;
  font-weight: 500;
}

.retry-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.stock-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  width: 100%;
}

.stock-card {
  background: var(--color-surface-2);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  transition: all var(--ease-fluid) 0.3s;
  min-height: 90px;
  border: 1px solid var(--color-border);
  backdrop-filter: var(--blur-sm);
}

.stock-name {
  font-size: 0.7rem;
  color: #a0aec0;
  margin-bottom: 4px;
}

.stock-price {
  font-size: 0.9rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 4px;
}

.stock-change {
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.index-title {
  font-weight: 700;
  margin-bottom: var(--space-2);
  font-size: 1rem;
  color: var(--text-primary);
  background: var(--color-secondary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.index-value {
  font-size: 1.6rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  color: var(--text-primary);
}

.change-percent {
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  backdrop-filter: var(--blur-sm);
}

.change-arrow {
  font-size: 0.8rem;
}

.last-updated {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: var(--space-3);
  text-align: right;
}

/* 상승: 녹색 */
.index-value.up {
  color: var(--color-success-solid);
}

.index-value.up .change-percent {
  background: var(--color-success);
  color: var(--text-primary);
}

/* 하락: 빨간색 */
.index-value.down {
  color: var(--color-warning-solid);
}

.index-value.down .change-percent {
  background: var(--color-warning);
  color: var(--text-primary);
}

/* 애니메이션 효과 */
.stock-card {
  animation: fadeIn 0.5s var(--ease-fluid);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 반응형 디자인 */
@media (max-width: 992px) {
  .stock-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-2);
  }
}

@media (max-width: 480px) {
  .stock-container {
    padding: var(--space-2);
    min-height: 160px;
  }

  .stock-header h2 {
    font-size: 0.9rem;
  }

  .stock-cards { grid-template-columns: repeat(2, 1fr); }

  .stock-card {
    padding: var(--space-2);
    min-height: 70px;
  }

  .stock-name {
    font-size: 0.65rem;
  }

  .stock-price {
    font-size: 0.8rem;
  }

  .stock-change {
    font-size: 0.65rem;
  }
}
</style>
