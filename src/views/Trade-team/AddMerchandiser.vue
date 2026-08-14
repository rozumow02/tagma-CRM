<template>
  <Dialog
    :title="t('merchandisers.add')"
    v-model="isAddDialog"
    :d_key="isAddDialog"
  >
    <template #content>
      <el-form :model="formMerchandisers" label-position="top" class="px-4">
        <el-form-item :label="t('FIO_name_ru')">
          <InputField v-model="formMerchandisers.name_ru" />
        </el-form-item>
        <el-form-item :label="t('FIO_name_tm')">
          <InputField v-model="formMerchandisers.name_tm" />
        </el-form-item>
        <el-form-item :label="t('phone_number')">
          <InputField v-model="formMerchandisers.number" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button
        :disabled="
          !formMerchandisers.name_ru ||
          !formMerchandisers.name_tm ||
          !formMerchandisers.number
        "
        size="large"
        :type="
          formMerchandisers.name_ru &&
          formMerchandisers.name_tm &&
          formMerchandisers.number
            ? 'primary'
            : ''
        "
        @click="FETCH_MERCHANDISERS_CREATE"
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
  useMerchandisersStore,
  formMerchandisers,
  isAddDialog,
} from "@/store/Trade-team/Merchandiser";
import { useI18n } from "vue-i18n";
import { useUserData } from "@/store/UseAppDataStore";
const { FETCH_MERCHANDISERS_CREATE } = useMerchandisersStore();
const { t } = useI18n();
const { getUserData } = useUserData();
const isAdmin = computed(() => getUserData("ROLE"));

watch(isAddDialog, () => {
  if (typeof formMerchandisers == "object") {
    formMerchandisers.number = "";
    formMerchandisers.name_ru = "";
    formMerchandisers.name_tm = "";
  }
});
</script>
