import { defineStore } from "pinia";
import { ElLoading } from "element-plus";
import { reactive, ref, type Ref } from "vue";
import { toast } from "vue3-toastify";
import type { ICityForm, ICities, IQuery } from "@/types";
import {
  cityDeleteApi,
  cityPostApi,
  citiesGetApi,
  cityPutApi,
  citiesGetByIdApi,
  cityLockApi,
} from "@/api/city";
import Trans from "@/i18n/translation";
const { t } = Trans;
export const isBlockDialog = ref(false);
export const isUpdateDialog = ref(false);
export const isAddDialog = ref(false);
export const selectedId = ref();

export const formCity = reactive<ICityForm>({
  name_ru: "",
  name_tm: "",
  status: true,
});

export const query = reactive<IQuery>({
  pageCount: 0,
  pageNumber: 1,
  pageSize: 10,
});

export const cities = ref<ICities[]>([]);

export const useCityStore = defineStore("city", () => {
  const FETCH_CITIES = async () => {
    try {
      const { data } = await citiesGetApi(query);
      cities.value = data.items;
      query.pageCount = data.pageCount;
    } catch (error) {
      console.log(error);
    }
  };

  const FETCH_CITIES_CREATE = async () => {
    await cityPostApi(formCity).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isAddDialog.value = false;
      FETCH_CITIES();
    });
  };

  const FETCH_CITIES_UPDATE = async (id: number) => {
    await cityPutApi(formCity, id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isUpdateDialog.value = false;
      FETCH_CITIES();
    });
  };

  const FETCH_CITIES_DELETE = async (id: number) => {
    cityDeleteApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_CITIES();
    });
  };

  const FETCH_CITIES_LOCK = async (id: number) => {
    cityLockApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_CITIES();
    });
  };

  const FETCH_CITIES_BY_ID = async (row: ICities, item?: string) => {
    selectedId.value = row.id;
    // const loading = ElLoading.service({
    //   lock: true,
    //   text: t("loading"),
    //   background: "rgba(0, 0, 0, 0.7)",
    // });
    if (item == "edit") {
      await citiesGetByIdApi(row.id).then((res) => {
        formCity.name_ru = res.data.name_ru;
        formCity.name_tm = res.data.name_tm;
        formCity.status = res.data.status;
        isUpdateDialog.value = true;
        // loading.close();
      });
    } else if (item == "block") {
      isBlockDialog.value = true;
    }
  };

  return {
    FETCH_CITIES,
    FETCH_CITIES_UPDATE,
    FETCH_CITIES_DELETE,
    FETCH_CITIES_LOCK,
    FETCH_CITIES_CREATE,
    FETCH_CITIES_BY_ID,
  };
});
