<template>
  <div class="p-6">
    <el-upload
      v-model:file-list="internalFileList"
      list-type="picture-card"
      :on-remove="handleRemove"
      :auto-upload="false"
      :on-success="handleAvatarSuccess"
      @change="handleAdd"
      :limit="uploadLimit"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <el-icon><Plus /></el-icon>
    </el-upload>
  </div>
  <div class="border-t"></div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, onMounted } from "vue";
import { Plus } from "@element-plus/icons-vue";
import type { UploadProps, UploadUserFile } from "element-plus";

// Props
const props = defineProps<{
  rowid: number;
  initialImages?: { id: number; path: string }[];
  uploadLimit: number;
  onImageCreate: (payload: { id: number; file: File }) => void;
  onImageDelete: (imageId: number, rowId: number) => void;
}>();

const IMAGE_URL = import.meta.env.VITE_APP_IMAGE_URL;
// Emit
const emit = defineEmits(["update:fileList"]);

// Internal file list for the component
const internalFileList = ref<UploadUserFile[]>([]);

// Compute initial images on mount
onMounted(() => {
  if (props.initialImages) {
    internalFileList.value = props.initialImages.map((item) => ({
      url: IMAGE_URL + item.path,
      name: String(item.id),
      uid: item.id,
      imageId: item.id,
    }));
  }
});

// Watch internalFileList changes and emit updates
watch(internalFileList, (newList) => {
  emit("update:fileList", newList);
});

// Handle file removal
const handleRemove: UploadProps["onRemove"] = (uploadFile) => {
  const imageId = uploadFile.uid;

  props.onImageDelete(imageId, props.rowid);
};

// Handle file addition
const handleAdd: UploadProps["onChange"] = (file) => {
  if (file?.status === "ready" && file.raw) {
    props.onImageCreate({ id: props.rowid, file: file.raw });
  }
};

const imageUrl = ref("");

const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile,
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
};
</script>
