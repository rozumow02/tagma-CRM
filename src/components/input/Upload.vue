<script lang="ts" setup>
import { ref, defineProps, defineEmits } from "vue";
import { Trash2, ImageUp } from "lucide-vue-next";
import { useI18n } from "vue-i18n";

interface IProps {
  modelValue: File[] | null;
  limit?: number;
  label?: string;
}
const { t } = useI18n();

const props = withDefaults(defineProps<IProps>(), {
  limit: 2,
});
const label = props.label || t("upload_image");
const emit = defineEmits(["update:modelValue"]);

const fileInputRef = ref<HTMLInputElement | null>(null);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const newFiles = Array.from(target.files);
    if (newFiles.length + (props.modelValue?.length || 0) > props.limit) {
      alert(`You can only upload up to ${props.limit} files.`);
      return;
    }
    emit("update:modelValue", [...(props.modelValue || []), ...newFiles]);
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer?.files) {
    const newFiles = Array.from(event.dataTransfer.files);
    if (newFiles.length + (props.modelValue?.length || 0) > props.limit) {
      alert(`You can only upload up to ${props.limit} files.`);
      return;
    }
    emit("update:modelValue", [...(props.modelValue || []), ...newFiles]);
  }
};

const handleDelete = (index: number, event: Event) => {
  event.preventDefault();
  const updatedFiles = (props.modelValue || []).filter((_, i) => i !== index);
  emit("update:modelValue", updatedFiles);
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
};
</script>

<template>
  <div class="card w-full">
    <div class="card-content">
      <div
        class="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-main text-center cursor-pointer"
        @dragover.prevent="handleDragOver"
        @drop="handleDrop"
        @click="fileInputRef?.click()"
      >
        <div class="flex items-center justify-center">
          <ImageUp :size="20" class="mr-3" />
          <p class="text-gray-500">{{ label }}</p>
          <input
            type="file"
            class="hidden"
            multiple
            @change="handleFileChange"
            ref="fileInputRef"
          />
        </div>
      </div>
      <div v-if="props.modelValue?.length" class="mt-4">
        <div
          v-for="(file, index) in props.modelValue"
          :key="index"
          class="flex items-center justify-between bg-gray-100 p-2 rounded mt-2"
        >
          <div>
            <p class="text-sm font-medium">{{ file.name }}</p>
            <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
          </div>
          <button
            class="text-red-500 hover:text-red-700"
            @click="handleDelete(index, $event)"
          >
            <Trash2 class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
