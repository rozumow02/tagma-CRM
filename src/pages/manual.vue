<script setup lang="ts">
import Header from "@/components/main/Header.vue";
import Dialog from "@/components/modal/Dialog.vue";
import PhotoSection from "@/components/photos/photoSection.vue";
import Trans from "@/i18n/translation";
import { sanitizeRichHtml } from "@/utils/sanitizeRichHtml";
import { useManualStore } from "@/store/Manual";
import type { IFormOption } from "@/types";
import Add from "@/views/Dynamic/add.vue";
import UpdateImage from "@/views/Points/UpdateImage.vue";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
const storeManual = useManualStore();
const { dialogs, formManual, manuals } = storeToRefs(storeManual);
onBeforeMount(() => {
  storeManual.fetchData("manual/get");
});
const data: IFormOption[] = [
  {
    model: "title_ru",
    type: "input",
    label: "name_ru",
  },
  {
    model: "content_ru",
    type: "editor",
    label: "content_ru",
  },
  {
    model: "title_tm",
    type: "input",
    label: "name_tm",
  },
  {
    model: "content_tm",
    type: "editor",
    label: "content_tm",
  },
];

const handleImageCreate = ({ id, file }: { id: number; file: File }) => {
  const formData = new FormData();
  formData.append("manualId", String(id));
  formData.append("image", file);
  storeManual.handleSubmit("manual/save", "POST", {}, formData);
};

const handleImageDelete = (imageId: number, rowId: number) => {
  storeManual.handleSubmit("manual/delete", "DELETE", { ImageId: imageId });
};

const computedPhotos = computed(() => {
  return manuals.value?.images?.map((item) => {
    return {
      path: item.name,
      id: item.id,
    };
  });
});
</script>

<template>
  <div class="border rounded-lg">
    <Header :title="Trans.t('menuItems.manual')">
      <Add
        :forms="data"
        width="700"
        :data="formManual"
        v-model="dialogs.isAdd"
        :label="manuals?.id ? 'manual.update' : 'manual.add'"
        :add="manuals?.id ? false : true"
        @update-forms="
          storeManual.handleSubmit('manual/create', 'POST', {}, formManual)
        "
      >
      </Add>
    </Header>
  </div>
  <div class="grid xl:grid-cols-2 mt-3 border rounded-lg" v-if="manuals?.id">
    <div class="border-r">
      <div class="p-4 flex justify-between border-b">
        <h1 class="text-gray3">{{ Trans.t("name_ru") }}:</h1>
        <h1 class="font-medium">{{ manuals?.title_ru }}</h1>
      </div>
      <div class="p-4 flex justify-between">
        <h1 class="text-gray3">{{ Trans.t("content_ru") }}:</h1>
        <span v-html="sanitizeRichHtml(manuals?.content_ru)"></span>
      </div>
    </div>
    <div>
      <div class="p-4 flex justify-between border-b">
        <h1 class="text-gray3">{{ Trans.t("name_tm") }}:</h1>
        <h1 class="font-medium">{{ manuals?.title_tm }}</h1>
      </div>
      <div class="p-4 flex justify-between">
        <h1 class="text-gray3">{{ Trans.t("content_tm") }}:</h1>
        <span v-html="sanitizeRichHtml(manuals?.content_tm)"></span>
      </div>
    </div>
  </div>
  <div class="border p-4 mt-3 rounded-lg w-full text-center" v-else>
    <span>{{ Trans.t("no_data") }}</span>
  </div>
  <!-- Images -->
  <PhotoSection
    v-if="manuals?.id"
    :photos="computedPhotos || []"
    class="border mt-4 rounded-lg pb-4"
  >
    <Header :title="Trans.t('photo')">
      <template #default>
        <ElButton
          type="primary"
          class="!rounded-md p-2"
          size="large"
          @click="() => (dialogs.isImageUpdate = true)"
        >
          {{ Trans.t("edit_image") }}
        </ElButton>
        <Dialog
          v-model="dialogs.isImageUpdate"
          :title="Trans.t('edit_image')"
          :footer="false"
          width="600"
        >
          <template #content>
            <UpdateImage
              v-if="manuals?.id"
              :rowid="manuals?.id"
              :key="computedPhotos?.length"
              :initial-images="computedPhotos"
              :upload-limit="6"
              :on-image-create="handleImageCreate"
              :on-image-delete="handleImageDelete"
            ></UpdateImage>
          </template>
        </Dialog>
      </template>
    </Header>
  </PhotoSection>
</template>
