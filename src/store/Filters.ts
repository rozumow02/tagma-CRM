import { requestApi } from "@/api";
import { useDownloadFile } from "@/composables/useDownloadFile";
import Trans from "@/i18n/translation";
import type {
  IFilterMain,
  IFilters,
  IQueryFilterMain,
  ISelectAll,
  IRoutePoints,
} from "@/types";
import { defineStore } from "pinia";
import { reactive, ref, toRef, watch } from "vue";
const { downloadFile } = useDownloadFile();

export const useFilterStore = defineStore("filter", () => {
  const allAgents = ref<ISelectAll[]>([]);
  const allBrands = ref<ISelectAll[]>([]);
  const allProductTypes = ref<ISelectAll[]>([]);
  const allDistricts = ref<ISelectAll[]>([]);
  const allPoints = ref<IRoutePoints[]>([]);
  const allCities = ref<ISelectAll[]>([]);
  const allTaste = ref<string[]>([]);
  const filtersMain = ref<IFilterMain[]>([]);
  const filters = ref<IFilters[]>([]);
  const queryFiltersMain = reactive<IQueryFilterMain>({});
  const fetchFilterMain = async () => {
    try {
      const { data } = await requestApi(
        "marketing/main",
        "GET",
        queryFiltersMain,
      );
      if (data && typeof data == "object") {
        filtersMain.value = data.map((item: IFilterMain) => {
          return {
            ...item,
            distribution: item.distribution + "%",
            rasprodano: item.rasprodano + "%",
            wystawlaymost: item.wystawlaymost + "%",
            have: item.have + "%",
          };
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchFilters = async (path: string) => {
    try {
      const { data } = await requestApi(
        `marketing/${path}`,
        "GET",
        queryFiltersMain,
      );
      filters.value = data;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCities = async () => {
    try {
      const { data } = await requestApi(`points/cities`);
      allCities.value = data;
    } catch (error) {
      console.error("Cities fetching error:", error);
    }
  };
  // Tumanni yangilaganda tumanlar ma'lumotlarini olish
  const fetchDistricts = async (cityId: number) => {
    try {
      const { data } = await requestApi(`points/districts?cityId=${cityId}`);
      allDistricts.value = data;
    } catch (error) {
      console.error("District fetching error:", error);
    }
  };

  // Manzillarni yangilash
  const fetchPoints = async (districtId: number) => {
    try {
      const { data } = await requestApi(
        `routes/points?districtId=${districtId}`,
      );
      allPoints.value = data;
    } catch (error) {
      console.error("Points fetching error:", error);
    }
  };

  const FETCH_ALL_SELECT = async () => {
    const [agent, city, type, brand] = await Promise.all([
      requestApi("points/agents"),
      requestApi("points/cities"),
      requestApi("products/types/all"),
      requestApi("products/brands"),
    ]);
    allCities.value = city.data;
    allAgents.value = agent.data;
    allProductTypes.value = type.data;
    allBrands.value = brand.data;
  };
  const FETCH_FILTER_EXCEL = async (path: string, title: string) => {
    requestApi(
      `marketing/${path}/excel`,
      "GET",
      queryFiltersMain,
      {},
      "blob",
    ).then((res) => {
      let date = new Date().toLocaleDateString();
      if (res.data)
        downloadFile(res.data, `${Trans.t(`${title}`)}-${date}.xlsx`);
    });
  };
  const fetchTaste = async (params: object) => {
    try {
      const { data } = await requestApi("orders/models", "GET", params);
      allTaste.value = data;
    } catch (error) {
      console.error(error);
    }
  };
  // Watch funksiyalari
  watch(
    () => toRef(queryFiltersMain, "cityId"),
    (newValue) => {
      if (newValue.value) {
        fetchDistricts(newValue.value);
      }
    },
  );

  watch(
    () => queryFiltersMain.districtId,
    (newValue) => {
      if (newValue) {
        fetchPoints(newValue);
      }
    },
  );

  watch(
    () => [queryFiltersMain.brand, queryFiltersMain.volume],
    (newValue) => {
      if (newValue[0] && newValue[1]) {
        fetchTaste({ brandId: newValue[0], productTypeId: newValue[1] });
      }
    },
  );

  return {
    fetchFilterMain,
    fetchFilters,
    fetchCities,
    fetchDistricts,
    fetchPoints,
    FETCH_ALL_SELECT,
    FETCH_FILTER_EXCEL,
    fetchTaste,
    queryFiltersMain,
    filters,
    filtersMain,
    allCities,
    allDistricts,
    allPoints,
    allAgents,
    allBrands,
    allProductTypes,
    allTaste,
  };
});
