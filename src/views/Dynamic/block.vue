<template>
  <Dialog
    :title="t(dialogType === 'delete' ? 'delete' : 'block_usage')"
    v-model="dialogBlock"
    :append-to-body="appendToBody"
  >
    <template #content>
      <div class="flex justify-center">
        <component
          :is="
            dialogType === 'delete'
              ? WarningFilled
              : row?.status
                ? WarningFilled
                : CircleCheckFilled
          "
          class="h-14 w-14"
          :class="
            dialogType === 'delete'
              ? 'text-error'
              : row?.status
                ? 'text-error'
                : 'text-success'
          "
          aria-hidden="true"
          focusable="false"
        />
      </div>
    </template>
    <template #footer>
      <ElButton
        :type="
          dialogType === 'delete'
            ? 'danger'
            : row?.status
              ? 'danger'
              : 'success'
        "
        size="large"
        @click="emit('submit')"
      >
        {{
          t(
            dialogType === "delete"
              ? "delete"
              : row?.status
                ? "block"
                : "unblock",
          )
        }}
      </ElButton>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { CircleCheckFilled, WarningFilled } from "@element-plus/icons-vue";
import Dialog from "@/components/modal/Dialog.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import { computed, type Ref } from "vue";

interface IProps {
  modelValue: boolean;
  row?: any;
  appendToBody?: boolean;
  dialogType?: string; // Added to differentiate between dialog types
}

const emit = defineEmits<{
  (e: "submit"): void;
  (e: "update:modelValue", value: boolean): void;
}>();

const props = withDefaults(defineProps<IProps>(), {
  dialogType: "block",
  appendToBody: false,
});
const dialogBlock = computed({
  get: () => props.modelValue,
  set: (newValue) => emit("update:modelValue", newValue),
});

const dialogType = props.dialogType || "block"; // Default to 'block' if not provided
</script>
