<template>
  <div class="about-page">
    <!-- Animated Background -->
    <div class="page-background"></div>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <div class="avatar-section">
            <div class="avatar-wrapper">
              <el-avatar :size="160" class="hero-avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <div class="avatar-glow"></div>
            </div>
          </div>

          <div class="intro-section">
            <h1 class="hero-title">
              안녕하세요, <span class="highlight">황원희</span>입니다
            </h1>
            <p class="hero-subtitle">사용자 경험을 중시하는 풀스택 개발자</p>
            <p class="hero-description">
              Vue.js와 Node.js를 주력으로 하는 웹 개발자로,
              사용자 중심의 인터페이스와 효율적인 백엔드 시스템 구축에 집중하고 있습니다.
            </p>

            <div class="hero-stats">
              <div class="stat-item">
                <div class="stat-number">2+</div>
                <div class="stat-label">Years</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">15+</div>
                <div class="stat-label">Projects</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">5+</div>
                <div class="stat-label">Technologies</div>
              </div>
            </div>

            <div class="hero-actions">
              <el-button type="primary" size="large" class="cta-button" @click="downloadResume">
                <el-icon><Download /></el-icon>
                이력서 다운로드
              </el-button>
              <el-button size="large" class="secondary-button" @click="scrollToContact">
                <el-icon><Message /></el-icon>
                연락하기
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section class="skills-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">
            <el-icon class="section-icon"><Tools /></el-icon>
            기술 스택
          </h2>
          <p class="section-subtitle">현재 사용하고 있는 주요 기술들입니다</p>
        </div>

        <div class="skills-grid">
          <div v-for="category in skills" :key="category.name" class="skill-category">
            <h3 class="category-title">{{ category.name }}</h3>
            <div class="skills-list">
              <div
                v-for="skill in category.items"
                :key="skill.name"
                class="skill-item"
                :style="{ animationDelay: skill.delay }"
              >
                <div class="skill-info">
                  <div class="skill-icon" v-html="skill.icon"></div>
                  <span class="skill-name">{{ skill.name }}</span>
                  <span class="skill-level">{{ skill.level }}%</span>
                </div>
                <div class="skill-bar">
                  <div
                    class="skill-progress"
                    :style="{
                      width: skill.level + '%',
                      backgroundColor: skill.color
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Timeline -->
    <section class="projects-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">
            <el-icon class="section-icon"><FolderOpened /></el-icon>
            주요 프로젝트
          </h2>
          <p class="section-subtitle">최근에 진행한 프로젝트들을 소개합니다</p>
        </div>

        <div class="timeline">
          <div v-for="(project, index) in projects" :key="project.id" class="timeline-item">
            <div class="timeline-marker" :style="{ animationDelay: index * 0.3 + 's' }"></div>
            <div class="timeline-content">
              <div class="project-card">
                <div class="project-header">
                  <h3 class="project-title">{{ project.title }}</h3>
                  <span class="project-period">{{ project.period }}</span>
                </div>
                <p class="project-description">{{ project.description }}</p>
                <div class="project-tech">
                  <span v-for="tech in project.tech" :key="tech" class="tech-badge">
                    {{ tech }}
                  </span>
                </div>
                <div class="project-features">
                  <h4 class="features-title">주요 기능</h4>
                  <ul class="features-list">
                    <li v-for="feature in project.features" :key="feature">{{ feature }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">
            <el-icon class="section-icon"><Trophy /></el-icon>
            개발 가치관
          </h2>
          <p class="section-subtitle">개발을 할 때 중요하게 생각하는 가치들입니다</p>
        </div>

        <div class="values-grid">
          <div v-for="value in values" :key="value.title" class="value-card">
            <div class="value-icon">
              <el-icon :style="{ color: value.color }">
                <component :is="value.icon" />
              </el-icon>
            </div>
            <h3 class="value-title">{{ value.title }}</h3>
            <p class="value-description">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section" id="contact">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">
            <el-icon class="section-icon"><Message /></el-icon>
            연락처
          </h2>
          <p class="section-subtitle">언제든지 연락주세요!</p>
        </div>

        <div class="contact-grid">
          <div class="contact-item">
            <div class="contact-icon">
              <el-icon><Message /></el-icon>
            </div>
            <div class="contact-info">
              <h3 class="contact-title">이메일</h3>
              <p class="contact-detail">hwh950105@example.com</p>
            </div>
          </div>

          <div class="contact-item">
            <div class="contact-icon">
              <el-icon><Link /></el-icon>
            </div>
            <div class="contact-info">
              <h3 class="contact-title">웹사이트</h3>
              <p class="contact-detail">hwh95.shop</p>
            </div>
          </div>

          <div class="contact-item">
            <div class="contact-icon">
              <el-icon><Link /></el-icon>
            </div>
            <div class="contact-info">
              <h3 class="contact-title">GitHub</h3>
              <p class="contact-detail">github.com/hwh950105</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  User, Download, Message, Tools, FolderOpened, Trophy, Link,
  Check, Sunny, Aim, Star, TrendCharts, UserFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { generateResumePDF } from '@/utils/pdfGenerator'

// 기술 스택 데이터
const skills = ref([
  {
    name: '프론트엔드',
    items: [
      { name: 'Vue.js', level: 90, color: '#4FC08D', icon: '<i class="devicon-vuejs-plain colored"></i>', delay: '0.1s' },
      { name: 'React', level: 85, color: '#61DAFB', icon: '<i class="devicon-react-plain colored"></i>', delay: '0.2s' },
      { name: 'JavaScript', level: 90, color: '#F7DF1E', icon: '<i class="devicon-javascript-plain colored"></i>', delay: '0.3s' },
      { name: 'TypeScript', level: 80, color: '#3178C6', icon: '<i class="devicon-typescript-plain colored"></i>', delay: '0.4s' },
      { name: 'HTML5/CSS3', level: 95, color: '#E34F26', icon: '<i class="devicon-html5-plain colored"></i>', delay: '0.5s' }
    ]
  },
  {
    name: '백엔드',
    items: [
      { name: 'Node.js', level: 85, color: '#339933', icon: '<i class="devicon-nodejs-plain colored"></i>', delay: '0.1s' },
      { name: 'Python', level: 80, color: '#3776AB', icon: '<i class="devicon-python-plain colored"></i>', delay: '0.2s' },
      { name: 'Express.js', level: 85, color: '#000000', icon: '<i class="devicon-express-original"></i>', delay: '0.3s' },
      { name: 'MongoDB', level: 75, color: '#47A248', icon: '<i class="devicon-mongodb-plain colored"></i>', delay: '0.4s' },
      { name: 'MySQL', level: 80, color: '#4479A1', icon: '<i class="devicon-mysql-plain colored"></i>', delay: '0.5s' }
    ]
  },
  {
    name: '도구 & 기타',
    items: [
      { name: 'Git', level: 90, color: '#F05032', icon: '<i class="devicon-git-plain colored"></i>', delay: '0.1s' },
      { name: 'Docker', level: 70, color: '#2496ED', icon: '<i class="devicon-docker-plain colored"></i>', delay: '0.2s' },
      { name: 'Firebase', level: 85, color: '#FFCA28', icon: '<i class="devicon-firebase-plain colored"></i>', delay: '0.3s' },
      { name: 'Vite', level: 85, color: '#646CFF', icon: '<i class="devicon-vite-original colored"></i>', delay: '0.4s' },
      { name: 'Element Plus', level: 90, color: '#409EFF', icon: '🎨', delay: '0.5s' }
    ]
  }
])

// 프로젝트 데이터
const projects = ref([
  {
    id: 1,
    title: 'HWH 개인 블로그',
    period: '2024.09 - 현재',
    description: 'Vue 3와 Vite를 기반으로 한 개인 포트폴리오 블로그입니다. 모던한 UI/UX와 다양한 기능을 제공합니다.',
    tech: ['Vue3', 'Vite', 'Element Plus', 'Firebase', 'Notion API'],
    features: [
      '반응형 웹 디자인으로 모바일/데스크톱 최적화',
      'Notion API 연동으로 동적 콘텐츠 관리',
      '다크/라이트 테마 전환 기능',
      'PDF 이력서 다운로드 기능',
      '실시간 암호화폐 가격 조회',
      'GitHub 레포지토리 연동'
    ]
  },
  {
    id: 2,
    title: '암호화폐 포트폴리오',
    period: '2024.08 - 2024.09',
    description: '실시간 암호화폐 가격을 추적하고 포트폴리오를 관리할 수 있는 웹 애플리케이션입니다.',
    tech: ['React', 'TypeScript', 'Chart.js', 'CoinGecko API'],
    features: [
      '실시간 가격 데이터 시각화',
      '포트폴리오 수익률 계산',
      '가격 알림 기능',
      '차트 분석 도구'
    ]
  },
  {
    id: 3,
    title: '할일 관리 앱',
    period: '2024.07 - 2024.08',
    description: '드래그 앤 드롭이 가능한 칸반 스타일의 할일 관리 도구입니다.',
    tech: ['Vue3', 'Pinia', 'Vuedraggable', 'LocalStorage'],
    features: [
      '직관적인 드래그 앤 드롭 인터페이스',
      '상태별 작업 분류',
      '로컬 스토리지 데이터 지속성',
      '반응형 디자인'
    ]
  }
])

// 개발 가치관 데이터
const values = ref([
  {
    icon: UserFilled,
    title: '사용자 중심 개발',
    description: '사용자의 니즈를 깊이 이해하고, 직관적이고 편리한 인터페이스를 만들어 최고의 경험을 제공합니다.',
    color: '#409EFF'
  },
  {
    icon: Star,
    title: '지속적 학습',
    description: '빠르게 변화하는 기술 환경에 적응하기 위해 끊임없이 학습하고 새로운 기술을 탐구합니다.',
    color: '#67C23A'
  },
  {
    icon: Check,
    title: '코드 품질',
    description: '깔끔하고 유지보수하기 쉬운 코드를 작성하며, 테스트를 통해 안정성을 보장합니다.',
    color: '#E6A23C'
  },
  {
    icon: UserFilled,
    title: '협업과 소통',
    description: '팀원들과의 원활한 소통을 통해 프로젝트의 목표를 달성하고 함께 성장합니다.',
    color: '#F56C6C'
  }
])

// PDF 다운로드 함수
const downloadResume = async () => {
  try {
    await generateResumePDF('황원희_이력서.pdf')
    ElMessage.success('이력서 PDF 다운로드가 완료되었습니다!')
  } catch (error) {
    console.error('PDF 생성 중 오류 발생:', error)
    ElMessage.error('PDF 다운로드 중 오류가 발생했습니다.')
  }
}

// 연락처 섹션으로 스크롤
const scrollToContact = () => {
  const contactSection = document.getElementById('contact')
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
/* Page Layout */
.about-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Animated Background */
.page-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.1) 0%, transparent 60%),
    radial-gradient(circle at 80% 70%, rgba(240, 147, 251, 0.08) 0%, transparent 60%),
    radial-gradient(circle at 40% 80%, rgba(79, 172, 254, 0.06) 0%, transparent 60%);
  animation: floatBackground 30s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes floatBackground {
  0%, 100% {
    background-position: 0% 0%, 100% 100%, 50% 80%;
    opacity: 1;
  }
  50% {
    background-position: 30% 20%, 70% 80%, 80% 40%;
    opacity: 0.8;
  }
}

/* Hero Section */
.hero-section {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 3rem 2rem;
  background: var(--color-surface-1);
  backdrop-filter: var(--blur-lg);
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.hero-content {
  display: flex;
  align-items: center;
  gap: 4rem;
}

.avatar-section {
  flex-shrink: 0;
}

.avatar-wrapper {
  position: relative;
}

.hero-avatar {
  background: var(--color-primary);
  color: white;
  font-size: 4rem;
  border: 4px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-xl), 0 0 40px rgba(102, 126, 234, 0.3);
  transition: all 0.4s var(--ease-fluid);
}

.hero-avatar:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-xl), 0 0 60px rgba(102, 126, 234, 0.5);
}

.avatar-glow {
  position: absolute;
  inset: -15px;
  background: conic-gradient(
    from 0deg,
    rgba(102, 126, 234, 0.4),
    rgba(240, 147, 251, 0.4),
    rgba(79, 172, 254, 0.4),
    rgba(102, 126, 234, 0.4)
  );
  border-radius: 50%;
  filter: blur(20px);
  opacity: 0.7;
  animation: rotate 6s linear infinite;
  z-index: -1;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.intro-section {
  flex: 1;
}

.hero-title {
  font-size: 3rem;
  font-weight: 900;
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.highlight {
  background: var(--color-primary);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-accent);
  margin-bottom: 1rem;
}

.hero-description {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 600px;
}

.hero-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 900;
  color: var(--color-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-button, .secondary-button {
  min-width: 160px;
  height: 50px;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s var(--ease-fluid);
  position: relative;
  overflow: hidden;
}

.cta-button::before, .secondary-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.cta-button:hover::before, .secondary-button:hover::before {
  transform: translateX(100%);
}

.cta-button {
  background: var(--color-primary);
  border: none;
  box-shadow: var(--shadow-lg), 0 0 20px rgba(102, 126, 234, 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl), 0 0 30px rgba(102, 126, 234, 0.5);
}

.secondary-button {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  color: var(--text-primary);
}

.secondary-button:hover {
  background: var(--color-surface-3);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Section Styles */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  position: relative;
  z-index: 2;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.section-icon {
  color: var(--color-primary);
  font-size: 2.5rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

/* Skills Section */
.skills-section {
  background: var(--color-surface-1);
  backdrop-filter: var(--blur-lg);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.skill-category {
  background: var(--color-surface-2);
  padding: 2rem;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
  transition: all 0.4s var(--ease-fluid);
}

.skill-category:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.category-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  text-align: center;
}

.skills-list {
  display: grid;
  gap: 1.2rem;
}

.skill-item {
  animation: slideInUp 0.6s var(--ease-fluid) both;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.skill-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.skill-icon {
  font-size: 1.5rem;
}

.skill-name {
  flex: 1;
  font-weight: 600;
  color: var(--text-primary);
}

.skill-level {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.skill-bar {
  height: 8px;
  background: var(--color-surface-3);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  border-radius: var(--radius-sm);
  transition: width 1.5s var(--ease-fluid);
  position: relative;
  overflow: hidden;
}

.skill-progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Projects Section */
.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(
    to bottom,
    var(--color-primary),
    var(--color-accent),
    var(--color-primary)
  );
  border-radius: var(--radius-sm);
}

.timeline-item {
  position: relative;
  margin-bottom: 3rem;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -2rem;
  top: 1rem;
  width: 14px;
  height: 14px;
  background: var(--color-primary);
  border: 3px solid var(--color-bg);
  border-radius: 50%;
  box-shadow: var(--shadow-md);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
  }
  70% {
    box-shadow: 0 0 0 12px rgba(102, 126, 234, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
  }
}

.timeline-content {
  margin-left: 1rem;
}

.project-card {
  background: var(--color-surface-1);
  backdrop-filter: var(--blur-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  transition: all 0.4s var(--ease-fluid);
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl), 0 20px 40px rgba(0, 0, 0, 0.1);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.project-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.project-period {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
}

.project-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tech-badge {
  background: var(--color-primary);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-weight: 500;
}

.features-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.75rem 0;
}

.features-list {
  margin: 0;
  padding-left: 1.5rem;
  color: var(--text-secondary);
}

.features-list li {
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

/* Values Section */
.values-section {
  background: var(--color-surface-1);
  backdrop-filter: var(--blur-lg);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.value-card {
  background: var(--color-surface-2);
  padding: 2rem;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
  text-align: center;
  transition: all 0.4s var(--ease-fluid);
}

.value-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl), 0 20px 40px rgba(0, 0, 0, 0.1);
}

.value-icon {
  background: var(--color-surface-3);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;
  font-size: 2rem;
  transition: all 0.3s var(--ease-fluid);
}

.value-card:hover .value-icon {
  transform: scale(1.1);
}

.value-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

.value-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* Contact Section */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: var(--color-surface-2);
  padding: 2rem;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
  transition: all 0.4s var(--ease-fluid);
}

.contact-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.contact-icon {
  background: var(--color-primary);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.contact-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.contact-detail {
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-stats {
    justify-content: center;
  }

  .hero-actions {
    justify-content: center;
  }

  .section-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .values-grid {
    grid-template-columns: 1fr;
  }

  .contact-grid {
    grid-template-columns: 1fr;
  }

  .timeline {
    padding-left: 1.5rem;
  }

  .project-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .section-container {
    padding: 3rem 1rem;
  }

  .hero-section {
    padding: 2rem 1rem;
  }
}

/* Print Styles */
@media print {
  .page-background,
  .hero-actions,
  .avatar-glow {
    display: none !important;
  }

  .hero-section,
  .skills-section,
  .values-section {
    background: white !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
  }
}
</style>