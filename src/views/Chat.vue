<template>
  <div class="homemain">

    <div class="block">
      <HWHChat></HWHChat>
    </div>

  </div>
</template>

<script>
</script>

<style scoped> 
.Gitlist {
    display: flex;  /* 부모 요소에 flex 설정 */
    flex-direction: row; /* 자식 요소들을 가로로 정렬 */
    align-items: center; /* 세로 가운데 정렬 */
    gap: 380px; /* 이미지와 텍스트 사이에 간격 추가 */
    color: #ffcc00;
    font-size: 100px;
}

.imgbono { 
  
    width: 600px;
    height: 600px;
}


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
