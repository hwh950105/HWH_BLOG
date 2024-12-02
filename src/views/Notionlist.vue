<template>
  <div class="blog-page-list">
    <el-row :gutter="20">
      <router-link
        v-for="post in list"
        :key="post.id"
        :to="`/Note/${post.id}`"
        custom
        v-slot="{ href, navigate }"
      >
        <el-col :span="24" class="blog-item-col">
          <el-card class="blog-item" shadow="hover" @click="navigate">
            <div class="blog-item-inner">
              <el-image
                v-if="post.file && post.file.length > 0"
                :src="post.file[0].url"
                fit="contain"
                class="post-image"
                alt="post Image"
              />
              <div class="blog-item-content">
                <div class="blog-title">{{ post.title }}</div>
                <div class="blog-contents">{{ post.contents }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </router-link>
    </el-row>

    <div class="my-loader" v-show="loading">
    <Loading />
   </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getPageTable } from "vue-notion";

const list = ref([]);
const loading = ref(true); // 로딩 상태 초기값 true

// 데이터 로드 함수
const fetchData = async () => {
  try {
    const value = await getPageTable("48373eeff05846bbb5ff00f4af92e8a8");
    list.value = value; // 데이터 설정
  } catch (error) {
    console.error("데이터를 가져오는 중 오류 발생:", error);
  } finally {
    loading.value = false; // 데이터 로드 완료 후 로딩 종료
  }
};

onMounted(() => {
  fetchData(); // 컴포넌트가 마운트될 때 데이터 로드
});
</script>



<style scoped>
.blog-page-list {
  width: 700px;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #2c2f38; /* 어두운 배경 */
  color: #ffffff; /* 텍스트 밝게 */
  border-radius: 8px;
  text-align: center;
}

.blog-item-col {
  padding: 5px;
}

.blog-item {
  display: flex; /* 플렉스 박스 활성화 */
  flex-direction: row; /* 가로 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  gap: 20px; /* 이미지와 텍스트 사이 간격 */
  background-color: #3a3f47; /* 카드 배경 어두운 색상 */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  width: 600px;
  cursor: pointer; /* 마우스 오버 시 포인터로 변경 */
  padding: 20px; /* 상하좌우 여백을 동일하게 */
  box-sizing: border-box; /* 패딩 포함 크기 계산 */
}

.blog-item-inner {
  display: flex; /* 플렉스 박스 활성화 */
  flex-direction: row; /* 자식 요소들을 가로로 정렬 */
  align-items: center; /* 세로 방향 중앙 정렬 */
  gap: 90px; /* 이미지와 텍스트 사이 간격 */
  width: 100%; /* 컨테이너 전체 너비 사용 */
}

.post-image {
  width: 200px;
  height: 200px;
  border-radius: 4px; /* 이미지를 약간 둥글게 */
  object-fit: cover; /* 이미지 크기 조정 */
}

.blog-item-content {
  display: flex;
  flex-direction: column; /* 텍스트를 세로로 정렬 */
  justify-content: center; /* 텍스트가 세로 방향으로 중앙 정렬되도록 */
  flex: 1; /* 오른쪽 콘텐츠가 남은 공간을 차지하도록 설정 */
  gap: 15px; /* 이미지와 텍스트 사이 간격 */
  align-items: flex-start; /* 텍스트를 왼쪽 정렬 */
}

.blog-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #ffcc00; /* 제목 색상 */
  margin: 0; /* 여백 제거 */
  padding: 0; /* 불필요한 패딩 제거 */
}

.blog-contents {
  font-size: 1.0em;
  color: #008cff79; /* 본문 색상 */
  margin: 0; /* 여백 제거 */
  padding: 0; /* 불필요한 패딩 제거 */
}

.blog-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}
</style>

