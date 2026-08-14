<template>
  <div
    class="skeleton-button"
    :style="{ width: width + 'px', height: height + 'px' }"
  ></div>
</template>

<script setup lang="ts">
interface SkeletonButtonProps {
  width?: number;
  height?: number;
}

const props = withDefaults(defineProps<SkeletonButtonProps>(), {
  width: 120,
  height: 40,
});
</script>

<style scoped>
.skeleton-button {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 6px;
  animation: shimmer 1.5s infinite;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: not-allowed;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
