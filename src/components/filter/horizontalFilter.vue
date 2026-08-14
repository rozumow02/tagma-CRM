<script setup lang="ts">
import { defineProps, defineEmits, reactive, computed } from "vue";
import { ElSelect, ElInput, ElOption, ElDatePicker } from "element-plus";
import type { FilterOption } from "@/types";
import SkeletonFilter from "@/components/loading/SkeletonFilter.vue";

const props = defineProps<{
  filters: FilterOption[];
  query: Record<string, any>;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "updateQuery", key: string, value: any): void;
}>();

const handleChange = (
  key: string,
  value: string | number | null | undefined | any,
) => {
  emit("updateQuery", key, value);
};
</script>

<template>
  <SkeletonFilter v-if="props.loading" :filter-count="props.filters.length" />
  <div v-else class="p-4 justify-center lg:justify-start flex flex-wrap gap-4">
    <component
      v-for="filter in props.filters"
      :is="
        filter.type === 'select'
          ? ElSelect
          : filter.type === 'date'
            ? ElDatePicker
            : ElInput
      "
      :key="filter.model"
      :disabled="filter.disabled"
      :placeholder="filter.placeholder"
      v-model="props.query[filter.model]"
      :style="{ width: filter.width || '240px' }"
      @keyup.enter="
        (event: any) =>
          filter.type === 'input'
            ? handleChange(filter.model, event.target.value)
            : {}
      "
      @change="
        (value: any) =>
          filter.type === 'input' ? {} : handleChange(filter.model, value)
      "
      :clearable="!filter.clearable"
      @clear="filter.type === 'input' ? handleChange(filter.model, null) : {}"
    >
      <el-option
        v-if="
          filter.type === 'select' && filter.options && filter.options.length
        "
        v-for="(option, i) in filter.options"
        :key="i"
        :label="typeof option === 'string' ? option : option.name"
        :value="typeof option === 'string' ? option : option.id"
      />
    </component>
    <slot name="default"></slot>
  </div>
</template>
