<template>
  <Dialog
    :title="t('ekspeditors.add')"
    v-model="isAddDialog"
    :d_key="isAddDialog"
  >
    <template #content>
      <el-form :model="formEkspeditors" label-position="top" class="px-4">
        <el-form-item :label="t('FIO_name_ru')">
          <InputField v-model="formEkspeditors.name_ru" />
        </el-form-item>
        <el-form-item :label="t('FIO_name_tm')">
          <InputField v-model="formEkspeditors.name_tm" />
        </el-form-item>
        <el-form-item :label="t('phone_number')">
          <InputField v-model="formEkspeditors.number" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button
        :disabled="
          !formEkspeditors.name_ru ||
          !formEkspeditors.name_tm ||
          !formEkspeditors.number
        "
        size="large"
        :type="
          formEkspeditors.name_ru &&
          formEkspeditors.name_tm &&
          formEkspeditors.number
            ? 'primary'
            : ''
        "
        @click="FETCH_EKSPEDITORS_CREATE"
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
  useEkspeditorsStore,
  formEkspeditors,
  isAddDialog,
} from "@/store/Trade-team/Ekspeditors";
import { useI18n } from "vue-i18n";
import { useUserData } from "@/store/UseAppDataStore";
const { FETCH_EKSPEDITORS_CREATE } = useEkspeditorsStore();
const { t } = useI18n();
const { getUserData } = useUserData();
const isAdmin = computed(() => getUserData("ROLE"));

watch(isAddDialog, () => {
  if (typeof formEkspeditors == "object") {
    formEkspeditors.number = "";
    formEkspeditors.name_ru = "";
    formEkspeditors.name_tm = "";
  }
});
</script>
