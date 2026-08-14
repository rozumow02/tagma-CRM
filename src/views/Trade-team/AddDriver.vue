<template>
  <Dialog :title="t('drivers.add')" v-model="isAddDialog" :d_key="isAddDialog">
    <template #content>
      <el-form :model="formDrivers" label-position="top" class="px-4">
        <el-form-item :label="t('FIO_name_ru')">
          <InputField v-model="formDrivers.name_ru" />
        </el-form-item>
        <el-form-item :label="t('FIO_name_tm')">
          <InputField v-model="formDrivers.name_tm" />
        </el-form-item>
        <el-form-item :label="t('phone_number')">
          <InputField v-model="formDrivers.number" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button
        :disabled="
          !formDrivers.name_ru || !formDrivers.name_tm || !formDrivers.number
        "
        size="large"
        :type="
          formDrivers.name_ru && formDrivers.name_tm && formDrivers.number
            ? 'primary'
            : ''
        "
        @click="FETCH_DRIVERS_CREATE"
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
  useDriversStore,
  formDrivers,
  isAddDialog,
} from "@/store/Trade-team/Drivers";
import { useI18n } from "vue-i18n";
import { useUserData } from "@/store/UseAppDataStore";
const { FETCH_DRIVERS_CREATE } = useDriversStore();
const { t } = useI18n();
const { getUserData } = useUserData();
const isAdmin = computed(() => getUserData("ROLE"));

watch(isAddDialog, () => {
  if (typeof formDrivers == "object") {
    formDrivers.number = "";
    formDrivers.name_ru = "";
    formDrivers.name_tm = "";
  }
});
</script>
