<template>
  <div class="h-full overflow-auto">
    <VueDraggable
      v-model="internalList"
      :disabled="disabled"
      :animation="150"
      @update="onChange"
      ghostClass="ghost"
      class="flex flex-col gap-2 py-4"
    >
      <div
        v-for="(item, i) in internalList"
        :key="item.id"
        class="cursor-move m-2 text-text"
      >
        <span class="bg-gray1 rounded m-1 p-3">
          {{ i + 1 }}
        </span>
        <span class="bg-gray-500/5 rounded m-1 p-3">
          {{ item.name }}
        </span>
      </div>
      <span class="w-full text-center" v-if="!internalList.length">
        {{ Trans.t("no_data") }}
      </span>
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
import Trans from "@/i18n/translation";
import { ref, watch } from "vue";
import { VueDraggable } from "vue-draggable-plus";

// Props definition with defaults
const props = withDefaults(
  defineProps<{
    modelValue: { name: string; id: number }[]; // Draggable items list
    disabled?: boolean; // Disable dragging
  }>(),
  {
    disabled: false, // Default: not disabled
  },
);

// Emit events definition
const emit = defineEmits<{
  (e: "update:modelValue", value: { name: string; id: number }[]): void;
}>();

const internalList = ref([...props.modelValue]); // Local copy of the list

// Sync props.modelValue with internalList and emit updates
watch(
  () => props.modelValue,
  (newList) => (internalList.value = [...newList]),
);
const onChange = (newOrders: any) => {
  emit("update:modelValue", internalList.value);
};
</script>

<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
