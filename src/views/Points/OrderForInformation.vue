<template>
  <div>
    <HorizontalFilter
      @update-query="updateQuery"
      :filters="filters"
      :query="query"
    ></HorizontalFilter>
    <TwTable
      :headers="headers"
      :rows="pointByOrders"
      @row-double-click="rowByOrder"
    >
      <template #sum="{ row }">
        <span
          class="text-text font-medium bg-shade border-main border px-3 py-1 rounded-md"
        >
          {{ row.sum }}
        </span>
      </template>
      <template #paid="{ row }">
        <span class="text-text font-medium border px-3 py-1 rounded-md">
          {{ row.paid }}
        </span>
      </template>
      <template #not_paid="{ row }">
        <span class="text-text font-medium border px-3 py-1 rounded-md">
          {{ row.not_paid }}
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
    </TwTable>
    <ViewOrder :row="selectedRowOrder"></ViewOrder>
  </div>
</template>

<script setup lang="ts">
const { t } = Trans;
import { computed, onBeforeMount, reactive, ref } from "vue";
import type { IFormPointByOrders, FilterOption, IQuery } from "@/types";
import HorizontalFilter from "@/components/filter/horizontalFilter.vue";
import Trans from "@/i18n/translation";
import { useProsmotrStore, pointByOrders } from "@/store/Points/Prosmotr";
import { useRoute, useRouter } from "vue-router";
import TwTable from "@/components/Table/TwTable.vue";
import { useOrdersStore } from "@/store/Orders";
import ViewOrder from "../Orders/viewOrder.vue";
import { getDateParts } from "@/utils/utils";

const headers = [
  { text: "index", value: "index" },
  { text: "points.trade_agent", value: "trade_agent" },
  { text: "create_at", value: "created_at" },
  { text: "status", value: "status" },
  { text: "summary_order", value: "sum" },
  { text: "paid", value: "paid" },
  { text: "not_paid", value: "not_paid" },
];

const filters = computed<FilterOption[]>(() => [
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
]);

interface IFilter {
  start?: string;
  end?: string;
  [key: string]: any;
}
const query = reactive<IFilter>({
  start: "",
  end: "",
});
const queryByOrders = reactive<IFormPointByOrders>({
  tradePointId: 0,
});
const route = useRoute();
const { FETCH_POINT_BY_ORDERS } = useProsmotrStore();
onBeforeMount(() => {
  if (route.params.id) {
    queryByOrders.tradePointId = Number(route.params.id);
    FETCH_POINT_BY_ORDERS(queryByOrders);
  }
});

const updateQuery = (key: keyof IFilter, value: any) => {
  query[key] = value;
  const updateDateParts = (dateKey: "start" | "end", targetObject: any) => {
    const dateValue = query[dateKey];
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
  updateDateParts("start", queryByOrders);
  updateDateParts("end", queryByOrders);
  FETCH_POINT_BY_ORDERS(queryByOrders);
};
const { FETCH_BY_ORDER } = useOrdersStore();
const selectedRowOrder = ref();

const rowByOrder = (row: any) => {
  FETCH_BY_ORDER(row.id);
  selectedRowOrder.value = row;
};
</script>
