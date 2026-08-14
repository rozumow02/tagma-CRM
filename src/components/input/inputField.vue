<template>
  <div class="custom-input w-full">
    <el-input
      class="font-medium text-text"
      v-model="inputValue"
      :key="props.d_key ? '1' : '0'"
      :size="props.size"
      :placeholder="props.placeholder"
      :type="props.type"
      :maxlength="props.maxlength"
      :minlength="props.minlength"
      :show-word-limit="props.showWordLimit"
      :clearable="props.clearable"
      :disabled="props.disabled"
      :prefix-icon="props.prefixIcon"
      :suffix-icon="props.suffixIcon"
      :rows="props.rows"
      :autosize="props.autosize"
      :resize="props.resize"
      :autocomplete="props.autocomplete"
      :name="props.name"
      :readonly="props.readonly"
      :validate-event="props.validateEvent"
      :step="props.step"
      :tabindex="props.tabindex"
      :show-password="props.showPassword"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
      @input="emit('update:modelValue', inputValue)"
      @change="emit('change', inputValue)"
      @clear="emit('clear')"
      @keydown="emit('keydown', $event)"
    >
      <template v-if="$slots.prepend" #prepend
        ><slot name="prepend"
      /></template>
      <template v-if="$slots.append" #append><slot name="append" /></template>
    </el-input>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from "vue";
import type { PropType } from "vue";
import { ElInput } from "element-plus";

// Propsni define qilish
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  showPassword: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<"default" | "small" | "large">,
    default: "large",
  },
  d_key: {
    type: [String, Boolean, Number],
    default: null,
    required: false,
  },
  placeholder: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  maxlength: {
    type: [String, Number],
    default: null,
  },
  minlength: {
    type: [String, Number],
    default: null,
  },
  showWordLimit: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  prefixIcon: {
    type: String,
    default: "",
  },
  suffixIcon: {
    type: String,
    default: "",
  },
  rows: {
    type: Number,
    default: 2,
  },
  autosize: {
    type: [Boolean, Object],
    default: false,
  },
  resize: {
    type: String as PropType<"none" | "both" | "horizontal" | "vertical">,
    default: "none",
  },
  autocomplete: {
    type: String,
    default: "off",
  },
  name: {
    type: String,
    default: "",
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  validateEvent: {
    type: Boolean,
    default: true,
  },
  // inputStyle: {
  //   type: Object as PropType<CSSStyleDeclaration>,
  //   default: () => ({}),
  // },
  step: {
    type: [String, Number],
    default: "1",
  },
  tabindex: {
    type: [String, Number],
    default: "0",
  },
});

// Emitsni define qilish
const emit = defineEmits([
  "update:modelValue",
  "blur",
  "focus",
  "change",
  "clear",
  "keydown",
]);

// Input qiymati uchun reactive ref
const inputValue = ref(props.modelValue);

// Input qiymati o'zgarganda avtomatik yangilash
inputValue.value = props.modelValue;
</script>

<style scoped>
.custom-input {
  margin-bottom: 0.5rem;
}
</style>
