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

// 🌐 실제 주식 시세 API 설정
// Finnhub API (무료, 안정적)
const FINNHUB_API_KEY = "d4si5lhr01qvsjbhtb20d4si5lhr01qvsjbhtb2g";
const FINNHUB_BASE = "https://finnhub.io/api/v1/quote";

// 주요 지수 추종 ETF 심볼 (실제 지수와 높은 상관관계)
const INDEX_SYMBOLS = {
  NASDAQ: "QQQ",        // Nasdaq-100 추종 ETF
  DOW: "DIA",           // Dow Jones 추종 ETF
  SP500: "SPY",         // S&P 500 추종 ETF
  KOSPI: "EWY",         // 한국 시장 ETF
  NIKKEI225: "EWJ",     // 일본 시장 ETF
  HANGSENG: "EWH",      // 홍콩 시장 ETF
  FTSE100: "EWU",       // 영국 시장 ETF
  DAX: "EWG",           // 독일 시장 ETF
};

// 초기 상태
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
const MAX_RETRIES = 2;

// 🚀 실제 주식 데이터 가져오기 (Finnhub API)
const fetchStockIndices = async (retry = 0) => {
  if (retry === 0) {
    loading.value = true;
    error.value = "";
  }

  try {
    console.time('⏱️ fetchStockIndices');
    console.log('📡 주식 지수 데이터 요청... (Finnhub API)');
    
    // 모든 ETF를 병렬로 요청
    const promises = Object.entries(INDEX_SYMBOLS).map(async ([name, symbol]) => {
      try {
        const apiUrl = `${FINNHUB_BASE}?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
        const response = await axios.get(apiUrl, { timeout: 8000 });
        
        const data = response.data;
        
        // Finnhub 응답: { c: 현재가, pc: 전일종가 }
        if (data.c && data.pc) {
          const currentPrice = data.c;
          const previousClose = data.pc;
          const changePercent = ((currentPrice - previousClose) / previousClose) * 100;

          return {
            name,
            price: currentPrice.toFixed(2),
            change: parseFloat(changePercent.toFixed(2)),
          };
        }
        return null;
      } catch (err) {
        console.error(`❌ ${name} 로드 실패:`, err.message);
        return null;
      }
    });

    const results = await Promise.allSettled(promises);
    const updatedIndices = {};
    let successCount = 0;

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        const { name, price, change } = result.value;
        updatedIndices[name] = { price, change };
        successCount++;
      }
    });
    
    if (successCount > 0) {
      indices.value = { ...indices.value, ...updatedIndices };
      lastUpdated.value = new Date();
      retryCount.value = 0;
      error.value = "";
      
      console.log(`✅ 주식 데이터 로드 완료 (${successCount}/8개 지수)`);
      console.timeEnd('⏱️ fetchStockIndices');
    } else {
      throw new Error("모든 지수 데이터 로드 실패");
    }
    
  } catch (err) {
    console.error("❌ 주식 API 호출 오류:", err.message);
    
    // 재시도 로직
    if (retry < MAX_RETRIES) {
      const retryDelay = 2000 * (retry + 1); // 2초, 4초
      console.log(`⏳ ${retryDelay}ms 후 재시도... (${retry + 1}/${MAX_RETRIES})`);
      setTimeout(() => fetchStockIndices(retry + 1), retryDelay);
      return;
    }
    
    // 모든 재시도 실패 시 에러 메시지
    error.value = "실시간 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
    retryCount.value = retry;

    // 폴백 데이터 (2025년 12월 기준 대략적인 값)
    indices.value = {
      NASDAQ: { price: "19735.12", change: 0.28 },
      DOW: { price: "43910.98", change: -0.15 },
      SP500: { price: "6051.09", change: 0.42 },
      KOSPI: { price: "2417.84", change: -0.65 },
      NIKKEI225: { price: "39081.25", change: 0.15 },
      HANGSENG: { price: "20426.34", change: -0.42 },
      FTSE100: { price: "8253.68", change: 0.08 },
      DAX: { price: "20426.27", change: 0.22 },
    };
    
  } finally {
    if (retry === 0 || retry >= MAX_RETRIES) {
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
@media (max-width: 1200px) {
  .stock-cards {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-3);
  }

  .index-value {
    font-size: 1.4rem;
  }

  .change-percent {
    font-size: 0.9rem;
  }
}

@media (max-width: 992px) {
  .stock-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
  }

  .stock-card {
    min-height: 100px;
  }

  .index-title {
    font-size: 0.95rem;
  }

  .index-value {
    font-size: 1.3rem;
    flex-direction: column;
    gap: var(--space-1);
    text-align: center;
  }

  .change-percent {
    font-size: 0.85rem;
  }
}

@media (max-width: 768px) {
  .stock-container {
    padding: var(--space-3);
  }

  .stock-header {
    margin-bottom: var(--space-3);
  }

  .stock-header h2 {
    font-size: 1rem;
  }

  .refresh-btn {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .stock-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-2);
  }

  .stock-card {
    padding: var(--space-3);
    min-height: 90px;
  }

  .index-title {
    font-size: 0.9rem;
    margin-bottom: var(--space-1);
  }

  .index-value {
    font-size: 1.2rem;
  }

  .change-percent {
    font-size: 0.8rem;
    padding: 2px var(--space-1);
  }

  .last-updated {
    font-size: 0.7rem;
    margin-top: var(--space-2);
  }
}

@media (max-width: 480px) {
  .stock-container {
    padding: var(--space-2);
    min-height: 140px;
  }

  .stock-header {
    margin-bottom: var(--space-2);
  }

  .stock-header h2 {
    font-size: 0.9rem;
  }

  .refresh-btn {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .stock-cards {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2);
  }

  .stock-card {
    padding: var(--space-2);
    min-height: 80px;
  }

  .index-title {
    font-size: 0.8rem;
    margin-bottom: var(--space-1);
  }

  .index-value {
    font-size: 1rem;
    gap: var(--space-1);
  }

  .change-percent {
    font-size: 0.7rem;
    padding: 1px var(--space-1);
  }

  .change-arrow {
    font-size: 0.65rem;
  }

  .last-updated {
    font-size: 0.65rem;
    margin-top: var(--space-1);
  }

  .error-message {
    font-size: 0.85rem;
    margin-top: var(--space-3);
  }

  .retry-btn {
    font-size: 0.8rem;
    padding: var(--space-1) var(--space-3);
  }
}

/* 터치 최적화 */
@media (hover: none) and (pointer: coarse) {
  .stock-card {
    transition: none;
  }

  .refresh-btn:active,
  .retry-btn:active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }
}

/* 접근성 개선 */
.refresh-btn:focus,
.retry-btn:focus {
  outline: 2px solid var(--color-accent-solid);
  outline-offset: 2px;
}

/* 성능 최적화 */
@media (max-width: 768px) {
  .stock-card {
    will-change: auto;
  }

  .refresh-icon.spinning {
    animation-duration: 1.5s;
  }
}
</style>
