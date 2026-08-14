<template>
  <Dialog
    :title="t(`channels.add_${isActiveDialog}`)"
    v-model="isAddDialog"
    :d_key="isAddDialog"
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
        @click="FETCH_CHANNELS_CREATE(isActiveDialog)"
      >
        {{ t("add") }}
      </el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ElDialog, ElForm, ElFormItem, ElInput } from "element-plus";
import { watch } from "vue";
import Dialog from "@/components/modal/Dialog.vue";
import InputField from "@/components/input/inputField.vue";
import {
  useSettingChannelsStore,
  formChannels,
  isAddDialog,
  isActiveDialog,
} from "@/store/Channels/Setting";
import { resetObject } from "@/utils/utils";
const { FETCH_CHANNELS_CREATE } = useSettingChannelsStore();
import { useI18n } from "vue-i18n";
const { t } = useI18n();
watch(isAddDialog, () => {
  if (typeof formChannels == "object") {
    resetObject(formChannels);
  }
});
</script>
