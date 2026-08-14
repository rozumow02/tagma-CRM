<script setup lang="ts">
import Header from "@/components/main/Header.vue";
import Trans from "@/i18n/translation";
import { useFurnitureStore } from "@/store/Furniture";
import type { IFurniture, IFormOption, ISelectAll } from "@/types";
import { resetObject } from "@/utils/utils";
import Block from "@/views/Dynamic/block.vue";
import Table from "@/views/Dynamic/Table.vue";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, onUnmounted, reactive, ref } from "vue";
import type {} from "@/types";
import Add from "@/views/Dynamic/add.vue";
const furnitureStore = useFurnitureStore();
const { furnitures, formFurniture, dialogs, query } =
  storeToRefs(furnitureStore);
const { t } = Trans;

onBeforeMount(() => {
  furnitureStore.fetchFurniture();
});
onUnmounted(() => {
  dialogs.value.isAdd = false;
  dialogs.value.isUpdate = false;
  dialogs.value.isBlock = false;
});
interface IDropdowns {
  title: string;
}

const data = computed<IFormOption[]>(() => [
  {
    model: "name_ru",
    label: "name_ru",
    type: "input",
  },
  {
    model: "name_tm",
    label: "name_tm",
    type: "input",
  },
]);

const headers = [
  { text: "name_ru", value: "name_ru" },
  { text: "name_tm", value: "name_tm" },
  // { text: "status", value: "status" },
  { text: "action", value: "action" },
];

const selectedId = ref();
const clickByRow = (row: IFurniture, type?: string) => {
  selectedId.value = row.id;
  if (type === "edit") {
    dialogs.value.isUpdate = true;
    formFurniture.value.name_ru = row.name_ru;
    formFurniture.value.name_tm = row.name_tm;
  } else if (type === "delete") {
    dialogs.value.isBlock = true;
  }
};
const changePage = (page: number) => {
  query.value.pageNumber = page;
  furnitureStore.fetchFurniture();
};
const changeSize = (size: number) => {
  query.value.pageNumber = 1;
  query.value.pageSize = size;
  furnitureStore.fetchFurniture();
};
const dropdowns: IDropdowns[] = [{ title: "edit" }, { title: "delete" }];
</script>

<template>
  <div class="border rounded-lg">
    <Header :title="Trans.t('menuItems.furnitures')">
      <Add
        :data="formFurniture"
        :forms="data"
        label="furnitures.add"
        @clear-object="resetObject(formFurniture)"
        add
        @update-forms="
          furnitureStore.handleSubmit(
            'furniture',
            'POST',
            {},
            formFurniture,
            furnitureStore.fetchFurniture,
          )
        "
        v-model="dialogs.isAdd"
      />
    </Header>
    <Table
      :headers="headers"
      :rows="furnitures"
      :dropdowns="dropdowns"
      @click-by-id="clickByRow"
      height="50"
    >
      <template #dialog="{ row }">
        <Add
          v-if="row.id === selectedId"
          :data="formFurniture"
          :forms="data"
          label="furnitures.update"
          @update-forms="
            furnitureStore.handleSubmit(
              `furniture`,
              'PUT',
              { id: row.id },
              formFurniture,
              furnitureStore.fetchFurniture,
            )
          "
          v-model="dialogs.isUpdate"
        />
        <Block
          v-if="row.id === selectedId"
          v-model="dialogs.isBlock"
          dialog-type="delete"
          :append-to-body="true"
          @submit="
            furnitureStore.handleSubmit(
              `furniture`,
              'DELETE',
              { id: row.id },
              {},
              furnitureStore.fetchFurniture,
            )
          "
        />
      </template>
    </Table>
  </div>
  <div class="flex items-center justify-between mt-6">
    <ElPagination
      v-model:current-page="query.pageNumber"
      v-model:page-size="query.pageSize"
      :prev-text="t('pagination.previous')"
      :next-text="t('pagination.next')"
      popper-class="!bg-gray1 !m-0"
      layout="prev, pager, next, sizes"
      :total="query.pageCount * query.pageSize"
      :page-count="query.pageCount"
      class="!text-gray3 !font-medium"
      :page-sizes="[10, 50, 100, 200, 300, 400, 500]"
      :default-page-size="query.pageNumber"
      background
      @current-change="changePage"
      @size-change="changeSize"
    />
    <span class="text-gray3"
      >{{ t("total") }}: <b>{{ query.total }}</b></span
    >
  </div>
</template>
