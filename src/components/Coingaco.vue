<template>
  <div class="crypto-dashboard">
    <!-- 헤더 영역 -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="dashboard-title">🪙 Crypto Dashboard</h1>
          <p class="dashboard-subtitle">실시간 암호화폐 시세 및 차트 분석</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-label">총 코인</span>
            <span class="stat-value">{{ coinPrices.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">업데이트</span>
            <span class="stat-value">실시간</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 코인 그리드 -->
    <div class="coin-grid">
      <div
        v-for="coin in coinPrices"
        :key="coin.id"
        class="coin-card"
        @click="openCoinDetails(coin)"
      >
        <div class="coin-header">
          <div class="coin-avatar">
            <img :src="coin.image" :alt="coin.name" class="coin-image" />
          </div>
          <div class="coin-basic-info">
            <h3 class="coin-name">{{ coin.name }}</h3>
            <span class="coin-symbol">{{ coin.symbol?.toUpperCase() }}</span>
          </div>
          <div class="coin-rank">#{{ coin.market_cap_rank }}</div>
        </div>

        <div class="coin-price-section">
          <div class="current-price">
            ${{ coin.current_price.toLocaleString() }}
          </div>
          <div
            class="price-change"
            :class="getPriceChangeClass(coin.price_change_percentage_24h)"
          >
            {{ coin.price_change_percentage_24h > 0 ? '+' : '' }}{{ coin.price_change_percentage_24h?.toFixed(2) }}%
          </div>
        </div>

        <div class="coin-stats">
          <div class="stat-row">
            <span class="stat-label">시가총액</span>
            <span class="stat-value">${{ formatLargeNumber(coin.market_cap) }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">거래량</span>
            <span class="stat-value">${{ formatLargeNumber(coin.total_volume) }}</span>
          </div>
        </div>

        <div class="coin-actions">
          <button class="action-btn primary">상세보기</button>
        </div>
      </div>
    </div>

    <!-- 커스텀 팝업 -->
    <Teleport to="body">
      <div v-if="isPopupOpen" class="custom-popup-overlay" @click="closePopup">
      <div class="custom-popup-container" @click.stop>
        <!-- 팝업 헤더 -->
        <div class="popup-header">
          <div class="popup-coin-info">
            <img :src="selectedCoin?.image" :alt="selectedCoin?.name" class="popup-coin-image" />
            <div class="popup-coin-details">
              <h2 class="popup-coin-name">{{ selectedCoin?.name }}</h2>
              <span class="popup-coin-symbol">{{ selectedCoin?.symbol?.toUpperCase() }}</span>
              <div class="popup-coin-rank">#{{ selectedCoin?.market_cap_rank }} 순위</div>
            </div>
          </div>
          <button class="popup-close-btn" @click="closePopup">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- 팝업 바디 -->
        <div class="popup-body">
          <!-- 가격 정보 그리드 -->
          <div class="popup-price-grid">
            <div class="popup-price-card featured">
              <div class="popup-price-card-header">
                <span class="popup-price-label">현재 시세</span>
                <div
                  class="popup-price-change-badge"
                  :class="getPriceChangeClass(selectedCoin?.price_change_percentage_24h)"
                >
                  {{ selectedCoin?.price_change_percentage_24h > 0 ? '+' : '' }}{{ selectedCoin?.price_change_percentage_24h?.toFixed(2) }}%
                </div>
              </div>
              <div class="popup-price-value featured">${{ selectedCoin?.current_price.toLocaleString() }}</div>
            </div>

            <div class="popup-price-card">
              <span class="popup-price-label">시가총액</span>
              <div class="popup-price-value">${{ formatLargeNumber(selectedCoin?.market_cap) }}</div>
            </div>

            <div class="popup-price-card">
              <span class="popup-price-label">24시간 거래량</span>
              <div class="popup-price-value">${{ formatLargeNumber(selectedCoin?.total_volume) }}</div>
            </div>

            <div class="popup-price-card">
              <span class="popup-price-label">유통 공급량</span>
              <div class="popup-price-value">{{ formatLargeNumber(selectedCoin?.circulating_supply) }}</div>
              <div class="popup-price-symbol">{{ selectedCoin?.symbol?.toUpperCase() }}</div>
            </div>
          </div>

          <!-- 상세 정보 -->
          <div class="popup-details-section">
            <h3 class="popup-section-title">상세 정보</h3>
            <div class="popup-details-grid">
              <div class="popup-detail-item">
                <span class="popup-detail-label">24시간 최고가</span>
                <span class="popup-detail-value">${{ selectedCoin?.high_24h?.toLocaleString() }}</span>
              </div>
              <div class="popup-detail-item">
                <span class="popup-detail-label">24시간 최저가</span>
                <span class="popup-detail-value">${{ selectedCoin?.low_24h?.toLocaleString() }}</span>
              </div>
              <div class="popup-detail-item">
                <span class="popup-detail-label">전체 공급량</span>
                <span class="popup-detail-value">{{ selectedCoin?.total_supply ? formatLargeNumber(selectedCoin.total_supply) : 'N/A' }}</span>
              </div>
              <div class="popup-detail-item">
                <span class="popup-detail-label">최대 공급량</span>
                <span class="popup-detail-value">{{ selectedCoin?.max_supply ? formatLargeNumber(selectedCoin.max_supply) : 'N/A' }}</span>
              </div>
            </div>
          </div>

          <!-- 차트 섹션 -->
          <div class="popup-chart-section">
            <h3 class="popup-section-title">30일 가격 차트</h3>
            <div class="popup-chart-wrapper">
              <canvas ref="chartCanvas" class="popup-price-chart"></canvas>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import Chart from "chart.js/auto";

// 상태 정의
const coinPrices = ref([]);
const isPopupOpen = ref(false);
const selectedCoin = ref(null);
const chart = ref(null);
const chartCanvas = ref(null);
let intervalId;

// 코인 시세 가져오기
const fetchCoinPrices = async () => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 100,
          page: 1,
          sparkline: false,
        },
      }
    );
    coinPrices.value = response.data;
  } catch (error) {
    console.error("시세 정보를 가져오는 중 오류 발생:", error);
  }
};

// 코인 상세 정보 커스텀 팝업으로 열기
const openCoinDetails = async (coin) => {
  selectedCoin.value = coin;
  isPopupOpen.value = true;
  await fetchCoinChartData(coin.id);
};

// 팝업 닫기
const closePopup = () => {
  isPopupOpen.value = false;
  if (chart.value) {
    chart.value.destroy();
    chart.value = null;
  }
};

// 코인 차트 데이터 가져오기
const fetchCoinChartData = async (coinId) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
      {
        params: {
          vs_currency: "usd",
          days: 30,
          interval: "daily",
        },
      }
    );

    const prices = response.data.prices;
    const labels = prices.map((price) =>
      new Date(price[0]).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
    );
    const data = prices.map((price) => price[1]);

    // 차트 초기화 및 생성 (nextTick 사용)
    await new Promise(resolve => setTimeout(resolve, 100)); // DOM 업데이트 대기

    if (chart.value) {
      chart.value.destroy();
    }

    if (chartCanvas.value) {
      const ctx = chartCanvas.value.getContext("2d");
      chart.value = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "가격 (USD)",
              data,
              borderColor: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              fill: true,
              tension: 0.4,
              borderWidth: 3,
              pointBackgroundColor: "#10b981",
              pointBorderColor: "#ffffff",
              pointBorderWidth: 3,
              pointRadius: 5,
              pointHoverRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: "var(--text-secondary)", font: { size: 12 } },
            },
            y: {
              beginAtZero: false,
              grid: { color: "rgba(156, 163, 175, 0.3)", borderDash: [2, 2] },
              ticks: {
                color: "var(--text-secondary)",
                font: { size: 12 },
                callback: function(value) { return '$' + value.toLocaleString(); }
              },
            },
          },
        },
      });
    }
  } catch (error) {
    console.error("차트 데이터를 가져오는 중 오류 발생:", error);
  }
};


// 숫자 포맷팅 함수
const formatLargeNumber = (num) => {
  if (!num) return 'N/A';
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toLocaleString();
};

// 가격 변화 클래스 반환
const getPriceChangeClass = (change) => {
  if (change > 0) return 'positive';
  if (change < 0) return 'negative';
  return 'neutral';
};

// 컴포넌트가 마운트될 때 실행
onMounted(() => {
  fetchCoinPrices();
  intervalId = setInterval(fetchCoinPrices, 300000); // 5분마다 업데이트
});

// 컴포넌트가 언마운트될 때 실행
onUnmounted(() => {
  clearInterval(intervalId);
  if (chart.value) {
    chart.value.destroy();
  }
});
</script>

<style>
/* 전체 대시보드 */
.crypto-dashboard {
  background: var(--color-bg) !important;
  background-color: var(--color-bg) !important;
  min-height: 100vh;
  padding: var(--space-6);
}

/* 헤더 영역 */
.dashboard-header {
  background: var(--color-surface-1);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  margin-bottom: var(--space-6);
  backdrop-filter: var(--blur-md);
  box-shadow: var(--shadow-lg);
}

.header-content {
  padding: var(--space-6) var(--space-8);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info {
  flex: 1;
}

.dashboard-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 var(--space-2) 0;
  background: linear-gradient(135deg, var(--color-primary-solid), var(--color-secondary-solid));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dashboard-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
  opacity: 0.8;
}

.header-stats {
  display: flex;
  gap: var(--space-6);
}

.stat-item {
  text-align: center;
  background: var(--color-surface-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  min-width: 120px;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: var(--space-1);
}

.stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-accent-solid);
}

/* 코인 그리드 */
.coin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4);
  width: 100%;
  max-width: none;
}

.coin-card {
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  cursor: pointer;
  transition: all var(--ease-fluid) 0.3s;
  backdrop-filter: var(--blur-md);
  box-shadow: var(--shadow-md);
  max-width: 400px;
}

.coin-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary-solid);
  box-shadow: var(--shadow-2xl), var(--shadow-glow);
}

.coin-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.coin-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--color-surface-2);
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.coin-image {
  width: 36px;
  height: 36px;
}

.coin-basic-info {
  flex: 1;
}

.coin-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-1) 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.coin-symbol {
  font-size: 0.9rem;
  color: var(--text-muted);
  background: var(--color-surface-3);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.coin-rank {
  background: var(--color-accent);
  color: var(--text-primary);
  font-size: 0.8rem;
  font-weight: 600;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-accent-solid);
}

.coin-price-section {
  margin-bottom: var(--space-4);
  text-align: center;
  padding: var(--space-4);
  background: var(--color-surface-2);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.current-price {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.price-change {
  font-size: 1rem;
  font-weight: 600;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
}

.price-change.positive {
  color: var(--color-success-solid);
  background: rgba(67, 233, 123, 0.1);
  border: 1px solid rgba(67, 233, 123, 0.3);
}

.price-change.negative {
  color: var(--color-warning-solid);
  background: rgba(250, 112, 154, 0.1);
  border: 1px solid rgba(250, 112, 154, 0.3);
}

.price-change.neutral {
  color: var(--text-secondary);
  background: var(--color-surface-3);
  border: 1px solid var(--color-border);
}

.coin-stats {
  margin-bottom: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2);
  background: var(--color-surface-2);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.stat-row .stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.stat-row .stat-value {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 0.9rem;
}

.coin-actions {
  text-align: center;
}

.action-btn {
  background: var(--color-primary);
  color: var(--text-primary);
  border: 1px solid var(--color-primary-solid);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-6);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--ease-fluid) 0.3s;
  width: 100%;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* 커스텀 팝업 스타일 */
.custom-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85) !important;
  backdrop-filter: blur(8px) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-6);
  overflow: hidden;
}

.custom-popup-container {
  background: var(--color-surface-1) !important;
  background-color: var(--color-surface-1) !important;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  width: 90vw;
  max-width: 1300px;
  height: 90vh;
  max-height: 900px;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-2xl);
  backdrop-filter: var(--blur-lg);
  overflow: hidden;
  position: relative;
}

.popup-header {
  padding: var(--space-6);
  background: linear-gradient(135deg, var(--color-surface-2), var(--color-surface-3)) !important;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.popup-coin-info {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.popup-coin-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid var(--color-primary-solid);
  background: var(--color-surface-1);
}

.popup-coin-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.popup-coin-name {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.popup-coin-symbol {
  font-size: 1rem;
  color: var(--text-secondary);
  background: var(--color-surface-3);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  align-self: flex-start;
}

.popup-coin-rank {
  font-size: 0.9rem;
  color: var(--color-accent-solid);
  font-weight: 600;
}

.popup-close-btn {
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all var(--ease-fluid) 0.3s;
}

.popup-close-btn:hover {
  background: var(--color-warning);
  color: var(--text-primary);
  transform: scale(1.1);
  border-color: var(--color-warning-solid);
}

.popup-body {
  flex: 1;
  padding: var(--space-6);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  background: var(--color-surface-1) !important;
  background-color: var(--color-surface-1) !important;
}

.popup-price-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-4);
  flex-shrink: 0;
}

.popup-price-card {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  text-align: center;
  transition: all var(--ease-fluid) 0.3s;
}

.popup-price-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary-solid);
}

.popup-price-card.featured {
  background: var(--color-primary);
  color: var(--text-primary);
  border-color: var(--color-primary-solid);
  grid-column: span 2;
}

.popup-price-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.popup-price-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.popup-price-card.featured .popup-price-label {
  color: rgba(255, 255, 255, 0.9);
}

.popup-price-change-badge {
  font-size: 0.8rem;
  font-weight: 600;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
}

.popup-price-change-badge.positive {
  color: var(--color-success-solid);
  background: rgba(67, 233, 123, 0.2);
}

.popup-price-change-badge.negative {
  color: var(--color-warning-solid);
  background: rgba(250, 112, 154, 0.2);
}

.popup-price-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.popup-price-value.featured {
  font-size: 2rem;
  color: white;
}

.popup-price-symbol {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: var(--space-1);
}

.popup-details-section {
  flex-shrink: 0;
}

.popup-section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--space-4) 0;
  background: var(--color-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.popup-details-grid {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-3);
}

.popup-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-divider);
}

.popup-detail-item:last-child {
  border-bottom: none;
}

.popup-detail-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.popup-detail-value {
  color: var(--text-primary);
  font-weight: 600;
}

.popup-chart-section {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.popup-chart-wrapper {
  flex: 1;
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-top: var(--space-4);
  min-height: 300px;
}

.popup-price-chart {
  width: 100% !important;
  height: 100% !important;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .crypto-dashboard {
    padding: var(--space-4);
  }

  .coin-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--space-3);
  }

  .coin-card {
    max-width: 350px;
  }

  .dashboard-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .crypto-dashboard {
    padding: var(--space-3);
  }

  .header-content {
    flex-direction: column;
    gap: var(--space-4);
    align-items: stretch;
    padding: var(--space-4);
  }

  .dashboard-title {
    font-size: 1.8rem;
    text-align: center;
  }

  .dashboard-subtitle {
    font-size: 1rem;
    text-align: center;
  }

  .header-stats {
    justify-content: center;
    flex-wrap: wrap;
  }

  .stat-item {
    min-width: 100px;
    flex: 1;
  }

  .coin-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-3);
  }

  .coin-card {
    max-width: none;
    padding: var(--space-4);
  }

  .coin-header {
    margin-bottom: var(--space-3);
  }

  .coin-avatar {
    width: 45px;
    height: 45px;
  }

  .coin-image {
    width: 32px;
    height: 32px;
  }

  .coin-name {
    font-size: 1rem;
    max-width: 140px;
  }

  .current-price {
    font-size: 1.6rem;
  }

  .price-change {
    font-size: 0.9rem;
    padding: var(--space-1) var(--space-2);
  }

  .action-btn {
    padding: var(--space-2) var(--space-4);
    font-size: 0.9rem;
    min-height: 44px;
    touch-action: manipulation;
  }

  /* 팝업 모바일 최적화 */
  .custom-popup-overlay {
    padding: var(--space-2);
    align-items: flex-end;
  }

  .custom-popup-container {
    width: 100vw;
    height: 95vh;
    max-width: none;
    max-height: none;
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    animation: slideUpMobile 0.3s ease-out;
  }

  .popup-header {
    padding: var(--space-4);
    flex-wrap: wrap;
    gap: var(--space-3);
  }

  .popup-coin-info {
    flex: 1;
    min-width: 200px;
  }

  .popup-coin-name {
    font-size: 1.4rem;
  }

  .popup-close-btn {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
  }

  .popup-body {
    padding: var(--space-4);
    gap: var(--space-4);
  }

  .popup-price-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  .popup-price-card {
    padding: var(--space-3);
  }

  .popup-price-card.featured {
    grid-column: span 1;
  }

  .popup-price-value.featured {
    font-size: 1.8rem;
  }

  .popup-details-grid {
    grid-template-columns: 1fr;
    padding: var(--space-3);
    gap: var(--space-2);
  }

  .popup-detail-item {
    padding: var(--space-2) 0;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-1);
  }

  .popup-chart-wrapper {
    min-height: 250px;
    padding: var(--space-3);
  }

  .popup-section-title {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .crypto-dashboard {
    padding: var(--space-2);
  }

  .header-content {
    padding: var(--space-3);
  }

  .dashboard-title {
    font-size: 1.6rem;
  }

  .dashboard-subtitle {
    font-size: 0.9rem;
  }

  .coin-grid {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }

  .coin-card {
    padding: var(--space-3);
  }

  .coin-name {
    max-width: 120px;
    font-size: 0.95rem;
  }

  .current-price {
    font-size: 1.4rem;
  }

  .price-change {
    font-size: 0.85rem;
  }

  .stat-row .stat-label,
  .stat-row .stat-value {
    font-size: 0.8rem;
  }

  .custom-popup-container {
    height: 98vh;
  }

  .popup-header {
    padding: var(--space-3);
  }

  .popup-coin-name {
    font-size: 1.2rem;
  }

  .popup-body {
    padding: var(--space-3);
  }

  .popup-price-card {
    padding: var(--space-2);
  }

  .popup-price-value.featured {
    font-size: 1.6rem;
  }

  .popup-chart-wrapper {
    min-height: 200px;
  }
}

/* 모바일 팝업 애니메이션 */
@keyframes slideUpMobile {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 터치 피드백 */
@media (hover: none) and (pointer: coarse) {
  .coin-card:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }

  .action-btn:active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }

  .popup-close-btn:active {
    transform: scale(0.9);
  }
}

/* 성능 최적화 */
@media (max-width: 768px) {
  .coin-card,
  .custom-popup-container {
    will-change: transform;
  }

  /* 애니메이션 간소화 */
  .coin-card:hover {
    transform: none;
  }

  .coin-card {
    transition: none;
  }
}

/* 접근성 개선 */
.coin-card:focus {
  outline: 2px solid var(--color-primary-solid);
  outline-offset: 2px;
}

.action-btn:focus {
  outline: 2px solid var(--color-accent-solid);
  outline-offset: 2px;
}

/* 가로 모드 대응 */
@media (max-width: 768px) and (orientation: landscape) {
  .custom-popup-container {
    height: 90vh;
  }

  .popup-chart-wrapper {
    min-height: 180px;
  }
}
</style>