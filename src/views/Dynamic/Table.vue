<template>
  <TwTable
    :headers="headers"
    :rows="rows"
    :loading="loading"
    @row-double-click="rowDoubleClick"
    :table-height-offset="props.height"
  >
    <template #action="{ row }">
      <el-dropdown popper-class="bg-gray1" v-if="dropdowns && dropdowns.length">
        <button class="outline-none p-1 text-gray-500">
          <Ellipsis />
        </button>
        <template #dropdown>
          <el-dropdown-menu class="p-1 flex flex-col">
            <span
              v-for="(item, i) in dropdowns"
              :key="i"
              @click="emit('clickById', row, item.title)"
              class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
              >{{
                item.title == "block"
                  ? row.status
                    ? t("block")
                    : t("unblock")
                  : t(item.title)
              }}
            </span>
            <slot name="dialog" :row="row"></slot>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
    <template #index="{ index }">
      {{ index }}
    </template>
    <template #status="{ row }">
      <ElTag :type="row.status ? 'primary' : 'danger'" round>
        {{ row.status ? t("active") : t("blocked") }}:
        {{ row.updated_at }}
      </ElTag>
    </template>
    <template #type="{ row }">
      <ElTag type="success" round>
        {{ row.type }}
      </ElTag>
    </template>
    <template #total="{ row }">
      <div
        class="whitespace-nowrap"
        :class="row?.total >= 0 ? '' : 'text-error'"
      >
        {{ formatNumber(row?.total) }}
      </div>
    </template>
    <template #account="{ row }">
      <div class="whitespace-nowrap">
        {{ formatNumber(row.account) }}
      </div>
    </template>
    <template #debt="{ row }">
      <div class="whitespace-nowrap">
        {{ formatNumber(row.debt) }}
      </div>
    </template>
  </TwTable>
</template>

<script setup lang="ts">
import {
  ElForm,
  ElFormItem,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
} from "element-plus";
import { Ellipsis } from "lucide-vue-next";
import TwTable from "@/components/Table/TwTable.vue";
import { useI18n } from "vue-i18n";
import type { IOrders } from "@/types";
import { formatNumber } from "@/utils/utils";
const { t } = useI18n();

interface IProps {
  headers: { text: string; value: string }[];
  rows: any | [];
  dropdowns?: { title: string }[];
  loading?: boolean;
  height?: string | number;
}

const props = defineProps<IProps>();

const emit = defineEmits<{
  (e: "clickById", row: any, title: string): void;
  (e: "update", value: string): void;
  (e: "doubleClick", row?: any): void;
}>();

const rowDoubleClick = (row: IOrders) => {
  emit("doubleClick", row);
};
</script>
