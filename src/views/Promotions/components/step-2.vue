<script setup lang="ts">
import InputNumber from "@/components/input/InputNumber.vue";
import Trans from "@/i18n/translation";
import { usePromotionsStore } from "@/store/Promotions";
const storePromotions = usePromotionsStore();
const {
  allProducts,
  dialogs,
  selectedGroupIds,
  selectedProduct,
  formPromotions,
  step,
  isMultiple,
} = storeToRefs(storePromotions);
import type { ISelectedProducts } from "@/types";
import { splitNumber, uniqueByField } from "@/utils/utils";
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

watch(selectedGroupIds, (newValue, oldValue) => {
  const addedIds = newValue.filter((id) => !oldValue.includes(id)); // Groups added
  const removedIds = oldValue.filter((id) => !newValue.includes(id)); // Groups removed

  // Add products of newly added groups
  addedIds.forEach((groupId) => {
    allProducts.value.forEach((item) => {
      if (item.group_id === groupId) {
        selectedProduct.value.push(item.Id);
      }
    });
  });

  // Remove products of removed groups
  removedIds.forEach((groupId) => {
    allProducts.value
      .filter((item) => item.group_id === groupId)
      .forEach((item) => {
        const index = selectedProduct.value.indexOf(item.Id);
        if (index !== -1) {
          selectedProduct.value.splice(index, 1);
        }
      });
  });
});
</script>
<template>
  <ElScrollbar height="500" class="px-4" v-if="step === 2">
    <div class="flex flex-wrap gap-4">
      <el-radio-group v-model="isMultiple">
        <el-radio-button :label="t('single')" :value="false" />
        <el-radio-button :label="t('group')" :value="true" />
      </el-radio-group>
    </div>
    <!-- Multilple bolanda -->
    <el-checkbox-group v-model="selectedGroupIds" v-if="isMultiple">
      <Checkbox
        v-for="product in uniqueByField(allProducts, 'group_id')"
        :key="product.Id"
        :product="product"
        :isMultiple="isMultiple"
      >
        <template #group>
          <ul class="text-base mx-14 mb-2 w-44 list-disc" v-if="isMultiple">
            <template v-for="item in allProducts" :key="item.Id">
              <li v-if="item.group_id === product.group_id">
                {{ item.taste }}
              </li>
            </template>
          </ul>
        </template>
      </Checkbox>
    </el-checkbox-group>
    <!-- Single bolanda -->
    <el-checkbox-group v-model="selectedProduct" v-else>
      <Checkbox
        v-for="product in allProducts"
        :key="product.Id"
        :product="product"
      >
      </Checkbox>
    </el-checkbox-group>
  </ElScrollbar>
</template>
