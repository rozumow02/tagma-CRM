<template>
  <div class="mx-auto border rounded-lg">
    <Header :title="t('menuItems.pointsOfSale')">
      <div class="flex items-center">
        <SkeletonButton
          v-if="isLoading"
          :width="80"
          :height="40"
          class="mx-4 flex"
        />
        <ElButton
          v-else
          @click="FETCH_POINTS_EXCEL"
          type="primary"
          class="mx-4"
          :disabled="!points.length"
          >{{ t("export") }}</ElButton
        >
        <AddPoint />
      </div>
    </Header>
    <div class="flex-col lg:flex-row flex items-center justify-between">
      <HorizontalFilter
        :filters="filters"
        :query="query"
        :loading="isLoading"
        @update-query="updateQuery"
      />
      <span
        @click="toggleCollapse"
        size="default"
        link
        class="hover:text-main font-medium text-sm cursor-pointer flex items-center"
      >
        {{ t("all") }}
        <ChevronUpIcon
          :size="15"
          class="mx-1 text-gray-400 transition-transform duration-300"
          :class="{ 'rotate-180': isCollapsed }"
        />
      </span>
    </div>

    <!-- Collapsible section for additional inputs -->
    <transition name="fade">
      <!-- </template> -->
      <HorizontalFilter
        v-if="!isCollapsed"
        class="pt-0"
        :filters="filtersHide"
        :query="query"
        :loading="isLoading"
        @update-query="updateQuery"
      />
    </transition>
    <PointsTable />
  </div>
  <SkeletonPagination v-if="isLoading" />
  <div v-else class="flex justify-between items-center mt-6">
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
      :page-sizes="[300, 3000]"
      :default-page-size="query.pageNumber"
      background
      @current-change="changePage"
      @size-change="changeSize"
    />
    <div class="ml-10 w-full flex justify-end space-x-16">
      <span
        class="text-gray3"
        v-for="item in allPointFurniture"
        :key="item.name"
        >{{ item.name }}: <b>{{ item.count }}</b> {{ t("amount") }}</span
      >
      <span class="text-gray3"
        >{{ t("total") }}: <b>{{ query.total }}</b></span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon, ChevronUpIcon } from "lucide-vue-next";
import { computed, onBeforeMount, onMounted, ref, watch } from "vue";
import AddPoint from "@/views/Points/AddPoints.vue";
import Search from "@/components/input/Search.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
import {
  usePointsStore,
  query,
  points,
  pointForAgents,
  pointForCities,
  allManagement,
  allSize,
  allStructure,
  allType,
  routeForDays,
  routeForEkspeditors,
  allEkspeditors,
  isLoading,
  allPointFurniture,
} from "@/store/Point";
import Header from "@/components/main/Header.vue";
import { useI18n } from "vue-i18n";
import PointsTable from "@/views/Points/PointsTable.vue";
import HorizontalFilter from "@/components/filter/horizontalFilter.vue";
import SkeletonButton from "@/components/loading/SkeletonButton.vue";
import SkeletonPagination from "@/components/loading/SkeletonPagination.vue";
const { FETCH_POINTS, FETCH_POINTS_EXCEL, FETCH_ALL_SELECT } = usePointsStore();
const { t } = useI18n();

onBeforeMount(() => {
  FETCH_ALL_SELECT();
  FETCH_POINTS();
});
import type { FilterOption, IQuery } from "@/types";
import { ElButton, ElCollapse, ElCollapseItem } from "element-plus";
import { requestApi } from "@/api";
import Trans from "@/i18n/translation";

const filtersHide = computed<FilterOption[]>(() => [
  {
    model: "typeId",
    type: "select",
    options: allType.value,
    placeholder: t("channels.type"),
  },
  {
    model: "structureId",
    type: "select",
    options: allStructure.value,
    placeholder: t("channels.structure"),
  },
  {
    model: "sizeId",
    type: "select",
    options: allSize.value,
    placeholder: t("channels.size"),
  },
  {
    model: "managementId",
    type: "select",
    options: allManagement.value,
    placeholder: t("channels.management"),
  },
  {
    type: "select",
    model: "dayId",
    placeholder: t("week_day"),
    options: routeForDays.value,
  },
  {
    type: "select",
    model: "ekspeditorId",
    placeholder: t("ekspeditors.title"),
    options: allEkspeditors.value,
  },
  {
    type: "select",
    model: "status",
    placeholder: t("status"),
    options: [
      { id: 1, name: Trans.t("active") },
      { id: 0, name: Trans.t("blocked") },
    ],
  },
  {
    type: "input",
    model: "contact",
    placeholder: t("contacts"),
  },
  {
    type: "input",
    model: "code",
    placeholder: t("code"),
  },
]);

const filters = computed<FilterOption[]>(() => [
  {
    model: "name",
    type: "input",
    placeholder: t("name"),
  },
  {
    type: "select",
    model: "agentId",
    options: pointForAgents.value,
    placeholder: t("points.trade_agent"),
  },
  {
    type: "select",
    model: "cityId",
    options: pointForCities.value,
    placeholder: t("city"),
  },
  {
    type: "select",
    model: "districtId",
    options: allDistricts.value,
    placeholder: t("district"),
    disabled: query.cityId ? false : true,
  },
]);

const changePage = async (page: number) => {
  query.pageNumber = page;
  await FETCH_POINTS();
};

const changeSize = async (size: number) => {
  query.pageNumber = 1;
  query.pageSize = size;
  await FETCH_POINTS();
};

const updateQuery = async (key: keyof IQuery, value: IQuery[keyof IQuery]) => {
  query[key] = value;
  query.pageNumber = 1;
  // Use the debounced function instead of calling FETCH_POINTS directly
  // debouncedFetchPoints();
  await FETCH_POINTS();
};
const allDistricts = ref([]);

watch(
  () => query.cityId,
  async (newValue) => {
    if (newValue)
      await requestApi("points/districts", "GET", { cityId: newValue }).then(
        (res) => {
          allDistricts.value = res.data;
        },
      );
  },
);
const isCollapsed = ref(true);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
