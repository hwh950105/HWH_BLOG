<template>
  <div class="weather-widget">
    <div class="weather-header">
      <h2>🌤️ 날씨 정보</h2>
      <button @click="refreshWeather" class="refresh-btn" :disabled="loading">
        <span class="refresh-icon" :class="{ 'spinning': loading }">⟳</span>
      </button>
    </div>
    
    <div v-if="loading" class="loading">
      <el-skeleton animated :rows="3" />
    </div>
    
    <div v-else-if="error" class="error">
      <div class="error-message">{{ error }}</div>
      <button @click="refreshWeather" class="retry-btn">재시도</button>
    </div>
    
    <div v-else class="weather-content">
      <div class="current-weather">
        <div class="weather-icon">
          <img :src="`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`" 
               :alt="weatherData.weather[0].description" />
        </div>
        
        <div class="weather-info">
          <div class="location">
            <el-icon><Location /></el-icon>
            <span>{{ weatherData.name }}</span>
            <button @click="getCurrentLocation" class="location-btn" title="내 위치 찾기">
              <el-icon><Aim /></el-icon>
            </button>
          </div>
          
          <div class="temperature">
            {{ Math.round(weatherData.main.temp) }}°C
            <span class="feels-like">체감 {{ Math.round(weatherData.main.feels_like) }}°C</span>
          </div>
          
          <div class="description">
            {{ weatherData.weather[0].description }}
          </div>
        </div>
      </div>
      
      <div class="weather-details">
        <div class="detail-item">
          <el-icon><WindPower /></el-icon>
          <div class="detail-info">
            <span class="detail-label">풍속</span>
            <span class="detail-value">{{ weatherData.wind.speed }} m/s</span>
          </div>
        </div>
        
        <div class="detail-item">
          <el-icon><Drizzling /></el-icon>
          <div class="detail-info">
            <span class="detail-label">습도</span>
            <span class="detail-value">{{ weatherData.main.humidity }}%</span>
          </div>
        </div>
        
        <div class="detail-item">
          <el-icon><View /></el-icon>
          <div class="detail-info">
            <span class="detail-label">가시거리</span>
            <span class="detail-value">{{ (weatherData.visibility / 1000).toFixed(1) }} km</span>
          </div>
        </div>
      </div>
      
      <div class="last-updated">
        마지막 업데이트: {{ getFormattedTime() }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { Location, WindPower, Drizzling, View, Aim } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// 실제 API 키를 사용하거나 환경 변수에서 가져올 수 있습니다
const API_KEY = 'f94136044935a2713cccaa97ec14bdf8'; // 예시 키 (만료되거나 사용 제한이 있을 수 있음)
const weatherData = ref(null);
const loading = ref(true);
const error = ref(null);
const lastUpdated = ref(new Date());

// 날씨 정보 가져오기 (위치 기반)
const fetchWeather = async (lat = 37.5665, lon = 126.9780) => { // 서울 좌표 기본값
  try {
    loading.value = true;
    error.value = null;
    
    // 실제 API 호출
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=kr`,
      { timeout: 5000 } // 5초 타임아웃 설정
    );
    
    weatherData.value = response.data;
    lastUpdated.value = new Date();
    
  } catch (err) {
    console.error('날씨 정보를 가져오는데 실패했습니다:', err);
    error.value = '날씨 정보를 불러올 수 없습니다. 다시 시도해주세요.';
    
    // API 호출 실패 시 대체 데이터 제공
    if (!weatherData.value) {
      weatherData.value = {
        name: '서울',
        main: {
          temp: 22,
          feels_like: 20,
          humidity: 60
        },
        weather: [{
          description: '맑음',
          icon: '01d'
        }],
        wind: {
          speed: 2.5
        },
        visibility: 10000
      };
    }
  } finally {
    loading.value = false;
  }
};

// 내 위치 가져오기
const getCurrentLocation = () => {
  if (navigator.geolocation) {
    loading.value = true;
    navigator.geolocation.getCurrentPosition(
      // 성공 시
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);
        ElMessage({
          message: '현재 위치의 날씨를 불러옵니다',
          type: 'success',
          duration: 2000
        });
      },
      // 실패 시
      (error) => {
        console.error('위치 정보를 가져올 수 없습니다:', error);
        ElMessage.error('위치 정보를 가져올 수 없습니다. 기본 위치(서울)의 날씨를 표시합니다.');
        fetchWeather(); // 기본 위치 사용
      },
      { timeout: 5000, maximumAge: 60000 } // 5초 타임아웃, 1분 캐시
    );
  } else {
    ElMessage.error('이 브라우저에서는 위치 정보를 지원하지 않습니다.');
    fetchWeather(); // 기본 위치 사용
  }
};

// 새로고침
const refreshWeather = () => {
  fetchWeather();
};

// 시간 포맷팅
const getFormattedTime = () => {
  const now = lastUpdated.value;
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

onMounted(() => {
  fetchWeather();
  
  // 15분마다 자동 새로고침
  const refreshInterval = setInterval(() => {
    fetchWeather();
  }, 900000);
  
  // 컴포넌트 언마운트 시 인터벌 제거
  onBeforeUnmount(() => {
    clearInterval(refreshInterval);
  });
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
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.weather-widget:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.weather-header h2 {
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

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
  height: 100%;
  justify-content: center;
}

.error-message {
  color: #ff4d4f;
  text-align: center;
  font-size: 1rem;
}

.retry-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background-color: #cf1322;
}

.weather-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeIn 0.5s ease;
}

.current-weather {
  display: flex;
  align-items: center;
  gap: 20px;
}

.weather-icon {
  flex-shrink: 0;
}

.weather-icon img {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 0 10px rgba(255, 204, 0, 0.3));
}

.weather-info {
  flex: 1;
}

.location {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.location-btn {
  background: transparent;
  border: none;
  color: #ffcc00;
  cursor: pointer;
  padding: 0;
  margin-left: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.location-btn:hover {
  transform: scale(1.2);
}

.temperature {
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffcc00;
  margin: 8px 0;
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.feels-like {
  font-size: 1rem;
  color: #cccccc;
  font-weight: normal;
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
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.detail-item .el-icon {
  font-size: 1.5rem;
  color: #ffcc00;
}

.detail-info {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.8rem;
  color: #aaa;
}

.detail-value {
  font-size: 1rem;
  color: #fff;
}

.last-updated {
  font-size: 0.8rem;
  color: #a0aec0;
  text-align: right;
  margin-top: 5px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .weather-widget {
    padding: 15px;
  }
  
  .current-weather {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  
  .weather-details {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .temperature {
    font-size: 2rem;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
  
  .location {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .weather-widget {
    padding: 12px;
  }
  
  .weather-header h2 {
    font-size: 1.2rem;
  }
  
  .temperature {
    font-size: 1.8rem;
  }
  
  .description {
    font-size: 1rem;
  }
}
</style> 