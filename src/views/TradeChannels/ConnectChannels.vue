<template>
  <Dialog :title="t('channels.add')" v-model="isAddDialog" :d_key="isAddDialog">
    <template #content>
      <el-form :model="formChannelsGroup" label-position="top" class="px-4">
        <el-form-item :label="t('channels.type')">
          <MySelect
            v-model="formChannelsGroup.type_id"
            :options="allTypes"
            value-key="id"
            label-key="name"
            class-name="w-full"
          />
        </el-form-item>
        <el-form-item :label="t('channels.structure')">
          <MySelect
            v-model="formChannelsGroup.structure_id"
            :options="allStructures"
            value-key="id"
            label-key="name"
            class-name="w-full"
          />
        </el-form-item>
        <el-form-item :label="t('channels.size')">
          <MySelect
            v-model="formChannelsGroup.size_id"
            :options="allSizes"
            value-key="id"
            label-key="name"
            class-name="w-full"
          />
        </el-form-item>
        <el-form-item :label="t('channels.management')">
          <MySelect
            v-model="formChannelsGroup.management_id"
            :options="allManagments"
            value-key="id"
            label-key="name"
            class-name="w-full"
          />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button
        :disabled="
          !formChannelsGroup.management_id ||
          !formChannelsGroup.size_id ||
          !formChannelsGroup.structure_id ||
          !formChannelsGroup.type_id
        "
        size="large"
        :type="
          formChannelsGroup.management_id &&
          formChannelsGroup.size_id &&
          formChannelsGroup.structure_id &&
          formChannelsGroup.type_id
            ? 'primary'
            : ''
        "
        @click="FETCH_CHANNELS_CONNECT_GROUP"
      >
        {{ t("add") }}
      </el-button>
    </template>
  </Dialog>
  <ElButton
    type="primary"
    class="!rounded-md p-2"
    size="large"
    v-permission="[isAdmin]"
    @click="() => (isAddDialog = !isAddDialog)"
  >
    <span class="mr-2 text-lg">+</span>
    {{ t("add") }}
  </ElButton>
</template>

<script setup lang="ts">
import { ElDialog, ElForm, ElFormItem, ElInput } from "element-plus";
import { computed, onBeforeMount, reactive, ref, watch } from "vue";
import Dialog from "@/components/modal/Dialog.vue";
import InputField from "@/components/input/inputField.vue";
import {
  useChannelsStore,
  channels,
  formChannelsGroup,
  allManagments,
  isAddDialog,
  allSizes,
  allStructures,
  allTypes,
} from "@/store/Channels/Channels";
import { useI18n } from "vue-i18n";
import { resetObject } from "@/utils/utils";
import { useUserData } from "@/store/UseAppDataStore";
const { FETCH_CHANNELS_CONNECT_GROUP } = useChannelsStore();
const { t } = useI18n();
const { getUserData } = useUserData();
const isAdmin = computed(() => getUserData("ROLE"));

watch(isAddDialog, () => {
  if (typeof formChannelsGroup == "object") {
    resetObject(formChannelsGroup);
  }
});
</script>
