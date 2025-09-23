<template>
  <span class="loader"></span>
</template>

<style>
.loader {
  position: relative;
  width: 108px;
  display: flex;
  justify-content: space-between;
  animation: floatLoader 3s ease-in-out infinite;
}

.loader::after,
.loader::before {
  content: '';
  display: inline-block;
  width: 48px;
  height: 48px;
  background: var(--color-primary);
  background-image: radial-gradient(circle 14px, var(--color-surface-3) 100%, transparent 0);
  background-repeat: no-repeat;
  border-radius: 50%;
  animation: eyeMove 3s infinite, blink 3s infinite;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

@keyframes eyeMove {
  0%, 10% { background-position: 0px 0px; }
  13%, 40% { background-position: -15px 0px; }
  43%, 70% { background-position: 15px 0px; }
  73%, 90% { background-position: 0px 15px; }
  93%, 100% { background-position: 0px 0px; }
}

@keyframes blink {
  0%, 10%, 12%, 20%, 22%, 40%, 42%, 60%, 62%, 70%, 72%, 90%, 92%, 98%, 100% {
    height: 48px;
  }
  11%, 21%, 41%, 61%, 71%, 91%, 99% {
    height: 18px;
  }
}

@keyframes floatLoader {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

