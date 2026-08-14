<template>
  <div class="container mx-auto border rounded-lg">
    <Header :title="t('menuItems.routes')">
      <template #default>
        <AddRoutes />
      </template>
    </Header>
    <!-- Filter -->
    <HorizontalFilter
      :filters="filters"
      :query="query"
      @update-query="updateQuery"
    />
    <RoutesTable />
  </div>
  <Pagination
    v-if="query.pageCount"
    :current-page="query.pageNumber"
    :total-pages="query.pageCount"
    @page-change="changePage"
    class="container mx-auto mt-4"
  />
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, reactive, ref } from "vue";
import AddRoutes from "@/views/Routes/AddRoute.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
import {
  useRoutesStore,
  query,
  routeForCities,
  routeForAgents,
  routeForDays,
} from "@/store/Route";
const filters = computed<FilterOption[]>(() => [
  {
    type: "select",
    model: "cityId",
    placeholder: t("menuItems.cities"),
    options: routeForCities.value,
  },
  {
    type: "select",
    model: "agentId",
    placeholder: t("menuItems.agents"),
    options: routeForAgents.value,
  },
  {
    type: "select",
    model: "dayId",
    placeholder: t("week_day"),
    options: routeForDays.value,
  },
]);
import type { IQuery, FilterOption } from "@/types";
const updateQuery = (key: keyof IQuery, value: IQuery[keyof IQuery]) => {
  query[key] = value;
  query.pageNumber = 1;
  FETCH_ROUTES();
};
import Header from "@/components/main/Header.vue";
import { useI18n } from "vue-i18n";
import RoutesTable from "@/views/Routes/RoutesTable.vue";
import HorizontalFilter from "@/components/filter/horizontalFilter.vue";
const { FETCH_ROUTES, FETCH_ALL_SELECT } = useRoutesStore();
const { t } = useI18n();
onBeforeMount(() => {
  FETCH_ROUTES();
  FETCH_ALL_SELECT();
});

const changePage = (page: number) => {
  query.pageNumber = page;
  FETCH_ROUTES();
};
</script>
