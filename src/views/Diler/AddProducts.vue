<script setup lang="ts">
import Trans from "@/i18n/translation";
import type { IFilteredProducts } from "@/types";
import { uniqueByField } from "@/utils/utils";
import { onBeforeMount, ref, watch } from "vue";

const { t } = Trans;

interface IProps {
  products: IFilteredProducts[];
  preserveCounts?: boolean;
}

const emit = defineEmits(["updateGroups"]);
const props = defineProps<IProps>();
const isMultiple = ref(false);
const selectedGroupIds = ref<number[]>([]);
const selectedProduct = ref<number[]>([]);
const hasInitialized = ref(false);

const initializeSelectedFromCounts = () => {
  const selectedIds = props.products
    .filter((item) => Number(item.count) > 0)
    .map((item) => item.Id);
  selectedProduct.value = selectedIds;

  if (props.preserveCounts) return;
  selectedGroupIds.value = [
    ...new Set(
      props.products
        .filter((item) => Number(item.count) > 0)
        .map((item) => item.group_id),
    ),
  ];
};

const updatedGroups = (value: IFilteredProducts) => {
  if (isMultiple.value) emit("updateGroups", value);
};

watch(selectedProduct, (newValue) => {
  props.products.forEach((item) => {
    if (!newValue.includes(item.Id)) {
      item.count = 0;
    }
  });
});

watch(selectedGroupIds, (newValue, oldValue) => {
  const addedIds = newValue.filter((id) => !oldValue.includes(id)); // Groups added
  const removedIds = oldValue.filter((id) => !newValue.includes(id)); // Groups removed

  // Add products of newly added groups
  addedIds.forEach((groupId) => {
    props.products.forEach((item) => {
      if (item.group_id === groupId) {
        selectedProduct.value.push(item.Id);
      }
    });
  });

  // Remove products of removed groups
  removedIds.forEach((groupId) => {
    props.products
      .filter((item) => item.group_id === groupId)
      .forEach((item) => {
        const index = selectedProduct.value.indexOf(item.Id);
        if (index !== -1) {
          selectedProduct.value.splice(index, 1);
          item.count = 0;
        }
      });
  });
});

watch(isMultiple, () => {
  clearProducts();
});
const clearProducts = () => {
  props.products.forEach((item) => {
    item.count = 0;
  });
  selectedProduct.value = [];
  selectedGroupIds.value = [];
};
onBeforeMount(() => {
  if (!props.preserveCounts) {
    clearProducts();
  }
});

watch(
  () => props.products.map((item) => item.count),
  () => {
    if (!props.preserveCounts || hasInitialized.value) return;
    const hasCounts = props.products.some((item) => Number(item.count) > 0);
    if (!hasCounts) return;
    initializeSelectedFromCounts();
    hasInitialized.value = true;
  },
  { immediate: true },
);
</script>

<template>
  <ElScrollbar height="500" class="mt-3">
    <div class="flex flex-wrap gap-4" v-if="!props?.preserveCounts">
      <el-radio-group v-model="isMultiple">
        <el-radio-button :label="t('single')" :value="false" />
        <el-radio-button :label="t('group')" :value="true" />
      </el-radio-group>
    </div>
    <!-- Multilple bolanda -->
    <el-checkbox-group v-model="selectedGroupIds" v-if="isMultiple">
      <Checkbox
        v-for="product in uniqueByField(products, 'group_id')"
        :key="product.Id"
        :product="product"
        :isMultiple="isMultiple"
        @updateGroup="updatedGroups"
      >
        <template #group>
          <ul class="text-base mx-14 mb-2 w-44 list-disc" v-if="isMultiple">
            <template v-for="item in products" :key="item.Id">
              <li v-if="item.group_id === product.group_id">
                {{ item.taste }}
              </li>
            </template>
          </ul>
        </template>
        <template v-if="selectedGroupIds.includes(product.group_id)">
          <InputNumber
            v-model="product.count"
            :suffix-text="Trans.t('quantity')"
          />
        </template>
      </Checkbox>
    </el-checkbox-group>
    <!-- Single bolanda -->
    <el-checkbox-group v-model="selectedProduct" v-else>
      <Checkbox
        v-for="product in products"
        :key="product.Id"
        :product="product"
      >
        <template v-if="selectedProduct.includes(product.Id)">
          <InputNumber
            v-model="product.count"
            :suffix-text="Trans.t('quantity')"
          />
        </template>
      </Checkbox>
    </el-checkbox-group>
  </ElScrollbar>
</template>
