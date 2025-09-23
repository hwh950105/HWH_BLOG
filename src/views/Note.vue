<template>
  <div class="note-page">
    <div class="page-header">

      <div class="header-actions">
        <el-switch v-model="serif" active-text="Serif" inactive-text="Sans"/>
        <el-select v-model="fontSize" size="small" class="font-select">
          <el-option label="작게" :value="'sm'" />
          <el-option label="보통" :value="'md'" />
          <el-option label="크게" :value="'lg'" />
        </el-select>
      </div>
    </div>

    <div class="note-layout" v-if="blockMaps">
      <aside class="toc" v-if="tocItems.length">
        <div class="toc-title">목차</div>
        <ul class="toc-list">
          <li v-for="item in tocItems" :key="item.id" :style="{ paddingLeft: item.indent + 'px' }">
            <a href="#" @click.prevent="scrollTo(item.id)">{{ item.text }}</a>
          </li>
        </ul>
      </aside>
      <div class="note-content">
        <div class="notion-container" :class="[fontSizeClass, serifClass]">
          <NotionRenderer :blockMap="blockMaps" />
        </div>
      </div>
    </div>

    <div class="loading-state" v-else>
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>노트를 불러오는 중...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { getPageBlocks, NotionRenderer } from 'vue-notion';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const blockMaps = ref(null);
const tocItems = ref([]);
const fontSize = ref('md');
const serif = ref(false);

onMounted(async () => {
  const pageId = route.params.id;
  console.log(pageId);

  try {
    const value = await getPageBlocks(pageId);
    blockMaps.value = value;
    await nextTick();
    buildToc();
  } catch (error) {
    console.error('노트를 불러오는 중 오류가 발생했습니다:', error);
  }
});

const goBack = () => {
  router.back();
};

const fontSizeClass = computed(() => {
  return fontSize.value === 'sm' ? 'font-sm' : fontSize.value === 'lg' ? 'font-lg' : 'font-md';
});

const serifClass = computed(() => (serif.value ? 'font-serif' : 'font-sans'));

function buildToc() {
  const headings = document.querySelectorAll('.notion h1, .notion h2, .notion h3');
  tocItems.value = Array.from(headings).map((el) => ({
    id: el.id || (el.id = 'h-' + Math.random().toString(36).slice(2)),
    text: el.textContent || '',
    indent: el.tagName === 'H1' ? 0 : el.tagName === 'H2' ? 12 : 24
  }));
}

function scrollTo(id) {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
</script>

<style scoped>
.note-page {
  min-height: 100vh;
  background: transparent;
  padding: var(--space-6);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
  padding: var(--space-4) var(--space-5);
  background: var(--color-surface-2);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  backdrop-filter: var(--blur-md);
  box-shadow: var(--shadow-md);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.page-title {
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0;
}

.font-select {
  width: 120px;
}

.note-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: var(--space-6);
}

.toc {
  position: sticky;
  top: 80px;
  align-self: start;
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  max-height: calc(100vh - 120px);
  overflow: auto;
}

.toc-title {
  font-weight: 700;
  margin-bottom: var(--space-3);
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc-list a {
  color: var(--text-secondary);
  text-decoration: none;
}

.toc-list a:hover {
  color: var(--text-primary);
}

.note-content {
  max-width: 900px;
  margin: 0 auto;
  animation: fadeInUp 0.6s var(--ease-fluid);
}

.notion-container {
  background: var(--color-surface-1);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  border: 1px solid var(--color-border);
  backdrop-filter: var(--blur-md);
  box-shadow: var(--shadow-lg);
  color: var(--text-primary);
}

.notion-container.font-sm { font-size: 0.95rem; }
.notion-container.font-md { font-size: 1rem; }
.notion-container.font-lg { font-size: 1.125rem; }
.notion-container.font-serif { font-family: 'Noto Serif KR', serif; }
.notion-container.font-sans { font-family: 'Inter', system-ui, sans-serif; }

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-spinner {
  text-align: center;
  color: var(--text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-surface-3);
  border-top: 3px solid var(--color-primary-solid);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--space-4) auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

/* Notion 컨텐츠 스타일 오버라이드 */
.notion-container :deep(.notion) {
  color: var(--text-primary) !important;
  background: transparent !important;
}

.notion-container :deep(.notion-h1),
.notion-container :deep(.notion-h2),
.notion-container :deep(.notion-h3) {
  color: var(--text-primary) !important;
}

.notion-container :deep(.notion-title) {
  color: var(--text-primary) !important;
}

.notion-container :deep(.notion-code) {
  background: var(--color-surface-3) !important;
  color: var(--text-primary) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: var(--radius-md) !important;
}

.notion-container :deep(.notion-link) {
  color: var(--color-accent-solid) !important;
}

@media (max-width: 768px) {
  .note-page {
    padding: var(--space-4);
  }

  .page-title {
    font-size: 2rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .note-layout { grid-template-columns: 1fr; }
  .toc { display: none; }
  .notion-container { padding: var(--space-6); }
}
</style>
