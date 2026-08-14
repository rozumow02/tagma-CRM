import Trans from "@/i18n/translation";
import {
  deletePointByImageApi,
  pointsPutApi,
  postPointByImageApi,
} from "@/api/point";
import { pointByIdGeneralApi } from "@/api/Point/prosmotr";
import type {
  IFormPointByOrders,
  IOrders,
  IPointByIDGeneral,
  IPointByProducts,
} from "@/types";
import { ElLoading } from "element-plus";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { toast } from "vue3-toastify";
import {
  formPoints,
  isUpdateDialog,
  isUpdateDays,
  isUpdateImageDialog,
} from "../Point";
import { requestApi } from "@/api";

export const pointByOrders = ref<IOrders[]>([]);
export const pointByProducts = ref<IPointByProducts[]>([]);
export const byIdGenerals = ref<IPointByIDGeneral>();

export const queryPoints = reactive<IFormPointByOrders>({
  endDay: 0,
  endMonth: 0,
  endYear: 0,
  startDay: 0,
  startMonth: 0,
  startYear: 0,
  tradePointId: 0,
});

export const useProsmotrStore = defineStore("prosmotr", () => {
  const FETCH_GENERALS = async (id: number) => {
    await pointByIdGeneralApi(id).then((res) => {
      byIdGenerals.value = res.data;
    });
    requestApi(`extra/${id}`, "GET").then((res) => {
      const weekExtraDays: number[] = Array.isArray(res.data) ? res.data : [];
      const dayId: number | null = byIdGenerals.value?.day_id ?? null;

      byIdGenerals.value!.weekExtraDays =
        dayId !== null ? [...weekExtraDays, dayId] : weekExtraDays;
    });
  };
  const FETCH_POINT_BY_IMAGE_CREATE = async (data: {
    id: number;
    file: File;
  }) => {
    const loading = ElLoading.service({
      lock: true,
      text: "Loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    const formData = new FormData();
    formData.append("point_id", String(data.id));
    formData.append("image", data.file);
    postPointByImageApi(formData)
      .then(() => {
        toast(Trans.t("messages.success"), {
          type: "success",
        });
        isUpdateImageDialog.value = false;
        FETCH_GENERALS(data.id);
      })
      .finally(() => loading.close());
  };
  const FETCH_POINT_BY_IMAGE_DELETE = async (id: number, parentId: number) => {
    deletePointByImageApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isUpdateImageDialog.value = false;
      FETCH_GENERALS(parentId);
    });
  };
  const FETCH_POINTS_UPDATE = async (id: number) => {
    await pointsPutApi(formPoints, id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isUpdateDialog.value = false;
      FETCH_GENERALS(id);
    });
  };
  const FETCH_POINT_BY_ORDERS = async (query: IFormPointByOrders) => {
    try {
      const { data } = await requestApi("points/order", "GET", query);
      pointByOrders.value = data;
    } catch (error) {
      console.error(error);
    }
  };
  const FETCH_POINT_BY_PRODUCTS = async (query: IFormPointByOrders) => {
    try {
      const { data } = await requestApi("points/product", "GET", query);
      pointByProducts.value = data;
    } catch (error) {
      console.error(error);
    }
  };
  const FETCH_POINTS_DAYS_UPDATE = async (id: number, days: number[]) => {
    //  Esasy guni ayyryp beryar (day_id)
    const index = days.indexOf(byIdGenerals.value?.day_id || 0);
    if (index !== -1) {
      days.splice(index, 1);
    }
    //
    requestApi(`extra/${id}`, "PUT", {}, days).then((res) => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isUpdateDays.value = false;
      FETCH_GENERALS(id);
    });
  };
  return {
    FETCH_GENERALS,
    FETCH_POINT_BY_IMAGE_CREATE,
    FETCH_POINT_BY_IMAGE_DELETE,
    FETCH_POINTS_UPDATE,
    FETCH_POINT_BY_ORDERS,
    FETCH_POINT_BY_PRODUCTS,
    FETCH_POINTS_DAYS_UPDATE,
  };
});
