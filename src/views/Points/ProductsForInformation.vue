<template>
  <div>
    <HorizontalFilter
      @update-query="updateQuery"
      :filters="filters"
      :query="query"
    ></HorizontalFilter>
    <TwTable
      :headers="headers"
      :rows="pointByProducts"
      table-height-offset="150"
    >
      <template #index="{ index }">
        {{ index }}
      </template>
    </TwTable>
  </div>
</template>

<script setup lang="ts">
const { t } = Trans;
import { computed, onBeforeMount, reactive, ref } from "vue";
import type { IFormPointByOrders, FilterOption, IQuery } from "@/types";
import HorizontalFilter from "@/components/filter/horizontalFilter.vue";
import Trans from "@/i18n/translation";
import { useProsmotrStore, pointByProducts } from "@/store/Points/Prosmotr";
import { useRoute, useRouter } from "vue-router";
import TwTable from "@/components/Table/TwTable.vue";
import { getDateParts } from "@/utils/utils";

const headers = [
  { text: "index", value: "index" },
  { text: "name", value: "name" },
  { text: "product.product_type_id", value: "product_type" },
  { text: "taste", value: "taste" },
  { text: "product.volume", value: "volume" },
  { text: "count", value: "count" },
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
  start?: string | null;
  end?: string | null;
  [key: string]: any;
}
const query = reactive<IFilter>({
  start: null,
  end: null,
});
const queryByProducts = reactive<IFormPointByOrders>({
  tradePointId: 0,
});
const route = useRoute();
const { FETCH_POINT_BY_PRODUCTS } = useProsmotrStore();
onBeforeMount(() => {
  if (route.params.id) {
    queryByProducts.tradePointId = Number(route.params.id);
    FETCH_POINT_BY_PRODUCTS(queryByProducts);
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
  updateDateParts("start", queryByProducts);
  updateDateParts("end", queryByProducts);
  FETCH_POINT_BY_PRODUCTS(queryByProducts);
};
</script>
