<template>
  <div class="flex flex-col border my-4 px-4 rounded-md w-full">
    <div class="flex justify-between items-center">
      <el-checkbox :value="props.isMultiple ? product.group_id : product.Id">
        <template #default>
          <span
            >{{ product.name }}, {{ product.product_type_name }},
            {{ isMultiple ? "" : product.taste }}
            ({{ product.volume }} {{ Trans.t("litr") }})</span
          >
        </template>
      </el-checkbox>
      <slot></slot>
    </div>
    <slot name="group"></slot>
  </div>
</template>

<script setup lang="ts">
import Trans from "@/i18n/translation";
import { computed, watch } from "vue";
// Props
const props = defineProps(["product", "isMultiple"]);
const emit = defineEmits(["updateGroup"]);
watch(
  () => [props.product.coefficient, props.product.count, props.product.coin],
  (newValue) => {
    if (props.product && props.isMultiple) {
      emit("updateGroup", props.product);
    }
  },
);
</script>
