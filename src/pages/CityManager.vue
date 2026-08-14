<template>
  <div class="border rounded-lg">
    <Header :title="t('menuItems.cities')">
      <template #default>
        <DynamicAdd
          :data="formCity"
          :forms="data"
          label="add_city"
          @update-forms="FETCH_CITIES_CREATE"
          @clear-object="resetObject(formCity)"
          add
          v-model="isAddDialog"
        />
        <!--  -->
      </template>
    </Header>
    <Search @search="performSearch" />
    <DynamicTable
      @click-by-id="FETCH_CITIES_BY_ID"
      :headers="headers"
      :rows="cities"
      :dropdowns="dropdowns"
    >
      <template #dialog="{ row }">
        <DynamicAdd
          v-if="row.id == selectedId"
          :data="formCity"
          :forms="data"
          label="update_city"
          @update-forms="FETCH_CITIES_UPDATE(row.id)"
          v-model="isUpdateDialog"
        ></DynamicAdd>
        <DynamicBlock
          v-model="isBlockDialog"
          :row="row"
          @submit="FETCH_CITIES_LOCK(row.id)"
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
import { computed, onBeforeMount } from "vue";
import DynamicAdd from "@/views/Dynamic/add.vue";
import DynamicTable from "@/views/Dynamic/Table.vue";
import DynamicBlock from "@/views/Dynamic/block.vue";
import Search from "@/components/input/Search.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
import {
  useCityStore,
  query,
  formCity,
  cities,
  isAddDialog,
  isUpdateDialog,
  selectedId,
  isBlockDialog,
} from "@/store/City";
import Header from "@/components/main/Header.vue";
import { useI18n } from "vue-i18n";

onBeforeMount(() => {
  performSearch("");
});

const {
  FETCH_CITIES_UPDATE,
  FETCH_CITIES,
  FETCH_CITIES_CREATE,
  FETCH_CITIES_BY_ID,
  FETCH_CITIES_LOCK,
} = useCityStore();

const { t } = useI18n();
import type { IFormOption, ICityForm } from "@/types";
import { resetObject } from "@/utils/utils";

const performSearch = (name: string) => {
  query.name = name;
  query.pageNumber = 1;
  FETCH_CITIES();
};

const changePage = (page: number) => {
  query.pageNumber = page;
  FETCH_CITIES();
};

const chageSize = (size: number) => {
  query.pageNumber = 1;
  query.pageSize = size;
  FETCH_CITIES();
};

const headers = [
  { text: "cityCode", value: "code" },
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
]);
interface IDropdowns {
  title: string;
}
const dropdowns: IDropdowns[] = [{ title: "edit" }, { title: "block" }];
</script>
