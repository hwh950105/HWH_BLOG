<template>
  <div>
    <!-- Blog Title Section -->
    <div class="blog-title">
      <el-col
        v-for="item in items"
        :key="item.index"
        class="title-card"
        @click="fetchBlockData(item.PageTablekey)"
      >
        <el-card>
          <div>
            {{ item.title }}
          </div>
        </el-card>
      </el-col>
    </div>

    <!-- Blog Container Section -->
    <div class="blog-container">
      <!-- Blog Page List -->
      <div class="blog-page-list">
        <el-row :gutter="20">
          <div
            v-for="post in list"
            :key="post.id"
            class="blog-item-col"
            @click="navigate(post)"
          >
            <el-col :span="24">
              <el-card class="blog-item" shadow="hover">
                <div class="blog-item-inner">
                  <div class="blog-item-content">
                    <div class="blog-title">{{ post.title }}</div>
                    <div class="blog-contents">{{ post.contents }}</div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </div>
        </el-row>
      </div>

      <!-- Notion Renderer -->
      <div class="post-content-area" v-if="blockMaps">
        <NotionRenderer :blockMap="blockMaps" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getPageTable, getPageBlocks, NotionRenderer } from "vue-notion";
import { useLoadingStore } from "@/stores/loading";

const list = ref([]);
const items = ref([]);
const blockMaps = ref(null);
const loadingStore = useLoadingStore();

onMounted(() => {
  fetchData();
  items.value = [
    { index: 1, title: "vue-notion", PageTablekey: "48373eeff05846bbb5ff00f4af92e8a8" },
    { index: 2, title: "미정", PageTablekey: "1ce4e7142c43800d8305e5256b87d4b4" },
    { index: 3, title: "미정2", PageTablekey: "1ce4e7142c4380f39073d4c59fecd6b5" },
  ];
});
// 클릭 시 PageBlocks 데이터를 로드하는 함수
const fetchBlockData = async (PageTablekey) => {
  loadingStore.ON(); // 로딩 시작
  try {
    const value = await getPageTable(PageTablekey); // PageTablekey 기반 데이터 가져오기
        list.value = value;
    if (list.value?.[0]?.id && blockMaps.value == null) {
      await navigate(value[0]);
    }
  } catch (error) {
    console.error("데이터를 가져오는 중 오류 발생:", error);
  } finally {
    loadingStore.OFF(); // 로딩 종료
  }
};

// 기본 데이터 로드
const fetchData = async () => {
  loadingStore.ON();
  try {
    const value = await getPageTable("48373eeff05846bbb5ff00f4af92e8a8");
    list.value = value;
    if (list.value?.[0]?.id && blockMaps.value == null) {
      await navigate(value[0]);
    }
  } catch (error) {
    console.error("데이터를 가져오는 중 오류 발생:", error);
  } finally {
    loadingStore.OFF();
  }
};

const navigate = async (post) => {
  loadingStore.ON();
  try {
    const blocks = await getPageBlocks(post.id);
    blockMaps.value = blocks;
  } catch (error) {
    console.error("데이터를 가져오는 중 오류 발생:", error);
  } finally {
    loadingStore.OFF();
  }
};
</script>

<style scoped>
.blog-container {
  display: flex;
  flex-direction: row; /* 리스트와 데이터 표시 영역을 나란히 배치 */
  gap: 20px; /* 두 섹션 간 간격 */
}

.blog-page-list {
  width: 250px; /* 리스트 너비 */
  flex-direction: column; /* 세로 정렬 */
  gap: 20px; /* 아이템 간 간격 */
  padding: 20px;
  background-color: #141414; /* 어두운 배경 */
  color: #ffffff; /* 텍스트 밝게 */
  border-radius: 8px;
  text-align: center;
  display: flex; /* 플렉스 박스 활성화 */
  align-items: flex-start; /* 세로 정렬 */
}

.blog-item-col {
  padding: 5px;
}

.blog-item {
  display: flex; /* 플렉스 박스 활성화 */
  flex-direction: row; /* 가로 정렬 */
  align-items: center; /* 세로 정렬 */
  gap: 20px; /* 이미지와 텍스트 사이 간격 */
  background-color: #1f1f1f; /* 카드 배경 어두운 색상 */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  width: 250px;
  cursor: pointer; /* 마우스 오버 시 포인터로 변경 */
  padding: 3px; /* 상하좌우 여백 */
  box-sizing: border-box; /* 패딩 포함 크기 계산 */
  border: 1px solid #333;
}

.blog-item-inner {
  display: flex; /* 플렉스 박스 활성화 */
  flex-direction: row; /* 자식 요소들을 가로로 정렬 */
  gap: 20px; /* 이미지와 텍스트 사이 간격 */
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
  flex: 1; /* 오른쪽 콘텐츠가 남은 공간을 차지하도록 설정 */
  gap: 10px; 
  align-items: flex-start; /* 텍스트를 왼쪽 정렬 */
}

.blog-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #ffcc00; /* 제목 색상 */
  margin-top: 0; /* 여백 제거 */
  padding: 0; /* 불필요한 패딩 제거 */
}

.blog-contents {
  font-size: 0.9em;
  color: #b3b3b3; /* 본문 색상 */
  margin-top: 5px; /* 여백 제거 */
  padding: 0; /* 불필요한 패딩 제거 */
}

.blog-item:hover {
  transform: translateY(-2.5px);
  border-color: #ffcc00;
}

.post-content-area {
  flex: 1; /* 나머지 공간을 차지 */
  background-color: #1f1f1f; /* 데이터 표시 영역 배경 */
  padding: 20px; /* 내부 여백 */
  border-radius: 8px; /* 둥근 모서리 */
  color: #ffffff; /* 텍스트 색상 */
  overflow-y: auto; /* 스크롤 가능 */
}

.my-loader {
  margin-top: 20px;
  text-align: center;
}

.blog-title {
  display: flex;
  flex-direction: row;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #1f1f1f, #2d2d2d);
  border-radius: 12px;
  overflow-x: auto;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #2c2c2c;
}

.title-card {
  min-width: 180px;
  max-width: 220px;
  height: 120px;
  background: linear-gradient(135deg, #282828, #3a3a3a);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1em;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #333;
}

.title-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.3);
  border-color: #ffcc00;
  background: linear-gradient(135deg, #2d2d2d, #3a3a3a);
}

.title-card .el-card {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
}

.title-card .el-card div {
  text-align: center;
  color: #ffcc00;
  font-weight: 500;
  line-height: 1.4;
}

/* 스크롤바 스타일링 */
.blog-title::-webkit-scrollbar {
  height: 6px;
}

.blog-title::-webkit-scrollbar-track {
  background: #1f1f1f;
  border-radius: 3px;
}

.blog-title::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}

.blog-title::-webkit-scrollbar-thumb:hover {
  background: #444;
}
</style>
