<template>
  <Dialog
    :title="t('categories.add_category')"
    v-model="isAddDialog"
    :d_key="isAddDialog"
    width="450"
  >
    <template #content>
      <el-form :model="formCategories" label-position="top" class="px-4">
        <el-form-item :label="t('name')">
          <InputField v-model="formCategories.name" />
        </el-form-item>
        <!-- <el-form-item :label="t('name_tm')">
          <InputField v-model="formCategories.name_tm" />
        </el-form-item> -->
        <div class="flex justify-between">
          <el-form-item :label="t('min_sum')">
            <el-input-number
              v-model="formCategories.min_sum"
              :min="0"
              controls-position="right"
            />
          </el-form-item>
          <el-form-item :label="t('max_sum')">
            <el-input-number
              v-model="formCategories.max_sum"
              :min="0"
              controls-position="right"
            />
          </el-form-item>
        </div>
      </el-form>
    </template>
    <template #footer>
      <el-button
        :disabled="
          !formCategories.name ||
          !formCategories.min_sum ||
          !formCategories.max_sum
        "
        size="large"
        :type="
          formCategories.name &&
          formCategories.min_sum &&
          formCategories.max_sum
            ? 'primary'
            : ''
        "
        @click="FETCH_CATEGORIES_CREATE"
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
  useCategoriesStore,
  formCategories,
  isAddDialog,
} from "@/store/Categories";
import { useI18n } from "vue-i18n";
import { resetObject } from "@/utils/utils";
import { useUserData } from "@/store/UseAppDataStore";
const { FETCH_CATEGORIES_CREATE } = useCategoriesStore();
const { t } = useI18n();
const { getUserData } = useUserData();
const isAdmin = computed(() => getUserData("ROLE"));

watch(isAddDialog, () => {
  if (typeof formCategories == "object") {
    resetObject(formCategories);
  }
});
</script>
