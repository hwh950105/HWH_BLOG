<template>
  <div class="homemain">
    <!-- <section class="hero">
      <div class="hero-content">
        <h1>오늘을 한눈에</h1>
        <p>시계, 시장 지수, 날씨까지. 필요한 정보만 깔끔하게.</p>
        <div class="hero-cta">
          <router-link to="/Notionlist" class="cta">
            <span class="cta-icon">📝</span>
            <span>노트 둘러보기</span>
          </router-link>
          <router-link to="/Coin" class="cta secondary">
            <span class="cta-icon">🪙</span>
            <span>코인 시세</span>
          </router-link>
        </div>
      </div>
    </section> -->

    <!-- 상단 주요 정보 영역 -->
    <div class="featured-section">
      <!-- <div class="block time-block featured">
        <hwhtime></hwhtime>
      </div> -->
      
      <div class="block showcase-block">
        <div class="block-header">
          <h3>🧭 프로젝트 & 깃허브</h3>
        </div>
        <div class="block-content">
          <ProjectShowcase />
        </div>
      </div>
    </div>
    
    <!-- 하단 정보 그리드 -->
    <div class="dashboard-grid single">
      <div class="block market-block wide">
        <div class="block-header">
          <h3>📈 시장 지수</h3>
        </div>
        <div class="block-content">
          <GlobalIndices></GlobalIndices>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import hwhtime from '@/components/hwhtime.vue';
import GlobalIndices from '@/components/GlobalIndices.vue';
import ProjectShowcase from '@/components/ProjectShowcase.vue';
</script>

<style scoped>
.homemain {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-6);
  align-items: center;
  height: auto;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
  overflow: visible;
  position: relative;

  /* Subtle background animation */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 30% 10%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 70% 90%, rgba(79, 172, 254, 0.03) 0%, transparent 50%);
    animation: gentleFloat 25s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }
}

.hero {
  background: var(--color-surface-2);
  backdrop-filter: var(--blur-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-2xl);
  padding: var(--space-10) var(--space-8);
  width: 100%;
  box-shadow: var(--shadow-2xl), var(--shadow-glow);
  position: relative;
  overflow: hidden;
  z-index: 1;

  /* Floating background elements */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -20%;
    width: 140%;
    height: 200%;
    background:
      radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(240, 147, 251, 0.08) 0%, transparent 50%);
    animation: heroFloat 20s ease-in-out infinite;
    pointer-events: none;
    z-index: -1;
  }

  /* Glass overlay */
  &::after {
    content: '';
    position: absolute;
    inset: 1px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%);
    border-radius: var(--radius-2xl);
    pointer-events: none;
    z-index: -1;
  }
}

.hero-content h1 {
  margin: 0 0 var(--space-3) 0;
  font-size: 2.5rem;
  font-weight: 900;
  font-variation-settings: 'wght' 900;
  background: var(--color-primary);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
  line-height: 1.2;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
  position: relative;

  /* Animated text effect */
  animation: textGlow 3s ease-in-out infinite;
}

.hero-content p {
  margin: 0 0 var(--space-6) 0;
  color: var(--text-secondary);
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-cta {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
}

.hero-cta .cta {
  background: var(--color-primary);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s var(--ease-fluid);
  position: relative;
  overflow: hidden;
  backdrop-filter: var(--blur-sm);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 160px;
  justify-content: center;

  /* Hover glow effect */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.3s var(--ease-fluid);
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: var(--shadow-xl), var(--shadow-glow);

    &::before {
      opacity: 1;
    }
  }
}

.cta-icon {
  font-size: 1.1rem;
  animation: iconBounce 2s ease-in-out infinite;
}

@keyframes iconBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.hero-cta .cta.secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--color-border-focus);

  &:hover {
    background: var(--color-border-focus);
    color: white;
  }
}

/* Featured Section - 시계 전용 */
.featured-section {
  width: 100%;
  margin-bottom: var(--space-6);
  position: relative;
  z-index: 1;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  width: 100%;
  padding: 0 var(--space-2);
  box-sizing: border-box;
  align-items: stretch;
  position: relative;
  z-index: 1;
}

.dashboard-grid.single {
  grid-template-columns: 1fr;
}

.block {
  background: var(--color-surface-2);
  backdrop-filter: var(--blur-lg);
  padding: var(--space-6);
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xl), var(--shadow-glow);
  width: 100%;
  min-height: 280px;
  transition: all 0.4s var(--ease-fluid);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  /* Glass morphism effect */
  &::before {
    content: '';
    position: absolute;
    inset: 1px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
    border-radius: var(--radius-2xl);
    pointer-events: none;
    z-index: 1;
    transition: all 0.3s var(--ease-fluid);
  }

  /* Animated background */
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background:
      radial-gradient(circle at 30% 30%, rgba(79, 172, 254, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(102, 126, 234, 0.02) 0%, transparent 50%);
    animation: blockFloat 18s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }
}

.block:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-2xl), var(--shadow-glow);
  border-color: var(--color-border-focus);

  &::before {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%);
  }
}

.time-block {
  min-height: 180px;
  background: var(--color-primary);
  color: white;
  border: 1px solid rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;

  &.featured {
    border-radius: var(--radius-2xl);
    box-shadow: var(--shadow-2xl), var(--shadow-glow);
  }

  &::before {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
  }
}

.market-block {
  min-height: 320px;
}

.market-block.wide {
  min-height: 360px;
}

.showcase-block {
  margin-top: var(--space-6);
}


.block-header {
  position: relative;
  z-index: 10;
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.block-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.block-content {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Fluid Animations */
.dashboard-grid {
  animation: dashboardFadeIn 0.8s var(--ease-fluid);
}

@keyframes dashboardFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes gentleFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-5px) rotate(0.5deg); }
  66% { transform: translateY(3px) rotate(-0.5deg); }
}

@keyframes heroFloat {
  0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
  50% { transform: translateY(-20px) rotate(2deg) scale(1.02); }
}

@keyframes blockFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(1deg); }
}

@keyframes textGlow {
  0%, 100% { text-shadow: 0 0 30px rgba(102, 126, 234, 0.3); }
  50% { text-shadow: 0 0 40px rgba(102, 126, 234, 0.5), 0 0 60px rgba(79, 172, 254, 0.2); }
}

/* Fluid Scrollbar */
.homemain::-webkit-scrollbar {
  width: 4px;
}

.homemain::-webkit-scrollbar-track {
  background: transparent;
}

.homemain::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.homemain::-webkit-scrollbar-thumb:hover {
  background: var(--color-accent);
  box-shadow: var(--shadow-glow);
}

/* 반응형 디자인 */
@media (max-width: 1400px) {
  .homemain {
    padding: var(--space-4);
  }

  .dashboard-grid {
    gap: var(--space-4);
  }
}

@media (max-width: 1200px) {
  .hero {
    padding: var(--space-8) var(--space-6);
  }

  .hero-content h1 {
    font-size: 2.25rem;
  }

  .block {
    padding: var(--space-4);
    min-height: 240px;
  }

  .dashboard-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

@media (max-width: 992px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-content p {
    font-size: 1rem;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .block {
    min-height: 220px;
    padding: var(--space-4);
    touch-action: pan-y;
  }

  .time-block {
    min-height: 160px;
  }

  .hero-cta {
    flex-direction: column;
    align-items: center;
  }

  .hero-cta .cta {
    width: 200px;
    text-align: center;
    min-height: 44px;
    touch-action: manipulation;
  }
}

@media (max-width: 768px) {
  .homemain {
    padding: var(--space-3);
    gap: var(--space-4);
  }

  .hero {
    padding: var(--space-6) var(--space-4);
  }

  .hero-content h1 {
    font-size: 1.8rem;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
    padding: 0;
    gap: var(--space-4);
  }

  .block {
    min-height: 200px;
    padding: var(--space-4);
  }

  .time-block {
    min-height: 150px;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 1.5rem;
  }

  .hero-content p {
    font-size: 0.9rem;
  }

  .homemain {
    gap: var(--space-3);
    padding: var(--space-2);
  }

  .hero {
    padding: var(--space-4) var(--space-3);
  }

  .dashboard-grid {
    gap: var(--space-3);
  }

  .block {
    padding: var(--space-3);
    min-height: 180px;
  }

  .time-block {
    min-height: 140px;
  }

  .hero-cta {
    flex-direction: column;
    gap: var(--space-2);
  }

  .hero-cta .cta {
    padding: var(--space-3) var(--space-4);
    font-size: 0.9rem;
    width: 100%;
    max-width: 200px;
  }

  /* 애니메이션 강도 감소 */
  .block::after {
    animation-duration: 25s;
  }

  .homemain::before {
    animation-duration: 30s;
  }
}

/* Performance Optimizations */
.block,
.hero {
  will-change: transform;
  contain: layout style paint;
}

/* Accessibility Improvements */
.cta:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.block:focus-within {
  border-color: var(--color-border-focus);
  box-shadow: var(--shadow-2xl), 0 0 0 2px var(--color-border-focus);
}

/* Smooth loading states */
.dashboard-grid > .block {
  animation-delay: calc(var(--animation-delay, 0) * 100ms);
}

.dashboard-grid > .block:nth-child(1) { --animation-delay: 0; }
.dashboard-grid > .block:nth-child(2) { --animation-delay: 1; }
.dashboard-grid > .block:nth-child(3) { --animation-delay: 2; }

/* Light Mode Specific Adjustments */
.light-mode .hero {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(15, 23, 42, 0.1);
  box-shadow: var(--shadow-lg);
}

.light-mode .block {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(15, 23, 42, 0.1);
  box-shadow: var(--shadow-md);
}

.light-mode .time-block {
  background: var(--color-primary);
  color: white;
}

.light-mode .hero-content h1 {
  text-shadow: 0 0 20px rgba(102, 126, 234, 0.2);
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .block::after,
  .hero::before,
  .homemain::before,
  .cta-icon {
    animation: none;
  }

  .block,
  .hero-cta .cta {
    transition: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .block {
    border-width: 2px;
  }

  .hero-cta .cta {
    border-width: 2px;
  }
}

/* Dark mode enhancements */
.dark-mode .hero::before {
  background:
    radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(240, 147, 251, 0.12) 0%, transparent 50%);
}

.dark-mode .block::after {
  background:
    radial-gradient(circle at 30% 30%, rgba(79, 172, 254, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(102, 126, 234, 0.04) 0%, transparent 50%);
}

/* Touch Feedback */
@media (hover: none) and (pointer: coarse) {
  .hero-cta .cta:active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }

  .block:active {
    transform: scale(0.98);
  }
}
</style>