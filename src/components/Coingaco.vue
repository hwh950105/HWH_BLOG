<template>
  <el-container class="coin-price-container">
    <el-row :gutter="20">
      <el-col
        v-for="coin in coinPrices"
        :key="coin.id"
        :span="6"
        class="coin-card-col"
      >
        <el-card
          class="coin-card"
          shadow="hover"
          @click="openCoinDetails(coin)"
        >
          <div class="coin-card-content">
            <el-image
              :src="coin.image"
              fit="contain"
              class="coin-image"
              alt="Coin Image"
            />
            <div class="coin-info">
              <h3 class="coin-name">{{ coin.name }}</h3>
              <p class="coin-price">
                현재 시세: {{ coin.current_price.toLocaleString() }} USD
              </p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 팝업 창 -->
    <el-dialog
      v-model="isDialogOpen"
      width="600px"
      :append-to-body="true"
      title="코인 정보"
    >
      <div v-if="selectedCoin">
        <el-image
          :src="selectedCoin.image"
          fit="contain"
          class="popup-coin-image"
        />
        <p>코인 이름: {{ selectedCoin.name }}</p>
        <p>심볼: {{ selectedCoin.symbol.toUpperCase() }}</p>
        <p>현재 시세: {{ selectedCoin.current_price.toLocaleString() }} USD</p>
        <p>시가 총액: {{ selectedCoin.market_cap.toLocaleString() }} USD</p>
        <p>24시간 거래량: {{ selectedCoin.total_volume.toLocaleString() }} USD</p>

        <!-- 차트 영역 -->
        <div class="chart-container">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDialogOpen = false">닫기</el-button>
      </div>
    </el-dialog>

  </el-container>

</template>


<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import Chart from "chart.js/auto";

// 상태 정의
const coinPrices = ref([]);
const isDialogOpen = ref(false);
const selectedCoin = ref(null);
const chart = ref(null);
const loading = ref(true); // 로딩 상태 추가
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

// 코인 상세 정보 열기
const openCoinDetails = async (coin) => {
  selectedCoin.value = coin;
  isDialogOpen.value = true;
  await fetchCoinChartData(coin.id);
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
      new Date(price[0]).toLocaleDateString()
    );
    const data = prices.map((price) => price[1]);

    // 차트 초기화 및 생성
    if (chart.value) {
      chart.value.destroy();
    }

    const ctx =
      document.querySelector(".chart-container canvas").getContext("2d");
    chart.value = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "일봉 시세 (USD)",
            data,
            borderColor: "#ffcc00",
            backgroundColor: "rgba(255, 204, 0, 0.2)",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: false,
            grid: {
              color: "#444",
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("차트 데이터를 가져오는 중 오류 발생:", error);
  }
};

// 페이지 초기화 함수
const initializePage = async () => {
  try {
    await fetchCoinPrices(); // 코인 데이터 가져오기
  } finally {
    loading.value = false; // 모든 작업이 끝난 후 로딩 상태 종료
  }
};

// 컴포넌트가 마운트될 때 실행
onMounted(() => {
  initializePage();
  intervalId = setInterval(fetchCoinPrices, 600000);
});

// 컴포넌트가 언마운트될 때 실행
onUnmounted(() => {
  clearInterval(intervalId);
  if (chart.value) {
    chart.value.destroy();
  }
});
</script>



<style scoped>
/* 전체 레이아웃 */
.coin-price-container {
  padding: 15px;
  background-color: #141414;
  color: #ffffff;
}

/* 카드 스타일 */
.coin-card {
  cursor: pointer;
  background-color: #1f1f1f;
  color: #ffffff;
  transition: all 0.3s ease;
  border: 1px solid #333;
  margin-bottom: 10px;
}

.coin-card:hover {
  transform: translateY(-4px);
  border-color: #ffcc00;
}

.coin-card-content {
  display: flex;
  

}

.coin-image {
  width: 50px;
  height: 50px;
}

.coin-info {
  margin-left: 20px;
}

.coin-name {
  font-size: 1.2em;
  color: #ffcc00;
  white-space: nowrap; /* 한 줄로 표시 */
  overflow: hidden;    /* 넘친 텍스트 숨김 */
  text-overflow: ellipsis; /* 말줄임표 추가 */
  max-width: 200px;    /* 최대 너비 설정 */
}

.coin-price {
  font-size: 0.9em;
  color: #27ae60;
}

/* 팝업 스타일 */
.popup-coin-image {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
  border-radius: 10px;
}

.chart-container {
  width: 100%;
  height: 300px;
  position: relative;
  background-color: #1f1f1f;
  border: 1px solid #333;
  margin-top: 20px;
}

.dialog-footer {
  margin-top: 10px;
  text-align: right;
}

.el-button {
  background-color: #ffcc00;
  color: #141414;
}

.el-button:hover {
  background-color: #ffd633;
}
</style>
