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
      <img :src="noImage" width="300" alt="No image" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = Trans;
interface PhotoProps {
  path: string;
  alt?: string;
}

import noImage from "@/assets/images/no_image.png";
import Trans from "@/i18n/translation";
const IMAGE_URL = import.meta.env.VITE_APP_IMAGE_URL;

const props = defineProps<{ photos?: PhotoProps[] }>();
</script>
