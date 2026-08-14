<template>
  <div class="mx-auto border rounded-lg">
    <Header :title="t('menuItems.ekspeditors')">
      <template #default>
        <AddEkspeditors />
      </template>
    </Header>
    <Search @search="performSearch" />
    <EkspeditorsTable />
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
import Search from "@/components/input/Search.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
import { useEkspeditorsStore, query } from "@/store/Trade-team/Ekspeditors";
import Header from "@/components/main/Header.vue";
import { useI18n } from "vue-i18n";
import AddEkspeditors from "@/views/Trade-team/AddEkspeditors.vue";
import EkspeditorsTable from "@/views/Trade-team/EkspeditorsTable.vue";
const { FETCH_EKSPEDITORS } = useEkspeditorsStore();
const { t } = useI18n();
onBeforeMount(() => {
  performSearch("");
});

const performSearch = (name: string) => {
  query.name = name;
  query.pageNumber = 1;
  FETCH_EKSPEDITORS();
};

const changePage = (page: number) => {
  query.pageNumber = page;
  FETCH_EKSPEDITORS();
};
</script>
