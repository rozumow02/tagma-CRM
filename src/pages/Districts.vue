<template>
  <div class="border rounded-lg">
    <Header :title="t('menuItems.districts')">
      <template #default>
        <!-- AddDistrict -->
        <DynamicAdd
          :data="formDistrict"
          :forms="data"
          label="districts.add"
          @update-forms="FETCH_DISTRICTS_CREATE"
          @clear-object="resetObject(formDistrict)"
          add
          v-model="isAddDialog"
        />
        <!--  -->
      </template>
    </Header>
    <!-- Search -->
    <Search @search="performSearch" />
    <!--  -->
    <!-- District Table -->
    <DynamicTable
      @click-by-id="FETCH_DISTRICTS_BY_ID"
      :headers="headers"
      :rows="districts"
      :dropdowns="dropdowns"
    >
      <template #dialog="{ row }">
        <DynamicAdd
          v-if="row.id == selectedId"
          :data="formDistrict"
          :forms="data"
          label="districts.update"
          @update-forms="FETCH_DISTRICTS_UPDATE(row.id)"
          v-model="isUpdateDialog"
        ></DynamicAdd>
        <DynamicBlock
          v-model="isBlockDialog"
          :row="row"
          @submit="FETCH_DISTRICTS_LOCK(row.id)"
        />
      </template>
    </DynamicTable>
    <!--  -->
  </div>
  <Pagination
    v-if="query.pageCount"
    class="mt-4"
    :current-page="query.pageNumber"
    :total-pages="query.pageCount"
    @page-change="changePage"
    @size-change="chageSize"
  />
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import DynamicAdd from "@/views/Dynamic/add.vue";
import DynamicTable from "@/views/Dynamic/Table.vue";
import DynamicBlock from "@/views/Dynamic/block.vue";
import Search from "@/components/input/Search.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
import {
  useDistrictsStore,
  query,
  formDistrict,
  districts,
  isAddDialog,
  isUpdateDialog,
  selectedId,
  isBlockDialog,
} from "@/store/District";
import Header from "@/components/main/Header.vue";
import { useI18n } from "vue-i18n";
const cities = ref([]);
onBeforeMount(() => {
  performSearch("");
  districtsApi("points/cities", "GET").then((res) => {
    cities.value = res.data;
  });
});

const {
  FETCH_DISTRICTS_UPDATE,
  FETCH_DISTRICTS,
  FETCH_DISTRICTS_CREATE,
  FETCH_DISTRICTS_BY_ID,
  FETCH_DISTRICTS_LOCK,
} = useDistrictsStore();

const { t } = useI18n();
import type { IFormOption, IDistrictForm } from "@/types";
import { resetObject } from "@/utils/utils";
import { districtsApi } from "@/api/districts";

const performSearch = (name: string) => {
  query.name = name;
  query.pageNumber = 1;
  FETCH_DISTRICTS();
};

const changePage = (page: number) => {
  query.pageNumber = page;
  FETCH_DISTRICTS();
};

const chageSize = (size: number) => {
  query.pageNumber = 1;
  query.pageSize = size;
  FETCH_DISTRICTS();
};

const headers = [
  { text: "index", value: "index" },
  { text: "city", value: "city" },
  { text: "name_ru", value: "name_ru" },
  { text: "name_tm", value: "name_tm" },
  { text: "status", value: "status" },
  { text: "action", value: "action" },
];
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
  {
    model: "city_id",
    label: "city",
    type: "select",
    options: cities.value,
  },
]);
interface IDropdowns {
  title: string;
}
const dropdowns: IDropdowns[] = [{ title: "edit" }, { title: "block" }];
</script>
