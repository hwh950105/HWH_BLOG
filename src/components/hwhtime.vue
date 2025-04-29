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
    <div class="progress-bar">
      <div
        class="progress"
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
      backgroundColor: "#1e1e2f",
      textColor: "#ffffff",
      progressBarColor: "#ffcc00",
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  transition: background 0.5s ease, color 0.5s ease;
}

.status {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.progress-bar {
  width: 80%;
  height: 30px;
  background-color: #333;
  border-radius: 15px;
  margin-top: 20px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #ffcc00;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #000;
  position: relative;
  transition: width 1s ease; /* 애니메이션 추가 */
}

.progress-percent {
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  font-size: 1rem;
  color: #141414;
  top: 50%;
  z-index: 1; /* 진행 바보다 위에 위치하도록 설정 */
}
</style>
