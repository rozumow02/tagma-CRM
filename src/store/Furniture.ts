import Trans from "@/i18n/translation";
import { requestApi } from "@/api";
import type { Method } from "axios";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import {
  type IFurnitureByPoint,
  type IFurniture,
  type IFurnitureForm,
  type IQuery,
  type ISelectAll,
  type IFurnitureByPointForm,
} from "@/types";
import { toast } from "vue3-toastify";

export const useFurnitureStore = defineStore("furniture", () => {
  const query = reactive<IQuery>({
    pageCount: 0,
    pageNumber: 1,
    pageSize: 10,
  });

  const dialogs = reactive({
    isAdd: false,
    isBlock: false,
    isUpdate: false,
  });

  const formFurniture = reactive<IFurnitureForm>({
    name_ru: "",
    name_tm: "",
  });

  const formFurnitureByPoint = reactive<IFurnitureByPointForm>({
    trade_point_id: 0,
    furniture_id: null,
    count: 0,
  });
  const furnitures = ref<IFurniture[]>([]);
  const furnitureForPoint = ref<IFurnitureByPoint[]>([]);
  const allFurnitures = ref<ISelectAll[]>([]);

  const fetchFurniture = async () => {
    try {
      const { data } = await requestApi("furniture", "GET", query);
      if (data?.items && data.items.length) furnitures.value = data.items;
      query.pageCount = data.pageCount;
      query.total = data?.total;
    } catch (error) {
      console.error(error);
    }
  };
  const fetchFurnitureByPoint = async (trade_point_id: number) => {
    try {
      const { data } = await requestApi(`furniture/point`, "GET", {
        trade_point_id,
      });
      furnitureForPoint.value = data;
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = async (
    url: string,
    method: Method,
    params: object,
    form: object,
    refetch: () => void,
  ) => {
    try {
      await requestApi(url, method, params, form);
      dialogs.isAdd = dialogs.isBlock = dialogs.isUpdate = false;
      refetch();
      toast(Trans.t("messages.success"), {
        type: "success",
      });
    } catch (error) {
      console.error(error);
    }
  };
  const fetchAllFurnitures = async () => {
    try {
      const { data } = await requestApi("furniture/select");
      allFurnitures.value = data;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    fetchAllFurnitures,
    fetchFurnitureByPoint,
    allFurnitures,
    fetchFurniture,
    handleSubmit,
    furnitures,
    query,
    formFurniture,
    formFurnitureByPoint,
    furnitureForPoint,
    dialogs,
  };
});
