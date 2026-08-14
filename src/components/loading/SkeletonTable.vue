<template>
  <div class="skeleton-table">
    <!-- Table Header Skeleton -->
    <div class="skeleton-header">
      <div
        v-for="(header, index) in headers"
        :key="index"
        class="skeleton-header-cell"
        :style="{ width: header.width ? header.width + 'px' : 'auto' }"
      >
        <div class="skeleton-text skeleton-header-text"></div>
      </div>
    </div>

    <!-- Table Rows Skeleton -->
    <div class="skeleton-rows">
      <div v-for="row in skeletonRows" :key="row" class="skeleton-row">
        <div
          v-for="(header, index) in headers"
          :key="index"
          class="skeleton-cell"
        >
          <div class="skeleton-text skeleton-cell-text"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SkeletonTableProps {
  headers: Array<{ text: string; value: string; width?: string }>;
  rows?: number;
}

const props = withDefaults(defineProps<SkeletonTableProps>(), {
  rows: 5,
});

const skeletonRows = Array.from({ length: props.rows }, (_, i) => i);
</script>

<style scoped>
.skeleton-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.skeleton-header {
  display: flex;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.skeleton-header-cell {
  flex: 1;
  padding: 16px 12px;
  border-right: 1px solid #e2e8f0;
  min-width: 120px;
}

.skeleton-header-cell:last-child {
  border-right: none;
}

.skeleton-rows {
  background: white;
  /* max-height: 400px; */
  /* overflow-y: auto; */
}

.skeleton-row {
  display: flex;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s;
  min-height: 60px;
}

.skeleton-row:hover {
  background-color: #f8fafc;
}

.skeleton-row:last-child {
  border-bottom: none;
}

.skeleton-cell {
  flex: 1;
  padding: 16px 12px;
  border-right: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  min-width: 120px;
}

.skeleton-cell:last-child {
  border-right: none;
}

.skeleton-text {
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}

.skeleton-header-text {
  height: 18px;
  background: linear-gradient(90deg, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  font-weight: 600;
}

.skeleton-cell-text {
  width: 80%;
}

.skeleton-cell-text:nth-child(odd) {
  width: 60%;
}

.skeleton-cell-text:nth-child(even) {
  width: 90%;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .skeleton-header {
    display: none;
  }

  .skeleton-row {
    flex-direction: column;
    padding: 12px;
    margin-bottom: 8px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    min-height: auto;
  }

  .skeleton-cell {
    border-right: none;
    border-bottom: 1px solid #f1f5f9;
    padding: 8px 0;
    min-width: auto;
  }

  .skeleton-cell:last-child {
    border-bottom: none;
  }
}
</style>
