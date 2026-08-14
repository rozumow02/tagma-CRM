import { defineStore } from "pinia";
import { ElLoading, ElMessageBox } from "element-plus";
import { reactive, ref, toRaw, watch, type Ref } from "vue";
import { toast } from "vue3-toastify";
import type {
  IFormPointDebt,
  IFurniturePointCount,
  IPoints,
  IPointsForm,
  IQuery,
  ISelectAll,
} from "@/types";
import {
  pointsDeleteApi,
  pointsPostApi,
  pointsGetApi,
  pointsPutApi,
  pointsGetByIdApi,
  pointsLockApi,
  getAllSelectApi,
  getPointByImageApi,
  postPointByImageApi,
  deletePointByImageApi,
} from "@/api/point";
import { requestApi } from "@/api";
import { useDownloadFile } from "@/composables/useDownloadFile";
import Trans from "@/i18n/translation";
import { useI18n } from "vue-i18n";
import { pointsDebtCreateApi } from "@/api/Point/prosmotr";
import { useProsmotrStore } from "./Points/Prosmotr";
const { downloadFile } = useDownloadFile();

export const isBlockDialog = ref(false);
export const isUpdateDialog = ref(false);
export const isAddDialog = ref(false);
export const isUpdateImageDialog = ref(false);
export const isUpdateDays = ref(false);
export const isPointDebtDialog = ref(false);

export const formPoints = reactive<IPointsForm>({
  name_ru: "",
  name_tm: "",
  status: true,
  city_id: 0,
  location_ru: "",
  location_tm: "",
  orientir_ru: "",
  orientir_tm: "",
  trade_agent_id: 0,
  trade_channel_id: 0,
  images: null,
  district_id: 0,
  day_id: null,
  ekspeditor_id: null,
});

export const query = reactive<IQuery>({
  pageCount: 0,
  pageNumber: 1,
  pageSize: 300,
});

export const formPointDebt = reactive<IFormPointDebt>({
  id: 0,
  price1: 0,
  price2: 0,
  paymentTypeId: null,
});

export const pointForAgents = ref<ISelectAll[]>([]);
export const pointForChannels = ref<ISelectAll[]>([]);
export const pointForCities = ref<ISelectAll[]>([]);
export const allManagement = ref<ISelectAll[]>([]);
export const allSize = ref<ISelectAll[]>([]);
export const allStructure = ref<ISelectAll[]>([]);
export const allType = ref<ISelectAll[]>([]);
export const routeForEkspeditors = ref<ISelectAll[]>([]);
export const routeForDays = ref<ISelectAll[]>([]);
export const allEkspeditors = ref<ISelectAll[]>([]);
export const allPointFurniture = ref<IFurniturePointCount[]>([]);
export const allPaymentTypes = ref<ISelectAll[]>([]);

watch(
  () => formPoints.trade_agent_id,
  async (newValue) => {
    if (newValue)
      await requestApi(`routes/ekspeditors/${newValue}`, "GET").then((res) => {
        routeForEkspeditors.value = res.data;
      });
  },
);

export const pointByImages = ref<{ id: number; path: string }[]>([]);

export const points = ref<IPoints[]>([]);
export const isLoading = ref(false);

const createDynamicFormData = (data: typeof formPoints) => {
  const formData = new FormData();

  // reactive obyektni raw (asl holatdagi) obyektga aylantirish
  const rawData = toRaw(data);

  // Obyekt kalitlari bo'yicha iteratsiya qilish
  for (const key in rawData) {
    if (Object.prototype.hasOwnProperty.call(rawData, key)) {
      const value = rawData[key as keyof typeof rawData];

      // Fayl yoki fayllar massivi bo'lsa, alohida ishlov beramiz
      if (key === "images" && Array.isArray(value)) {
        value.forEach((file, index) => {
          if (file instanceof File || file instanceof Blob) {
            // Faylni dinamik nom bilan qo'shish: image1, image2, ...
            formData.append(`image${index + 1}`, file);
          }
        });
      }
      // Boolean qiymatlarni stringga aylantirish
      else if (typeof value === "boolean") {
        formData.append(key, value.toString());
      }
      // Raqamlarni stringga aylantirish
      else if (typeof value === "number") {
        formData.append(key, value.toString());
      }
      // Qolgan maydonlarni oddiy string sifatida qo'shish
      else if (value !== null && value !== undefined) {
        formData.append(key, value as string);
      }
    }
  }

  return formData;
};
export const usePointsStore = defineStore("points", () => {
  const { t } = useI18n();
  const pointProsmotrStore = useProsmotrStore();
  const FETCH_POINTS = async () => {
    isLoading.value = true;

    try {
      const { data } = await pointsGetApi(query);
      if (data.items && data.items.length) {
        points.value = data.items.map((item: IPoints) => {
          return {
            ...item,
            visible: false,
          };
        });
      } else {
        points.value = [];
      }
      if (data.furniture_list && data.furniture_list.length) {
        allPointFurniture.value = data.furniture_list;
      }
      query.pageCount = data.pageCount;
      query.total = data.total || 0;
    } catch (error) {
      console.log(error);
      toast(t("messages.error"), {
        type: "error",
      });
    } finally {
      isLoading.value = false;
    }
  };

  const FETCH_POINTS_CREATE = async () => {
    const loading = ElLoading.service({
      lock: true,
      text: t("loading.creatings"),
      background: "rgba(0, 0, 0, 0.7)",
    });
    const formdata = createDynamicFormData(formPoints);
    try {
      await pointsPostApi(formdata);
      toast(t("messages.created"), {
        type: "success",
      });
      isAddDialog.value = false;
      await FETCH_POINTS();
    } catch (error) {
      toast(t("messages.error"), {
        type: "error",
      });
    } finally {
      loading.close();
    }
  };

  const FETCH_POINTS_DELETE = async (id: number) => {
    const loading = ElLoading.service({
      lock: true,
      text: t("loading.deleting"),
      background: "rgba(0, 0, 0, 0.7)",
    });
    try {
      await pointsDeleteApi(id);
      toast(t("messages.deleted"), {
        type: "success",
      });
      isBlockDialog.value = false;
      await FETCH_POINTS();
    } catch (error) {
      toast(t("messages.error"), {
        type: "error",
      });
    } finally {
      loading.close();
    }
  };

  const FETCH_POINTS_LOCK = async (id: number) => {
    const loading = ElLoading.service({
      lock: true,
      text: t("loadings.updating"),
      background: "rgba(0, 0, 0, 0.7)",
    });
    try {
      await pointsLockApi(id);
      toast(t("messages.updated"), {
        type: "success",
      });
      isBlockDialog.value = false;
      await FETCH_POINTS();
    } catch (error) {
      toast(t("messages.error"), {
        type: "error",
      });
    } finally {
      loading.close();
    }
  };

  const FETCH_POINTS_BY_ID = async (id: number) => {
    const loading = ElLoading.service({
      lock: true,
      text: t("loading"),
      background: "rgba(0, 0, 0, 0.7)",
    });
    await pointsGetByIdApi(id)
      .then((res) => {
        formPoints.name_ru = res.data.name_ru;
        formPoints.name_tm = res.data.name_tm;
        formPoints.status = res.data.status;
        formPoints.city_id = res.data.city_id;
        formPoints.location_ru = res.data.location_ru;
        formPoints.location_tm = res.data.location_tm;
        formPoints.orientir_ru = res.data.orientir_ru;
        formPoints.orientir_tm = res.data.orientir_tm;
        formPoints.trade_agent_id = res.data.trade_agent_id;
        formPoints.trade_channel_id = res.data.trade_channel_id;
        formPoints.district_id = res.data.district_id;
        formPoints.ekspeditor_id = res.data.ekspeditor_id;
        formPoints.day_id = res.data.day_id;
        isUpdateDialog.value = true;
      })
      .finally(() => loading.close());
  };

  const FETCH_ALL_SELECT = async () => {
    const [
      agents,
      channels,
      cities,
      management,
      size,
      structure,
      type,
      day,
      ekspeditors,
      paymentTypes,
    ] = await Promise.all([
      getAllSelectApi("agents"),
      getAllSelectApi("channels"),
      getAllSelectApi("cities"),
      requestApi("channels/management"),
      requestApi("channels/size"),
      requestApi("channels/structure"),
      requestApi("channels/type"),
      requestApi("routes/days"),
      requestApi("agents/ekspeditors"),
      requestApi("payments/types"),
    ]);
    pointForAgents.value = agents.data;
    pointForChannels.value = channels.data;
    pointForCities.value = cities.data;
    allManagement.value = management.data;
    allSize.value = size.data;
    allStructure.value = structure.data;
    allType.value = type.data;
    routeForDays.value = day.data;
    allEkspeditors.value = ekspeditors.data;
    allPaymentTypes.value = paymentTypes.data;
  };
  const FETCH_ALL_SELECT_TRANSFER = async () => {
    const [agents, cities, type, day, ekspeditors] = await Promise.all([
      getAllSelectApi("agents"),
      getAllSelectApi("cities"),
      requestApi("channels/type"),
      requestApi("routes/days"),
      requestApi("agents/ekspeditors"),
    ]);

    pointForAgents.value = agents.data;
    pointForCities.value = cities.data;
    allType.value = type.data;
    routeForDays.value = day.data;
    routeForEkspeditors.value = ekspeditors.data;
  };

  const FETCH_POINT_BY_IMAGE = async (id: number) => {
    const loading = ElLoading.service({
      lock: true,
      text: t("loading"),
      background: "rgba(0, 0, 0, 0.7)",
    });
    await getPointByImageApi(id)
      .then((res) => {
        pointByImages.value = res.data ? res.data : [];
        isUpdateImageDialog.value = true;
      })
      .finally(() => loading.close());
  };
  const FETCH_POINTS_EXCEL = async () => {
    const loading = ElLoading.service({
      lock: true,
      text: t("loading.exporting"),
      background: "rgba(0, 0, 0, 0.7)",
    });
    try {
      const res = await requestApi("points/excel", "GET", query, {}, "blob");
      let date = new Date().toLocaleDateString();
      if (res.data) {
        downloadFile(res.data, `${Trans.t("points.title")}-${date}.xlsx`);
        toast(t("messages.exported"), {
          type: "success",
        });
      }
    } catch (error) {
      toast(t("messages.error"), {
        type: "error",
      });
    } finally {
      loading.close();
    }
  };
  const FETCH_POINTS_DEBT_CREATE = async () => {
    ElMessageBox.confirm("", {
      confirmButtonText: Trans.t("confirm"),
      cancelButtonText: Trans.t("discard"),
      title: Trans.t("dialog_ship_accept"),
      confirmButtonClass: "bg-red",
      type: "info",
      center: true,
    })
      .then(async () => {
        const loading = ElLoading.service({
          lock: true,
          text: t("loading.saving"),
          background: "rgba(0, 0, 0, 0.7)",
        });
        await pointsDebtCreateApi(formPointDebt)
          .then(() => {
            formPointDebt.price1 = 0;
            formPointDebt.price2 = 0;
            isPointDebtDialog.value = false;
            pointProsmotrStore.FETCH_GENERALS(formPointDebt.id);
            toast(t("messages.success"), {
              type: "success",
            });
          })
          .finally(() => loading.close());
      })
      .catch(() => {
        // catch error
      });
  };

  return {
    FETCH_POINTS,
    FETCH_POINTS_DELETE,
    FETCH_POINTS_LOCK,
    FETCH_POINTS_CREATE,
    FETCH_POINTS_BY_ID,
    FETCH_ALL_SELECT,
    FETCH_POINT_BY_IMAGE,
    FETCH_POINTS_EXCEL,
    FETCH_ALL_SELECT_TRANSFER,
    FETCH_POINTS_DEBT_CREATE,
    isLoading,
  };
});
