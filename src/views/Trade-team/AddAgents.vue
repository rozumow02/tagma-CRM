<template>
  <Dialog :title="t('agents.add')" v-model="isAddDialog" :d_key="isAddDialog">
    <template #content>
      <el-form :model="formAgents" label-position="top" class="px-4">
        <el-form-item :label="t('FIO_name_ru')">
          <InputField v-model="formAgents.name_ru" />
        </el-form-item>
        <el-form-item :label="t('FIO_name_tm')">
          <InputField v-model="formAgents.name_tm" />
        </el-form-item>
        <el-form-item :label="t('phone_number')">
          <InputField v-model="formAgents.number" />
        </el-form-item>
        <el-form-item :label="t('drivers.title')">
          <MySelect
            v-model="formAgents.driver_ids"
            :options="agentForDrivers"
            value-key="id"
            multiple
            label-key="name"
            class-name="w-full"
          />
        </el-form-item>
        <el-form-item :label="t('ekspeditors.title')">
          <MySelect
            v-model="formAgents.ekspeditor_ids"
            :options="agentForEkspeditors"
            multiple
            value-key="id"
            label-key="name"
            class-name="w-full"
          />
        </el-form-item>
        <el-form-item :label="t('merchandisers.title')">
          <MySelect
            v-model="formAgents.merchandiser_ids"
            :options="agentForMerchandisers"
            multiple
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
          !formAgents.name_ru ||
          !formAgents.name_tm ||
          !formAgents.number ||
          !formAgents.driver_ids.length ||
          !formAgents.ekspeditor_ids.length
        "
        size="large"
        :type="
          formAgents.name_ru &&
          formAgents.name_tm &&
          formAgents.number &&
          formAgents.driver_ids.length &&
          formAgents.ekspeditor_ids.length
            ? 'primary'
            : ''
        "
        @click="FETCH_AGENTS_CREATE"
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
  useAgentsStore,
  formAgents,
  isAddDialog,
  agentForDrivers,
  agentForEkspeditors,
  agentForMerchandisers,
} from "@/store/Trade-team/Agents";
import { useI18n } from "vue-i18n";
import { resetObject } from "@/utils/utils";
import { useUserData } from "@/store/UseAppDataStore";
const { FETCH_AGENTS_CREATE } = useAgentsStore();
const { t } = useI18n();
const { getUserData } = useUserData();
const isAdmin = computed(() => getUserData("ROLE"));

watch(isAddDialog, () => {
  if (typeof formAgents == "object") {
    resetObject(formAgents);
  }
});
</script>
