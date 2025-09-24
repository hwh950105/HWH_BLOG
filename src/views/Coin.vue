<template>
  <div class="coin-page">
    <div class="page-header">
      <h1 class="page-title">🪙 암호화폐 시세</h1>
      <p class="page-description">실시간 코인 가격 정보를 확인하세요</p>
    </div>
    <div class="coin-content">
      <coingaco />
    </div>
  </div>
</template>

<script setup>
import Coingaco from '@/components/Coingaco.vue';
</script>

<style scoped>
.coin-page {
  min-height: 100vh;
  background: transparent;
  padding: var(--space-6);
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-8);
  padding: var(--space-6);
  background: #1a1f2e !important;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  backdrop-filter: none !important;
  box-shadow: var(--shadow-md);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--space-4);
  background: var(--color-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(13, 33, 122, 0.3);
}

.page-description {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin: 0;
  opacity: 0.9;
}

.coin-content {
  width: 100%;
  max-width: none;
  margin: 0;
  animation: fadeInUp 0.6s var(--ease-fluid);
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

@media (max-width: 768px) {
  .coin-page {
    padding: var(--space-4);
  }

  .page-title {
    font-size: 2rem;
  }

  .page-description {
    font-size: 1rem;
  }
}
</style>



