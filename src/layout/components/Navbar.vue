<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Trans from "@/i18n/translation";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const route = useRoute();

const path = computed(() => route.fullPath.replace("/", ""));
</script>

<template>
  <div class="py-5 border-b dark:border-gray-800 font-semibold"></div>
</template>
