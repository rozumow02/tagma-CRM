<template>
  <div class="border rounded-lg">
    <Header :title="t('menuItems.products')"></Header>
    <HorizontalFilter
      @update-query="updateQuery"
      :filters="filters"
      :query="query"
    >
      <el-checkbox
        v-model="query.status"
        :label="Trans.t('locked')"
        size="large"
        @change="updateQuery('status', query.status)"
      />
    </HorizontalFilter>
    <TwTable
      :headers="headers"
      :rows="dilerInfoProducts"
      table-height-offset="100"
    >
      <template #index="{ index }">
        {{ index }}
      </template>
      <template #volume="{ row }">
        {{ row.volume }} {{ Trans.t("litr") }}
      </template>
      <template #count="{ row }">
        {{ formatNumberCount(row.count) }}
      </template>
    </TwTable>
  </div>
  <div class="m-4 float-end">
    <span class="text-gray3"
      >{{ Trans.t("total_count") }}:
      <b>{{ formatNumberCount(totalCount) }}</b></span
    >
  </div>
</template>

<script setup lang="ts">
const { t } = Trans;
import { computed, onBeforeMount, reactive, ref } from "vue";
import type {
  IFormPointByOrders,
  FilterOption,
  IQuery,
  IDilerInfoProductsQuery,
} from "@/types";
import HorizontalFilter from "@/components/filter/horizontalFilter.vue";
import Trans from "@/i18n/translation";
import TwTable from "@/components/Table/TwTable.vue";
import { formatNumberCount, getDateParts } from "@/utils/utils";
import { useDilerStore } from "@/store/Dilers/Dilers";
import { storeToRefs } from "pinia";
import { useDilerOrdersStore } from "@/store/Dilers/Orders";
import Header from "@/components/main/Header.vue";
const storeDiler = useDilerStore();
const storeDilerOrders = useDilerOrdersStore();
const { dilerInfoProducts } = storeToRefs(storeDilerOrders);
const { allDilers } = storeToRefs(storeDiler);

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
    model: "dealerId",
    type: "select",
    options: allDilers.value,
    placeholder: Trans.t("diler"),
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
]);

interface IFilter {
  start?: string | null;
  end?: string | null;
  dealerId?: number | null;
  status?: boolean;
  [key: string]: any;
}
const query = reactive<IFilter>({
  start: null,
  end: null,
  dealerId: null,
  status: false,
});
const queryByProducts = reactive<IDilerInfoProductsQuery>({
  dealerId: 0,
});
onBeforeMount(() => {
  storeDilerOrders.fetchByDilerProducts();
  storeDiler.fetchAllDilers();
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

  if (query?.dealerId) queryByProducts.dealerId = query.dealerId;
  else delete queryByProducts.dealerId;

  if (query?.status) queryByProducts.status = query.status;
  else delete queryByProducts.status;

  storeDilerOrders.fetchByDilerProducts(queryByProducts);
};

const totalCount = computed(() => {
  if (dilerInfoProducts.value.length)
    return dilerInfoProducts.value.reduce(
      (sum, item) => sum + Number(item.count),
      0,
    );
});
</script>
