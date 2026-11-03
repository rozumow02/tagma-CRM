<script setup lang="ts">
import { requestApi } from "@/api";
import { putChangeAgentPointsApi } from "@/api/point";
import HorizontalFilter from "@/components/filter/horizontalFilter.vue";
import Header from "@/components/main/Header.vue";
import CustomTable from "@/components/Table/CustomTable.vue";
import Trans from "@/i18n/translation";
import {
  usePointsStore,
  query,
  points,
  pointForAgents,
  allType,
  pointForCities,
  routeForDays,
  routeForEkspeditors,
  isLoading,
} from "@/store/Point";
import { selected } from "@/store/Route";
import type { FilterOption, IElColumnTable, IPoints } from "@/types";
import { BrushFilled } from "@element-plus/icons-vue";
import { Save, Trash2 } from "lucide-vue-next";
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from "vue";
import { toast } from "vue3-toastify";
const { FETCH_POINTS, FETCH_ALL_SELECT_TRANSFER } = usePointsStore();
onBeforeMount(() => {
  FETCH_POINTS();
  FETCH_ALL_SELECT_TRANSFER();
});
const filterTransfer = computed<FilterOption[]>(() => [
  {
    model: "name",
    type: "input",
    placeholder: Trans.t("name"),
  },
  {
    model: "cityId",
    type: "select",
    placeholder: Trans.t("city"),
    options: pointForCities.value,
  },
  {
    model: "districtId",
    type: "select",
    placeholder: Trans.t("district"),
    options: allDistricts.value,
  },
  {
    model: "typeId",
    type: "select",
    placeholder: Trans.t("channels.type"),
    options: allType.value,
  },
]);
const updateQuery = () => {
  query.pageNumber = 1;
  FETCH_POINTS();
};
const columnTransfer = ref<IElColumnTable[]>([
  { type: "selection", prop: "", label: "" },
  { prop: "code", label: "points.code" },
  { prop: "city", label: "city" },
  { prop: "district", label: "district" },
  { prop: "name", label: "name" },
]);
onBeforeUnmount(() => {
  query.pageNumber = 1;
  query.name = "";
  query.cityId = null;
  query.districtId = null;
  query.typeId = null;
  query.pageSize = 10;
});
const selectedPoints = ref<number[]>([]);
const selectionChange = (val: IPoints[]) => {
  selectedPoints.value = val.map((item) => item.id);
};
const allDistricts = ref([]);
watch(
  () => query.cityId,
  async (newValue) => {
    if (newValue)
      await requestApi("points/districts", "GET", { cityId: newValue }).then(
        (res) => {
          allDistricts.value = res.data;
        },
      );
  },
);
// Form state for transfer operation
const transferForm = ref({
  agentId: null as number | null,
  ekspeditorId: null as number | null,
  dayId: null as number | null,
});

const loading = ref<boolean>(false);

/**
 * Change agent points with ekspeditor and day validation
 * @description Transfers selected points to a new agent with ekspeditor and day constraints
 */
const changeAgentPoints = async () => {
  // Validation: Check if all required fields are selected
  if (
    !transferForm.value.agentId ||
    !transferForm.value.ekspeditorId ||
    !transferForm.value.dayId
  ) {
    toast(Trans.t("messages.error"), {
      type: "error",
    });
    return;
  }

  // Validation: Check if points are selected
  if (!selectedPoints.value.length) {
    toast(Trans.t("messages.error"), {
      type: "error",
    });
    return;
  }

  loading.value = true;

  try {
    await putChangeAgentPointsApi(
      selectedPoints.value, // body data
      transferForm.value.agentId, // query param
      transferForm.value.ekspeditorId, // query param
      transferForm.value.dayId, // query param
    );

    toast(Trans.t("messages.success"), {
      type: "success",
    });

    // Reset form and selections
    resetTransferForm();
    selectedPoints.value = [];

    // Refresh points data
    await FETCH_POINTS();
  } catch (error) {
    console.error("Error changing agent points");
    toast(Trans.t("messages.error"), {
      type: "error",
    });
  } finally {
    loading.value = false;
  }
};

/**
 * Reset transfer form to initial state
 * @description Clears all form fields and resets to default values
 */
const resetTransferForm = () => {
  transferForm.value = {
    agentId: null,
    ekspeditorId: null,
    dayId: null,
  };
};

/**
 * Check if form has any values
 * @description Returns true if any field in the form has a value
 */
const hasFormValues = computed(() => {
  return (
    transferForm.value.agentId ||
    transferForm.value.ekspeditorId ||
    transferForm.value.dayId
  );
});
</script>

<template>
  <div class="mx-auto border rounded-lg">
    <div class="grid grid-cols-4 border-b p-4 gap-4">
      <!-- Agent Selection -->
      <div class="flex items-center">
        <span class="mr-2 text-red-600">*</span>
        <el-select
          v-model="transferForm.agentId"
          :placeholder="Trans.t('points.trade_agent')"
          class="w-full"
        >
          <el-option
            v-for="item in pointForAgents"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>

      <!-- Ekspeditor Selection -->
      <div class="flex items-center">
        <span class="mr-2 text-red-600">*</span>
        <ElSelect
          v-model="transferForm.ekspeditorId"
          :placeholder="Trans.t('ekspeditors.title')"
          class="w-full"
        >
          <ElOption
            v-for="item in routeForEkspeditors"
            :value="item.id"
            :label="item.name"
            :key="item.id"
          >
          </ElOption>
        </ElSelect>
      </div>

      <!-- Day Selection -->
      <div class="flex items-center">
        <span class="mr-2 text-red-600">*</span>
        <ElSelect
          v-model="transferForm.dayId"
          :placeholder="Trans.t('week_day')"
          class="w-full"
        >
          <ElOption
            v-for="day in routeForDays"
            :key="day.id"
            :value="day.id"
            :label="day.name"
          ></ElOption>
        </ElSelect>
      </div>
      <div class="flex items-center justify-end">
        <!-- Reset Button -->
        <ElButton
          :disabled="!hasFormValues"
          type="warning"
          @click="resetTransferForm"
          class="flex items-center gap-2"
          plain
        >
          <BrushFilled class="w-4 h-4 mr-2" />
          {{ Trans.t("clear") }}
        </ElButton>
      </div>
    </div>
    <HorizontalFilter
      :filters="filterTransfer"
      :query="query"
      @update-query="updateQuery"
    />
    <CustomTable
      :is-loading="isLoading"
      @selection-change="selectionChange"
      :columns="columnTransfer"
      :data="points"
      :query="query"
      row-key="id"
      @page-change="FETCH_POINTS"
      @size-change="FETCH_POINTS"
      height="calc(100vh - 300px)"
      :page-sizes="[300, 1000, 3000]"
    />
  </div>
  <div class="flex justify-center w-full mt-4 gap-4">
    <!-- Save Changes Button -->
    <ElButton
      :disabled="
        !selectedPoints.length ||
        !transferForm.agentId ||
        !transferForm.ekspeditorId ||
        !transferForm.dayId
      "
      type="primary"
      :loading="loading"
      @click="changeAgentPoints"
      class="flex items-center gap-2"
    >
      <Save class="w-4 h-4 mr-2" />

      {{ Trans.t("save_changes") }}
    </ElButton>
  </div>
</template>
