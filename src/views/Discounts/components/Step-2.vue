<script setup lang="ts">
import InputNumber from "@/components/input/InputNumber.vue";
import Trans from "@/i18n/translation";
import {
  ArrowBigUpDashIcon,
  ArrowBigDownDashIcon,
  Percent,
} from "lucide-vue-next";
import {
  formDiscounts,
  step,
  selectedProduct,
  selectedGroupIds,
  type2ProductCoefficient,
  type2ProductCoin,
  type2ProductCount,
  first,
} from "@/store/Discounts";
import type { ISelectedProducts } from "@/types";
import { splitNumber, uniqueByField } from "@/utils/utils";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const updatedGroups = (value: ISelectedProducts) => {
  first.value.forEach((item) => {
    if (item.group_id === value.group_id) {
      item.count = value.count;
      item.coefficient = value.coefficient;
      item.coin = value.coin;
    }
  });
};

watch(selectedGroupIds, (newValue, oldValue) => {
  const addedIds = newValue.filter((id) => !oldValue.includes(id)); // Groups added
  const removedIds = oldValue.filter((id) => !newValue.includes(id)); // Groups removed

  // Add products of newly added groups
  addedIds.forEach((groupId) => {
    first.value.forEach((item) => {
      if (item.group_id === groupId) {
        selectedProduct.value.push(item.Id);
      }
    });
  });

  // Remove products of removed groups
  removedIds.forEach((groupId) => {
    first.value
      .filter((item) => item.group_id === groupId)
      .forEach((item) => {
        const index = selectedProduct.value.indexOf(item.Id);
        if (index !== -1) {
          selectedProduct.value.splice(index, 1);
        }
      });
  });
});

const percentageTitle = computed(() => {
  return formDiscounts.is_procent ? "%" : Trans.t("currency_man");
});
</script>
<template>
  <ElScrollbar height="500" class="px-4" v-if="step === 2">
    <div class="flex flex-wrap gap-4">
      <el-radio-group v-model="formDiscounts.is_group">
        <el-radio-button :label="t('single')" :value="false" />
        <el-radio-button :label="t('group')" :value="true" />
      </el-radio-group>
      <div class="flex items-center gap-2" v-if="!formDiscounts.is_direct">
        <InputNumber
          v-model="type2ProductCoefficient"
          size="default"
          :suffix-text="percentageTitle"
        />
        <InputNumber
          v-if="!formDiscounts.is_procent"
          v-model="type2ProductCoin"
          size="default"
          :suffix-text="Trans.t('currency_tng')"
        />
        <InputNumber
          :max="10000"
          size="default"
          v-model="type2ProductCount"
          :suffix-text="Trans.t('quantity')"
        />
      </div>
      <ElSwitch
        v-model="formDiscounts.is_procent"
        :active-text="t('percentage')"
        :active-action-icon="Percent"
        class="flex justify-end"
      />
      <ElSwitch
        v-model="formDiscounts.is_increase"
        :active-text="t('adding_price')"
        class="flex justify-end"
        :active-action-icon="ArrowBigUpDashIcon"
        :inactive-action-icon="ArrowBigDownDashIcon"
      />
    </div>
    <!-- Multilple bolanda -->
    <el-checkbox-group v-model="selectedGroupIds" v-if="formDiscounts.is_group">
      <Checkbox
        v-for="product in uniqueByField(first, 'group_id')"
        :key="product.Id"
        :product="product"
        :isMultiple="formDiscounts.is_group"
        @updateGroup="updatedGroups"
      >
        <template #group>
          <ul
            class="text-base mx-14 mb-2 w-44 list-disc"
            v-if="formDiscounts.is_group"
          >
            <template v-for="item in first" :key="item.Id">
              <li v-if="item.group_id === product.group_id">
                {{ item.taste }}
              </li>
            </template>
          </ul>
        </template>
        <template
          v-if="
            selectedGroupIds.includes(product.group_id) &&
            formDiscounts.is_direct
          "
        >
          <InputNumber
            v-model="product.coefficient"
            :suffix-text="percentageTitle"
          />
          <InputNumber
            v-if="!formDiscounts.is_procent"
            v-model="product.coin"
            :max="99"
            :suffix-text="Trans.t('currency_tng')"
          />
          <InputNumber
            v-model="product.count"
            :max="10000"
            :suffix-text="Trans.t('quantity')"
          />
        </template>
      </Checkbox>
    </el-checkbox-group>
    <!-- Single bolanda -->
    <el-checkbox-group v-model="selectedProduct" v-else>
      <Checkbox v-for="product in first" :key="product.Id" :product="product">
        <template
          v-if="selectedProduct.includes(product.Id) && formDiscounts.is_direct"
        >
          <InputNumber
            v-model="product.coefficient"
            :suffix-text="percentageTitle"
          />
          <InputNumber
            v-if="!formDiscounts.is_procent"
            v-model="product.coin"
            :max="99"
            :suffix-text="Trans.t('currency_tng')"
          />
          <InputNumber
            v-model="product.count"
            :max="10000"
            :suffix-text="Trans.t('quantity')"
          />
        </template>
      </Checkbox>
    </el-checkbox-group>
  </ElScrollbar>
</template>
