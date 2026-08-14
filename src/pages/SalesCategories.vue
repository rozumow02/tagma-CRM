<template>
  <div class="container mx-auto border rounded-lg">
    <mainHeader :title="t('menuItems.salesCategories')">
      <template #default>
        <AddCategories />
      </template>
    </mainHeader>
    <Search @search="performSearch" />
    <CategoriesTable />
  </div>
  <Pagination
    class="mt-4"
    :current-page="query.pageNumber"
    :total-pages="query.pageCount"
    @page-change="changePage"
  />
</template>

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from "vue";
import Search from "@/components/input/Search.vue";
import CategoriesTable from "@/views/SalesCategories/CategoriesTable.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
import { useCategoriesStore, query } from "@/store/Categories";
import mainHeader from "@/components/main/Header.vue";
import AddCategories from "@/views/SalesCategories/AddCategories.vue";
import { useI18n } from "vue-i18n";
const { FETCH_CATEGORIES } = useCategoriesStore();
const { t } = useI18n();

onBeforeMount(() => {
  performSearch("");
});

const performSearch = (name: string) => {
  query.name = name;
  FETCH_CATEGORIES();
};

const changePage = (page: number) => {
  query.pageNumber = page;
  FETCH_CATEGORIES();
};
</script>
