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
              <div class="project-icon">{{ item.icon }}</div>
              <div>
                <h3 class="project-name">{{ item.name }}</h3>
                <span class="project-status">{{ item.status }}</span>
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

      </div>
    </div>
  </div>
</template>

<script setup>
import { Link, Collection, ArrowRight } from '@element-plus/icons-vue'

const items = [
  {
    name: 'HWH BLOG',
    description: 'Vue 3 + Vite로 만든 개인 블로그입니다. Notion API를 활용한 블로그 시스템과 다양한 기능들을 포함합니다.',

    tags: ['Vue3', 'Vite', 'javaScript', 'Notion API', 'FIREBASE','Vercel'],
    icon: '📝',
    status: '현재페이지'
  },
  {
    name: '방과후 플랫폼 ',
    description: 'Next.js + Supabase.',
    site: 'https://webcode-blush.vercel.app/',
    repo: 'https://webcode-blush.vercel.app/',
    tags: ['Next.js', 'Supabase', 'TypeScript', 'TailwindCSS' ,'Vercel'],
    icon: '🚀',
    status: '개발중'
  },
  // {
  //   name: 'Portfolio Website',
  //   description: '개인 포트폴리오 웹사이트. 반응형 디자인과 인터랙티브 애니메이션이 특징입니다.',
  //   site: 'http://hwh95.shop/',
  //   repo: 'https://github.com/hwh950105/portfolio',
  //   tags: ['React', 'CSS3', 'Animation', 'PWA'],
  //   icon: '💼',
  //   status: '운영중'
  // }
]

function openSite(url) {
  if (!url) return
  window.open(url, '_blank', 'noopener')
}


// 태그 색상 관리 시스템
const tagColorMap = new Map();
const tagColorPalette = [
  { name: 'vue', bg: 'linear-gradient(135deg, rgba(79, 192, 141, 0.2), rgba(79, 192, 141, 0.1))', color: '#4FC08D', border: '#4FC08D' },
  { name: 'react', bg: 'linear-gradient(135deg, rgba(97, 218, 251, 0.2), rgba(97, 218, 251, 0.1))', color: '#61DAFB', border: '#61DAFB' },
  { name: 'next', bg: 'linear-gradient(135deg, rgba(128, 0, 128, 0.2), rgba(128, 0, 128, 0.1))', color: '#800080', border: '#800080' },
  { name: 'typescript', bg: 'linear-gradient(135deg, rgba(49, 120, 198, 0.2), rgba(49, 120, 198, 0.1))', color: '#3178C6', border: '#3178C6' },
  { name: 'build', bg: 'linear-gradient(135deg, rgba(255, 183, 0, 0.2), rgba(255, 183, 0, 0.1))', color: '#FFB700', border: '#FFB700' },
  { name: 'ui', bg: 'linear-gradient(135deg, rgba(64, 158, 255, 0.2), rgba(64, 158, 255, 0.1))', color: '#409EFF', border: '#409EFF' },
  { name: 'database', bg: 'linear-gradient(135deg, rgba(62, 175, 124, 0.2), rgba(62, 175, 124, 0.1))', color: '#3EAF7C', border: '#3EAF7C' },
  { name: 'cloud', bg: 'linear-gradient(135deg, rgba(106, 90, 205, 0.2), rgba(106, 90, 205, 0.1))', color: '#6A5ACD', border: '#6A5ACD' },
  { name: 'css', bg: 'linear-gradient(135deg, rgba(21, 114, 182, 0.2), rgba(21, 114, 182, 0.1))', color: '#1572B6', border: '#1572B6' },
  { name: 'api', bg: 'linear-gradient(135deg, rgba(255, 107, 129, 0.2), rgba(255, 107, 129, 0.1))', color: '#FF6B81', border: '#FF6B81' },
  { name: 'security', bg: 'linear-gradient(135deg, rgba(220, 53, 69, 0.2), rgba(220, 53, 69, 0.1))', color: '#DC3545', border: '#DC3545' },
  { name: 'design', bg: 'linear-gradient(135deg, rgba(255, 105, 180, 0.2), rgba(255, 105, 180, 0.1))', color: '#FF69B4', border: '#FF69B4' },
  { name: 'mobile', bg: 'linear-gradient(135deg, rgba(255, 69, 0, 0.2), rgba(255, 69, 0, 0.1))', color: '#FF4500', border: '#FF4500' },
  { name: 'performance', bg: 'linear-gradient(135deg, rgba(34, 139, 34, 0.2), rgba(34, 139, 34, 0.1))', color: '#228B22', border: '#228B22' },
  { name: 'testing', bg: 'linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(138, 43, 226, 0.1))', color: '#8A2BE2', border: '#8A2BE2' },
  { name: 'default', bg: 'linear-gradient(135deg, var(--color-surface-3), var(--color-surface-2))', color: 'var(--text-secondary)', border: 'var(--color-border)' }
];

// 모든 태그를 순서대로 수집하고 색상 할당
function initializeTagColors() {
  const allTags = [];

  // 모든 프로젝트의 태그를 순서대로 수집
  items.forEach(item => {
    if (item.tags) {
      item.tags.forEach(tag => {
        if (!allTags.includes(tag)) {
          allTags.push(tag);
        }
      });
    }
  });

  // 순서대로 색상 할당 (default 제외)
  const availableColorPalette = tagColorPalette.filter(color => color.name !== 'default');

  allTags.forEach((tag, index) => {
    const colorIndex = index % availableColorPalette.length;
    const colorStyle = availableColorPalette[colorIndex];
    tagColorMap.set(tag, colorStyle.name);
  });
}

function getTagStyle(tag) {
  // 태그 색상이 초기화되지 않았다면 초기화
  if (tagColorMap.size === 0) {
    initializeTagColors();
  }

  // 이미 할당된 색상 반환
  if (tagColorMap.has(tag)) {
    return tagColorMap.get(tag);
  }

  // 새로운 태그인 경우 다음 순서의 색상 할당
  const availableColorPalette = tagColorPalette.filter(color => color.name !== 'default');
  const nextColorIndex = tagColorMap.size % availableColorPalette.length;
  const selectedStyle = availableColorPalette[nextColorIndex].name;

  tagColorMap.set(tag, selectedStyle);
  return selectedStyle;
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
  color: #ffffff;
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

.tag.react {
  background: linear-gradient(135deg, rgba(97, 218, 251, 0.2), rgba(97, 218, 251, 0.1));
  color: #61DAFB;
  border-color: #61DAFB;
}

.tag.next {
  background: linear-gradient(135deg, rgba(128, 0, 128, 0.2), rgba(128, 0, 128, 0.1));
  color: #800080;
  border-color: #800080;
}

.tag.typescript {
  background: linear-gradient(135deg, rgba(49, 120, 198, 0.2), rgba(49, 120, 198, 0.1));
  color: #3178C6;
  border-color: #3178C6;
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

.tag.database {
  background: linear-gradient(135deg, rgba(62, 175, 124, 0.2), rgba(62, 175, 124, 0.1));
  color: #3EAF7C;
  border-color: #3EAF7C;
}

.tag.cloud {
  background: linear-gradient(135deg, rgba(106, 90, 205, 0.2), rgba(106, 90, 205, 0.1));
  color: #6A5ACD;
  border-color: #6A5ACD;
}

.tag.css {
  background: linear-gradient(135deg, rgba(21, 114, 182, 0.2), rgba(21, 114, 182, 0.1));
  color: #1572B6;
  border-color: #1572B6;
}

.tag.api {
  background: linear-gradient(135deg, rgba(255, 107, 129, 0.2), rgba(255, 107, 129, 0.1));
  color: #FF6B81;
  border-color: #FF6B81;
}

.tag.security {
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.2), rgba(220, 53, 69, 0.1));
  color: #DC3545;
  border-color: #DC3545;
}

.tag.design {
  background: linear-gradient(135deg, rgba(255, 105, 180, 0.2), rgba(255, 105, 180, 0.1));
  color: #FF69B4;
  border-color: #FF69B4;
}

.tag.mobile {
  background: linear-gradient(135deg, rgba(255, 69, 0, 0.2), rgba(255, 69, 0, 0.1));
  color: #FF4500;
  border-color: #FF4500;
}

.tag.performance {
  background: linear-gradient(135deg, rgba(34, 139, 34, 0.2), rgba(34, 139, 34, 0.1));
  color: #228B22;
  border-color: #228B22;
}

.tag.testing {
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.2), rgba(138, 43, 226, 0.1));
  color: #8A2BE2;
  border-color: #8A2BE2;
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