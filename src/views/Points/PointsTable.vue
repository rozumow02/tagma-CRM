<template>
  <TwTable
    :headers="DEMO_MODE ? headers.filter(header => header.value !== 'action') : headers"
    :rows="points"
    :loading="isLoading"
    table-height-offset="115"
    @row-double-click="handleRowDoubleClick"
  >
    <template v-if="!DEMO_MODE" #action="{ row }">
      <el-popover :visible="row.visible" popper-class="!p-1" trigger="hover">
        <template #reference>
          <button
            class="outline-none p-1 text-gray-500"
            @click="toggleVisibility(row.id)"
          >
            <Ellipsis />
          </button>
        </template>
        <div class="flex flex-col" ref="target">
          <span
            @click="() => (isBlockDialog = true)"
            class="p-2 mx-1 whitespace-nowrap cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
          >
            {{ row.status ? t("block") : t("unblock") }}
          </span>

          <!-- Blocking -->
          <Dialog :title="t('block_usage')" v-model="isBlockDialog">
            <template #content>
              <div class="flex justify-center">
                <WarningFilled
                  v-if="row.status"
                  class="h-14 w-14 text-error"
                  aria-hidden="true"
                  focusable="false"
                />
                <CircleCheckFilled
                  v-else
                  class="h-14 w-14 text-success"
                  aria-hidden="true"
                  focusable="false"
                />
              </div>
            </template>
            <template #footer>
              <ElButton
                :type="row.status ? 'danger' : 'success'"
                size="large"
                @click="FETCH_POINTS_LOCK(row.id)"
              >
                {{ row.status ? t("block") : t("unblock") }}
              </ElButton>
            </template>
          </Dialog>
        </div>
      </el-popover>
    </template>
    <template #status="{ row }">
      <ElTag :type="row.status ? 'primary' : 'danger'" round>
        {{ row?.status ? t("active") : t("blocked") }}:
        {{ row?.updated_at }}
      </ElTag>
    </template>
    <template #index="{ index }">
      {{ index }}
    </template>
    <template #name="{ row }">
      <!-- <div class="whitespace-nowrap"> -->
      {{ `${row?.name} - ${row?.location} - ${row?.orientir}` }}
      <!-- </div> -->
    </template>
    <template #debt="{ row }">
      <div class="whitespace-nowrap">
        {{ formatNumber(row.debt) }}
      </div>
    </template>
    <template #furniture_list="{ row }">
      <div v-if="row.furniture_list && row.furniture_list.length">
        <div
          v-for="(item, index) in row.furniture_list"
          :key="index"
          class="whitespace-nowrap"
        >
          {{ item.name }}: {{ item.count }} {{ t("amount") }}
        </div>
      </div>
      <div v-else class="text-gray-500">-</div>
    </template>
  </TwTable>
</template>

<script setup lang="ts">
import { CircleCheckFilled, WarningFilled } from "@element-plus/icons-vue";
import { DEMO_MODE } from "@/demo/config";
import { onClickOutside } from "@vueuse/core";
const target = ref(null);
watch(
  [isBlockDialog, isUpdateDialog],
  (
    [newBlockDialog, newIsUpdateDialog],
    [oldBlockDialog, oldIsUpdateDialog],
  ) => {
    if (
      (oldBlockDialog && !newBlockDialog) ||
      (oldIsUpdateDialog && !newIsUpdateDialog)
    ) {
      clearDropdownMenu();
    }
  },
);

const clearDropdownMenu = () => {
  points.value.forEach((item) => {
    item.visible = false;
  });
};

onClickOutside(target, (event) => {
  if (!isBlockDialog.value && !isUpdateDialog.value) {
    clearDropdownMenu();
  }
});
import {
  ElForm,
  ElPopover,
  ElFormItem,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
} from "element-plus";
import { Ellipsis } from "lucide-vue-next";
import Dialog from "@/components/modal/Dialog.vue";
import {
  usePointsStore,
  formPoints,
  points,
  isLoading,
  isUpdateDialog,
  isBlockDialog,
  pointForCities,
  pointForAgents,
  pointForChannels,
  isUpdateImageDialog,
  allPointFurniture,
} from "@/store/Point";

import TwTable from "@/components/Table/TwTable.vue";
import { useI18n } from "vue-i18n";
import MySelect from "@/components/input/my-select.vue";
import { computed, onBeforeMount, ref, watch } from "vue";
import type { IPoints } from "@/types";
import router from "@/router";
import { formatNumber } from "@/utils/utils";
const {
  FETCH_POINTS_LOCK,
  FETCH_POINTS,
  FETCH_POINTS_BY_ID,
  FETCH_ALL_SELECT,
  FETCH_POINT_BY_IMAGE,
} = usePointsStore();
const { t } = useI18n();
const visibleOptions = ref(false);
// Toggle visibility// Toggle visibility
const toggleVisibility = (id: number) => {
  const item = points.value.find((item) => item.id === id);
  if (item) {
    item.visible = !item.visible; // Toggle the visible value
  }
};
const headers = [
  { text: "points.code", value: "code" },
  { text: "city", value: "city" },
  { text: "district", value: "district" },
  { text: "name", value: "name" },
  // { text: "location", value: "location" },
  // { text: "orientir", value: "orientir" },
  { text: "points.trade_category", value: "trade_category" },
  { text: "points.trade_channel_type", value: "trade_channel" },
  { text: "furnitures.title", value: "furniture_list" },
  { text: "points.trade_agent", value: "trade_agent" },
  { text: "ekspeditor", value: "ekspeditor" },
  { text: "week_day", value: "day" },
  { text: "debts_amount", value: "debt", align: "right" },
  { text: "status", value: "status" },
  { text: "action", value: "action" },
] as Array<{
  text: string;
  value: string;
  width?: string;
  align?: "left" | "center" | "right";
}>;

const handleRowDoubleClick = (row: IPoints) => {
  if (DEMO_MODE) return;
  router.push({ name: "view", params: { id: row.id } });
};
</script>
