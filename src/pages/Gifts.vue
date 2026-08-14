<template>
  <div class="mx-auto border rounded-lg">
    <Header :title="t('menuItems.gifts')">
      <template #default>
        <AddGifts />
      </template>
    </Header>
    <Search @search="performSearch" />
    <GiftsTable />
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
import AddGifts from "@/views/Gifts/AddGift.vue";
import Search from "@/components/input/Search.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
import { useGiftsStore } from "@/store/Gifts";
import Header from "@/components/main/Header.vue";
import { useI18n } from "vue-i18n";
import GiftsTable from "@/views/Gifts/GiftsTable.vue";
const { fetchGifts, query, gifts } = useGiftsStore();
const { t } = useI18n();
onBeforeMount(() => {
  performSearch("");
});

const performSearch = async (name: string) => {
  query.name = name;
  query.pageNumber = 1;
  await fetchGifts();
};

const changePage = (page: number) => {
  query.pageNumber = page;
  fetchGifts();
};
</script>
