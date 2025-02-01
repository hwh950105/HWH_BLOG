<template>
  <div class="stock-container">
    <!-- 헤더 -->
    <header class="stock-header">
      <h2>📊 주요 지수</h2>
    </header>

    <!-- 주요 지수 카드 -->
    <div v-if="loading" class="loading">데이터를 불러오는 중...</div>
    <div v-else class="stock-cards">
      <el-card
        v-for="(value, key) in indices"
        :key="key"
        class="stock-card"
        shadow="hover"
      >
        <div class="index-title">{{ key }}</div>
        <div class="index-value" :class="{ 'up': value.change > 0, 'down': value.change < 0 }">
          {{ value.price }} ({{ value.change.toFixed(2) }}%)
        </div>
      </el-card>
    </div>

    <!-- 에러 메시지 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const indices = ref({
  NASDAQ: { price: "Loading...", change: 0 },
  DOW: { price: "Loading...", change: 0 },
});
const loading = ref(true);
const error = ref("");

// API 호출 함수
const fetchStockIndices = async () => {
  try {
    const nasdaqResponse = await axios.get("http://localhost:3000/api/nasdaq");
    const dowResponse = await axios.get("http://localhost:3000/api/dow");

    const nasdaqData = nasdaqResponse.data.chart.result[0].meta;
    const dowData = dowResponse.data.chart.result[0].meta;

    indices.value.NASDAQ = {
      price: nasdaqData.regularMarketPrice.toFixed(2),
      change: ((nasdaqData.regularMarketPrice - nasdaqData.previousClose) / nasdaqData.previousClose) * 100,
    };
    indices.value.DOW = {
      price: dowData.regularMarketPrice.toFixed(2),
      change: ((dowData.regularMarketPrice - dowData.previousClose) / dowData.previousClose) * 100,
    };
  } catch (err) {
    console.error("Error fetching data:", err.message);
    error.value = "데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해 주세요.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchStockIndices();
});
</script>

<style scoped>
.stock-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #2d3748;
  color: #f7fafc;
  border-radius: 12px;
}

.stock-header {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #90cdf4;
}

.error-message {
  text-align: center;
  color: #e53e3e;
  font-size: 1.2rem;
  margin-top: 20px;
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
}

.index-title {
  font-weight: bold;
  margin-bottom: 8px;
}

.index-value {
  font-size: 1.5rem;
  font-weight: bold;
}

/* 상승: 파란색 */
.index-value.up {
  color: #48bb78;
}

/* 하락: 빨간색 */
.index-value.down {
  color: #f56565;
}
</style>
