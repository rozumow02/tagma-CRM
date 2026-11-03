import Trans from "@/i18n/translation";
import { defineStore } from "pinia";
import { ElLoading } from "element-plus";
import { reactive, ref, toRef, watch, type Ref } from "vue";
import { toast } from "vue3-toastify";
import type {
  IRoutes,
  IRoutePoints,
  IRoutesForm,
  IQuery,
  ISelectAll,
} from "@/types";
import {
  routesDeleteApi,
  routesPostApi,
  routesGetApi,
  routesPutApi,
  routesGetByIdApi,
  routesLockApi,
  getAllSelectApi,
} from "@/api/route";
import { requestApi } from "@/api";

export const isBlockDialog = ref(false);
export const isUpdateDialog = ref(false);
export const isAddDialog = ref(false);

export const formRoutes = reactive<IRoutesForm>({
  status: true,
  day_id: 0,
  trade_agent_id: 0,
  trade_point_id: 0,
  ekspeditor_id: 0,
});

export const selectedIdRoute = ref();
export const query = reactive<IQuery>({
  pageCount: 0,
  pageNumber: 1,
  pageSize: 10,
  agentId: null,
  cityId: null,
  dayId: null,
});
export const selectedItemRow = ref<string | null>();

export const routeForDays = ref<ISelectAll[]>([]);
export const routeForPoints = ref<IRoutePoints[]>([]);
export const routeForAgents = ref<ISelectAll[]>([]);
export const routeForCities = ref<ISelectAll[]>([]);
export const routeForEkspeditors = ref<ISelectAll[]>([]);

export const routes = ref<IRoutes[]>([]);

watch(
  () => formRoutes.trade_agent_id,
  async (newValue) => {
    if (newValue)
      await requestApi(`routes/ekspeditors/${newValue}`, "GET").then((res) => {
        routeForEkspeditors.value = res.data;
      });
  },
);
export const selected = reactive({
  cityId: undefined,
  districtId: undefined,
});
export const allDistricts = ref<ISelectAll[]>([]);
watch(
  () => toRef(selected, "cityId"),
  async (newValue) => {
    if (newValue.value)
      try {
        const { data } = await requestApi(
          `points/districts?cityId=${newValue.value}`,
        );
        allDistricts.value = data;
      } catch (error) {
        console.error("Operation failed.");
      }
  },
);
export const allPoints = ref<IRoutePoints[]>([]);
watch(
  () => selected.districtId,
  async (newValue) => {
    if (newValue)
      try {
        const { data } = await requestApi(
          `routes/points?districtId=${newValue}`,
        );
        allPoints.value = data;
      } catch (error) {
        console.error("Operation failed.");
      }
  },
);

export const useRoutesStore = defineStore("routes", () => {
  const FETCH_ROUTES = async () => {
    try {
      const { data } = await routesGetApi(query);
      routes.value = data.items;
      query.pageCount = data.pageCount;
    } catch (error) {
      console.error("Operation failed.");
    }
  };

  const FETCH_ROUTES_CREATE = async () => {
    await routesPostApi(formRoutes).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isAddDialog.value = false;
      selectedItemRow.value = "";
      FETCH_ROUTES();
    });
  };

  const FETCH_ROUTES_UPDATE = async (id: number) => {
    await routesPutApi(formRoutes, id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isUpdateDialog.value = false;
      selectedItemRow.value = "";
      FETCH_ROUTES();
    });
  };

  const FETCH_ROUTES_DELETE = async (id: number) => {
    routesDeleteApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_ROUTES();
    });
  };

  const FETCH_ROUTES_LOCK = async (id: number) => {
    routesLockApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_ROUTES();
    });
  };

  const FETCH_ROUTES_BY_ID = async (id: number) => {
    // const loading = ElLoading.service({
    //   lock: true,
    //   text: "Loading",
    //   background: "rgba(0, 0, 0, 0.7)",
    // });
    selectedIdRoute.value = id;
    await routesGetByIdApi(id).then((res) => {
      selected.cityId = res.data.city_id;
      selected.districtId = res.data.district_id;
      formRoutes.day_id = res.data.day_id;
      formRoutes.status = res.data.status;
      formRoutes.trade_agent_id = res.data.trade_agent_id;
      formRoutes.trade_point_id = res.data.trade_point_id;
      formRoutes.ekspeditor_id = res.data.ekspeditor_id;
      selectedItemRow.value = `${res.data.city}, ${res.data.location},${res.data.name}`;
      isUpdateDialog.value = true;
    });
    // .finally(() => loading.close());
  };

  const FETCH_ALL_SELECT = async () => {
    const [days, agents, cities] = await Promise.all([
      getAllSelectApi("routes/days"),
      // getAllSelectApi("routes/points"),
      getAllSelectApi("points/agents"),
      getAllSelectApi("points/cities"),
    ]);
    routeForDays.value = days.data;
    // routeForPoints.value = points.data;
    routeForAgents.value = agents.data;
    routeForCities.value = cities.data;
  };

  return {
    FETCH_ROUTES,
    FETCH_ROUTES_UPDATE,
    FETCH_ROUTES_DELETE,
    FETCH_ROUTES_LOCK,
    FETCH_ROUTES_CREATE,
    FETCH_ROUTES_BY_ID,
    FETCH_ALL_SELECT,
  };
});
