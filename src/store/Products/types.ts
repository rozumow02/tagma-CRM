import { defineStore } from "pinia";
import { ElLoading } from "element-plus";
import { reactive, ref, type Ref } from "vue";
import { toast } from "vue3-toastify";
import type { IProductTypesForm, IProductTypes, IQuery } from "@/types";
import {
  productTypesDeleteApi,
  productTypesPostApi,
  productTypesGetApi,
  productTypesPutApi,
  productTypesGetByIdApi,
  productTypesLockApi,
  getAllSelectApi,
} from "@/api/products/types";
import Trans from "@/i18n/translation";
const { t } = Trans;
export const isBlockDialog = ref(false);
export const isUpdateDialog = ref(false);
export const isAddDialog = ref(false);

export const formProductTypes = reactive<IProductTypesForm>({
  name_ru: "",
  name_tm: "",
  volume: 0,
  count: 12,
  status: true,
});

export const query = reactive<IQuery>({
  pageCount: 0,
  pageNumber: 1,
  pageSize: 10,
});

export const selectedId = ref();
export const typeForVolumes = ref<{ volume: number }[]>([]);
export const productTypes = ref<IProductTypes[]>([]);

export const useProductTypesStore = defineStore("productTypes", () => {
  const FETCH_PRODUCTTYPES = async () => {
    try {
      const { data } = await productTypesGetApi(query);
      productTypes.value = data.items;
      query.pageCount = data.pageCount;
    } catch (error) {
      console.error("Operation failed.");
    }
  };

  const FETCH_PRODUCTTYPES_CREATE = async () => {
    await productTypesPostApi(formProductTypes).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isAddDialog.value = false;
      FETCH_PRODUCTTYPES();
    });
  };

  const FETCH_PRODUCTTYPES_UPDATE = async (id: number) => {
    await productTypesPutApi(formProductTypes, id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isUpdateDialog.value = false;
      FETCH_PRODUCTTYPES();
    });
  };

  const FETCH_PRODUCTTYPES_DELETE = async (id: number) => {
    productTypesDeleteApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_PRODUCTTYPES();
    });
  };

  const FETCH_PRODUCTTYPES_LOCK = async (id: number) => {
    productTypesLockApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_PRODUCTTYPES();
    });
  };

  const FETCH_PRODUCTTYPES_BY_ID = async (id: number) => {
    // const loading = ElLoading.service({
    //   lock: true,
    //   text: t("loading"),
    //   background: "rgba(0, 0, 0, 0.7)",
    // });
    selectedId.value = id;
    await productTypesGetByIdApi(id).then((res) => {
      formProductTypes.name_ru = res.data.name_ru;
      formProductTypes.name_tm = res.data.name_tm;
      formProductTypes.count = res.data.count;
      formProductTypes.volume = res.data.volume;
      formProductTypes.status = res.data.status;
      isUpdateDialog.value = true;
      // loading.close();
    });
  };
  const FETCH_ALL_SELECT = async () => {
    getAllSelectApi("types/volume").then((res) => {
      typeForVolumes.value = res.data;
    });
  };

  return {
    FETCH_PRODUCTTYPES,
    FETCH_PRODUCTTYPES_UPDATE,
    FETCH_PRODUCTTYPES_DELETE,
    FETCH_PRODUCTTYPES_LOCK,
    FETCH_PRODUCTTYPES_CREATE,
    FETCH_PRODUCTTYPES_BY_ID,
    FETCH_ALL_SELECT,
  };
});
