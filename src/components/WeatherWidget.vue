<template>
  <div class="weather-widget">
    <div v-if="loading" class="loading">
      <el-skeleton animated />
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else class="weather-content">
      <div class="current-weather">
        <div class="location">
          <el-icon><Location /></el-icon>
          <span>{{ weatherData.name }}</span>
        </div>
        <div class="temperature">
          {{ Math.round(weatherData.main.temp) }}°C
        </div>
        <div class="description">
          {{ weatherData.weather[0].description }}
        </div>
      </div>
      
      <div class="weather-details">
        <div class="detail-item">
          <el-icon><WindPower /></el-icon>
          <span>{{ weatherData.wind.speed }} m/s</span>
        </div>
        <div class="detail-item">
          <el-icon><Drizzling /></el-icon>
          <span>{{ weatherData.main.humidity }}%</span>
        </div>
        <div class="detail-item">
          <el-icon><View /></el-icon>
          <span>{{ weatherData.visibility / 1000 }} km</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Location, WindPower, Drizzling, View } from '@element-plus/icons-vue';

const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // OpenWeatherMap API 키를 여기에 입력하세요
const weatherData = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchWeather = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // 기본값으로 서울의 날씨를 보여줍니다
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=Seoul&units=metric&appid=YOUR_OPENWEATHERMAP_API_KEY`
    );
    
    weatherData.value = response.data;
  } catch (err) {
    console.error('날씨 정보를 가져오는데 실패했습니다:', err);
    // 에러 발생 시 기본값 설정
    weatherData.value = {
      name: '서울',
      main: {
        temp: 20,
        humidity: 50
      },
      weather: [{
        description: '맑음'
      }],
      wind: {
        speed: 3
      },
      visibility: 10000
    };
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchWeather();
});
</script>

<style scoped>
.weather-widget {
  background: linear-gradient(145deg, #1a1a1a, #2d2d2d);
  border-radius: 12px;
  padding: 20px;
  color: #ffffff;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
}

.error {
  color: #ff4d4f;
  text-align: center;
  padding: 20px;
}

.weather-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.current-weather {
  text-align: center;
}

.location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.temperature {
  font-size: 3rem;
  font-weight: bold;
  color: #ffcc00;
  margin: 10px 0;
}

.description {
  text-transform: capitalize;
  color: #cccccc;
  font-size: 1.1rem;
}

.weather-details {
  display: flex;
  justify-content: space-around;
  gap: 15px;
  padding-top: 15px;
  border-top: 1px solid #333;
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.detail-item .el-icon {
  font-size: 1.5rem;
  color: #ffcc00;
}

.detail-item span {
  font-size: 0.9rem;
  color: #cccccc;
}
</style> 