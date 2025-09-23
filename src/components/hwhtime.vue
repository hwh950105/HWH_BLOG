<template>
  <div
    class="work-timer"
    :style="{
      background: backgroundColor,
      color: textColor,
      width: width,
      height: height
    }"
  >
    <!-- 상태 메시지 -->
    <div class="status">
      <div v-if="isWeekend">{{ timeUntilWork }} 후 출근 </div>
      <div v-else>
        <div v-if="beforeWork">{{ timeUntilWork }} 후 출근</div>
        <div v-else-if="afterWork">{{ timeUntilWork }} 후 출근</div>
        <div v-else>{{ timeUntilOffWork }}</div>
      </div>
    </div>

    <!-- 진행 바 -->
    <div class="progress-container">
      <div
        class="progress-bar"
        :style="{ width: progressWidth, backgroundColor: progressBarColor }"
      >
        <span class="progress-percent">{{ progressPercent }}%</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WorkTimer",
  props: {
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "auto",
    },
  },
  data() {
    return {
      currentDate: "",
      currentTime: "",
      timeUntilWork: "",
      timeUntilOffWork: "",
      progressWidth: "0%",
      progressPercent: 0,
      backgroundColor: "var(--color-surface-1)",
      textColor: "var(--text-primary)",
      progressBarColor: "var(--color-primary-solid)",
      beforeWork: true,
      afterWork: false,
      isWeekend: false,
    };
  },
  methods: {
    updateTime() {
      const now = new Date();
      const day = now.getDay();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      this.currentDate = now.toLocaleDateString();
      this.currentTime = now.toLocaleTimeString();
      this.isWeekend = day === 0 || day === 6;

      const workStartTime = 9 * 3600; // 9:00 AM in seconds
      const workEndTime = 18 * 3600; // 6:00 PM in seconds
      const currentTimeInSeconds = hours * 3600 + minutes * 60 + seconds;

      if (this.isWeekend) {
        // 월요일 9시까지 남은 시간 계산
        const mondayStartTime = this.calculateMondayStart(now);
        const remainingTime = Math.floor((mondayStartTime - now.getTime()) / 1000);
        this.timeUntilWork = this.formatTime(remainingTime);

        // 주말 진행 바 계산
        const totalWeekendTime = this.calculateWeekendDuration(now);
        const elapsedTime = totalWeekendTime - remainingTime;
        const progress = (elapsedTime / totalWeekendTime) * 100;
        this.progressWidth = `${progress}%`;
        this.progressPercent = Math.floor(progress);
      } else {
        // 월~목요일 평일 로직
        if (currentTimeInSeconds >= workStartTime && currentTimeInSeconds < workEndTime) {
          this.beforeWork = false;
          this.afterWork = false;
          const remainingTime = workEndTime - currentTimeInSeconds;
          this.timeUntilOffWork = "퇴근까지 " + this.formatTime(remainingTime);

          // 퇴근 진행 바 계산
          const totalWorkTime = workEndTime - workStartTime;
          const progress = ((currentTimeInSeconds - workStartTime) / totalWorkTime) * 100;
          this.progressWidth = `${progress}%`;
          this.progressPercent = Math.floor(progress);
        } else if (currentTimeInSeconds >= workEndTime) {
          // 18시 이후, 다음날 9시까지 남은 시간
          this.beforeWork = false;
          this.afterWork = true;
          const nextWorkStartTime = this.calculateNextWorkStart(now);
          const remainingTime = nextWorkStartTime - Math.floor(now.getTime() / 1000);
          this.timeUntilWork = this.formatTime(remainingTime);
          this.progressWidth = "0%";
          this.progressPercent = 0;
        } else if (currentTimeInSeconds < workStartTime) {
          // 9시 전
          this.beforeWork = true;
          this.afterWork = false;
          const remainingTime = workStartTime - currentTimeInSeconds;
          this.timeUntilWork = this.formatTime(remainingTime);
          this.progressWidth = "0%";
          this.progressPercent = 0;
        }
      }
    },

    // 월요일 9시까지 남은 시간 계산
    calculateMondayStart(currentDate) {
      const nextMonday = new Date(currentDate);
      nextMonday.setDate(currentDate.getDate() + (1 + 7 - currentDate.getDay()) % 7);
      nextMonday.setHours(9, 0, 0, 0);
      return nextMonday.getTime();
    },

    // 주말 시작부터 월요일 9시까지 남은 시간 계산
    calculateWeekendDuration(currentDate) {
      const weekendStartTime = new Date(currentDate);
      weekendStartTime.setHours(0, 0, 0, 0); // 토요일 00:00
      const mondayStartTime = this.calculateMondayStart(currentDate);
      return (mondayStartTime - weekendStartTime.getTime()) / 1000; // 총 주말 시간 (초 단위)
    },

    // 다음 근무 시작 시간 계산
    calculateNextWorkStart(now) {
      const nextWorkDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0, 0, 0);
      return Math.floor(nextWorkDay.getTime() / 1000);
    },

    // 시간을 hh:mm:ss 형식으로 변환
    formatTime(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    },
  },
  mounted() {
    // 초기 로딩 없이 바로 시간 업데이트
    this.updateTime();
    setInterval(() => this.updateTime(), 1000); // 1초마다 시간 업데이트
  },
};
</script>

<style scoped>
.work-timer {
  background: var(--color-surface-1);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  color: var(--text-primary);
  min-height: 200px;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  box-sizing: border-box;
  border: 1px solid var(--color-border);
  backdrop-filter: var(--blur-md);
  transition: all var(--ease-fluid) 0.3s;
  box-shadow: var(--shadow-md);
}

.status {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: var(--space-6);
  text-align: center;
  line-height: 1.2;
  background: var(--color-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
}

.progress-container {
  width: 100%;
  max-width: 350px;
  height: 12px;
  background: var(--color-surface-3);
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin: var(--space-4) 0;
  border: 1px solid var(--color-border);
  position: relative;
}

.progress-bar {
  height: 100%;
  background: var(--color-primary);
  transition: width var(--ease-fluid) 0.5s, background-color var(--ease-fluid) 0.3s;
  border-radius: var(--radius-sm);
  position: relative;
  overflow: hidden;
}

.progress-percent {
  font-size: 1rem;
  margin-top: var(--space-2);
  text-align: center;
  color: var(--text-secondary);
  font-weight: 500;
}

@media (max-width: 480px) {
  .work-timer {
    padding: var(--space-4);
    min-height: 180px;
  }

  .status {
    font-size: 1.8rem;
    margin-bottom: var(--space-4);
  }

  .progress-container {
    max-width: 300px;
    height: 10px;
    margin: var(--space-3) 0;
  }

  .progress-percent {
    font-size: 0.9rem;
    margin-top: var(--space-2);
  }
}
</style>
