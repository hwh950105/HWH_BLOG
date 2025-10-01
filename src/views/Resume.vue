<template>
  <div class="resume-page" :class="{ printing: isPrinting }">
    <!-- Header Section -->
    <section class="resume-header">
      <div class="header-container">
        <div class="header-content">
          <div class="profile-section">
            <el-avatar :size="120" src="/profile.jpg" class="profile-avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
            <div class="profile-info">
              <h1 class="name">황우현 </h1>
              <h2 class="title">MES/POP 개발자</h2>
              <div class="contact-info">
                <div class="contact-item">
                  <el-icon><Message /></el-icon>
                  <span>ghk********@naver.com</span>
                </div>
                <div class="contact-item">
                  <el-icon><Phone /></el-icon>
                  <span>010-****-8077</span>
                </div>
                <div class="contact-item">
                  <el-icon><Link /></el-icon>
                  <a href="https://hwh95.shop" target="_blank" rel="noopener">hwh95.shop</a>
                </div>
                <div class="contact-item">
                  <el-icon><Link /></el-icon>
                  <a href="https://github.com/hwh950105" target="_blank" rel="noopener">github.com/hwh950105</a>
                </div>
              </div>
            </div>
          </div>

          <div class="actions-section no-print">
            <el-button type="primary" size="large" @click="downloadPDF">
              <el-icon><Download /></el-icon>
              PDF 다운로드
            </el-button>
            <el-button size="large" @click="printResume">
              <el-icon><Printer /></el-icon>
              인쇄하기
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- Resume Content -->
    <div class="resume-content">
      <div class="container">
        <div class="resume-grid">
          <!-- Left Column -->
          <div class="left-column">
            <!-- Skills -->
            <section class="resume-section">
              <h3 class="section-title">
                <el-icon><Tools /></el-icon>
                기술 스택
              </h3>
              <div class="skills-categories">
                <div class="skill-category" v-for="category in skills" :key="category.name">
                  <h4 class="category-name">{{ category.name }}</h4>
                  <div class="skill-tags">
                    <el-tag
                      v-for="skill in category.skills"
                      :key="skill.name"
                      :type="getSkillType(skill.level)"
                      class="skill-tag"
                    >
                      {{ skill.name }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </section>

            <!-- Education -->
            <section class="resume-section">
              <h3 class="section-title">
                <el-icon><School /></el-icon>
                학력
              </h3>
              <div class="education-list">
                <div class="education-item" v-for="edu in education" :key="edu.id">
                  <div class="edu-period">{{ edu.period }}</div>
                  <div class="edu-content">
                    <h4 class="edu-school">{{ edu.school }}</h4>
                    <p class="edu-major">{{ edu.major }}</p>
                    <p class="edu-status">{{ edu.status }}</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Certificates -->

          </div>

          <!-- Right Column -->
          <div class="right-column">
            <!-- Summary -->
            <section v-if="showSummary" class="resume-section">
              <h3 class="section-title">
                <el-icon><User /></el-icon>
                자기소개
              </h3>
              <div class="summary-content">
                <p>
                  MES/POP 중심의 현장 실무에서 5년 이상 경험을 쌓은 백엔드/서버 개발자야. C#/.NET 기반 WinForm & 서비스, .NET MVC, PostgreSQL/Oracle 등 DB, Kafka 메시징, OPC‒UA 설비 인터페이스까지 전 주기로 다뤄왔어. Vue3·Spring 기반의 Web UI 보강도 경험했고.
                </p>
                <p>
                  목표는 <strong>현장 데이터의 신뢰도와 가용성</strong>을 높이는 거. 장애 포인트를 빠르게 찾아 안정화하고, 유지보수성이 높은 구조로 꾸준히 개선해. 실사용자와의 커뮤니케이션, 로그/모니터링 체계, 배포 안전장치(SOP)까지 챙겨.
                </p>
              </div>
            </section>

            <!-- Experience -->
            <section class="resume-section">
              <h3 class="section-title">
                <el-icon><Briefcase /></el-icon>
                프로젝트 경험
              </h3>
              <div class="experience-list">
                <div class="experience-item" v-for="exp in experiences" :key="exp.id">
                  <div class="exp-header">
                    <div class="exp-title-group">
                      <h4 class="exp-title">{{ exp.title }}</h4>
                      <span class="exp-period">{{ exp.period }}</span>
                    </div>
                    <div class="exp-type">{{ exp.type }}</div>
                  </div>

                  <div class="exp-content">
                    <p class="exp-company" v-if="exp.company">{{ exp.company }}</p>
                    <p class="exp-description">{{ exp.description }}</p>

                    <div class="exp-details" v-if="exp.features?.length">
                      <h5>주요 기능</h5>
                      <ul>
                        <li v-for="feature in exp.features" :key="feature">{{ feature }}</li>
                      </ul>
                    </div>

                    <div class="exp-achievements" v-if="exp.achievements?.length">
                      <h5>성과</h5>
                      <ul>
                        <li v-for="achievement in exp.achievements" :key="achievement">{{ achievement }}</li>
                      </ul>
                    </div>

                    <div class="exp-tech" v-if="exp.technologies?.length">
                      <h5>사용 기술</h5>
                      <div class="tech-tags">
                        <el-tag
                          v-for="tech in exp.technologies"
                          :key="tech"
                          size="small"
                          class="tech-tag"
                        >
                          {{ tech }}
                        </el-tag>
                      </div>
                    </div>

                    <div class="exp-links" v-if="exp.links?.length">
                      <div class="link-item" v-for="link in exp.links" :key="link.type">
                        <a :href="link.url" target="_blank" rel="noopener" class="link-btn">
                          <el-icon><Link /></el-icon>
                          <span>{{ link.type }}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  User, Message, Phone, Link, Download, Printer, Tools, School,
  Medal, Briefcase
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { generateResumePDF } from '@/utils/pdfGenerator'

// 상태: 인쇄 중 감지해서 인쇄용 스타일 토글
const isPrinting = ref(false)
const showSummary = ref(false)
const onBeforePrint = () => (isPrinting.value = true)
const onAfterPrint = () => (isPrinting.value = false)

onMounted(() => {
  window.addEventListener('beforeprint', onBeforePrint)
  window.addEventListener('afterprint', onAfterPrint)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeprint', onBeforePrint)
  window.removeEventListener('afterprint', onAfterPrint)
})

// 기술 스택 데이터 (이력서 기반 정리)
const skills = ref([
  {
    name: 'Backend',
    skills: [
      { name: 'C# / .NET (WinForm, Service, MVC)', level: 'advanced' },
      { name: 'Java', level: 'intermediate' },
      { name: 'Node.js', level: 'intermediate' }
    ]
  },
  {
    name: 'Frontend / Mobile',
    skills: [
      { name: 'Vue.js', level: 'advanced' },
      { name: 'JavaScript / jQuery', level: 'advanced' },
      { name: 'Bootstrap', level: 'intermediate' },
      // { name: 'Flutter', level: 'beginner' }
    ]
  },
  {
    name: 'Database',
    skills: [
      { name: 'PostgreSQL', level: 'advanced' },
      { name: 'Oracle', level: 'intermediate' },
      { name: 'MSSQL', level: 'intermediate' },
      { name: 'MySQL / MariaDB', level: 'intermediate' }
    ]
  },
  {
    name: 'Infra & Etc.',
    skills: [
      { name: 'Kafka', level: 'intermediate' },
      { name: 'OPC‒UA', level: 'intermediate' },
      { name: 'Windows Server', level: 'intermediate' },
      { name: 'Git', level: 'advanced' },
      { name: 'REST API', level: 'advanced' }
    ]
  }
])

// 학력 데이터
const education = ref([
  {
    id: 1,
    period: '2014.03 - 2020.02',
    school: '남서울대학교 (4년제)',
    major: '정보통신공학과',
    status: '졸업 (GPA 3.13/4.5)'
  },
  {
    id: 2,
    period: '2011.03 - 2013.12',
    school: '신천고등학교',
    major: '이과',
    status: '졸업'
  }
])

// 자격증 & 어학 (사용자 템플릿 유지)
const certificates = ref([
  { id: 1, date: '2023.06', name: '정보처리기사', issuer: '한국산업인력공단', score: null },
  { id: 2, date: '2022.12', name: 'TOEIC', issuer: 'ETS', score: '850점' }
])

// 프로젝트 / 경력 (이력서 기반 요약)
const experiences = ref([
  {
    id: 101,
    title: '현대위아 MES 구축 ',
    period: '2025.01 - 2025.06.10',
    type: '구축',
    company: '(주)콘웰',
    description: 'PLC–MES 인터페이스 및 Web UI 구축',
    features: [
      'OPC‒UA 설비 통신 및 데이터 수집',
      '기존 시스템 연계, Web UI 신규 페이지 구성'
    ],
    technologies: [ 'C#/.NET', 'WinForm/Service', 'PostgreSQL', 'OPC UA', 'JavaScript', 'Vue3', 'Spring' ]
  },
  {
    id: 102,
    title: '금호폴리켐 RTDB → PI 시스템 데이터 이관',
    period: '2024.12',
    type: '데이터 이관',
    company: '(주)콘웰',
    description: '5년치 RTDB 실시간 데이터를 PI로 이관하며 정합성 검증/배치 구성',
    technologies: [ 'PI System', 'RTDB', '배치 처리' ]
  },
  {
    id: 103,
    title: '삼성엔지니어링 파이프 MES 고도화/안정화',
    period: '2024.02 - 2024.12',
    type: '개선/안정화',
    company: '(주)콘웰',
    description: '현장 설비–MES 간 OPC 기반 인터페이스 개선 및 오류 안정화',
    technologies: [ 'C# (.NET MVC)', 'Oracle', 'JavaScript', 'jQuery', 'OPC' ]
  },
  {
    id: 104,
    title: '면사랑 POP 신규 구축',
    period: '2024.11 - 2024.12',
    type: '구축',
    company: '(주)콘웰',
    description: 'Kafka 기반 생산 실적 처리 로직 설계 및 구현',
    technologies: [ 'MSSQL', 'Kafka' ]
  },
  {
    id: 105,
    title: '풀무원 POP 유지보수',
    period: '2023.11 - 2024.11',
    type: '유지보수/개선',
    company: '(주)콘웰',
    description: 'POP 기능 개선, Kafka 이벤트 처리 및 서비스 안정화',
    technologies: [ 'C# (WinForm/Service)', 'MySQL', 'Kafka' ]
  },
  {
    id: 106,
    title: '포스코DX PI MES IF',
    period: '2024.04 - 2024.05',
    type: '인터페이스',
    company: '(주)콘웰',
    description: 'MES–PI 시스템 연계용 서비스형 IF 프로그램 개발 및 오류 로깅',
    technologies: [ 'C# (Service)', 'PostgreSQL' ]
  },
  {
    id: 107,
    title: '삼성바이오 미들웨어 유지보수',
    period: '2022.12 - 2023.04',
    type: '유지보수/개선',
    company: '(주)콘웰',
    description: 'WinForm 기반 미들웨어 기능 보완 및 데이터 처리 로직 개선',
    technologies: [ 'C# (WinForm)', 'MSSQL' ]
  },
  {
    id: 201,
    title: '제조 비전시스템 제어 SW 개발',
    period: '2020.01 - 2022.04',
    type: '머신비전',
    company: '이루미',
    description: 'Cognex/VisionPro SDK 연동, PLC/센서 통신, 설비–MES IF 로직 구현',
    technologies: [ 'C# (WinForm)', 'PLC', 'TCP/IP·Serial', 'Cognex/VisionPro' ]
  },
  {
    id: 301,
    title: 'MES 개발 인턴',
    period: '2019.08 - 2019.09',
    type: '인턴십',
    company: 'GST Global',
    description: 'C#, DevExpress, MSSQL을 활용한 MES 화면/쿼리 실습',
    technologies: [ 'C#', 'MSSQL', 'DevExpress' ]
  },
  // 개인 프로젝트 (포트폴리오 사이트)
  // {
  //   id: 401,
  //   title: '개인 포트폴리오/블로그 (hwh95.shop)',
  //   period: '2025.04 - 현재',
  //   type: '개인 프로젝트',
  //   company: '',
  //   description: 'Vue3 + 무료 API로 학습/실험 기능을 모아둔 개인 도메인 페이지 운영',
  //   links: [
  //     { type: '사이트', url: 'https://hwh95.shop' },
  //     { type: '포트폴리오', url: 'https://hwh95.shop/포트폴리오' }
  //   ],
  //   technologies: [ 'Vue 3', 'Vite', 'Element Plus', 'Vercel' ]
  // }
])

// 스킬 레벨에 따른 태그 타입 결정
const getSkillType = (level) => {
  switch (level) {
    case 'advanced':
      return 'success'
    case 'intermediate':
      return 'warning'
    case 'beginner':
      return 'info'
    default:
      return ''
  }
}

// PDF 다운로드
const downloadPDF = async () => {
  try {
    ElMessage.info('PDF 생성 중...')
    const result = await generateResumePDF('황우현_이력서.pdf')
    if (result?.success) {
      ElMessage.success('PDF가 성공적으로 다운로드되었어!')
    } else {
      ElMessage.error(result?.message || 'PDF 생성에 실패했어.')
    }
  } catch (error) {
    console.error('PDF 다운로드 오류:', error)
    ElMessage.error('PDF 생성 중 오류가 발생했어.')
  }
}

// 인쇄
const printResume = () => {
  window.print()
}
</script>

<style scoped>
.resume-page {
  min-height: 100vh;
  background: var(--color-background);
  color: var(--text-primary);
}

/* Header */
.resume-header {
  background: linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2));
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-8) 0;
  box-shadow: var(--shadow-lg);
}
.header-container {
  max-width: 1440px;
  margin: 0;
  padding: 0 var(--space-5);
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--space-6);
}
.profile-section {
  display: flex;
  align-items: flex-start;
  gap: var(--space-5);
}
.profile-avatar {
  border: 3px solid var(--color-primary-solid);
  box-shadow: var(--shadow-md);
}
.name {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
  background: linear-gradient(135deg, var(--color-primary-solid), var(--color-secondary-solid));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.title {
  font-size: 1.1rem;
  color: var(--color-accent-solid);
  margin-bottom: var(--space-3);
  font-weight: 600;
}
.contact-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.contact-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.92rem;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}
.contact-item:hover {
  color: var(--text-primary);
  transform: translateX(4px);
}
.contact-item a {
  color: var(--text-primary);
  text-decoration: none;
  border-bottom: 1px dashed var(--color-border);
  transition: all 0.3s ease;
}
.contact-item a:hover {
  color: var(--color-primary-solid);
  border-bottom-color: var(--color-primary-solid);
}
.actions-section {
  display: flex;
  gap: var(--space-3);
  justify-content: flex-start;
}

/* Content */
.resume-content {
  padding: var(--space-8) 0;
}
.container {
  max-width: 1440px;
  margin: 0;
  padding: 0 var(--space-5);
}
.resume-grid {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: var(--space-6);
}
.left-column, .right-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* Section */
.resume-section {
  background: linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-5);
  box-shadow: var(--shadow-lg);
  transition: all 0.3s var(--ease-fluid);
  position: relative;
  overflow: hidden;
}
.resume-section:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary-solid);
}
.resume-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary-solid), var(--color-secondary-solid));
  opacity: 0;
  transition: opacity 0.3s ease;
}
.resume-section:hover::before {
  opacity: 1;
}
.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 2px solid var(--color-primary-solid);
}

/* Skills */
.skills-categories {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.skill-category {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.category-name {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 1rem;
  margin-bottom: var(--space-1);
}
.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.skill-tag {
  font-size: 0.8rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  color: var(--text-primary);
  transition: all 0.3s ease;
}
.skill-tag:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: var(--shadow-sm);
}

/* Education & Certificates */
.education-list, .certificates-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.education-item, .certificate-item {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-surface-2);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}
.education-item:hover, .certificate-item:hover {
  background: var(--color-surface-3);
  border-color: var(--color-primary-solid);
  transform: translateX(4px);
}
.edu-period, .cert-date {
  font-size: 0.85rem;
  color: var(--text-muted);
  min-width: 110px;
  font-weight: 600;
  flex-shrink: 0;
}
.edu-school, .cert-name {
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}
.edu-major, .cert-issuer, .edu-status, .cert-score {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 2px 0;
}

/* Summary */
.summary-content {
  line-height: 1.75;
  color: var(--text-secondary);
}
.summary-content strong {
  color: var(--text-primary);
  font-weight: 700;
}
.summary-content p {
  margin-bottom: var(--space-3);
}

/* Experience */
.experience-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
.experience-item {
  border-left: 2px solid var(--color-primary-solid);
  padding-left: var(--space-3);
  background: var(--color-surface-2);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  transition: all 0.3s var(--ease-fluid);
  position: relative;
}
.experience-item:hover {
  background: var(--color-surface-3);
  border-color: var(--color-primary-solid);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.exp-title-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.exp-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
}
.exp-period {
  font-size: 0.9rem;
  color: var(--text-muted);
}
.exp-type {
  background: var(--color-primary);
  color: white;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
  border: 1px solid var(--color-primary-solid);
  transition: all 0.3s ease;
}
.exp-type:hover {
  background: var(--color-primary-solid);
  color: white;
  transform: scale(1.05);
}
.exp-company {
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.95rem;
}
.exp-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.exp-description {
  color: var(--text-secondary);
  line-height: 1.6;
}
.exp-details h5, .exp-achievements h5, .exp-tech h5 {
  font-weight: 800;
  color: var(--text-primary);
  font-size: 0.95rem;
  margin: var(--space-1) 0;
}
.exp-details ul, .exp-achievements ul {
  margin: 0;
  padding-left: var(--space-4);
}
.exp-details li, .exp-achievements li {
  margin-bottom: var(--space-1);
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}
.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.tech-tag {
  background: var(--color-surface-3);
  border: 1px solid var(--color-border);
  color: var(--text-primary);
  font-size: 0.8rem;
  transition: all 0.3s ease;
}
.tech-tag:hover {
  background: var(--color-primary);
  border-color: var(--color-primary-solid);
  color: var(--color-primary-solid);
  transform: translateY(-1px);
}
.exp-links {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-2);
}
.link-item {
  display: flex;
}
.link-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg);
  background: var(--color-surface-3);
  border: 1px solid var(--color-border);
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.3s ease;
}
.link-btn:hover {
  border-color: var(--color-primary-solid);
  background: var(--color-primary);
  color: var(--color-primary-solid);
  box-shadow: var(--shadow-sm);
}

/* Responsive */
@media (max-width: 1024px) {
  .resume-grid {
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }
  .left-column {
    order: 2;
  }
  .right-column {
    order: 1;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: left;
  }
  .profile-section {
    flex-direction: column;
    text-align: left;
  }
  .contact-info {
    align-items: flex-start;
  }
  .resume-content {
    padding: var(--space-5) 0;
  }
  .container {
    padding: 0 var(--space-3);
  }
  .exp-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .exp-type {
    align-self: flex-start;
  }
  .resume-section {
    padding: var(--space-4);
  }
  .experience-item {
    padding: var(--space-4);
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0 var(--space-3);
  }
  .profile-avatar {
    width: 100px;
    height: 100px;
  }
  .name {
    font-size: 1.6rem;
  }
  .actions-section {
    flex-direction: column;
    width: 100%;
    align-items: flex-start;
  }
  .skill-tags, .tech-tags {
    gap: var(--space-1);
  }
  .exp-links {
    flex-direction: column;
    gap: var(--space-2);
  }
}

/* Print */
@media print {
  .resume-page {
    background: #fff !important;
    color: #222 !important;
  }
  .no-print {
    display: none !important;
  }
  .resume-section {
    box-shadow: none !important;
    border: 1px solid #ddd !important;
    background: #fff !important;
  }
  .resume-section::before {
    display: none !important;
  }
  .resume-grid {
    grid-template-columns: 280px 1fr !important;
  }
  .section-title {
    color: #111 !important;
    border-bottom-color: #666 !important;
  }
  .skill-tag, .tech-tag {
    background: #f5f5f5 !important;
    color: #333 !important;
    border-color: #e5e5e5 !important;
  }
  .name {
    color: #222 !important;
    -webkit-text-fill-color: #222 !important;
  }
  .education-item, .certificate-item, .experience-item {
    background: #fff !important;
    border-color: #ddd !important;
  }
}
</style>
