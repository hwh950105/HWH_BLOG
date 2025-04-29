<template>
  <div class="homemain">
    <h1 class="page-title">대시보드</h1>
    <div class="dashboard-grid">
      <div class="block time-block">
        <hwhtime></hwhtime>
      </div>
      <div class="block global-indices">
        <GlobalIndices></GlobalIndices>
      </div>
      <div class="block weather-block">
        <WeatherWidget></WeatherWidget>
      </div>
    </div>
  </div>
</template>


<script setup>
import hwhtime from '@/components/hwhtime.vue';
import GlobalIndices from '@/components/GlobalIndices.vue';
import WeatherWidget from '@/components/WeatherWidget.vue';
</script>


<style scoped>
.homemain {
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 20px;
  align-items: flex-start;
  overflow: hidden;
  height: 100%;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffcc00;
  margin: 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #ffcc00;
  width: fit-content;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  width: 100%;
}

.block {
  background-color: #1f1f1f;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  width: 100%;
  overflow: hidden;
  min-height: 150px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.block:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.time-block {
  grid-column: 1 / 3;
}

.global-indices {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  overflow: hidden;
  min-height: 280px;
}

.global-indices * {
  margin: 0;
  padding: 0;
  text-align: left;
}

/* GlobalIndices 컴포넌트의 내부 요소 강제 스타일 적용 */
:deep(.stock-card) {
  text-align: left;
  min-height: 80px;
  margin-bottom: 15px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

:deep(.stock-card:hover) {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

:deep(.el-skeleton) {
  width: 100%;
  height: 80px;
}

:deep(.index-title),
:deep(.index-value) {
  text-align: left;
}

/* 애니메이션 효과 */
.dashboard-grid {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 반응형 디자인 */
@media (max-width: 992px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .time-block {
    grid-column: 1;
  }
}

@media (max-width: 768px) {
  .homemain {
    padding: 15px;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .block {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .homemain {
    gap: 15px;
  }
  
  .dashboard-grid {
    grid-gap: 15px;
  }
}
</style>

