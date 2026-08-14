<script setup lang="ts">
import InputNumber from "@/components/input/InputNumber.vue";
import Trans from "@/i18n/translation";
import { usePromoStore } from "@/store/PromoStore";
const storePromo = usePromoStore();
const { allProducts, formPromo, step } = storeToRefs(storePromo);
import { storeToRefs } from "pinia";
</script>
<template>
  <ElScrollbar height="500" class="px-4" v-if="step === 2">
    <el-form-item
      :label="Trans.t('promo.need_count')"
      class="mb-4"
      label-position="top"
    >
      <InputNumber
        style="width: 100%"
        size="large"
        v-model="formPromo.need_count"
      />
    </el-form-item>
    <el-checkbox-group v-model="formPromo.need_ids">
      <Checkbox
        v-for="product in allProducts"
        :key="product.Id"
        :product="product"
      >
      </Checkbox>
    </el-checkbox-group>
  </ElScrollbar>
</template>
