<template>
  <div class="m-4 md:w-80 relative">
    <SearchIcon
      class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
    />
    <input
      v-model.trim="searchQuery"
      @keyup.enter="emitSearch"
      type="text"
      :placeholder="t('search')"
      class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 outline-none"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SearchIcon, PlusIcon } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const searchQuery = ref("");
const emit = defineEmits<{
  (e: "search", query: string): void;
}>();

const emitSearch = () => {
  emit("search", searchQuery.value);
};
</script>
