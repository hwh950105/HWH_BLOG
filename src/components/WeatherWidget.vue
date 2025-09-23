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
          <img :src="weatherData.weather[0].icon" 
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
            <span class="detail-value">{{ weatherData.wind.speed.toFixed(1) }} m/s</span>
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

const weatherData = ref(null);
const loading = ref(true);
const error = ref(null);
const lastUpdated = ref(new Date());

// 날씨 정보 가져오기 (위치 기반)
const fetchWeather = async (lat = 37.5665, lon = 126.9780) => { // 서울 좌표 기본값
  try {
    loading.value = true;
    error.value = null;
    
    // 무료 날씨 API 사용 (API 키 불필요)
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,weather_code,visibility&timezone=Asia%2FTokyo`,
      { timeout: 5000 }
    );
    
    // 응답 데이터를 기존 형식에 맞게 변환
    weatherData.value = {
      name: '현재 위치',
      main: {
        temp: response.data.current.temperature_2m,
        feels_like: response.data.current.apparent_temperature,
        humidity: response.data.current.relative_humidity_2m
      },
      weather: [{
        description: getWeatherDescription(response.data.current.weather_code),
        icon: getWeatherIcon(response.data.current.weather_code)
      }],
      wind: {
        speed: response.data.current.wind_speed_10m
      },
      visibility: response.data.current.visibility
    };
    
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

// 날씨 코드를 설명으로 변환
function getWeatherDescription(code) {
  const descriptions = {
    0: '맑음',
    1: '대체로 맑음',
    2: '부분적으로 흐림',
    3: '흐림',
    45: '안개',
    48: '서리 안개',
    51: '가벼운 이슬비',
    53: '중간 이슬비',
    55: '강한 이슬비',
    61: '가벼운 비',
    63: '중간 비',
    65: '강한 비',
    71: '가벼운 눈',
    73: '중간 눈',
    75: '강한 눈',
    77: '눈알갱이',
    80: '가벼운 소나기',
    81: '중간 소나기',
    82: '강한 소나기',
    85: '가벼운 눈보라',
    86: '강한 눈보라',
    95: '뇌우',
    96: '우박이 있는 뇌우',
    99: '강한 우박이 있는 뇌우'
  };
  return descriptions[code] || '알 수 없음';
}

// 날씨 코드를 아이콘으로 변환
function getWeatherIcon(code) {
  const icons = {
    0: 'https://openweathermap.org/img/wn/01d@2x.png',
    1: 'https://openweathermap.org/img/wn/02d@2x.png',
    2: 'https://openweathermap.org/img/wn/03d@2x.png',
    3: 'https://openweathermap.org/img/wn/04d@2x.png',
    45: 'https://openweathermap.org/img/wn/50d@2x.png',
    48: 'https://openweathermap.org/img/wn/50d@2x.png',
    51: 'https://openweathermap.org/img/wn/09d@2x.png',
    53: 'https://openweathermap.org/img/wn/09d@2x.png',
    55: 'https://openweathermap.org/img/wn/09d@2x.png',
    61: 'https://openweathermap.org/img/wn/10d@2x.png',
    63: 'https://openweathermap.org/img/wn/10d@2x.png',
    65: 'https://openweathermap.org/img/wn/10d@2x.png',
    71: 'https://openweathermap.org/img/wn/13d@2x.png',
    73: 'https://openweathermap.org/img/wn/13d@2x.png',
    75: 'https://openweathermap.org/img/wn/13d@2x.png',
    77: 'https://openweathermap.org/img/wn/13d@2x.png',
    80: 'https://openweathermap.org/img/wn/09d@2x.png',
    81: 'https://openweathermap.org/img/wn/09d@2x.png',
    82: 'https://openweathermap.org/img/wn/09d@2x.png',
    85: 'https://openweathermap.org/img/wn/13d@2x.png',
    86: 'https://openweathermap.org/img/wn/13d@2x.png',
    95: 'https://openweathermap.org/img/wn/11d@2x.png',
    96: 'https://openweathermap.org/img/wn/11d@2x.png',
    99: 'https://openweathermap.org/img/wn/11d@2x.png'
  };
  return icons[code] || 'https://openweathermap.org/img/wn/01d@2x.png';
}

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
  background: var(--color-surface-1);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  color: var(--text-primary);
  min-height: 250px;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  box-sizing: border-box;
  border: 1px solid var(--color-border);
  backdrop-filter: var(--blur-md);
  transition: all var(--ease-fluid) 0.3s;
}

.weather-widget:hover {
  box-shadow: var(--shadow-lg), var(--shadow-glow);
  transform: translateY(-2px);
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.weather-header h2 {
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
  color: var(--color-warning-solid);
  text-align: center;
  font-size: 1rem;
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

.weather-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  animation: fadeIn 0.5s var(--ease-fluid);
  height: 100%;
  flex: 1;
}

.current-weather {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.weather-icon {
  flex-shrink: 0;
}

.weather-icon img {
  width: 80px;
  height: 80px;
  filter: drop-shadow(0 0 15px rgba(102, 126, 234, 0.4));
  transition: transform var(--ease-bounce) 0.3s;
}

.weather-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.location {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.location-btn {
  background: transparent;
  border: none;
  color: var(--color-accent-solid);
  cursor: pointer;
  padding: var(--space-1);
  margin-left: var(--space-2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--ease-bounce) 0.3s;
  border-radius: var(--radius-sm);
}

.location-btn:hover {
  transform: scale(1.2);
  background: var(--color-surface-2);
}

.temperature {
  font-size: 1.8rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
}

.feels-like {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: normal;
}

.description {
  text-transform: capitalize;
  color: var(--text-secondary);
  font-size: 1.1rem;
  text-align: center;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
  width: 100%;
  margin-top: var(--space-4);
}

.detail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--color-surface-2);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  transition: all var(--ease-fluid) 0.3s;
}

.detail-item .el-icon {
  font-size: 1.4rem;
  color: var(--color-accent-solid);
  filter: drop-shadow(0 0 8px rgba(79, 172, 254, 0.3));
}

.detail-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.detail-label {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.detail-value {
  font-size: 0.95rem;
  font-weight: 500;
}

.last-updated {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: right;
  margin-top: var(--space-3);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 반응형 디자인 */
@media (max-width: 480px) {
  .weather-widget {
    padding: 12px;
    min-height: 220px;
  }

  .weather-header h2 {
    font-size: 0.9rem;
  }

  .weather-icon img {
    width: 70px;
    height: 70px;
  }

  .temperature {
    font-size: 1.6rem;
  }

  .weather-details {
    gap: 8px;
    margin-top: 12px;
  }

  .detail-item {
    padding: 6px;
  }

  .detail-label {
    font-size: 0.7rem;
  }

  .detail-value {
    font-size: 0.85rem;
  }
}
</style> 