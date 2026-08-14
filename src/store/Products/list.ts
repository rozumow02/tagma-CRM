import { defineStore } from "pinia";
import { ElLoading } from "element-plus";
import { reactive, ref, type Ref } from "vue";
import { toast } from "vue3-toastify";
import type { IProductForm, IProduct, IQuery, ISelectAll } from "@/types";
import {
  productListDeleteApi,
  productListPostApi,
  productListGetApi,
  productListPutApi,
  productListGetByIdApi,
  productListLockApi,
  productTypesAllApi,
} from "@/api/products/list";
import Trans from "@/i18n/translation";
import { getAllSelectApi } from "@/api";
const { t } = Trans;
export const isBlockDialog = ref(false);
export const isUpdateDialog = ref(false);
export const isAddDialog = ref(false);

export const formProductList = reactive<IProductForm>({
  status: true,
  price1: 0,
  price2: 0,
  product_type_id: 0,
  taste_ru: "",
  taste_tm: "",
  brand_id: 0,
  d_price1: 0,
  d_price2: 0,
});

export const query = reactive<IQuery>({
  pageCount: 0,
  pageNumber: 1,
  pageSize: 10,
});

export const productList = ref<IProduct[]>([]);

export const productTypesAll = ref<ISelectAll[]>([]);
export const allBrands = ref<ISelectAll[]>([]);

export const useProductListStore = defineStore("productList", () => {
  const FETCH_PRODUCTLIST = async () => {
    try {
      const { data } = await productListGetApi(query);
      productList.value = data.items;
      query.pageCount = data.pageCount;
      query.total = data.total;
    } catch (error) {
      console.log(error);
    }
  };

  const FETCH_PRODUCTLIST_CREATE = async () => {
    await productListPostApi(formProductList).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isAddDialog.value = false;
      FETCH_PRODUCTLIST();
    });
  };

  const FETCH_PRODUCTLIST_UPDATE = async (id: number) => {
    await productListPutApi(formProductList, id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isUpdateDialog.value = false;
      FETCH_PRODUCTLIST();
    });
  };

  const FETCH_PRODUCTLIST_DELETE = async (id: number) => {
    productListDeleteApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_PRODUCTLIST();
    });
  };

  const FETCH_PRODUCTLIST_LOCK = async (id: number) => {
    productListLockApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_PRODUCTLIST();
    });
  };

  const FETCH_PRODUCTTYPES_ALL = async () => {
    productTypesAllApi().then((res) => {
      productTypesAll.value = res.data;
    });
    getAllSelectApi("products/brands").then((res) => {
      allBrands.value = res.data;
    });
  };

  const FETCH_PRODUCTLIST_BY_ID = async (id: number) => {
    // const loading = ElLoading.service({
    //   lock: true,
    //   text: t("loading"),
    //   background: "rgba(0, 0, 0, 0.7)",
    // });
    await productListGetByIdApi(id).then((res) => {
      formProductList.brand_id = res.data.brand_id;
      // formProductList.name_tm = res.data.name_tm;
      formProductList.status = res.data.status;
      formProductList.price1 = res.data.price1;
      formProductList.price2 = res.data.price2;
      formProductList.d_price1 = res.data.d_price1;
      formProductList.d_price2 = res.data.d_price2;
      formProductList.product_type_id = res.data.product_type_id;
      formProductList.taste_ru = res.data.taste_ru;
      formProductList.taste_tm = res.data.taste_tm;
      isUpdateDialog.value = true;
      // loading.close();
    });
  };

  return {
    FETCH_PRODUCTLIST,
    FETCH_PRODUCTLIST_UPDATE,
    FETCH_PRODUCTLIST_DELETE,
    FETCH_PRODUCTLIST_LOCK,
    FETCH_PRODUCTLIST_CREATE,
    FETCH_PRODUCTLIST_BY_ID,
    FETCH_PRODUCTTYPES_ALL,
  };
});
