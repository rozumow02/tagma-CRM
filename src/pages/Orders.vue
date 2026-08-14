<template>
  <div class="border rounded-lg">
    <Header :title="t('menuItems.orders')">
      <ElButton type="primary" @click="FETCH_ORDER_EXCEL">
        {{ t("export") }}
      </ElButton>
    </Header>
    <HorizontalFilter
      :filters="filters"
      :query="query"
      @update-query="updateQuery"
    />
    <TwTable
      :headers="headers"
      :rows="orders"
      :loading="loading"
      @row-double-click="rowByOrder"
      table-height-offset="100"
    >
      <template #sum="{ row }">
        <span
          class="text-text font-medium bg-shade border-main border px-3 py-1 rounded-md whitespace-nowrap"
        >
          {{ formatNumber(row.sum) }}
        </span>
      </template>
      <template #paid="{ row }">
        <span
          class="text-text font-medium border px-3 py-1 rounded-md whitespace-nowrap"
        >
          {{ formatNumber(row.paid) }}
        </span>
      </template>
      <template #not_paid="{ row }">
        <span
          class="text-text font-medium border px-3 py-1 rounded-md whitespace-nowrap"
        >
          {{ formatNumber(row.not_paid) }}
        </span>
      </template>
      <template #index="{ index }">
        {{ index }}
      </template>
      <template #status="{ row }">
        <ElTag :type="row.status ? 'success' : 'danger'">
          {{ row.status ? t("completed") : t("not_completed") }}
        </ElTag>
      </template>
      <template #is_closed="{ row }">
        <template v-for="status in ORDER_STATUS" :key="status.id">
          <ElTag v-if="status.id === row.is_closed" effect="plain">{{
            status.name
          }}</ElTag>
        </template>
      </template>
    </TwTable>
    <ViewOrder :row="selectedRowOrder" order></ViewOrder>
  </div>
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
      :page-sizes="[100, 300, 3000]"
      :default-page-size="query.pageNumber"
      background
      @current-change="changePage"
      @size-change="changeSize"
    />
    <div class="flex items-center gap-4 text-gray3">
      <span
        >{{ t("total") }}: <b>{{ query.total }}</b></span
      >
      <span
        >{{ t("summary_order") }}: <b>{{ formatNumber(query.sum) }}</b></span
      >
      <span
        >{{ t("paid") }}: <b>{{ formatNumber(query.paid) }}</b></span
      >
      <span
        >{{ t("not_paid") }}: <b>{{ formatNumber(query.not_paid) }}</b></span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref, watch } from "vue";

import {
  useOrdersStore,
  query,
  isViewOrder,
  allAgents,
  allCities,
  orders,
  allDistricts,
  allPaymentTypes,
  loading,
} from "@/store/Orders";
import { ORDER_STATUS } from "@/constants";
import DynamicTable from "@/views/Dynamic/Table.vue";
import Header from "@/components/main/Header.vue";
import { useI18n } from "vue-i18n";
import HorizontalFilter from "@/components/filter/horizontalFilter.vue";
const { FETCH_ORDERS, FETCH_BY_ORDER, FETCH_ORDER_EXCEL, FETCH_ALL_SELECT } =
  useOrdersStore();
const { t } = useI18n();

onBeforeMount(() => {
  FETCH_ALL_SELECT();
  FETCH_ORDERS();
});
import type { FilterOption, IOrders, IQuery } from "@/types";
import { requestApi } from "@/api";
import ViewOrder from "@/views/Orders/viewOrder.vue";
import TwTable from "@/components/Table/TwTable.vue";
import { formatNumber, getDateParts } from "@/utils/utils";
import Trans from "@/i18n/translation";

const filters = computed<FilterOption[]>(() => [
  {
    model: "name",
    type: "input",
    placeholder: t("point"),
  },
  {
    type: "select",
    model: "agentId",
    options: allAgents.value,
    placeholder: t("points.trade_agent"),
  },
  {
    type: "select",
    model: "cityId",
    options: allCities.value,
    placeholder: t("city"),
  },
  {
    type: "select",
    model: "districtId",
    options: allDistricts.value,
    placeholder: t("district"),
    disabled: query.cityId ? false : true,
  },
  {
    type: "input",
    model: "location",
    placeholder: t("location"),
  },
  {
    type: "select",
    model: "status",
    options: [
      { id: true, name: t("completed") },
      { id: false, name: t("not_completed") },
    ],
    placeholder: t("status"),
  },
  {
    model: "order",
    type: "select",
    placeholder: t("date_sort"),
    options: [
      // { id: 'all', name: Trans.t("all") },
      { id: "created_at desc", name: Trans.t("new_sort") },
      { id: "created_at", name: Trans.t("old_sort") },
    ],
  },
  {
    model: "start",
    type: "date",
    placeholder: Trans.t("start_date"),
  },
  {
    model: "end",
    type: "date",
    placeholder: Trans.t("end_date"),
  },
  {
    model: "payment_type_id",
    type: "select",
    placeholder: Trans.t("payment_type"),
    options: allPaymentTypes.value,
  },
]);

const headers = [
  { text: "index", value: "index" },
  { text: "point", value: "trade_point" },
  { text: "location", value: "location" },
  { text: "points.trade_agent", value: "trade_agent" },
  { text: "points.trade_category", value: "trade_category" },
  { text: "orientir", value: "orientir" },
  { text: "city", value: "city" },
  { text: "district", value: "district" },
  { text: "create_at", value: "created_at" },
  { text: "payment_type", value: "payment_type" },
  { text: "status", value: "status" },
  { text: "state", value: "is_closed" },
  { text: "summary_order", value: "sum" },
  { text: "paid", value: "paid" },
  { text: "not_paid", value: "not_paid" },
];

const changePage = (page: number) => {
  query.pageNumber = page;
  FETCH_ORDERS();
};

const changeSize = (size: number) => {
  query.pageNumber = 1;
  query.pageSize = size;
  FETCH_ORDERS();
};
const updateQuery = (key: keyof IQuery, value: IQuery[keyof IQuery]) => {
  // query[key] = value;
  query.pageNumber = 1;

  const updateDateParts = (dateKey: "start" | "end", targetObject: IQuery) => {
    const dateValue = (query as any)[dateKey];
    if (dateValue) {
      const { day, month, year } = getDateParts(dateValue);
      targetObject[`${dateKey}Day`] = day;
      targetObject[`${dateKey}Month`] = month;
      targetObject[`${dateKey}Year`] = year;
    } else {
      delete targetObject[`${dateKey}Day`];
      delete targetObject[`${dateKey}Month`];
      delete targetObject[`${dateKey}Year`];
    }
  };

  // Update start and end date parts
  updateDateParts("start", query);
  updateDateParts("end", query);

  FETCH_ORDERS();
};

watch(
  () => query.cityId,
  (newValue) => {
    if (newValue)
      requestApi("points/districts", "GET", { cityId: newValue }).then(
        (res) => {
          allDistricts.value = res.data;
        },
      );
  },
);

const selectedRowOrder = ref<IOrders>();
const rowByOrder = (row: IOrders) => {
  FETCH_BY_ORDER(row.id);
  selectedRowOrder.value = row;
};
</script>
