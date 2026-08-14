<template>
  <ElCard shadow="always" body-class="!p-0">
    <template #header>
      <div class="card-header flex justify-between items-center">
        <span class="font-medium text-lg">{{ title }}</span>
        <ElButton
          type="primary"
          class="!rounded-md p-2 max-w-28"
          size="default"
          @click="setActiveDialog(channel)"
        >
          <span class="mr-2 text-lg">+</span>
          {{ t("add") }}
        </ElButton>
      </div>
    </template>
    <el-table
      max-height="250"
      :data="items"
      style="width: 100%"
      size="default"
      show-overflow-tooltip
      header-cell-class-name="row-header_cell"
    >
      <el-table-column :label="t('name_ru')" prop="name_ru" />
      <el-table-column :label="t('name_tm')" prop="name_tm" />
      <el-table-column :label="t('action')">
        <template #default="scope">
          <div class="flex">
            <el-button
              size="small"
              :icon="Edit"
              circle
              @click="FETCH_CHANNELS_BY_ID(scope.row, channel)"
            >
            </el-button>
            <el-button
              size="small"
              circle
              :icon="DeleteFilled"
              @click="confirmDelete(scope.row, channel)"
            >
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </ElCard>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { Edit, DeleteFilled } from "@element-plus/icons-vue";
import {
  useSettingChannelsStore,
  formChannels,
  isAddDialog,
  isActiveDialog,
  isBlockDialog,
  selectedId,
} from "@/store/Channels/Setting";
import { TRADE_CHANNELS, TYPE, type ITRADE_CHANNELS } from "@/constants";
import type { IChannels } from "@/types";
const { t } = useI18n();
const { FETCH_CHANNELS_BY_ID } = useSettingChannelsStore();
interface IProps {
  items: any;
  title: string;
  channel: ITRADE_CHANNELS;
}

const setActiveDialog = (value: ITRADE_CHANNELS) => {
  isActiveDialog.value = value;
  isAddDialog.value = true;
};
const confirmDelete = (row: IChannels, channel: ITRADE_CHANNELS) => {
  selectedId.value = row.id;
  isBlockDialog.value = true;
  isActiveDialog.value = channel;
};
const props = defineProps<IProps>();
</script>

<style lang="scss">
.row-header_cell {
  @apply text-text  text-sm border-stroke;
  background-color: #f7f7f7 !important;
  .cell {
    overflow-wrap: normal;
    font-weight: 500;
  }
}
</style>
