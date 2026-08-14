<script setup lang="ts">
import InputNumber from "@/components/input/InputNumber.vue";
import { DISCOUNT_TYPES } from "@/constants";
import { usePromotionsStore } from "@/store/Promotions";
import { storeToRefs } from "pinia";

import { useI18n } from "vue-i18n";
const storePromotions = usePromotionsStore();

const { allProducts, step, dialogs, formPromotions } =
  storeToRefs(storePromotions);

const { t } = useI18n();
</script>
<template>
  <el-form
    :model="formPromotions"
    label-position="top"
    class="px-4"
    v-if="step === 1"
  >
    <el-form-item :label="t('name_ru')">
      <InputField v-model="formPromotions.name_ru" />
    </el-form-item>
    <el-form-item :label="t('name_tm')">
      <InputField v-model="formPromotions.name_tm" />
    </el-form-item>
    <el-form-item :label="t('count')">
      <InputNumber
        custom-class="w-full"
        style="width: 100%"
        size="large"
        class="w-full"
        v-model="formPromotions.count"
        :min="1"
      />
    </el-form-item>
    <el-form-item :label="t('start_date')">
      <el-date-picker
        v-model="formPromotions.start"
        type="date"
        style="width: 100%"
        class="mb-4 font-medium"
      />
    </el-form-item>
    <el-form-item :label="t('end_date')">
      <el-date-picker
        v-model="formPromotions.end"
        type="date"
        style="width: 100%"
        class="mb-4 font-medium"
      />
    </el-form-item>
  </el-form>
</template>
