<template>
  <div class="mx-auto border rounded-lg">
    <div class="flex items-center space-x-4 p-4 border-b">
      <button
        class="text-gray-500 hover:bg-gray1 p-2 rounded-lg"
        @click="router.back()"
      >
        <ArrowLeft class="h-6 w-6" />
      </button>
      <h1 class="text-xl font-semibold">
        {{ t("general.view_point_info") }}
      </h1>
    </div>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-6 py-4 border-b"
    >
      <ElButton
        v-for="(tab, index) in tabs"
        :key="index"
        class="w-full"
        :type="index === currentComponent ? 'primary' : ''"
        @click="showComponent(index)"
      >
        {{ t(`${tab.title}`) }}
      </ElButton>
    </div>
    <component :is="tabs[currentComponent].component" />
  </div>
  <Furniture v-if="currentComponent == 0" />
  <Contacts v-if="currentComponent == 0" />
  <PhotoSection
    :photos="byIdGenerals?.images || []"
    v-if="currentComponent == 0"
    class="border mt-4 rounded-lg pb-4"
  >
    <Header :title="t('photo')">
      <template #default>
        <ElButton
          type="primary"
          class="!rounded-md p-2"
          size="large"
          v-permission="[isAdmin]"
          @click="FETCH_POINT_BY_IMAGE(Number(route.params.id))"
        >
          {{ t("edit") }}
        </ElButton>
        <Dialog
          v-model="isUpdateImageDialog"
          :title="t('edit_image')"
          :footer="false"
          width="600"
        >
          <template #content>
            <UpdateImage
              :rowid="Number(route.params.id)"
              :initial-images="computedImages"
              :key="computedImages.length"
              :upload-limit="2"
              @update:fileList="updateFileList"
              :on-image-create="handleImageCreate"
              :on-image-delete="handleImageDelete"
            ></UpdateImage>
          </template>
        </Dialog>
      </template>
    </Header>
  </PhotoSection>
</template>

<script setup lang="ts">
import {
  isUpdateImageDialog,
  pointByImages,
  usePointsStore,
} from "@/store/Point";
import { computed, onMounted, ref } from "vue";
import UpdateImage from "@/views/Points/UpdateImage.vue";
import { ArrowLeft } from "lucide-vue-next";
import { useRouter, useRoute } from "vue-router";
import { useProsmotrStore, byIdGenerals } from "@/store/Points/Prosmotr";
import { useI18n } from "vue-i18n";
import Contacts from "@/views/Points/Contacts.vue";
import PhotoSection from "@/components/photos/photoSection.vue";
import AllInformation from "@/views/Points/AllInformation.vue";
import NPoint from "@/views/Points/NPoint.vue";
import Test from "../test.vue";
import type { UploadUserFile } from "element-plus";
import ProductsForInformation from "@/views/Points/ProductsForInformation.vue";
import OrderForInformation from "@/views/Points/OrderForInformation.vue";
import { useUserData } from "@/store/UseAppDataStore";
import Furniture from "@/views/Points/Furniture.vue";
const { FETCH_GENERALS } = useProsmotrStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { getUserData } = useUserData();
const isAdmin = computed(() => getUserData("ROLE"));

const {
  FETCH_POINTS_LOCK,
  FETCH_POINTS,
  FETCH_POINTS_BY_ID,
  FETCH_ALL_SELECT,
  FETCH_POINT_BY_IMAGE,
  FETCH_POINTS_CREATE,
  FETCH_POINTS_DELETE,
} = usePointsStore();
const { FETCH_POINT_BY_IMAGE_CREATE, FETCH_POINT_BY_IMAGE_DELETE } =
  useProsmotrStore();
const currentComponent = ref(0);

const computedImages = computed(() => pointByImages.value);

const tabs = [
  {
    component: AllInformation,
    title: "general.general_info",
  },
  // {
  //   component: Contacts,
  //   title: "contacts",
  // },
  {
    component: ProductsForInformation,
    title: "general.products_info",
  },
  {
    component: OrderForInformation,
    title: "general.order_info",
  },
  {
    component: NPoint,
    title: "menuItems.notes_point",
  },
] as const;

onMounted(() => {
  if (route.params.id) FETCH_GENERALS(Number(route.params.id));
});

const showComponent = (index: number) => {
  currentComponent.value = index;
};

const updateFileList = (newFileList: UploadUserFile[]) => {
  console.log("Updated file list:", newFileList);
};

const handleImageCreate = ({ id, file }: { id: number; file: File }) => {
  FETCH_POINT_BY_IMAGE_CREATE({ id, file });
};

const handleImageDelete = (imageId: number, rowId: number) => {
  FETCH_POINT_BY_IMAGE_DELETE(imageId, rowId);
};
</script>
