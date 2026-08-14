<template>
  <div class="mx-auto border rounded-lg">
    <Header :title="t('menuItems.drivers')">
      <template #default>
        <AddDriver />
      </template>
    </Header>
    <Search @search="performSearch" />
    <DriversTable />
  </div>
  <Pagination
    v-if="query.pageCount"
    class="mt-4"
    :current-page="query.pageNumber"
    :total-pages="query.pageCount"
    @page-change="changePage"
  />
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from "vue";
import AddDriver from "@/views/Trade-team/AddDriver.vue";
import Search from "@/components/input/Search.vue";
import DriversTable from "@/views/Trade-team/DriversTable.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
import { useDriversStore, query } from "@/store/Trade-team/Drivers";
import Header from "@/components/main/Header.vue";
import { useI18n } from "vue-i18n";
const { FETCH_DRIVERS } = useDriversStore();
const { t } = useI18n();
onBeforeMount(() => {
  performSearch("");
});

const performSearch = (name: string) => {
  query.name = name;
  query.pageNumber = 1;
  FETCH_DRIVERS();
};

const changePage = (page: number) => {
  query.pageNumber = page;
  FETCH_DRIVERS();
};
</script>
