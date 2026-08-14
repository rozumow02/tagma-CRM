import { defineStore } from "pinia";
import { ElLoading } from "element-plus";
import { reactive, ref, type Ref } from "vue";
import { toast } from "vue3-toastify";
import type { IDistrictForm, IDistricts, IQuery } from "@/types";
import { districtsApi } from "@/api/districts";
import Trans from "@/i18n/translation";
const { t } = Trans;
export const isBlockDialog = ref(false);
export const isUpdateDialog = ref(false);
export const isAddDialog = ref(false);
export const selectedId = ref();

export const formDistrict = reactive<IDistrictForm>({
  name_ru: "",
  name_tm: "",
  city_id: null,
});

export const query = reactive<IQuery>({
  pageCount: 0,
  pageNumber: 1,
  pageSize: 10,
});

export const districts = ref<IDistricts[]>([]);

export const useDistrictsStore = defineStore("districts", () => {
  const FETCH_DISTRICTS = async () => {
    try {
      const { data } = await districtsApi("districts", "GET", query);
      districts.value = data.items;
      query.pageCount = data.pageCount;
    } catch (error) {
      console.log(error);
    }
  };

  const FETCH_DISTRICTS_CREATE = async () => {
    await districtsApi("districts", "POST", {}, formDistrict).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isAddDialog.value = false;
      FETCH_DISTRICTS();
    });
  };

  const FETCH_DISTRICTS_UPDATE = async (id: number) => {
    await districtsApi(`districts/${id}`, "PUT", {}, formDistrict).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isUpdateDialog.value = false;
      FETCH_DISTRICTS();
    });
  };

  //   const FETCH_DISTRICTS_DELETE = async (id: number) => {
  //     districtsDeleteApi(id).then(() => {
  //       toast(Trans.t("messages.success"), {
  //         type: "success",
  //       });
  //       isBlockDialog.value = false;
  //       FETCH_DISTRICTS();
  //     });
  //   };

  const FETCH_DISTRICTS_LOCK = async (id: number) => {
    districtsApi(`districts/${id}/lock`, "GET").then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_DISTRICTS();
    });
  };

  const FETCH_DISTRICTS_BY_ID = async (row: IDistricts, item?: string) => {
    selectedId.value = row.id;
    // const loading = ElLoading.service({
    //   lock: true,
    //   text: t("loading"),
    //   background: "rgba(0, 0, 0, 0.7)",
    // });
    if (item == "edit") {
      await districtsApi(`districts/${row.id}`).then((res) => {
        formDistrict.name_ru = res.data.name_ru;
        formDistrict.name_tm = res.data.name_tm;
        formDistrict.city_id = res.data.city_id;
        isUpdateDialog.value = true;
        // loading.close();
      });
    } else if (item == "block") {
      isBlockDialog.value = true;
    }
  };

  return {
    FETCH_DISTRICTS,
    FETCH_DISTRICTS_UPDATE,
    FETCH_DISTRICTS_LOCK,
    FETCH_DISTRICTS_CREATE,
    FETCH_DISTRICTS_BY_ID,
  };
});
