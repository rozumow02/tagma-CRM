<script setup lang="ts">
import HorizontalFilter from "@/components/filter/horizontalFilter.vue";
import Header from "@/components/main/Header.vue";
import TwTable from "@/components/Table/TwTable.vue";
import Trans from "@/i18n/translation";
import { useFilterStore } from "@/store/Filters";
import type { FilterOption, IQuery, IQueryFilterMain } from "@/types";
import { removeOptionalFields, resetObject } from "@/utils/utils";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";

const storeFilters = useFilterStore();
const {
  filtersMain,
  queryFiltersMain,
  allCities,
  allDistricts,
  allPoints,
  allAgents,
  allBrands,
  allProductTypes,
  allTaste,
} = storeToRefs(storeFilters);

onBeforeMount(() => {
  resetObject(queryFiltersMain.value);
  removeOptionalFields(queryFiltersMain.value);
  storeFilters.FETCH_ALL_SELECT();
  storeFilters.fetchFilterMain();
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
    disabled: !queryFiltersMain.value.cityId,
    options: allDistricts.value,
  },

  {
    model: "tradePointId",
    type: "select",
    placeholder: Trans.t("point"),
    disabled: !queryFiltersMain.value.districtId,
    options: allPoints.value,
  },
  {
    model: "agentId",
    type: "select",
    placeholder: Trans.t("points.trade_agent"),
    options: allAgents.value,
  },

  {
    model: "volume",
    type: "select",
    placeholder: Trans.t("product.product_type_id"),
    options: allProductTypes.value,
  },
  {
    model: "brand",
    type: "select",
    placeholder: Trans.t("product.name_tm"),
    options: allBrands.value,
  },
  {
    model: "taste",
    type: "select",
    placeholder: Trans.t("taste"),
    options: allTaste.value,
    disabled: !(queryFiltersMain.value.brand && queryFiltersMain.value.volume),
  },
]);

const headers = [
  { text: "index", value: "index" },
  { text: "product.name_tm", value: "name" },
  { text: "product.product_type_id", value: "product_type" },
  {
    text: "product.volume",
    value: "volume",
  },
  {
    text: "taste",
    value: "taste",
  },
  {
    text: "menuItems.distribution",
    value: "distribution",
  },
  {
    text: "availability",
    value: "have",
  },
  {
    text: "menuItems.display",
    value: "wystawlaymost",
  },
  {
    text: "oos",
    value: "rasprodano",
  },
];

const updateQuery = (key: keyof IQueryFilterMain, value: any) => {
  // queryFiltersMain[key] = value;
  storeFilters.fetchFilterMain();
};
</script>

<template>
  <div class="border rounded-lg">
    <Header :title="Trans.t('menuItems.marketing')">
      <ElButton
        @click="storeFilters.FETCH_FILTER_EXCEL('main', 'menuItems.marketing')"
        type="primary"
        class="mx-4"
        :disabled="!filtersMain.length"
        >{{ Trans.t("export") }}</ElButton
      >
    </Header>
    <HorizontalFilter
      :query="queryFiltersMain"
      :filters="filters"
      @update-query="updateQuery"
    />
    <TwTable :headers="headers" :rows="filtersMain" :table-height-offset="160">
      <template #index="{ index }">
        {{ index }}
      </template>
    </TwTable>
  </div>
  <div class="mt-4 float-end">
    <span class="text-gray3 p-3" v-if="filtersMain.length"
      >{{ Trans.t("count_point") }}:
      <b>{{ filtersMain[0].trade_point_count }}</b></span
    >
  </div>
</template>
