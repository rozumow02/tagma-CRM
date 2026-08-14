<template>
  <div class="space-y-1">
    <p class="text-gray3">{{ label }}</p>
    <p class="text-lg font-medium">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  value?: string | number;
}>();
</script>
