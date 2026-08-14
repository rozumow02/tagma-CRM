import { requestApi } from "@/api";
import type { IProduct, IProductForm, IQuery } from "@/types";
import type { Method } from "axios";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useDilerProductsStore = defineStore("dilerProducts", () => {
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

  const formDilerProducts = reactive<IProductForm>({
    brand_id: 0,
    price1: 0,
    price2: 0,
    product_type_id: 0,
    status: false,
    taste_ru: "",
    taste_tm: "",
    d_price1: 0,
    d_price2: 0,
  });
  const dilerProducts = ref<IProduct[]>([]);

  const fetchData = async (url: string) => {
    try {
      const { data } = await requestApi(url, "GET", query);
      dilerProducts.value = data.items;
      query.pageCount = data.pageCount;
      query.total = data?.total;
    } catch (error) {
      console.error(error);
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
      dialogs.isAdd = dialogs.isBlock = dialogs.isUpdate = false;
      fetchData("");
    } catch (error) {
      console.error(error);
    }
  };

  return {
    fetchData,
    handleSubmit,
    dilerProducts,
    formDilerProducts,
    dialogs,
    query,
  };
});
