<script setup lang="ts">
import Trans from "@/i18n/translation";
import { useFilterStore } from "@/store/Filters";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, watch } from "vue";
import { useRoute } from "vue-router";
import type { FilterOption, IQueryFilterMain } from "@/types";
import { removeOptionalFields, resetObject } from "@/utils/utils";
const storeFilters = useFilterStore();
const { filters, queryFiltersMain, allCities, allDistricts, allPoints } =
  storeToRefs(storeFilters);

const slugMap = {
  soldOut: "rasp",
  display: "wyst",
  distribution: "dist",
} as const;

const selectedSlug = computed<keyof typeof slugMap>(() => {
  const slug = route.params.slug as string;
  return slug && slug in slugMap ? (slug as keyof typeof slugMap) : "soldOut"; // Default to "sold-out" if invalid
});
const route = useRoute();

watch(
  selectedSlug,
  (newValue, oldValue) => {
    if (oldValue) {
      resetObject(queryFiltersMain.value);
      removeOptionalFields(queryFiltersMain.value);
    }

    storeFilters.fetchCities();
    if (selectedSlug.value)
      storeFilters.fetchFilters(slugMap[selectedSlug.value]);
  },
  { immediate: true },
);

onBeforeMount(() => {});

const filtersInput = computed<FilterOption[]>(() => [
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
]);
const updateQuery = (key: keyof IQueryFilterMain, value: any) => {
  // queryFiltersMain[key] = value as {key: string}: any;
  (queryFiltersMain.value as { [key: string]: any })[key] = value;
  storeFilters.fetchFilters(slugMap[selectedSlug.value]);
};

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
    text: "status",
    value: "status",
  },
];
</script>

<template>
  <div class="border rounded-lg" :key="selectedSlug">
    <Header :title="Trans.t(`menuItems.${selectedSlug}`)">
      <ElButton
        @click="
          storeFilters.FETCH_FILTER_EXCEL(
            slugMap[selectedSlug],
            `menuItems.${selectedSlug}`,
          )
        "
        type="primary"
        class="mx-4"
        :disabled="!filters.length"
        >{{ Trans.t("export") }}</ElButton
      >
    </Header>
    <HorizontalFilter
      :query="queryFiltersMain"
      :filters="filtersInput"
      @update-query="updateQuery"
    />
    <TwTable :headers="headers" :rows="filters" :table-height-offset="80">
      <template #index="{ index }">
        {{ index }}
      </template>
      <template #status="{ row }">
        {{ row.status ? Trans.t("yes") : Trans.t("no") }}
      </template>
    </TwTable>
  </div>
</template>
