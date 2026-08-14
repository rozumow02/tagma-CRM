<script setup lang="ts">
import {
  useDiscountsStore,
  second,
  selectedProductSecond,
  step,
} from "@/store/Discounts";
</script>

<template>
  <ElScrollbar height="500" class="px-4" v-if="step === 3">
    <el-checkbox-group v-model="selectedProductSecond">
      <Checkbox
        v-for="product in second"
        :key="product.Id"
        :product="product"
      />
    </el-checkbox-group>
  </ElScrollbar>
</template>
