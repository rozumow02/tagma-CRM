<script setup lang="ts">
import HorizontalFilter from "@/components/filter/horizontalFilter.vue";
import Header from "@/components/main/Header.vue";
import TwTable from "@/components/Table/TwTable.vue";
import Trans from "@/i18n/translation";
import { useSalesStore } from "@/store/Sales";
import type { ISalesQuery } from "@/types";
import { formatNumberCount, getDateParts } from "@/utils/utils";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, watch } from "vue";
import type { FilterOption } from "@/types";
import { useFilterStore } from "@/store/Filters";

const storeFilters = useFilterStore();
const {
  allCities,
  allDistricts,
  allPoints,
  allAgents,
  allBrands,
  allProductTypes,
  allTaste,
} = storeToRefs(storeFilters);

const storeSales = useSalesStore();
const { query, sales, loadingSales } = storeToRefs(storeSales);

onBeforeMount(() => {
  storeFilters.fetchCities();
  storeFilters.FETCH_ALL_SELECT();
  storeSales.fetchData("products/sales");
});

const updateQuery = () => {
  // query.value[key] = value;

  const updateDateParts = (
    dateKey: "start" | "end",
    targetObject: ISalesQuery,
  ) => {
    const dateValue = (query.value as any)[dateKey];
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
  updateDateParts("start", query.value);
  updateDateParts("end", query.value);
  storeSales.fetchData("products/sales");
};

const headers = [
  { text: "index", value: "index" },
  { text: "name", value: "name" },
  { text: "product.product_type_id", value: "product_type" },
  { text: "product.volume", value: "volume" },
  { text: "taste", value: "taste" },
  { text: "sku_count", value: "count" },
];

const filteredAllPoints = computed(() => {
  if (query.value.districtId)
    return allPoints.value.map((item) => {
      return {
        ...item,
        name: `${item.code} - ${item.name}`,
      };
    });
});

const filters = computed<FilterOption[]>(() => [
  {
    model: "cityId",
    type: "select",
    placeholder: Trans.t("city"),
    options: allCities.value,
  },
  {
    model: "districtId",
    type: "select",
    placeholder: Trans.t("district"),
    disabled: !query.value.cityId,
    options: allDistricts.value,
  },

  {
    model: "tradePointId",
    type: "select",
    placeholder: Trans.t("point"),
    disabled: !query.value.districtId,
    options: filteredAllPoints.value,
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
    model: "agentId",
    type: "select",
    placeholder: Trans.t("points.trade_agent"),
    options: allAgents.value,
  },

  {
    model: "productTypeId",
    type: "select",
    placeholder: Trans.t("product.product_type_id"),
    options: allProductTypes.value,
  },
  {
    model: "brandId",
    type: "select",
    placeholder: Trans.t("product.name_tm"),
    options: allBrands.value,
  },
  {
    model: "taste",
    type: "select",
    placeholder: Trans.t("taste"),
    options: allTaste.value,
    // disabled: !(query.value.brandId && query.value.productTypeId),
  },
]);

// Watch funksiyalari
watch(
  () => query.value.cityId,
  (newValue) => {
    if (newValue) {
      storeFilters.fetchDistricts(newValue);
    }
  },
);

watch(
  () => query.value.districtId,
  (newValue) => {
    if (newValue) {
      storeFilters.fetchPoints(newValue);
    }
  },
);

watch(
  () => [query.value.brandId, query.value.productTypeId],
  (newValue) => {
    if (newValue[0] && newValue[1]) {
      storeFilters.fetchTaste({
        brandId: newValue[0],
        productTypeId: newValue[1],
      });
    }
  },
);
const totalCount = computed(() => {
  if (sales.value.length)
    return sales.value.reduce((sum, item) => sum + Number(item.count), 0);
});
</script>

<template>
  <div class="border rounded-lg">
    <Header :title="Trans.t('menuItems.sales')">
      <ElButton
        @click="storeSales.FETCH_SALES_EXCEL('menuItems.sales')"
        type="primary"
        class="mx-4"
        :disabled="!sales.length"
        >{{ Trans.t("export") }}</ElButton
      >
    </Header>
    <HorizontalFilter
      :filters="filters"
      :query="query"
      @update-query="updateQuery"
    />
    <TwTable
      :headers="headers"
      :rows="sales"
      table-height-offset="120"
      v-loading="loadingSales"
    >
      <template #index="{ index }">
        {{ index }}
      </template>
      <template #count="{ row }">
        {{ formatNumberCount(row.count) }}
      </template>
      <template #volume="{ row }">
        {{ row.volume }} {{ Trans.t("litr") }}
      </template>
    </TwTable>
  </div>
  <div class="m-4 float-end">
    <span class="text-gray3"
      >{{ Trans.t("total_count") }}: <b>{{ totalCount }}</b></span
    >
  </div>
</template>
