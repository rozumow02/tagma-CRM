<template>
  <ElDialog
    :model-value="modelValue"
    :show-close="false"
    :visible="modelValue"
    align-center
    :title="title"
    class="!rounded-xl !p-0"
    :before-close="handleBeforeClose"
    :width="width"
    :append-to-body="appendToBody"
    :append-to="appendTo"
    :key="d_key ? '1' : '0'"
    @close="handleclose"
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header border-b p-4 font-semibold">
        <h4 :id="titleId" :class="titleClass" class="!text-h2 ml-2">
          {{ title }}
        </h4>
        <X
          class="el-icon--left text-gray3 cursor-pointer"
          :size="20"
          @click="handleclose"
        />
      </div>
    </template>
    <slot name="content"></slot>
    <template #footer>
      <div
        class="dialog-footer p-4 border-t flex justify-center"
        v-if="props.footer"
      >
        <slot name="footer"></slot>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ElDialog } from "element-plus";
import { defineProps, defineEmits, watch } from "vue";
import { X } from "lucide-vue-next";
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  d_key: {
    type: [String, Boolean],
    default: false,
  },
  beforeClose: {
    type: Function,
    required: false,
    default: null,
  },
  appendToBody: {
    type: Boolean,
    required: false,
    default: false,
  },
  appendTo: {
    type: String,
    required: false,
    default: "body",
  },
  width: {
    type: String,
    requred: false,
    default: "500",
  },
  footer: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const handleclose = () => {
  emit("update:modelValue", false);
};
const handleBeforeClose = (done: Function) => {
  if (props.beforeClose) {
    props.beforeClose(done);
  } else {
    done();
  }
};
</script>

<style scoped>
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
</style>
