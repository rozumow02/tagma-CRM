<script setup lang="ts">
import Trans from "@/i18n/translation";
import type { FilterOption, IElColumnTable } from "@/types";
import { computed, onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";
import CustomTable from "@/components/Table/CustomTable.vue";
import {
  useEkspeditorsStore,
  remainderToEkspeditor,
} from "@/store/Trade-team/Ekspeditors";
const router = useRouter();

const { FETCH_REMAINDER_TO_EKSPEDITOR } = useEkspeditorsStore();
const route = useRoute();
const id = computed<number>(() => Number(route.params.id));

onBeforeMount(() => {
  FETCH_REMAINDER_TO_EKSPEDITOR(id.value);
});

const columns = ref<IElColumnTable[]>([
  { type: "index", label: "index", prop: "" },
  { label: "ekspeditor", prop: "name" },
  { label: "product.product_type_id", prop: "product_type" },
  { label: "taste", prop: "taste" },
  { label: "product.volume", prop: "volume" },
  { label: "remainder", prop: "count" },
]);
</script>

<template>
  <div class="mx-auto border rounded-lg">
    <div class="flex items-center space-x-4 p-4 border-b">
      <button
        class="text-gray-500 hover:bg-gray1 p-2 rounded-lg"
        @click="router.back()"
      >
        <ArrowLeft class="h-6 w-6" />
      </button>
      <h1 class="text-xl font-semibold">
        {{ Trans.t("remainder") }}
      </h1>
    </div>

    <CustomTable :columns="columns" :data="remainderToEkspeditor" />
  </div>
</template>
