import Trans from "@/i18n/translation";
import { requestApi } from "@/api";

import type { Method } from "axios";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import type {
  IAllProduct,
  IByDilerOrders,
  IDiler,
  IDilerForm,
  IDilerInfoProductsQuery,
  IDilerOrderQuery,
  IDilerOrders,
  IFilteredProducts,
  IPointByProducts,
  IQuery,
  ISelectedProducts,
} from "@/types";
import { toast } from "vue3-toastify";

export const useDilerOrdersStore = defineStore("dOrders", () => {
  const byDilerOrders = ref<IByDilerOrders[]>([]);
  const filteredProducts = ref<IFilteredProducts[]>([]);
  const query = reactive<IDilerOrderQuery>({
    pageCount: 0,
    pageNumber: 1,
    pageSize: 10,
  });
  const dialogs = reactive({
    isAdd: false,
    isBlock: false,
    isUpdate: false,
    isdView: false,
  });

  const dilerOrders = ref<IDilerOrders[]>([]);
  const dilerInfoProducts = ref<IPointByProducts[]>([]);
  const totalSumOrders = ref<number>(0);

  const fetchData = async (url: string) => {
    try {
      const { data } = await requestApi(url, "GET", query);
      dilerOrders.value = data.items;
      query.pageCount = data.pageCount;
      query.total = data?.total || 0;
      if (data.items && data.items.length)
        totalSumOrders.value = data.items
          .map((item: IDilerOrders) => item.sum)
          .reduce((a: number, b: number) => a + b, 0);
    } catch (error) {
      console.error("Operation failed.");
    }
  };
  const handleSubmit = async (
    url: string,
    method: Method,
    params?: object,
    form?: object,
  ) => {
    try {
      await requestApi(url, method, params, form);
      dialogs.isAdd =
        dialogs.isBlock =
        dialogs.isUpdate =
        dialogs.isdView =
          false;
      fetchData("dorders");
      toast(Trans.t("messages.success"), {
        type: "success",
      });
    } catch (error) {
      console.error("Operation failed.");
    }
  };
  const fetchAllProducts = async () => {
    try {
      const { data } = await requestApi("orders/products");
      if (data && data.length)
        filteredProducts.value = data.map((item: IAllProduct) => {
          return {
            ...item,
            count: 0,
            id: item.Id,
          };
        });
    } catch (error) {
      console.error("Operation failed.");
    }
  };
  const fetchByDilerOrder = async (id: number) => {
    try {
      const { data } = await requestApi("dorders/list", "GET", { id });
      byDilerOrders.value = data;
      if (data) {
        byDilerOrders.value = data.map((item: IByDilerOrders) => {
          if (item.start === "") {
            (item.start = "-"), (item.end = "-");
          }
          return {
            ...item,
          };
        });
      }
    } catch (error) {
      console.error("Operation failed.");
    }
  };

  const fetchByDilerProducts = async (params?: IDilerInfoProductsQuery) => {
    try {
      const { data } = await requestApi("dorders/product", "GET", params);
      dilerInfoProducts.value = data;
    } catch (error) {
      console.error("Operation failed.");
    }
  };

  return {
    fetchData,
    handleSubmit,
    dilerOrders,
    query,
    filteredProducts,
    dialogs,
    byDilerOrders,
    dilerInfoProducts,
    totalSumOrders,
    fetchByDilerProducts,
    fetchByDilerOrder,
    fetchAllProducts,
  };
});
