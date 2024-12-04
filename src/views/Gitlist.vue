<template>
  <div class="Gitlist">
    <img class="imgbono" src="/보노보노.png" alt="보노보노">
    <h1>준비중</h1>
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
</style>
