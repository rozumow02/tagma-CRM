<template>
  <div class="flex text-gray3 items-center">
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-4 py-2 text-sm font-medium rounded bg-gray1 border-gray-300 hover:bg-gray-100 disabled:opacity-50 flex"
    >
      <ChevronLeft :size="18" class="mr-2" />
      {{ t("pagination.previous") }}
    </button>

    <!-- Pagination buttons -->
    <template v-if="totalPages > visiblePageCount + 2">
      <button
        v-for="page in firstPages"
        :key="page"
        @click="changePage(page)"
        :class="buttonClass(page)"
      >
        {{ page }}
      </button>

      <span v-if="currentPage > visiblePageCount + 1">...</span>

      <button
        v-if="
          currentPage > visiblePageCount &&
          currentPage < totalPages - visiblePageCount
        "
        @click="changePage(currentPage)"
        :class="buttonClass(currentPage)"
      >
        {{ currentPage }}
      </button>

      <span v-if="currentPage < totalPages - visiblePageCount - 1">...</span>

      <button
        v-for="page in lastPages"
        :key="page"
        @click="changePage(page)"
        :class="buttonClass(page)"
      >
        {{ page }}
      </button>
    </template>

    <template v-else>
      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        :class="buttonClass(page)"
      >
        {{ page }}
      </button>
    </template>

    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="px-4 py-2 rounded-lg text-sm font-medium bg-gray1 border-gray-300 hover:bg-gray-100 disabled:opacity-50 flex items-center"
    >
      {{ t("pagination.next") }}
      <ChevronRight :size="18" class="ml-2" />
    </button>

    <!-- Select for page size -->
    <ElSelect
      v-model="selectedPageSize"
      size="large"
      v-if="currentSize"
      class="!w-24"
      @change="changePageSize"
    >
      <ElOption
        v-for="item in pageSizes"
        :key="item"
        :label="item"
        :value="item"
      />
    </ElSelect>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { ElSelect, ElOption } from "element-plus";
import { computed, onMounted, ref, watch } from "vue";

const { t } = useI18n();
const props = withDefaults(
  defineProps<{
    currentPage: number;
    totalPages: number;
    pageSizes?: number[];
    currentSize?: number;
    visiblePageCount?: number; // Default prop for visible page count
  }>(),
  {
    // currentSize: 10,
    pageSizes: () => [10, 20, 30, 40, 50, 100, 200, 300, 400, 500],
  },
);

const emit = defineEmits<{
  (e: "page-change", page: number): void;
  (e: "size-change", size: number): void;
}>();

const changePage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit("page-change", page);
  }
};

const selectedPageSize = ref();
// watch(selectedPageSize, (value) => {
//   changePageSize();
// });

const changePageSize = () => {
  emit("size-change", selectedPageSize.value);
};

// Default value for visiblePageCount
const visiblePageCount = ref(props.visiblePageCount || 2);

const firstPages = computed(() => {
  return Array.from(
    { length: Math.min(visiblePageCount.value, props.totalPages) },
    (_, i) => i + 1,
  );
});

const lastPages = computed(() => {
  return Array.from(
    { length: Math.min(visiblePageCount.value, props.totalPages) },
    (_, i) => props.totalPages - visiblePageCount.value + i + 1,
  );
});

const buttonClass = (page: number) => {
  return [
    "px-4 py-2 font-medium rounded-lg",
    props.currentPage === page
      ? "bg-main text-white"
      : "border-gray-300 hover:bg-gray-100",
  ];
};

onMounted(() => {
  selectedPageSize.value = props.currentSize;
});
</script>
