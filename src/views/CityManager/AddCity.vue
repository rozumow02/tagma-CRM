<template>
  <Dialog :title="t('add_city')" v-model="isAddDialog" :d_key="isAddDialog">
    <template #content>
      <el-form :model="formCity" label-position="top" class="px-4">
        <el-form-item :label="t('name_ru')">
          <InputField v-model="formCity.name_ru" />
        </el-form-item>
        <el-form-item :label="t('name_tm')">
          <InputField v-model="formCity.name_tm" />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button
        :disabled="!formCity.name_ru || !formCity.name_tm"
        size="large"
        :type="formCity.name_ru && formCity.name_tm ? 'primary' : ''"
        @click="FETCH_CITIES_CREATE"
      >
        {{ t("add") }}
      </el-button>
    </template>
  </Dialog>
  <ElButton
    type="primary"
    class="!rounded-md p-2"
    size="large"
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
import { useCityStore, formCity, isAddDialog } from "@/store/City";
import { useI18n } from "vue-i18n";
const { FETCH_CITIES_CREATE } = useCityStore();
const { t } = useI18n();
watch(isAddDialog, () => {
  if (typeof formCity == "object") {
    formCity.name_ru = "";
    formCity.name_tm = "";
  }
});
</script>
