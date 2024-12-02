<template>
  <div class="homemain">
    <div class="block">
      <hwhtime></hwhtime>
    </div>
    <div class="block">
      <GlobalIndices></GlobalIndices>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeMain",
};
</script>


<style scoped>
.homemain {
  display: flex; /* 블럭들을 가로로 배치하려면 flex 사용 */
  flex-direction: column; /* 세로 정렬 */
  gap: 20px; /* 블럭 간 간격 */
  padding: 20px;
}

.block {
  background-color: #1f1f1f; /* 각 블럭의 배경 색 */
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* 각 블럭별 음영 */
}
</style>

