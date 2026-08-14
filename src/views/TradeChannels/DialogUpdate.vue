<template>
  <Dialog :title="t('delete')" v-model="isBlockDialog">
    <template #content>
      <div class="flex justify-center">
        <img :src="warningSvg" />
      </div>
    </template>
    <template #footer>
      <ElButton :type="'danger'" size="large" @click="FETCH_CHANNELS_DELETE()">
        {{ t("delete") }}
      </ElButton>
    </template>
  </Dialog>
  <Dialog
    :title="t(`channels.edit_${isActiveDialog}`)"
    v-model="isUpdateDialog"
    :d_key="isUpdateDialog"
  >
    <template #content>
      <el-form
        :model="formChannels"
        label-position="top"
        class="px-4 text-text font-normal"
      >
        <el-form-item size="large" :label="t('name_ru')">
          <InputField v-model="formChannels.name_ru" />
        </el-form-item>
        <el-form-item size="large" :label="t('name_tm')">
          <InputField v-model="formChannels.name_tm" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button
        :disabled="!formChannels.name_ru || !formChannels.name_tm"
        size="large"
        :type="formChannels.name_ru && formChannels.name_tm ? 'primary' : ''"
        @click="FETCH_CHANNELS_UPDATE"
      >
        {{ t("edit") }}
      </el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import {
  isBlockDialog,
  useSettingChannelsStore,
  formChannels,
  isActiveDialog,
  isUpdateDialog,
} from "@/store/Channels/Setting";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import warningSvg from "@/assets/svg/warning.svg";
import type { IChannels } from "@/types";
import type { ITRADE_CHANNELS } from "@/constants";

const { FETCH_CHANNELS_DELETE, FETCH_CHANNELS_UPDATE } =
  useSettingChannelsStore();
</script>
