<template>
  <header class="flex justify-between items-center border-b p-4">
    <h1 class="text-xl font-bold">{{ title }}</h1>
    <div>
      <slot></slot>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface IProps {
  title: string;
}
defineProps<IProps>();
</script>
