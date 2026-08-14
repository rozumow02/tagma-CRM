<template>
  <div class="skeleton-pagination">
    <div class="skeleton-pagination-controls">
      <div class="skeleton-pagination-button"></div>
      <div class="skeleton-pagination-numbers">
        <div v-for="i in 5" :key="i" class="skeleton-pagination-number"></div>
      </div>
      <div class="skeleton-pagination-button"></div>
    </div>
    <div class="skeleton-pagination-info">
      <div class="skeleton-pagination-text"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for this component
</script>

<style scoped>
.skeleton-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding: 16px;
  background: white;
  border-radius: 8px;
}

.skeleton-pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skeleton-pagination-button {
  width: 32px;
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.skeleton-pagination-numbers {
  display: flex;
  gap: 4px;
}

.skeleton-pagination-number {
  width: 32px;
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.skeleton-pagination-info {
  display: flex;
  align-items: center;
}

.skeleton-pagination-text {
  width: 120px;
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@media (max-width: 768px) {
  .skeleton-pagination {
    flex-direction: column;
    gap: 16px;
    padding: 12px;
  }
}
</style>
