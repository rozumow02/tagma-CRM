<template>
  <div class="skeleton-filter">
    <div v-for="i in filterCount" :key="i" class="skeleton-filter-item">
      <div class="skeleton-filter-input"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SkeletonFilterProps {
  filterCount?: number;
}

const props = withDefaults(defineProps<SkeletonFilterProps>(), {
  filterCount: 4,
});
</script>

<style scoped>
.skeleton-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
}

.skeleton-filter-item {
  min-width: 240px;
  flex: 1;
}

.skeleton-filter-input {
  height: 40px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 6px;
  animation: shimmer 1.5s infinite;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.skeleton-filter-input:nth-child(odd) {
  width: 90%;
}

.skeleton-filter-input:nth-child(even) {
  width: 85%;
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
  .skeleton-filter {
    flex-direction: column;
    padding: 12px;
  }

  .skeleton-filter-item {
    min-width: auto;
    flex: none;
  }
}
</style>
