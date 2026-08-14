<template>
  <Dialog
    :title="t('channels.add_type')"
    v-model="isAddDialog"
    :d_key="isAddDialog"
  >
    <template #content>
      <el-form :model="formProductTypes" label-position="top" class="px-4">
        <el-form-item :label="t('name_ru')">
          <InputField v-model="formProductTypes.name_ru" />
        </el-form-item>
        <el-form-item :label="t('name_tm')">
          <InputField v-model="formProductTypes.name_tm" />
        </el-form-item>
        <el-form-item :label="t('product.volume')">
          <MySelect
            v-model="formProductTypes.volume"
            :options="typeForVolumes"
            value-key="volume"
            label-key="volume"
            class-name="w-full"
          />
        </el-form-item>
        <el-form-item :label="t('product.count')">
          <el-input-number
            v-model="formProductTypes.count"
            :min="1"
            style="width: 100%"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button
        :disabled="
          !formProductTypes.name_ru ||
          !formProductTypes.name_tm ||
          !formProductTypes.count ||
          !formProductTypes.volume
        "
        size="large"
        :type="
          formProductTypes.name_ru &&
          formProductTypes.name_tm &&
          formProductTypes.count &&
          formProductTypes.volume
            ? 'primary'
            : ''
        "
        @click="FETCH_PRODUCTTYPES_CREATE"
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
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from "vue";
import Dialog from "@/components/modal/Dialog.vue";
import InputField from "@/components/input/inputField.vue";
import {
  useProductTypesStore,
  formProductTypes,
  isAddDialog,
  typeForVolumes,
} from "@/store/Products/types";
import { useI18n } from "vue-i18n";
const { getUserData } = useUserData();
const isAdmin = computed(() => getUserData("ROLE"));

import { resetObject } from "@/utils/utils";
import MySelect from "@/components/input/my-select.vue";
import { useUserData } from "@/store/UseAppDataStore";
const { FETCH_PRODUCTTYPES_CREATE, FETCH_ALL_SELECT } = useProductTypesStore();
const { t, locale } = useI18n();

watch(locale, () => {
  FETCH_ALL_SELECT();
});

watch(isAddDialog, () => {
  if (typeof formProductTypes == "object") {
    resetObject(formProductTypes);
  }
  formProductTypes.count = 12;
});
</script>
