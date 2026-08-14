<template>
  <div class="border mt-4 rounded-lg pb-4">
    <Header :title="t('furnitures.title')">
      <template #default>
        <Add
          add
          v-model="dialogs.isAdd"
          :data="formFurnitureByPoint"
          :forms="formData"
          label="furnitures.add"
          @update-forms="
            furnitureStore.handleSubmit(
              'furniture/point_create',
              'GET',
              formFurnitureByPoint,
              {},
              fetch,
            )
          "
        />
      </template>
    </Header>
    <TwTable :headers="headers" :rows="furnitureForPoint">
      <template #action="{ row }">
        <ElDropdown popper-class="bg-gray1">
          <button class="outline-none p-1 text-gray-500">
            <Ellipsis />
          </button>
          <template #dropdown>
            <ElDropdownMenu class="p-1 flex flex-col">
              <span
                @click="beforeModal(row, 'put')"
                class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
                >{{ t("edit") }}</span
              >
              <span
                @click="beforeModal(row, 'delete')"
                class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
              >
                {{ t("delete") }}
              </span>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </template>
      <template #index="{ index }">
        {{ index }}
      </template>
    </TwTable>
    <Add
      v-model="dialogs.isUpdate"
      :data="formFurnitureByPoint"
      :forms="formData"
      label="furnitures.update"
      @update-forms="
        furnitureStore.handleSubmit(
          'furniture/point_update',
          'GET',
          formFurnitureByPoint,
          {},
          fetch,
        )
      "
    />
    <Block
      v-model="dialogs.isBlock"
      dialog-type="delete"
      @submit="
        furnitureStore.handleSubmit(
          'furniture/point',
          'DELETE',
          { id: formFurnitureByPoint.id },
          {},
          fetch,
        )
      "
    />
  </div>
</template>

<script setup lang="ts">
import TwTable from "@/components/Table/TwTable.vue";
import { Ellipsis } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import { onMounted, computed, watch, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import Header from "@/components/main/Header.vue";
import Add from "../Dynamic/add.vue";
import { useFurnitureStore } from "@/store/Furniture";
import { storeToRefs } from "pinia";
import type { IFormOption, IFurnitureByPoint } from "@/types";
import Block from "../Dynamic/block.vue";
import { ElDropdown, ElDropdownMenu } from "element-plus";
const furnitureStore = useFurnitureStore();
const { allFurnitures, dialogs, furnitureForPoint, formFurnitureByPoint } =
  storeToRefs(furnitureStore);
const { t } = useI18n();

const headers = [
  { text: "index", value: "index", width: "50" },
  { text: "name", value: "name" },
  { text: "count", value: "count" },
  { text: "action", value: "action", width: "130" },
];

const formData = computed<IFormOption[]>(() => [
  {
    type: "select",
    model: "furniture_id",
    label: "furnitures.title",
    options: allFurnitures.value,
  },
  {
    type: "number",
    model: "count",
    label: "count",
  },
]);

const route = useRoute();
onMounted(() => {
  fetch();
});
onUnmounted(() => {
  dialogs.value.isAdd = false;
  dialogs.value.isUpdate = false;
  dialogs.value.isBlock = false;
});

const fetch = () => {
  if (route.params.id) {
    formFurnitureByPoint.value.trade_point_id = Number(route.params.id);
    formFurnitureByPoint.value.furniture_id = null;
    formFurnitureByPoint.value.count = 0;
    furnitureStore.fetchFurnitureByPoint(Number(route.params.id));
    furnitureStore.fetchAllFurnitures();
  }
};

const beforeModal = (row: IFurnitureByPoint | any, type: string) => {
  if (type === "delete") {
    dialogs.value.isBlock = true;
    formFurnitureByPoint.value.id = row.id;
  } else if (type === "put") {
    dialogs.value.isUpdate = true;
    formFurnitureByPoint.value.furniture_id = row.furniture_id;
    formFurnitureByPoint.value.count = row.count;
    formFurnitureByPoint.value.id = row.id;
  }
};

watch(
  () => dialogs.value.isAdd,
  (newValue) => {
    if (newValue) {
      formFurnitureByPoint.value.trade_point_id = Number(route.params.id);
      formFurnitureByPoint.value.furniture_id = null;
      formFurnitureByPoint.value.count = 0;
      delete formFurnitureByPoint.value.id;
    }
  },
);
</script>
