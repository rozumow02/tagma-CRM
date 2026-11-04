<template>
  <div>
    <!-- Checkbox -->
    <label v-if="type === 'checkbox'" class="flex items-center cursor-pointer">
      <input type="checkbox" v-model="isChecked" class="sr-only" />
      <div
        class="w-6 h-6 flex items-center justify-center border rounded-md"
        :class="isChecked ? 'bg-main border-main' : 'border-gray-400'"
      >
        <Check
          v-if="isChecked"
          class="h-4 w-4 text-white"
          aria-hidden="true"
          focusable="false"
        />
      </div>
    </label>

    <!-- Switch -->
    <label v-if="type === 'switch'" class="flex items-center cursor-pointer">
      <input type="checkbox" v-model="isChecked" class="sr-only" />
      <div
        class="toggle-bg w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out"
        :class="isChecked ? 'bg-main' : ''"
      >
        <div
          class="dot bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out"
          :class="isChecked ? 'translate-x-6' : ''"
        ></div>
      </div>
    </label>

    <!-- Regular Button -->
    <button v-if="type === 'default'" class="btn-default">
      {{ label }}
    </button>

    <!-- Outline Button -->
    <button v-if="type === 'outline'" class="btn-outline">
      {{ label }}
    </button>

    <!-- Filled Button -->
    <button v-if="type === 'filled'" class="btn-filled">
      {{ label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { Check } from "@element-plus/icons-vue";
import { ref, computed } from "vue";

const props = defineProps<{
  type: "checkbox" | "switch" | "default" | "outline" | "filled";
  label?: string;
}>();

const isChecked = ref(false);

const buttonClass = computed(() => {
  switch (props.type) {
    case "default":
      return "btn-default";
    case "outline":
      return "btn-outline";
    case "filled":
      return "btn-filled";
    default:
      return "";
  }
});
</script>

<style scoped>
.btn-default {
  @apply px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md;
}

.btn-outline {
  @apply px-4 py-2 bg-transparent border border-main text-main rounded-md;
}

.btn-filled {
  @apply px-4 py-2 bg-main text-white rounded-md;
}

.toggle-bg {
  @apply transition-colors;
}

.dot {
  @apply transition-transform;
}
</style>
