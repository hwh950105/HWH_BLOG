<template>
  <div class="notion-workspace">
    <!-- 헤더 영역 -->
    <div class="workspace-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="workspace-title">📚 Notion Workspace</h1>
          <p class="workspace-subtitle">다양한 주제의 노트들을 탐색해보세요</p>
        </div>

      </div>
    </div>

    <!-- 모바일 카테고리 탭 -->
    <div class="mobile-category-tabs">
      <div
        v-for="(item, index) in items"
        :key="item.index"
        class="mobile-category-tab"
        :class="{ 'active': selectedCategoryIndex === index }"
        @click="fetchBlockData(item.PageTablekey, index)"
      >
        📂 {{ item.title }}
      </div>
    </div>

    <!-- 메인 워크스페이스 -->
    <div class="workspace-main">
      <!-- 카테고리 사이드바 (데스크톱만) -->
      <div class="category-sidebar" :class="{ 'collapsed': isCategorySidebarCollapsed }" @click="isCategorySidebarCollapsed && (isCategorySidebarCollapsed = false)">
        <div class="sidebar-header">
          <div class="sidebar-title-section">
            <h3 class="sidebar-title">📁 카테고리</h3>
            <div class="category-count">{{ items.length }}개</div>
          </div>
          <button class="sidebar-toggle-btn" @click.stop="isCategorySidebarCollapsed = !isCategorySidebarCollapsed">
            <el-icon><component :is="isCategorySidebarCollapsed ? 'ArrowRight' : 'ArrowLeft'" /></el-icon>
          </button>
        </div>

        <div class="category-list">
          <div
            v-for="(item, index) in items"
            :key="item.index"
            class="category-item"
            :class="{ 'active': selectedCategoryIndex === index }"
            @click.stop="fetchBlockData(item.PageTablekey, index)"
          >
            <div class="category-icon">📂</div>
            <div class="category-info">
              <div class="category-name">{{ item.title }}</div>
              <div class="category-desc">{{ getCategoryDescription(item.title) }}</div>
            </div>
            <div class="category-arrow">
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- 노트 목록 -->
      <div class="notes-panel" :class="{ 'collapsed': isNotesPanelCollapsed }" @click="isNotesPanelCollapsed && (isNotesPanelCollapsed = false)">
        <div class="panel-header">
          <div class="panel-title-section">
            <h3 class="panel-title">📝 노트 목록</h3>
            <div class="notes-stats">
              <span class="current-category">{{ items[selectedCategoryIndex]?.title || 'vue-notion' }}</span>
              <span class="notes-count">{{ filteredList.length }}개 노트</span>
            </div>
          </div>
          <button class="sidebar-toggle-btn" @click.stop="isNotesPanelCollapsed = !isNotesPanelCollapsed">
            <el-icon><component :is="isNotesPanelCollapsed ? 'ArrowRight' : 'ArrowLeft'" /></el-icon>
          </button>

        </div>

        <el-scrollbar class="notes-scroll">
          <div class="notes-list">
            <div
              v-for="(post, index) in filteredList"
              :key="post.id"
              class="note-card"
              :class="{ 'active': selectedPostIndex === index }"
              @click="navigate(post, index)"
            >
              <div class="note-header">
                <h4 class="note-title">{{ post.title }}</h4>
                <time class="note-date">{{ formatDate(post.created_time) }}</time>
              </div>
              <p class="note-preview">{{ truncateText(post.contents, 100) }}</p>
              <div class="note-footer">
                <span class="read-indicator">읽기 →</span>
              </div>
            </div>

            <div v-if="filteredList.length === 0" class="empty-notes">
              <div class="empty-icon">🔍</div>
              <p>검색 결과가 없습니다</p>
            </div>
          </div>
        </el-scrollbar>
      </div>

      <!-- 메인 컨텐츠 영역 -->
      <div class="content-main">
        <div v-if="blockMaps" class="content-container">
          <div class="content-header">
            <div class="content-title-area">
              <h2 class="content-title">{{ selectedPost?.title || '노트 제목' }}</h2>
              <div class="content-meta">
                <span class="content-date">{{ selectedPost ? formatDate(selectedPost.created_time) : '' }}</span>
              </div>
            </div>
            <div class="content-actions">
              <el-button size="small" type="default">
                <el-icon><Share /></el-icon>
                공유
              </el-button>
              <el-button size="small" type="primary" @click="openFullNote">
                <el-icon><FullScreen /></el-icon>
                전체보기
              </el-button>
            </div>
          </div>

          <el-scrollbar class="content-scroll">
            <div class="notion-content">
              <NotionRenderer :blockMap="blockMaps" />
            </div>
          </el-scrollbar>
        </div>

        <!-- 빈 상태 -->
        <div v-else class="content-empty">
          <div class="empty-illustration">
            <div class="empty-circle">
              <el-icon size="60"><Document /></el-icon>
            </div>
          </div>
          <h3>노트를 선택해보세요</h3>
          <p>왼쪽에서 카테고리를 선택하고<br>읽고 싶은 노트를 클릭하세요</p>
          <el-button type="primary" @click="selectFirstNote">첫 번째 노트 보기</el-button>
        </div>
      </div>
    </div>

    <!-- 모바일 노트 리스트 버튼 -->
    <button class="mobile-notes-btn" @click="showMobileNotesModal = true" v-if="list.length > 0">
      📝
    </button>

    <!-- 모바일 노트 리스트 모달 -->
    <div class="mobile-nav-overlay" :class="{ 'active': showMobileNotesModal }" @click="showMobileNotesModal = false"></div>
    <div class="mobile-notes-modal" :class="{ 'active': showMobileNotesModal }">
      <div class="mobile-notes-header">
        <h3 class="mobile-notes-title">📝 노트 목록 ({{ filteredList.length }}개)</h3>
        <button class="mobile-close-btn" @click="showMobileNotesModal = false">×</button>
      </div>
      <div class="mobile-notes-content">
        <div class="notes-list">
          <div
            v-for="(post, index) in filteredList"
            :key="post.id"
            class="note-card"
            :class="{ 'active': selectedPostIndex === index }"
            @click="navigate(post, index); showMobileNotesModal = false"
          >
            <div class="note-header">
              <h4 class="note-title">{{ post.title }}</h4>
              <time class="note-date">{{ formatDate(post.created_time) }}</time>
            </div>
            <p class="note-preview">{{ truncateText(post.contents, 30) }}</p>
            <div class="note-footer">
              <span class="read-indicator">읽기 →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { getPageTable, getPageBlocks, NotionRenderer } from "vue-notion";
import { useLoadingStore } from "@/stores/loading";
import { useRouter } from "vue-router";
import { Search, ArrowRight, ArrowLeft, Share, FullScreen, Document } from '@element-plus/icons-vue';

const router = useRouter();
const list = ref([]);
const items = ref([]);
const blockMaps = ref(null);
const loadingStore = useLoadingStore();
const searchQuery = ref('');
const selectedPostIndex = ref(-1);
const selectedPost = ref(null);
const selectedCategoryIndex = ref(0);
const isCategorySidebarCollapsed = ref(false);
const isNotesPanelCollapsed = ref(false);
const showMobileNotesModal = ref(false);

// 검색된 노트 목록
const filteredList = computed(() => {
  if (!searchQuery.value.trim()) {
    return list.value;
  }
  return list.value.filter(post =>
    post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    post.contents.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 텍스트 자르기
const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// 날짜 포맷팅
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// 유틸리티 함수들
const getCategoryDescription = (title) => {
  const descriptions = {
    'vue-notion': 'Vue.js와 Notion 통합',
    '미정': '미분류 노트들',
    '미정2': '추가 노트 모음'
  };
  return descriptions[title] || '노트 모음';
};

const getWordCount = (text) => {
  if (!text) return 0;
  return text.length;
};

const selectFirstNote = () => {
  if (list.value.length > 0) {
    navigate(list.value[0], 0);
  }
};

// 전체 노트 보기
const openFullNote = () => {
  if (selectedPost.value?.id) {
    router.push(`/note/${selectedPost.value.id}`);
  }
};

onMounted(() => {
  fetchData();
  items.value = [
    { index: 1, title: "vue", PageTablekey: "48373eeff05846bbb5ff00f4af92e8a8" },
    { index: 2, title: "react", PageTablekey: "765cae4b9be74ada82e6d1796fe991e3" },
    { index: 3, title: "AI정리", PageTablekey: "2784e7142c4380008840db313fdbc7c8" },
  ];
});
// 클릭 시 PageBlocks 데이터를 로드하는 함수
const fetchBlockData = async (PageTablekey, categoryIndex) => {
  selectedCategoryIndex.value = categoryIndex;

  // 카테고리 클릭 시 자동으로 사이드바 접기
  isCategorySidebarCollapsed.value = true;

  loadingStore.ON(); // 로딩 시작
  try {
    const value = await getPageTable(PageTablekey); // PageTablekey 기반 데이터 가져오기
    list.value = value;
    if (list.value?.[0]?.id && blockMaps.value == null) {
      await navigate(value[0], 0);
    }
  } catch (error) {
    console.error("데이터를 가져오는 중 오류 발생:", error);

    // CORS 오류나 API 오류 시 빈 배열로 설정하여 UI가 깨지지 않도록 함
    list.value = [];

    // 사용자에게 오류 알림
    if (error.message?.includes('CORS') || error.message?.includes('Failed to fetch')) {
      console.warn('API 연결 오류: Notion API 설정을 확인해주세요.');
    }
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
      await navigate(value[0], 0);
    }
  } catch (error) {
    console.error("데이터를 가져오는 중 오류 발생:", error);

    // CORS 오류나 API 오류 시 빈 배열로 설정하여 UI가 깨지지 않도록 함
    list.value = [];

    // 사용자에게 오류 알림
    if (error.message?.includes('CORS') || error.message?.includes('Failed to fetch')) {
      console.warn('API 연결 오류: Notion API 설정을 확인해주세요.');
    }
  } finally {
    loadingStore.OFF();
  }
};

const navigate = async (post, index) => {
  selectedPostIndex.value = index;
  selectedPost.value = post;
  loadingStore.ON();
  try {
    const blocks = await getPageBlocks(post.id);
    blockMaps.value = blocks;
  } catch (error) {
    console.error("데이터를 가져오는 중 오류 발생:", error);

    // API 오류 시 blockMaps를 null로 설정하여 빈 상태 화면 표시
    blockMaps.value = null;

    // 사용자에게 오류 알림
    if (error.message?.includes('CORS') || error.message?.includes('Failed to fetch')) {
      console.warn('API 연결 오류: Notion API 설정을 확인해주세요.');
    }
  } finally {
    loadingStore.OFF();
  }
};
</script>

<style scoped>
/* 전체 워크스페이스 */
.notion-workspace {
  min-height: 100vh;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
}

/* 헤더 영역 */
.workspace-header {
  background: var(--color-surface-1);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: var(--blur-md);
  box-shadow: var(--shadow-sm);
  z-index: 100;
  position: relative;
}

.header-content {
  max-width: 1800px;
  margin: 0 auto;
  padding: var(--space-4) var(--space-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-6);
}

.header-left {
  flex: 1;
  min-width: 0;
}

.workspace-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 var(--space-1) 0;
  background: linear-gradient(135deg, var(--color-primary-solid), var(--color-secondary-solid));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.workspace-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
  opacity: 0.8;
}

.header-right {
  flex-shrink: 0;
  width: 320px;
}

.global-search {
  width: 100%;
}

.global-search :deep(.el-input__wrapper) {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.global-search :deep(.el-input__inner) {
  color: var(--text-primary);
  font-size: 0.95rem;
}

/* 메인 워크스페이스 */
.workspace-main {
  flex: 1;
  display: flex;
  max-width: none;
  margin: 0;
  padding: var(--space-4) var(--space-6);
  gap: var(--space-4);
  height: calc(100vh - 80px);
  overflow: hidden;
  position: relative;
}

/* 카테고리 사이드바 */
.category-sidebar {
  background: var(--color-surface-1);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  backdrop-filter: var(--blur-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 260px;
  flex-shrink: 0;
  transition: width var(--ease-fluid) 0.3s;
  z-index: 10;
}

.category-sidebar.collapsed {
  width: 60px;
}

.category-sidebar.collapsed .sidebar-title-section,
.category-sidebar.collapsed .category-list {
  display: none;
}

.category-sidebar.collapsed .sidebar-header {
  padding: var(--space-4) var(--space-3);
  justify-content: center;
}

.category-sidebar.collapsed {
  cursor: pointer;
}

.category-sidebar.collapsed:hover {
  border-color: var(--color-primary-solid);
  box-shadow: var(--shadow-lg);
}

.sidebar-header {
  padding: var(--space-4) var(--space-5);
  background: linear-gradient(135deg, var(--color-surface-2), var(--color-surface-3));
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

.sidebar-toggle-btn {
  background: var(--color-surface-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--ease-fluid) 0.3s;
  color: var(--text-secondary);
  margin-left: var(--space-2);
}

.sidebar-toggle-btn:hover {
  background: var(--color-primary);
  color: var(--text-primary);
  transform: scale(1.1);
}

.sidebar-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.category-count {
  font-size: 0.8rem;
  color: var(--text-muted);
  background: var(--color-surface-3);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.category-list {
  flex: 1;
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.category-item {
  padding: var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface-2);
  cursor: pointer;
  transition: all var(--ease-fluid) 0.3s;
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.category-item:hover {
  transform: translateY(-1px);
  border-color: var(--color-primary-solid);
  box-shadow: var(--shadow-md);
  background: var(--color-surface-3);
}

.category-item.active {
  border-color: var(--color-secondary-solid);
  background: var(--color-secondary);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.category-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.category-info {
  flex: 1;
  min-width: 0;
}

.category-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.category-item.active .category-name {
  color: var(--text-primary);
  font-weight: 600;
}

.category-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
  opacity: 0.8;
}

.category-arrow {
  color: var(--text-muted);
  font-size: 0.8rem;
  transition: transform var(--ease-fluid) 0.3s;
}

.category-item:hover .category-arrow {
  transform: translateX(2px);
  color: var(--color-primary-solid);
}

.category-item.active .category-arrow {
  color: var(--text-primary);
}

/* 숨겨진 사이드바 스타일 - 기존 코드 제거됨 */

/* 노트 패널 */
.notes-panel {
  background: var(--color-surface-1);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  backdrop-filter: var(--blur-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 320px;
  flex-shrink: 0;
  transition: width var(--ease-fluid) 0.3s;
  z-index: 9;
}

.notes-panel.collapsed {
  width: 60px;
}

.notes-panel.collapsed .panel-title-section,
.notes-panel.collapsed .search-results,
.notes-panel.collapsed .notes-scroll {
  display: none;
}

.notes-panel.collapsed .panel-header {
  padding: var(--space-4) var(--space-3);
  justify-content: center;
}

.notes-panel.collapsed {
  cursor: pointer;
}

.notes-panel.collapsed:hover {
  border-color: var(--color-primary-solid);
  box-shadow: var(--shadow-lg);
}

.panel-header {
  padding: var(--space-4) var(--space-5);
  background: linear-gradient(135deg, var(--color-surface-2), var(--color-surface-3));
  border-bottom: 1px solid var(--color-border);
}

.panel-title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.panel-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.notes-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-1);
}

.current-category {
  font-size: 0.8rem;
  color: var(--color-accent-solid);
  background: var(--color-surface-3);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.notes-count {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.search-results {
  margin-top: var(--space-2);
}

.notes-scroll {
  flex: 1;
  padding: var(--space-3);
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.note-card {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  cursor: pointer;
  transition: all var(--ease-fluid) 0.3s;
}

.note-card:hover {
  transform: translateY(-1px);
  border-color: var(--color-primary-solid);
  box-shadow: var(--shadow-md);
  background: var(--color-surface-3);
}

.note-card.active {
  border-color: var(--color-secondary-solid);
  background: var(--color-secondary);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.note-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
  line-height: 1.3;
}

.note-date {
  font-size: 0.75rem;
  color: var(--text-muted);
  background: var(--color-surface-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  white-space: nowrap;
  flex-shrink: 0;
}

.note-preview {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin: 0 0 var(--space-3) 0;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.read-indicator {
  font-size: 0.8rem;
  color: var(--color-accent-solid);
  font-weight: 500;
}

.empty-notes {
  text-align: center;
  padding: var(--space-8);
  color: var(--text-muted);
}

.empty-notes .empty-icon {
  font-size: 3rem;
  margin-bottom: var(--space-3);
  opacity: 0.6;
}

/* 메인 컨텐츠 영역 */
.content-main {
  background: var(--color-surface-1);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  backdrop-filter: var(--blur-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  margin-left: 0;
  transition: margin-left var(--ease-fluid) 0.3s;
}

.content-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.content-header {
  padding: var(--space-5);
  background: linear-gradient(135deg, var(--color-surface-2), var(--color-surface-3));
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-4);
}

.content-title-area {
  flex: 1;
  min-width: 0;
}

.content-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--space-2) 0;
  line-height: 1.3;
}

.content-meta {
  display: flex;
  gap: var(--space-3);
  align-items: center;
}

.content-date, .content-length {
  font-size: 0.8rem;
  color: var(--text-muted);
  background: var(--color-surface-3);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.content-actions {
  display: flex;
  gap: var(--space-2);
  flex-shrink: 0;
}

.content-scroll {
  flex: 1;
  background: var(--color-surface-1);
}

.notion-content {
  padding: var(--space-8) var(--space-6);
  animation: fadeInUp 0.6s var(--ease-fluid);
  max-width: 900px;
  margin: 0 auto;
  line-height: 1.7;
}

/* 빈 상태 */
.content-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  text-align: center;
  color: var(--text-secondary);
}

.empty-illustration {
  margin-bottom: var(--space-6);
}

.empty-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--color-surface-2);
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-4) auto;
  color: var(--text-muted);
}

.content-empty h3 {
  font-size: 1.3rem;
  color: var(--text-primary);
  margin: 0 0 var(--space-2) 0;
}

.content-empty p {
  font-size: 1rem;
  margin: 0 0 var(--space-4) 0;
  color: var(--text-muted);
  line-height: 1.5;
}

/* Notion 컨텐츠 스타일 */
.notion-content :deep(.notion) {
  color: var(--text-primary) !important;
  background: transparent !important;
  font-size: 1rem !important;
  line-height: 1.7 !important;
}

.notion-content :deep(.notion-h1) {
  color: var(--text-primary) !important;
  font-size: 2rem !important;
  margin: 2rem 0 1rem 0 !important;
  font-weight: 700 !important;
}

.notion-content :deep(.notion-h2) {
  color: var(--text-primary) !important;
  font-size: 1.5rem !important;
  margin: 1.5rem 0 0.8rem 0 !important;
  font-weight: 600 !important;
}

.notion-content :deep(.notion-h3) {
  color: var(--text-primary) !important;
  font-size: 1.2rem !important;
  margin: 1.2rem 0 0.6rem 0 !important;
  font-weight: 600 !important;
}

.notion-content :deep(.notion-title) {
  color: var(--text-primary) !important;
  font-size: 2.5rem !important;
  font-weight: 700 !important;
  margin-bottom: 2rem !important;
}

.notion-content :deep(.notion-text) {
  font-size: 1rem !important;
  line-height: 1.7 !important;
  margin: 1rem 0 !important;
}

.notion-content :deep(.notion-code) {
  background: var(--color-surface-3) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: var(--radius-md) !important;
  padding: 0.2em 0.4em !important;
  font-size: 0.9em !important;
}

.notion-content :deep(.notion-link) {
  color: var(--color-accent-solid) !important;
  text-decoration: none !important;
  border-bottom: 1px solid transparent !important;
  transition: border-color 0.3s ease !important;
}

.notion-content :deep(.notion-link:hover) {
  border-bottom-color: var(--color-accent-solid) !important;
}

.notion-content :deep(.notion-list) {
  margin: 1rem 0 !important;
}

.notion-content :deep(.notion-list-item) {
  margin: 0.5rem 0 !important;
  line-height: 1.6 !important;
}

/* 애니메이션 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 모바일 나비게이션 버튼 */
.mobile-nav-toggle {
  display: none;
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  z-index: 1001;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  backdrop-filter: var(--blur-sm);
  transition: all 0.3s var(--ease-fluid);
}

.mobile-nav-toggle:active {
  transform: scale(0.95);
}

/* 모바일 네비게이션 오버레이 */
.mobile-nav-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
}

.mobile-nav-overlay.active {
  display: block;
}

/* 모바일 노트 리스트 모달 */
.mobile-notes-modal {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-surface-1);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-2xl);
  z-index: 1000;
  max-height: 70vh;
  transform: translateY(100%);
  transition: transform 0.3s var(--ease-fluid);
}

.mobile-notes-modal.active {
  display: flex;
  flex-direction: column;
  transform: translateY(0);
}

.mobile-notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  background: var(--color-surface-2);
  border-bottom: 1px solid var(--color-border);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.mobile-notes-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.mobile-close-btn {
  background: var(--color-surface-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.3s var(--ease-fluid);
}

.mobile-close-btn:hover {
  background: var(--color-warning);
  color: var(--text-primary);
}

.mobile-notes-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-3);
}

/* 모바일 카테고리 탭 */
.mobile-category-tabs {
  display: none;
  background: var(--color-surface-1);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-3) var(--space-4);
  overflow-x: auto;
  white-space: nowrap;
}

.mobile-category-tabs::-webkit-scrollbar {
  height: 3px;
}

.mobile-category-tabs::-webkit-scrollbar-track {
  background: var(--color-surface-2);
}

.mobile-category-tabs::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--radius-xs);
}

.mobile-category-tab {
  display: inline-block;
  padding: var(--space-2) var(--space-4);
  margin-right: var(--space-2);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s var(--ease-fluid);
  white-space: nowrap;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  touch-action: manipulation;
}

.mobile-category-tab.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary-solid);
  font-weight: 500;
}

.mobile-category-tab:not(.active):hover {
  background: var(--color-surface-3);
  border-color: var(--color-primary-solid);
}

/* 모바일 노트 버튼 */
.mobile-notes-btn {
  display: none;
  position: fixed;
  bottom: var(--space-4);
  right: var(--space-4);
  background: var(--color-secondary);
  color: white;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  font-size: 24px;
  cursor: pointer;
  box-shadow: var(--shadow-xl);
  z-index: 100;
  transition: all 0.3s var(--ease-fluid);
  touch-action: manipulation;
}

.mobile-notes-btn:active {
  transform: scale(0.9);
}

/* 반응형 디자인 */
@media (max-width: 1400px) {
  .workspace-main {
    gap: var(--space-4);
  }

  .category-sidebar {
    width: 240px;
  }

  .notes-panel {
    width: 300px;
  }
}

@media (max-width: 1200px) {
  .header-content {
    padding: var(--space-3) var(--space-4);
  }

  .workspace-title {
    font-size: 1.6rem;
  }

  .category-sidebar {
    width: 220px;
  }

  .notes-panel {
    width: 280px;
  }
}

@media (max-width: 1024px) {
  .workspace-main {
    flex-direction: column;
    height: auto;
    min-height: calc(100vh - 100px);
    gap: var(--space-3);
  }

  .category-sidebar {
    width: 100%;
    height: auto;
    order: 1;
  }

  .category-sidebar.collapsed {
    width: 100%;
    height: 60px;
  }

  .notes-panel {
    width: 100%;
    max-height: 300px;
    order: 2;
  }

  .notes-panel.collapsed {
    width: 100%;
    height: 60px;
  }

  .content-main {
    order: 3;
    min-height: 400px;
  }

  .category-list {
    flex-direction: row;
    overflow-x: auto;
    padding: var(--space-3);
    gap: var(--space-2);
  }

  .category-item {
    min-width: 180px;
    flex-shrink: 0;
  }
}

@media (max-width: 768px) {
  /* 모바일 모드 활성화 */
  .mobile-nav-toggle,
  .mobile-notes-btn,
  .mobile-category-tabs {
    display: flex;
  }

  .workspace-header {
    position: relative;
    z-index: 1;
  }

  .workspace-main {
    padding: var(--space-3);
    gap: 0;
    height: calc(100vh - 120px);
  }

  /* 데스크톱 사이드바 숨기기 */
  .category-sidebar,
  .notes-panel {
    display: none;
  }

  /* 콘텐츠 영역을 전체 화면으로 */
  .content-main {
    width: 100%;
    height: 100%;
    order: 1;
    margin-top: var(--space-3);
  }

  .header-content {
    padding: var(--space-3) var(--space-4);
    padding-right: var(--space-16); /* 토글 버튼 공간 확보 */
  }

  .workspace-title {
    font-size: 1.4rem;
  }

  .workspace-subtitle {
    font-size: 0.9rem;
  }

  .content-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-3);
    padding: var(--space-4);
  }

  .content-actions {
    flex-direction: row;
    justify-content: flex-end;
  }

  .notion-content {
    padding: var(--space-4);
  }

  /* 모바일 전용 노트 리스트 스타일 */
  .mobile-notes-modal .note-card {
    margin-bottom: var(--space-2);
    padding: var(--space-3);
  }

  .mobile-notes-modal .note-title {
    font-size: 0.95rem;
  }

  .mobile-notes-modal .note-preview {
    font-size: 0.8rem;
    line-height: 1.3;
  }
}

@media (max-width: 480px) {
  .mobile-nav-toggle {
    top: var(--space-3);
    right: var(--space-3);
    width: 44px;
    height: 44px;
    font-size: 18px;
  }

  .mobile-notes-btn {
    width: 52px;
    height: 52px;
    font-size: 22px;
    bottom: var(--space-3);
    right: var(--space-3);
  }

  .workspace-main {
    padding: var(--space-2);
  }

  .header-content {
    padding: var(--space-3);
    padding-right: var(--space-14);
  }

  .workspace-title {
    font-size: 1.3rem;
  }

  .workspace-subtitle {
    font-size: 0.85rem;
  }

  .mobile-category-tab {
    font-size: 0.85rem;
    padding: var(--space-2) var(--space-3);
    min-height: 40px;
  }

  .mobile-notes-header {
    padding: var(--space-3);
  }

  .mobile-notes-title {
    font-size: 1rem;
  }

  .content-header {
    padding: var(--space-3);
  }

  .content-title {
    font-size: 1.2rem;
  }

  .notion-content {
    padding: var(--space-3);
  }

  .mobile-notes-modal {
    max-height: 75vh;
  }
}

/* 터치 최적화 */
@media (hover: none) and (pointer: coarse) {
  .mobile-category-tab:active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }

  .mobile-notes-modal .note-card:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
}

/* 접근성 개선 */
.mobile-nav-toggle:focus,
.mobile-notes-btn:focus,
.mobile-close-btn:focus {
  outline: 2px solid var(--color-accent-solid);
  outline-offset: 2px;
}

.mobile-category-tab:focus {
  outline: 2px solid var(--color-accent-solid);
  outline-offset: 2px;
}

/* 가로 모드 대응 */
@media (max-width: 768px) and (orientation: landscape) {
  .mobile-notes-modal {
    max-height: 60vh;
  }

  .workspace-main {
    height: calc(100vh - 100px);
  }
}

/* 성능 최적화 */
@media (max-width: 768px) {
  .mobile-notes-modal {
    will-change: transform;
  }

  .category-sidebar,
  .notes-panel {
    will-change: auto;
  }

  /* 애니메이션 간소화 */
  .category-item,
  .note-card {
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }
}

.list-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-1);
}

.category-name {
  font-size: 0.8rem;
  color: var(--color-accent-solid);
  background: var(--color-surface-3);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.list-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-accent-solid);
  margin: 0;
  background: var(--color-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.list-count {
  font-size: 0.9rem;
  color: var(--text-muted);
  background: var(--color-surface-3);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.search-section {
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--color-divider);
  background: var(--color-surface-1);
}

.search-results-info {
  font-size: 0.8rem;
  color: var(--color-success-solid);
  margin-top: var(--space-2);
  padding: var(--space-1) var(--space-2);
  background: rgba(67, 233, 123, 0.1);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(67, 233, 123, 0.2);
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  background: var(--color-surface-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: none;
}

.search-input :deep(.el-input__inner) {
  color: var(--text-primary);
  background: transparent;
}

.search-input :deep(.el-input__inner::placeholder) {
  color: var(--text-muted);
}

.list-scrollbar {
  flex: 1;
  padding: var(--space-2);
}

.blog-items-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.blog-item-wrapper {
  width: 100%;
}

.blog-item {
  background: var(--color-surface-2);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: all var(--ease-fluid) 0.3s;
  cursor: pointer;
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  backdrop-filter: var(--blur-sm);
  position: relative;
  overflow: hidden;
}

.blog-item:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary-solid);
  box-shadow: var(--shadow-md), var(--shadow-glow);
}

.blog-item.active {
  border-color: var(--color-secondary-solid);
  background: var(--color-surface-3);
  box-shadow: var(--shadow-md);
}

.blog-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--color-secondary);
}

.blog-item-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
}

.blog-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-2);
}

.blog-date {
  font-size: 0.75rem;
  color: var(--text-muted);
  background: var(--color-surface-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  white-space: nowrap;
  flex-shrink: 0;
}

.blog-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-2);
}

.read-more {
  font-size: 0.8rem;
  color: var(--color-accent-solid);
  font-weight: 500;
}

.arrow-icon {
  color: var(--color-accent-solid);
  font-size: 0.9rem;
  transition: transform var(--ease-fluid) 0.3s;
}

.blog-item:hover .arrow-icon {
  transform: translateX(4px);
}

.blog-title {
  font-size: 1.1em;
  font-weight: bold;
  color: var(--color-primary-solid);
  background: var(--color-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-top: 0;
  padding: 0;
}

.blog-contents {
  font-size: 0.9em;
  color: var(--text-secondary);
  margin-top: var(--space-2);
  padding: 0;
  line-height: 1.5;
}

.blog-item:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary-solid);
  box-shadow: var(--shadow-md), var(--shadow-glow);
}

.post-content-area {
  flex: 1;
  background: var(--color-surface-1);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  backdrop-filter: var(--blur-md);
  box-shadow: var(--shadow-lg);
  color: var(--text-primary);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.content-header {
  padding: var(--space-5);
  border-bottom: 1px solid var(--color-divider);
  background: linear-gradient(135deg, var(--color-surface-2), var(--color-surface-3));
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  backdrop-filter: var(--blur-sm);
}

.content-header-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-4);
}

.content-title-section {
  flex: 1;
  min-width: 0;
}

.content-subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: var(--space-2) 0 0 0;
  line-height: 1.4;
  opacity: 0.8;
}

.content-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-2);
  flex-shrink: 0;
}

.action-buttons {
  display: flex;
  gap: var(--space-2);
}

.toggle-btn {
  background: var(--color-surface-3);
  border: 1px solid var(--color-border);
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.toggle-btn:hover {
  background: var(--color-secondary);
  color: var(--text-primary);
}

.content-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-secondary-solid);
  margin: 0;
  background: var(--color-secondary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex: 1;
}

.content-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.content-date {
  font-size: 0.9rem;
  color: var(--text-muted);
  background: var(--color-surface-3);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.full-view-btn {
  background: var(--color-accent);
  border: none;
  color: var(--text-primary);
  font-weight: 500;
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  transition: all var(--ease-fluid) 0.3s;
}

.full-view-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.notion-scrollbar {
  flex: 1;
  background: var(--color-surface-1);
}

.notion-wrapper {
  padding: var(--space-6);
  animation: fadeInUp 0.6s var(--ease-fluid);
  min-height: 100%;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  background: var(--color-surface-1);
}

.empty-content {
  text-align: center;
  max-width: 400px;
  color: var(--text-secondary);
}

.quick-actions {
  margin-top: var(--space-4);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: var(--space-4);
  opacity: 0.6;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin: 0 0 var(--space-2) 0;
}

.empty-state p {
  font-size: 1rem;
  margin: 0;
  color: var(--text-muted);
}

.my-loader {
  margin-top: var(--space-5);
  text-align: center;
}

.blog-title {
  display: flex;
  flex-direction: row;
  gap: var(--space-4);
  padding: var(--space-5);
  background: var(--color-surface-1);
  border-radius: var(--radius-lg);
  overflow-x: auto;
  margin-bottom: var(--space-5);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
  backdrop-filter: var(--blur-sm);
}

.title-card {
  min-width: 180px;
  max-width: 220px;
  height: 120px;
  background: var(--color-surface-2);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1em;
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--ease-fluid) 0.3s;
  border: 1px solid var(--color-border);
  backdrop-filter: var(--blur-sm);
}

.title-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
  border-color: var(--color-secondary-solid);
  background: var(--color-surface-3);
}

.title-card.active-category {
  transform: translateY(-2px);
  border-color: var(--color-primary-solid);
  background: var(--color-primary);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.title-card.active-category .el-card div {
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--color-primary-solid), var(--color-secondary-solid));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
}

.title-card .el-card {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.title-card .el-card div {
  text-align: center;
  color: var(--color-secondary-solid);
  background: var(--color-secondary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 500;
  line-height: 1.4;
}

/* 스크롤바 스타일링 */
.blog-title::-webkit-scrollbar {
  height: 6px;
}

.blog-title::-webkit-scrollbar-track {
  background: var(--color-surface-3);
  border-radius: var(--radius-xs);
}

.blog-title::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--radius-xs);
}

.blog-title::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary-solid);
}

.post-content-area::-webkit-scrollbar {
  width: 6px;
}

.post-content-area::-webkit-scrollbar-track {
  background: var(--color-surface-3);
  border-radius: var(--radius-xs);
}

.post-content-area::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--radius-xs);
}

.post-content-area::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary-solid);
}

/* Notion 컨텐츠 스타일 오버라이드 */
.notion-wrapper :deep(.notion) {
  color: var(--text-primary) !important;
  background: transparent !important;
}

.notion-wrapper :deep(.notion-h1),
.notion-wrapper :deep(.notion-h2),
.notion-wrapper :deep(.notion-h3) {
  color: var(--text-primary) !important;
}

.notion-wrapper :deep(.notion-title) {
  color: var(--text-primary) !important;
}

.notion-wrapper :deep(.notion-code) {
  background: var(--color-surface-3) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: var(--radius-md) !important;
}

.notion-wrapper :deep(.notion-link) {
  color: var(--color-accent-solid) !important;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 사이드바 축소 상태 스타일 */
.blog-page-list.collapsed .list-header {
  padding: var(--space-3) var(--space-2);
}

.blog-page-list.collapsed .list-title,
.blog-page-list.collapsed .list-stats,
.blog-page-list.collapsed .search-section,
.blog-page-list.collapsed .list-scrollbar {
  display: none;
}

.blog-page-list.collapsed .sidebar-toggle {
  margin: 0 auto;
}

/* 태블릿 사이즈 */
@media (max-width: 1024px) {
  .blog-container {
    gap: var(--space-3);
    height: 82vh;
  }

  .blog-page-list {
    width: 420px;
    min-width: 280px;
  }

  .blog-title {
    padding: var(--space-4);
  }

  .title-card {
    min-width: 160px;
    max-width: 200px;
    height: 100px;
  }
}

/* 모바일 사이즈 */
@media (max-width: 768px) {
  .notionlist-page {
    padding: var(--space-3);
  }

  .page-header {
    padding: var(--space-4);
    margin-bottom: var(--space-6);
  }

  .page-title {
    font-size: 2rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .blog-container {
    flex-direction: column;
    gap: var(--space-3);
    height: auto;
    min-height: 80vh;
  }

  .blog-page-list {
    width: 100%;
    min-width: 100%;
    height: 45vh;
    order: 2;
  }

  .blog-page-list.collapsed {
    height: 60px;
    width: 100%;
  }

  .post-content-area {
    height: 50vh;
    order: 1;
  }

  .list-header {
    padding: var(--space-3) var(--space-4);
  }

  .search-section {
    padding: var(--space-3) var(--space-4);
  }

  .content-header {
    padding: var(--space-4);
  }

  .content-header-info {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .content-actions {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .action-buttons {
    flex-direction: row;
  }

  .notion-wrapper {
    padding: var(--space-4);
  }

  .blog-item {
    padding: var(--space-3);
  }

  .blog-item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-1);
  }

  .blog-date {
    align-self: flex-end;
  }

  .blog-title {
    padding: var(--space-3);
    gap: var(--space-3);
  }

  .title-card {
    min-width: 140px;
    max-width: 180px;
    height: 80px;
  }

  .empty-content {
    max-width: 300px;
  }

  .empty-state {
    padding: var(--space-6);
  }
}

/* 작은 모바일 */
@media (max-width: 480px) {
  .notionlist-page {
    padding: var(--space-2);
  }

  .page-header {
    padding: var(--space-3);
  }

  .page-title {
    font-size: 1.8rem;
  }

  .blog-container {
    gap: var(--space-2);
  }

  .blog-page-list {
    height: 40vh;
  }

  .post-content-area {
    height: 45vh;
  }

  .title-card {
    min-width: 120px;
    max-width: 160px;
    height: 70px;
    font-size: 0.9rem;
  }

  .blog-title {
    gap: var(--space-2);
  }

  .list-title {
    font-size: 1.1rem;
  }

  .content-title {
    font-size: 1.1rem;
  }
}
</style>
