<template>
  <div class="mx-auto border rounded-lg">
    <Header :title="t('menuItems.logs')">
      <template #default>
        <!-- <AddProductList /> -->
      </template>
    </Header>
    <Search @search="performSearch" />
    <LogsTable />
  </div>
  <!-- <Pagination
      v-if="query.pageCount"
      :current-page="query.pageNumber"
      :total-pages="6"
      @page-change="changePage"
      :page-sizes="[10,50,100,200,300,400,500]"
      :current-size="query.pageSize"
      @size-change="changeSize"
    /> -->
  <div class="flex justify-between items-center mt-6">
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

<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from "vue";
import { ElPagination } from "element-plus";
import Search from "@/components/input/Search.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
import { useLogsStore, query } from "@/store/Logs";
import Header from "@/components/main/Header.vue";
import { useI18n } from "vue-i18n";
import LogsTable from "@/views/Logs/LogsTable.vue";
const { FETCH_LOGS } = useLogsStore();
const { t } = useI18n();
onBeforeMount(() => {
  performSearch("");
});

const performSearch = (name: string) => {
  query.name = name;
  query.pageNumber = 1;
  FETCH_LOGS();
};

const changePage = (page: number) => {
  query.pageNumber = page;
  FETCH_LOGS();
};
const changeSize = (size: number) => {
  query.pageNumber = 1;
  query.pageSize = size;
  FETCH_LOGS();
};
</script>
