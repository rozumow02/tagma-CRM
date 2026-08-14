<template>
  <div class="mx-auto border rounded-lg">
    <Header :title="t('menuItems.merchandisers')">
      <template #default>
        <AddMerchandiser />
      </template>
    </Header>
    <Search @search="performSearch" />
    <MerchandisersTable />
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
import AddMerchandiser from "@/views/Trade-team/AddMerchandiser.vue";
import Search from "@/components/input/Search.vue";
import MerchandisersTable from "@/views/Trade-team/MerchandiserTable.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
import { useMerchandisersStore, query } from "@/store/Trade-team/Merchandiser";
import Header from "@/components/main/Header.vue";
import { useI18n } from "vue-i18n";
const { FETCH_MERCHANDISERS } = useMerchandisersStore();
const { t } = useI18n();
onBeforeMount(() => {
  performSearch("");
});

const performSearch = (name: string) => {
  query.name = name;
  query.pageNumber = 1;
  FETCH_MERCHANDISERS();
};

const changePage = (page: number) => {
  query.pageNumber = page;
  FETCH_MERCHANDISERS();
};
</script>
