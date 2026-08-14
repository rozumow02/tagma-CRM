<template>
  <div class="mx-auto border rounded-lg">
    <Header :title="t('menuItems.agents')">
      <ElButton
        @click="FETCH_AGENTS_EXCEL"
        type="primary"
        class="mx-4"
        :disabled="!agents.length"
        >{{ t("export") }}</ElButton
      >
      <AddAgents />
    </Header>
    <Search @search="performSearch" />
    <AgentsTable />
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
import AddAgents from "@/views/Trade-team/AddAgents.vue";
import Search from "@/components/input/Search.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
import { useAgentsStore, query, agents } from "@/store/Trade-team/Agents";
import Header from "@/components/main/Header.vue";
import { useI18n } from "vue-i18n";
import AgentsTable from "@/views/Trade-team/AgentsTable.vue";
const { FETCH_AGENTS, FETCH_AGENTS_EXCEL } = useAgentsStore();
const { t } = useI18n();
onBeforeMount(() => {
  performSearch("");
});

const performSearch = (name: string) => {
  query.name = name;
  query.pageNumber = 1;
  FETCH_AGENTS();
};

const changePage = (page: number) => {
  query.pageNumber = page;
  FETCH_AGENTS();
};
</script>
