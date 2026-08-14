<template>
  <ElInputNumber
    :min="min"
    :model-value="modelValue"
    :max="max"
    controls-position="right"
    :size="size"
    :class="customClass"
    @update:modelValue="updateValue"
  >
    <template #suffix v-if="!!suffixText">
      <span>{{ suffixText }}</span>
    </template>
  </ElInputNumber>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface IProps {
  modelValue: number;
  min?: number;
  max?: number;
  suffixText?: string;
  customClass?: string;
  size?: "small" | "default" | "large";
}
const props = withDefaults(defineProps<IProps>(), {
  size: "default",
  min: 0,
  modelValue: 0,
});

const updateValue = (value: number | null) => {
  if (value == null) {
    value = 0;
  }
  emit("update:modelValue", value);
};

const emit = defineEmits(["update:modelValue"]);
</script>
