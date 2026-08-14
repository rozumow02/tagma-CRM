<template>
  <div class="container mx-auto border rounded-lg">
    <Header :title="t('menuItems.productTypes')">
      <template #default>
        <AddProductTypes />
      </template>
    </Header>
    <Search @search="performSearch" />
    <ProductTypesTable />
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
import AddProductTypes from "@/views/Products/Types/AddProductTypes.vue";
import Search from "@/components/input/Search.vue";
import ProductTypesTable from "@/views/Products/Types/ProductTypesTable.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
import { useProductTypesStore, query } from "@/store/Products/types";
import Header from "@/components/main/Header.vue";
import { useI18n } from "vue-i18n";
const { FETCH_PRODUCTTYPES } = useProductTypesStore();
const { t } = useI18n();
onBeforeMount(() => {
  performSearch("");
});

const performSearch = (name: string) => {
  query.name = name;
  query.pageNumber = 1;
  FETCH_PRODUCTTYPES();
};

const changePage = (page: number) => {
  query.pageNumber = page;
  FETCH_PRODUCTTYPES();
};
</script>
