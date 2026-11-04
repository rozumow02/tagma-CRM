<template>
  <div class="">
    <slot></slot>
    <div class="grid grid-cols-4 gap-4 p-5" v-viewer v-if="photos?.length">
      <img
        v-for="(photo, index) in photos"
        :key="index"
        :src="IMAGE_URL + photo.path"
        :alt="photo.alt"
        class="rounded-lg object-cover cursor-zoom-in"
        width="400"
      />
    </div>
    <div v-else>
      <div
        class="w-[300px] max-w-full aspect-square flex flex-col items-center justify-center gap-3 bg-gray1 text-gray3"
        role="img"
        aria-label="No image"
      >
        <Picture
          class="h-12 w-12"
          aria-hidden="true"
          focusable="false"
        />
        <span aria-hidden="true">No image</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = Trans;
interface PhotoProps {
  path: string;
  alt?: string;
}

import { Picture } from "@element-plus/icons-vue";
import Trans from "@/i18n/translation";
const IMAGE_URL = import.meta.env.VITE_APP_IMAGE_URL;

const props = defineProps<{ photos?: PhotoProps[] }>();
</script>
