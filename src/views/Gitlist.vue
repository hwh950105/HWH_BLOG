<template>
  <div class="github-dashboard">
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
        </div>
        <div class="header-text">
          <h1 class="dashboard-title">GitHub 개발 대시보드</h1>
          <p class="dashboard-subtitle">실시간 개발 활동 및 통계</p>
        </div>
      </div>
      <div class="last-updated">
        마지막 업데이트: {{ lastUpdated }}
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>GitHub 데이터를 불러오는 중...</p>
    </div>

    <!-- 대시보드 콘텐츠 -->
    <div v-else class="dashboard-content">
      <!-- 통계 카드 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon repositories">📊</div>
          <div class="stat-content">
            <h3 class="stat-value">{{ stats.publicRepos }}</h3>
            <p class="stat-label">Public Repositories</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon followers">👥</div>
          <div class="stat-content">
            <h3 class="stat-value">{{ stats.followers }}</h3>
            <p class="stat-label">Followers</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon following">🤝</div>
          <div class="stat-content">
            <h3 class="stat-value">{{ stats.following }}</h3>
            <p class="stat-label">Following</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon gists">📝</div>
          <div class="stat-content">
            <h3 class="stat-value">{{ stats.publicGists }}</h3>
            <p class="stat-label">Public Gists</p>
          </div>
        </div>
      </div>

      <!-- GitHub 잔디 (Contribution Graph) -->
      <!-- <div class="contribution-graph">
        <div class="section-header">
          <h3 class="section-title">🌱 GitHub 잔디</h3>
          <p class="section-subtitle">최근 1년간 커밋 활동</p>
        </div>
        <div class="grass-container">
          <div class="grass-grid">
            <div v-for="(week, weekIndex) in contributionData" :key="weekIndex" class="grass-week">
              <div
                v-for="(day, dayIndex) in week"
                :key="dayIndex"
                class="grass-day"
                :class="[getContributionLevel(day.count), { 'future': day.future }]"
                :title="day.future ? `${day.date}: 미래 날짜` : `${day.date}: ${day.count}개 커밋`"
              ></div>
            </div>
          </div>
          <div class="grass-legend">
            <span class="legend-text">Less</span>
            <div class="legend-levels">
              <div class="legend-level level-0"></div>
              <div class="legend-level level-1"></div>
              <div class="legend-level level-2"></div>
              <div class="legend-level level-3"></div>
              <div class="legend-level level-4"></div>
            </div>
            <span class="legend-text">More</span>
          </div>
        </div>
      </div> -->

      <!-- 프로젝트 목록 -->
      <div class="projects-section">
        <div class="section-header">
          <h3 class="section-title">💼 주요 프로젝트</h3>
          <p class="section-subtitle">최근 업데이트 순</p>
        </div>
        <div class="projects-grid">
          <div
            v-for="project in topProjects"
            :key="project.id"
            class="project-card"
            @click="openProjectLink(project.html_url)"
          >
            <div class="project-header">
              <div class="project-info">
                <h4 class="project-name">
                  {{ project.name }}
                </h4>
                <p class="project-description">{{ project.description || '설명이 없습니다.' }}</p>
              </div>
              <div class="project-language" v-if="project.language">
                <span class="language-dot" :style="{ backgroundColor: getLanguageColor(project.language) }"></span>
                {{ project.language }}
              </div>
            </div>

            <div class="project-stats">
              <div class="stat-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                </svg>
                {{ project.stargazers_count }}
              </div>

              <div class="stat-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.25 2.25 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878z"/>
                </svg>
                {{ project.forks_count }}
              </div>

              <div class="stat-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25V2.75A1.75 1.75 0 0014.25 1H1.75zM1.5 2.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25V9.5L12 7.5 9.75 9.75 7 7 1.5 12.5V2.75z"/>
                  <path d="M5 6a1 1 0 11-2 0 1 1 0 012 0z"/>
                </svg>
                {{ formatFileSize(project.size) }}
              </div>

              <div class="stat-item updated">
                {{ formatDate(project.updated_at) }} 업데이트
              </div>
            </div>

            <div class="project-topics" v-if="project.topics && project.topics.length">
              <span v-for="topic in project.topics.slice(0, 3)" :key="topic" class="topic-tag">
                {{ topic }}
              </span>
              <span v-if="project.topics.length > 3" class="topic-more">
                +{{ project.topics.length - 3 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 최근 커밋 히스토리 -->
      <div class="recent-commits">
        <div class="section-header">
          <h3 class="section-title">🔄 최근 커밋 활동</h3>
          <div class="section-actions">
            <button @click="refreshData" class="refresh-btn" :disabled="loading">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
              새로고침
            </button>
          </div>
        </div>

        <div class="commits-list">
          <div v-for="commit in recentCommits" :key="commit.sha" class="commit-item">
            <div class="commit-avatar">
              <img
                :src="commit.author?.avatar_url || 'https://github.com/identicons/default.png'"
                :alt="commit.author?.login || 'Unknown'"
              />
            </div>
            <div class="commit-content">
              <div class="commit-message">{{ commit.commit.message }}</div>
              <div class="commit-meta">
                <span class="commit-author">{{ commit.author?.login || commit.commit.author.name || 'Unknown' }}</span>
                <span class="commit-separator">•</span>
                <span class="commit-date">{{ formatDate(commit.commit.author.date) }}</span>
                <span class="commit-separator">•</span>
                <span class="commit-repo">{{ commit.repository }}</span>
              </div>
            </div>
            <div class="commit-actions">
              <a :href="commit.html_url" target="_blank" rel="noopener" class="commit-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 에러 상태 -->
    <div v-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>데이터를 불러올 수 없습니다</h3>
      <p>{{ error }}</p>
      <button @click="refreshData" class="retry-btn">다시 시도</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js'

// Chart.js 등록
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement)

// GitHub 사용자명 (실제 사용자명으로 변경)
const GITHUB_USERNAME = 'hwh950105'

// 반응형 데이터
const loading = ref(true)
const error = ref(null)
const lastUpdated = ref('')
const stats = ref({
  publicRepos: 0,
  followers: 0,
  following: 0,
  publicGists: 0
})
const recentCommits = ref([])
const contributionData = ref([])
const topProjects = ref([])
const languageChart = ref(null)
const commitChart = ref(null)

// 차트 인스턴스
let languageChartInstance = null
let commitChartInstance = null

// GitHub API 호출 함수
async function fetchGitHubData() {
  try {
    loading.value = true
    error.value = null

    // 사용자 정보 가져오기
    const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
    if (!userResponse.ok) throw new Error('사용자 정보를 가져올 수 없습니다')
    const userData = await userResponse.json()

    stats.value = {
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      publicGists: userData.public_gists
    }

    // 리포지토리 목록 가져오기
    const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`)
    if (!reposResponse.ok) throw new Error('리포지토리 정보를 가져올 수 없습니다')
    const reposData = await reposResponse.json()

    // 언어 통계 계산
    const languageStats = {}
    reposData.forEach(repo => {
      if (repo.language) {
        languageStats[repo.language] = (languageStats[repo.language] || 0) + 1
      }
    })

    // 모든 리포지토리에서 최근 1년간의 커밋 데이터 수집
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    const commitPromises = reposData.map(async repo => {
      try {
        // 더 많은 커밋을 가져와서 1년간의 데이터 수집
        const commitsResponse = await fetch(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/commits?since=${oneYearAgo.toISOString()}&per_page=100`
        )
        if (commitsResponse.ok) {
          const commits = await commitsResponse.json()
          return commits
            .filter(commit => commit.author && commit.author.login === GITHUB_USERNAME) // 본인 커밋만
            .map(commit => ({
              ...commit,
              repository: repo.name
            }))
        }
        return []
      } catch {
        return []
      }
    })

    const allCommits = await Promise.all(commitPromises)
    const flatCommits = allCommits
      .flat()
      .filter(commit => commit && commit.commit && commit.commit.author)

    // 최근 커밋 목록 (표시용)
    recentCommits.value = flatCommits
      .sort((a, b) => new Date(b.commit.author.date) - new Date(a.commit.author.date))
      .slice(0, 10)

    // 실제 커밋 데이터로 잔디 생성
    generateContributionDataFromCommits(flatCommits)

    // 프로젝트 목록 설정 (상위 8개)
    topProjects.value = reposData
      .filter(repo => !repo.fork) // 포크가 아닌 원본 프로젝트만
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 8)

    // 차트 생성
    await nextTick()
    createLanguageChart(languageStats)
    createCommitChart()

    lastUpdated.value = new Date().toLocaleString('ko-KR')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// 언어 통계 차트 생성
function createLanguageChart(languageStats) {
  if (languageChartInstance) {
    languageChartInstance.destroy()
  }

  const ctx = languageChart.value?.getContext('2d')
  if (!ctx) return

  const languages = Object.keys(languageStats).slice(0, 6)
  const counts = languages.map(lang => languageStats[lang])

  const colors = [
    '#4FC08D', '#61DAFB', '#3178C6', '#FF6B81', '#FFB700', '#6A5ACD'
  ]

  languageChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: languages,
      datasets: [{
        data: counts,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            padding: 15,
            color: 'var(--text-primary)'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = Math.round((context.parsed / total) * 100)
              return `${context.label}: ${context.parsed}개 (${percentage}%)`
            }
          }
        }
      }
    }
  })
}

// 커밋 활동 차트 생성
function createCommitChart() {
  if (commitChartInstance) {
    commitChartInstance.destroy()
  }

  const ctx = commitChart.value?.getContext('2d')
  if (!ctx) return

  // 최근 7일간의 커밋 수 계산 (더미 데이터)
  const last7Days = []
  const commitCounts = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    last7Days.push(date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }))
    commitCounts.push(Math.floor(Math.random() * 10) + 1) // 더미 데이터
  }

  commitChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: last7Days,
      datasets: [{
        label: '커밋 수',
        data: commitCounts,
        borderColor: '#4FC08D',
        backgroundColor: 'rgba(79, 192, 141, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#4FC08D',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: 'var(--text-secondary)'
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: 'var(--text-secondary)',
            stepSize: 1
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  })
}

// 날짜 포맷 함수
function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return '1일 전'
  if (diffDays < 7) return `${diffDays}일 전`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`
  return date.toLocaleDateString('ko-KR')
}

// 실제 커밋 데이터로 잔디 생성
function generateContributionDataFromCommits(commits) {
  const weeks = []
  const today = new Date()

  // 커밋 데이터를 날짜별로 그룹화
  const commitsByDate = {}
  commits.forEach(commit => {
    if (commit.commit && commit.commit.author && commit.commit.author.date) {
      const date = commit.commit.author.date.split('T')[0] // YYYY-MM-DD 형식
      commitsByDate[date] = (commitsByDate[date] || 0) + 1
    }
  })

  // 정확히 365일 전부터 시작 (1년)
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - 364) // 365일 전 (오늘 포함)

  // 시작일을 일요일로 맞춤 (GitHub 잔디는 일요일부터 시작)
  const startDay = startDate.getDay()
  if (startDay !== 0) {
    startDate.setDate(startDate.getDate() - startDay)
  }

  // 53주 동안 생성
  for (let week = 0; week < 53; week++) {
    const days = []
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + (week * 7) + day)

      // 오늘 이후 날짜는 표시하지 않음
      if (currentDate > today) {
        days.push({
          date: currentDate.toISOString().split('T')[0],
          count: 0,
          future: true
        })
      } else {
        const dateStr = currentDate.toISOString().split('T')[0]
        const count = commitsByDate[dateStr] || 0
        days.push({
          date: dateStr,
          count: count,
          future: false
        })
      }
    }
    weeks.push(days)
  }

  contributionData.value = weeks
}

// 잔디 데이터 생성 (더미 데이터 - 백업용)
function generateContributionData() {
  const weeks = []
  const today = new Date()

  // 정확히 365일 전부터 시작 (1년)
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - 364) // 365일 전 (오늘 포함)

  // 시작일을 일요일로 맞춤 (GitHub 잔디는 일요일부터 시작)
  const startDay = startDate.getDay()
  if (startDay !== 0) {
    startDate.setDate(startDate.getDate() - startDay)
  }

  // 53주 동안 생성
  for (let week = 0; week < 53; week++) {
    const days = []
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + (week * 7) + day)

      // 오늘 이후 날짜는 표시하지 않음
      if (currentDate > today) {
        days.push({
          date: currentDate.toISOString().split('T')[0],
          count: 0,
          future: true
        })
      } else {
        // 더미 커밋 데이터 (0-15개 랜덤)
        const count = Math.random() < 0.7 ? Math.floor(Math.random() * 15) : 0
        days.push({
          date: currentDate.toISOString().split('T')[0],
          count: count,
          future: false
        })
      }
    }
    weeks.push(days)
  }

  contributionData.value = weeks
}

// 기여도 레벨 계산
function getContributionLevel(count) {
  if (count === 0) return 'level-0'
  if (count <= 3) return 'level-1'
  if (count <= 6) return 'level-2'
  if (count <= 9) return 'level-3'
  return 'level-4'
}

// 언어별 색상
function getLanguageColor(language) {
  const colors = {
    'JavaScript': '#f7df1e',
    'TypeScript': '#3178c6',
    'Vue': '#4fc08d',
    'React': '#61dafb',
    'Python': '#3776ab',
    'Java': '#ed8b00',
    'C++': '#00599c',
    'C#': '#239120',
    'PHP': '#777bb4',
    'Go': '#00add8',
    'Rust': '#000000',
    'Swift': '#fa7343',
    'Kotlin': '#7f52ff',
    'Ruby': '#cc342d',
    'HTML': '#e34f26',
    'CSS': '#1572b6',
    'SCSS': '#cf649a',
    'Shell': '#89e051',
    'Dockerfile': '#384d54',
    'YAML': '#cb171e',
    'JSON': '#000000'
  }
  return colors[language] || '#6c757d'
}

// 파일 크기 포맷
function formatFileSize(kb) {
  if (kb === 0) return '0 KB'
  if (kb < 1024) return `${kb} KB`
  if (kb < 1024 * 1024) return `${(kb / 1024).toFixed(1)} MB`
  return `${(kb / (1024 * 1024)).toFixed(1)} GB`
}

// 프로젝트 링크 열기
function openProjectLink(url) {
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

// 데이터 새로고침
function refreshData() {
  fetchGitHubData()
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  fetchGitHubData()
})
</script>

<style scoped>
.github-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-6);
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-8);
  padding: var(--space-6);
  background: linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2));
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-lg);
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.header-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #4FC08D, #42A5F5);
  border-radius: var(--radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: var(--shadow-md);
}

.dashboard-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 var(--space-1) 0;
  background: linear-gradient(135deg, var(--color-primary-solid), var(--color-secondary-solid));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dashboard-subtitle {
  color: var(--text-secondary);
  margin: 0;
  font-size: 1.1rem;
}

.last-updated {
  color: var(--text-muted);
  font-size: 0.9rem;
  padding: var(--space-2) var(--space-4);
  background: var(--color-surface-2);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
}

/* 로딩 및 에러 상태 */
.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
  text-align: center;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-surface-3);
  border-top: 4px solid var(--color-primary-solid);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--space-4);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: var(--space-4);
}

.retry-btn {
  padding: var(--space-3) var(--space-6);
  background: var(--color-primary-solid);
  color: white;
  border: none;
  border-radius: var(--radius-xl);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: var(--color-secondary-solid);
  transform: translateY(-1px);
}

/* 통계 카드 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.stat-card {
  background: linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  transition: all 0.3s ease;
  box-shadow: var(--shadow-lg);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary-solid);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: white;
  flex-shrink: 0;
}

.stat-icon.repositories {
  background: linear-gradient(135deg, #4FC08D, #42A5F5);
}

.stat-icon.followers {
  background: linear-gradient(135deg, #FF6B81, #FF8A95);
}

.stat-icon.following {
  background: linear-gradient(135deg, #FFB700, #FFC947);
}

.stat-icon.gists {
  background: linear-gradient(135deg, #6A5ACD, #8A2BE2);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 var(--space-1) 0;
  color: var(--text-primary);
}

.stat-label {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
}

/* 차트 섹션 */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.chart-container {
  background: linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-lg);
}

.chart-header {
  margin-bottom: var(--space-4);
}

.chart-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 var(--space-1) 0;
  color: var(--text-primary);
}

.chart-subtitle {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
}

.chart-content {
  height: 300px;
  position: relative;
}

/* 잔디 (Contribution Graph) 섹션 */
.contribution-graph {
  background: linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-lg);
  margin-bottom: var(--space-8);
}

.grass-container {
  overflow-x: auto;
  padding: var(--space-4) 0;
}

.grass-grid {
  display: flex;
  gap: 3px;
  min-width: 720px;
  justify-content: center;
}

.grass-week {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.grass-day {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.grass-day:hover {
  border-color: var(--color-primary-solid);
  transform: scale(1.2);
}

.grass-day.level-0 {
  background-color: var(--color-surface-3);
}

.grass-day.level-1 {
  background-color: rgba(79, 192, 141, 0.3);
}

.grass-day.level-2 {
  background-color: rgba(79, 192, 141, 0.5);
}

.grass-day.level-3 {
  background-color: rgba(79, 192, 141, 0.7);
}

.grass-day.level-4 {
  background-color: #4FC08D;
}

.grass-day.future {
  background-color: transparent !important;
  opacity: 0.3;
}

.grass-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-4);
  font-size: 0.8rem;
  color: var(--text-muted);
}

.legend-levels {
  display: flex;
  gap: 3px;
}

.legend-level {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.legend-level.level-0 {
  background-color: var(--color-surface-3);
}

.legend-level.level-1 {
  background-color: rgba(79, 192, 141, 0.3);
}

.legend-level.level-2 {
  background-color: rgba(79, 192, 141, 0.5);
}

.legend-level.level-3 {
  background-color: rgba(79, 192, 141, 0.7);
}

.legend-level.level-4 {
  background-color: #4FC08D;
}

/* 프로젝트 섹션 */
.projects-section {
  background: linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-lg);
  margin-bottom: var(--space-8);
}

.section-subtitle {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--space-5);
  margin-top: var(--space-5);
}

.project-card {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.project-card:hover {
  background: var(--color-surface-3);
  border-color: var(--color-primary-solid);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.project-card::before {
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

.project-card:hover::before {
  opacity: 1;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
}

.project-info {
  flex: 1;
  margin-right: var(--space-3);
}

.project-name {
  margin: 0 0 var(--space-2) 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.project-name a {
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.project-name a:hover {
  color: var(--color-primary-solid);
}

.project-description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-language {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.85rem;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.language-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.project-stats {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: 0.8rem;
  color: var(--text-muted);
  transition: color 0.3s ease;
}

.stat-item:hover {
  color: var(--text-secondary);
}

.stat-item svg {
  width: 14px;
  height: 14px;
}

.stat-item.updated {
  margin-left: auto;
}

.project-topics {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.topic-tag {
  background: var(--color-primary);
  color: var(--color-primary-solid);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-md);
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid var(--color-primary-solid);
  transition: all 0.3s ease;
}

.topic-tag:hover {
  background: var(--color-primary-solid);
  color: white;
  transform: scale(1.05);
}

.topic-more {
  background: var(--color-surface-3);
  color: var(--text-muted);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-md);
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid var(--color-border);
}

/* 최근 커밋 섹션 */
.recent-commits {
  background: linear-gradient(135deg, var(--color-surface-1), var(--color-surface-2));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-lg);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--color-primary-solid);
  color: white;
  border: none;
  border-radius: var(--radius-xl);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: var(--color-secondary-solid);
  transform: translateY(-1px);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.commits-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.commit-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-surface-2);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.commit-item:hover {
  background: var(--color-surface-3);
  border-color: var(--color-primary-solid);
  transform: translateX(4px);
}

.commit-avatar {
  flex-shrink: 0;
}

.commit-avatar img {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-xl);
  border: 2px solid var(--color-border);
}

.commit-content {
  flex: 1;
}

.commit-message {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
  line-height: 1.4;
}

.commit-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.85rem;
  color: var(--text-muted);
}

.commit-author {
  font-weight: 600;
  color: var(--color-primary-solid);
}

.commit-separator {
  opacity: 0.5;
}

.commit-actions {
  flex-shrink: 0;
}

.commit-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--color-surface-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.3s ease;
}

.commit-link:hover {
  background: var(--color-primary-solid);
  border-color: var(--color-primary-solid);
  color: white;
  transform: scale(1.05);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .github-dashboard {
    padding: var(--space-4);
  }

  .dashboard-header {
    flex-direction: column;
    gap: var(--space-4);
    align-items: flex-start;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: var(--space-3);
  }

  .dashboard-title {
    font-size: 1.8rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .charts-section {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .section-header {
    flex-direction: column;
    gap: var(--space-3);
    align-items: flex-start;
  }

  .commit-item {
    flex-direction: column;
    gap: var(--space-3);
  }

  .commit-meta {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .chart-container {
    padding: var(--space-4);
  }

  .chart-content {
    height: 250px;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: var(--space-3);
  }

  .commit-avatar img {
    width: 32px;
    height: 32px;
  }

  .grass-grid {
    min-width: 100%;
  }

  .grass-day {
    width: 10px;
    height: 10px;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .project-card {
    padding: var(--space-4);
  }

  .project-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .project-language {
    align-self: flex-end;
  }

  .project-stats {
    gap: var(--space-3);
  }

  .stat-item.updated {
    margin-left: 0;
    order: -1;
    width: 100%;
  }
}
</style>
