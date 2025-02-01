<template>
  <div class="homemain">
    <div class="block">
      <hwhtime></hwhtime>
    </div>
    <div class="block global-indices">
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
.global-indices {
  display: flex;
  justify-content: flex-start; /* 왼쪽 정렬 */
  align-items: flex-start; /* 수직 정렬 */
  width: 100%;
}

.global-indices * {
  margin: 8px; /* 내부 요소의 여백 제거 */
  padding: 0;
  text-align: left; /* 모든 자식 요소를 왼쪽 정렬 */
}

.homemain {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  align-items: flex-start;
}

.block {
  background-color: #1f1f1f;
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  width: 100%;
}

/* GlobalIndices 컴포넌트의 내부 요소 강제 스타일 적용 */
::v-deep(.stock-card) {
  text-align: left; /* 내부 카드 왼쪽 정렬 */
}

::v-deep(.index-title),
::v-deep(.index-value) {
  text-align: left; /* 제목과 값 왼쪽 정렬 */
}

</style>

