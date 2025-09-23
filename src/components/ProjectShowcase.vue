<template>
  <div class="project-showcase">
    <div class="showcase-header">
      <h2 class="showcase-title">🚀 프로젝트</h2>
      <p class="showcase-subtitle">개발한 프로젝트들을 살펴보세요</p>
    </div>

    <div class="projects-grid">
      <div
        v-for="(item, index) in items"
        :key="item.name"
        class="project-card"
        :style="{ '--delay': index * 0.15 + 's' }"
        @click="openSite(item.site)"
      >
        <div class="card-accent"></div>
        <div class="card-glow"></div>

        <div class="card-content">
          <div class="card-header">
            <div class="project-info">
              <div class="project-icon">{{ getProjectIcon(item.name) }}</div>
              <div>
                <h3 class="project-name">{{ item.name }}</h3>
                <span class="project-status">{{ getProjectStatus(item.name) }}</span>
              </div>
            </div>
            <div class="project-links">
              <a v-if="item.site" :href="item.site" target="_blank" rel="noopener" class="link-btn primary" @click.stop>
                <el-icon><Link /></el-icon>
              </a>
              <a v-if="item.repo" :href="item.repo" target="_blank" rel="noopener" class="link-btn secondary" @click.stop>
                <el-icon><Collection /></el-icon>
              </a>
            </div>
          </div>

          <p class="project-description">{{ item.description }}</p>

          <div v-if="item.tags?.length" class="tech-tags">
            <span v-for="tag in item.tags" :key="tag" class="tag" :class="getTagStyle(tag)">{{ tag }}</span>
          </div>
        </div>

        <div class="card-footer">
          <div class="project-stats">
            <div class="stat">
              <span class="stat-value">{{ getCommitCount(item.name) }}</span>
              <span class="stat-label">commits</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ getStarCount(item.name) }}</span>
              <span class="stat-label">stars</span>
            </div>
          </div>
          <div class="view-more">
            <span>자세히 보기</span>
            <el-icon class="arrow"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Link, Collection, ArrowRight } from '@element-plus/icons-vue'

const items = [
  {
    name: 'HWH BLOG',
    description: 'Vue 3 + Vite로 만든 개인 블로그. 다크 테마와 지수/노트 뷰 제공.',
    site: 'https://example.com',
    repo: 'https://github.com/yourname/hwh_blog',
    tags: ['Vue3', 'Vite', 'ElementPlus']
  },
  {
    name: 'Stock Dashboard',
    description: '무료 공개 API로 구현한 시장 지수 대시보드.',
    site: 'https://example.com/stocks',
    repo: 'https://github.com/yourname/stock-dashboard',
    tags: ['YahooFinance', 'Serverless']
  },
  {
    name: 'Notes Viewer',
    description: '노트 렌더링/검색 뷰어. 모바일 최적화.',
    site: 'https://example.com/notes',
    repo: 'https://github.com/yourname/notes-viewer',
    tags: ['Vue', 'Notion']
  }
]

function openSite(url) {
  if (!url) return
  window.open(url, '_blank', 'noopener')
}

function getProjectIcon(name) {
  const icons = {
    'HWH BLOG': '📝',
    'Stock Dashboard': '📊',
    'Notes Viewer': '📚'
  }
  return icons[name] || '🚀'
}

function getProjectStatus(name) {
  const statuses = {
    'HWH BLOG': '운영중',
    'Stock Dashboard': '완료',
    'Notes Viewer': '베타'
  }
  return statuses[name] || '개발중'
}

function getTagStyle(tag) {
  const styles = {
    'Vue3': 'vue',
    'Vue': 'vue',
    'Vite': 'build',
    'ElementPlus': 'ui',
    'YahooFinance': 'api',
    'Serverless': 'cloud',
    'Notion': 'notion'
  }
  return styles[tag] || 'default'
}

function getCommitCount(name) {
  const counts = {
    'HWH BLOG': '127',
    'Stock Dashboard': '89',
    'Notes Viewer': '156'
  }
  return counts[name] || '42'
}

function getStarCount(name) {
  const counts = {
    'HWH BLOG': '23',
    'Stock Dashboard': '45',
    'Notes Viewer': '31'
  }
  return counts[name] || '12'
}
</script>

<style scoped>
.project-showcase {
  width: 100%;
  padding: var(--space-4) 0;
}

.showcase-header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.showcase-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 var(--space-2) 0;
  background: linear-gradient(135deg, var(--color-primary-solid), var(--color-secondary-solid), var(--color-accent-solid));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(13, 33, 122, 0.3);
}

.showcase-subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
  opacity: 0.9;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: var(--space-6);
  max-width: 1200px;
  margin: 0 auto;
}

.project-card {
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s var(--ease-fluid);
  box-shadow: var(--shadow-lg);
  position: relative;
  animation: slideUp 0.5s var(--ease-fluid) both;
  animation-delay: var(--delay);
}

.project-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow:
    var(--shadow-xl),
    var(--shadow-glow),
    0 20px 40px rgba(13, 33, 122, 0.15);
  border-color: var(--color-primary-solid);
}

.card-accent {
  height: 4px;
  background: linear-gradient(90deg,
    var(--color-primary-solid) 0%,
    var(--color-secondary-solid) 50%,
    var(--color-accent-solid) 100%
  );
}


.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 50% 0%, rgba(13, 33, 122, 0.1), transparent 50%);
  opacity: 0;
  transition: opacity 0.5s var(--ease-fluid);
  pointer-events: none;
}

.project-card:hover .card-glow {
  opacity: 1;
}


@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.card-content {
  padding: var(--space-6);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
}

.project-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex: 1;
}

.project-icon {
  font-size: 2.2rem;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-surface-2), var(--color-surface-3));
  border: 3px solid var(--color-border);
  border-radius: var(--radius-2xl);
  position: relative;
  transition: all 0.3s var(--ease-fluid);
  box-shadow: var(--shadow-md);
}

.project-icon::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    rgba(255,255,255,0.3) 0%,
    transparent 50%,
    rgba(13, 33, 122, 0.2) 100%
  );
  border-radius: var(--radius-2xl);
  pointer-events: none;
  opacity: 0;
  transition: all 0.3s var(--ease-fluid);
}

.project-card:hover .project-icon {
  transform: scale(1.05) rotate(2deg);
  border-color: var(--color-primary-solid);
  box-shadow: var(--shadow-lg);
}

.project-card:hover .project-icon::before {
  opacity: 1;
}

.project-name {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 var(--space-1) 0;
  color: var(--text-primary);
  transition: all 0.3s var(--ease-fluid);
}

.project-card:hover .project-name {
  background: linear-gradient(135deg, var(--color-primary-solid), var(--color-secondary-solid));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.project-status {
  font-size: 0.8rem;
  color: var(--color-accent-solid);
  background: var(--color-accent);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-accent-solid);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s var(--ease-fluid);
}

.project-card:hover .project-status {
  transform: scale(1.02);
  box-shadow: var(--shadow-sm);
}

.project-links {
  display: flex;
  gap: var(--space-2);
  flex-shrink: 0;
}

.link-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-xl);
  text-decoration: none;
  transition: all 0.3s var(--ease-fluid);
  position: relative;
  overflow: hidden;
}



.link-btn.primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-solid));
  border: 2px solid var(--color-primary-solid);
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
}

.link-btn.secondary {
  background: linear-gradient(135deg, var(--color-surface-2), var(--color-surface-3));
  border: 2px solid var(--color-border);
  color: var(--text-secondary);
  box-shadow: var(--shadow-sm);
}

.link-btn:hover {
  transform: translateY(-1px) scale(1.05);
  box-shadow: var(--shadow-md);
}

.link-btn.primary:hover {
  background: linear-gradient(135deg, var(--color-primary-solid), var(--color-secondary-solid));
  box-shadow: 0 10px 30px rgba(13, 33, 122, 0.4);
}

.link-btn.secondary:hover {
  background: linear-gradient(135deg, var(--color-surface-3), var(--color-primary));
  border-color: var(--color-primary-solid);
  color: var(--text-primary);
}

.project-description {
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0 0 var(--space-4) 0;
  font-size: 0.95rem;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.tag {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  border: 2px solid;
  transition: all 0.3s var(--ease-fluid);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}


.tag:hover {
  transform: translateY(-1px) scale(1.03);
  box-shadow: var(--shadow-sm);
}


.tag.vue {
  background: linear-gradient(135deg, rgba(79, 192, 141, 0.2), rgba(79, 192, 141, 0.1));
  color: #4FC08D;
  border-color: #4FC08D;
}

.tag.build {
  background: linear-gradient(135deg, rgba(255, 183, 0, 0.2), rgba(255, 183, 0, 0.1));
  color: #FFB700;
  border-color: #FFB700;
}

.tag.ui {
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.2), rgba(64, 158, 255, 0.1));
  color: #409EFF;
  border-color: #409EFF;
}

.tag.api {
  background: linear-gradient(135deg, rgba(255, 107, 129, 0.2), rgba(255, 107, 129, 0.1));
  color: #FF6B81;
  border-color: #FF6B81;
}

.tag.cloud {
  background: linear-gradient(135deg, rgba(106, 90, 205, 0.2), rgba(106, 90, 205, 0.1));
  color: #6A5ACD;
  border-color: #6A5ACD;
}

.tag.notion {
  background: linear-gradient(135deg, rgba(55, 53, 47, 0.3), rgba(55, 53, 47, 0.2));
  color: #37352F;
  border-color: #37352F;
}

.tag.default {
  background: linear-gradient(135deg, var(--color-surface-3), var(--color-surface-2));
  color: var(--text-secondary);
  border-color: var(--color-border);
}

.card-footer {
  padding: var(--space-4) var(--space-6);
  background: linear-gradient(135deg, var(--color-surface-2), var(--color-surface-1));
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}



.project-stats {
  display: flex;
  gap: var(--space-5);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  transition: all 0.3s var(--ease-fluid);
}

.stat:hover {
  transform: scale(1.05);
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--color-primary-solid);
  transition: all 0.3s var(--ease-fluid);
}

.project-card:hover .stat-value {
  background: linear-gradient(135deg, var(--color-primary-solid), var(--color-secondary-solid));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transform: scale(1.05);
}

.stat-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 600;
}

.view-more {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.9rem;
  color: var(--color-accent-solid);
  font-weight: 600;
  transition: all 0.3s var(--ease-fluid);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}


.project-card:hover .view-more {
  transform: translateX(4px) scale(1.05);
  background: var(--color-accent);
  border-color: var(--color-accent-solid);
  box-shadow: var(--shadow-md);
  color: var(--text-primary);
}


.arrow {
  transition: all 0.3s var(--ease-fluid);
  font-size: 1.1rem;
}

.project-card:hover .arrow {
  transform: translateX(3px) rotate(15deg) scale(1.1);
}

/* 반응형 디자인 */
@media (max-width: 992px) {
  .projects-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: var(--space-5);
  }
}

@media (max-width: 768px) {
  .showcase-header {
    margin-bottom: var(--space-5);
  }

  .showcase-title {
    font-size: 1.8rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
    padding: 0 var(--space-3);
  }

  .card-content {
    padding: var(--space-5);
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .project-info {
    width: 100%;
  }

  .project-links {
    align-self: flex-end;
  }

  .card-footer {
    padding: var(--space-3) var(--space-5);
    flex-direction: column;
    gap: var(--space-3);
    align-items: flex-start;
  }

  .view-more {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .project-showcase {
    padding: var(--space-3) 0;
  }

  .showcase-title {
    font-size: 1.6rem;
  }

  .projects-grid {
    padding: 0 var(--space-2);
  }

  .project-icon {
    width: 56px;
    height: 56px;
    font-size: 1.8rem;
  }

  .project-name {
    font-size: 1.2rem;
  }

  .link-btn {
    width: 36px;
    height: 36px;
  }

  .project-stats {
    gap: var(--space-4);
  }
}
</style>