import { defineStore } from "pinia";
import { ElLoading } from "element-plus";
import { reactive, ref, type Ref } from "vue";
import { toast } from "vue3-toastify";
import type {
  IEkspeditors,
  IRemainderToEkspeditor,
  IEkspeditorsForm,
  IQuery,
} from "@/types";
import {
  ekspeditorsDeleteApi,
  ekspeditorsPostApi,
  ekspeditorsGetApi,
  ekspeditorsPutApi,
  ekspeditorsGetByIdApi,
  ekspeditorsLockApi,
} from "@/api/Trade-team/ekspeditors";
import Trans from "@/i18n/translation";
import { requestApi } from "@/api";
const { t } = Trans;

export const isBlockDialog = ref(false);
export const isUpdateDialog = ref(false);
export const isAddDialog = ref(false);

export const formEkspeditors = reactive<IEkspeditorsForm>({
  name_ru: "",
  name_tm: "",
  status: true,
  number: "",
});

export const query = reactive<IQuery>({
  pageCount: 0,
  pageNumber: 1,
  pageSize: 50,
});

export const remainderToEkspeditor = ref<IRemainderToEkspeditor[]>([]);
export const ekspeditors = ref<IEkspeditors[]>([]);

export const useEkspeditorsStore = defineStore("ekspeditors", () => {
  const FETCH_EKSPEDITORS = async () => {
    try {
      const { data } = await ekspeditorsGetApi(query);
      ekspeditors.value = data.items;
      query.pageCount = data.pageCount;
    } catch (error) {
      console.error("Operation failed.");
    }
  };

  const FETCH_EKSPEDITORS_CREATE = async () => {
    await ekspeditorsPostApi(formEkspeditors).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isAddDialog.value = false;
      FETCH_EKSPEDITORS();
    });
  };

  const FETCH_EKSPEDITORS_UPDATE = async (id: number) => {
    await ekspeditorsPutApi(formEkspeditors, id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isUpdateDialog.value = false;
      FETCH_EKSPEDITORS();
    });
  };

  const FETCH_EKSPEDITORS_DELETE = async (id: number) => {
    ekspeditorsDeleteApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_EKSPEDITORS();
    });
  };

  const FETCH_EKSPEDITORS_LOCK = async (id: number) => {
    ekspeditorsLockApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_EKSPEDITORS();
    });
  };

  const FETCH_EKSPEDITORS_BY_ID = async (id: number) => {
    // const loading = ElLoading.service({
    //   lock: true,
    //   text: t("loading"),
    //   background: "rgba(0, 0, 0, 0.7)",
    // });
    await ekspeditorsGetByIdApi(id).then((res) => {
      formEkspeditors.name_ru = res.data.name_ru;
      formEkspeditors.name_tm = res.data.name_tm;
      formEkspeditors.status = res.data.status;
      formEkspeditors.number = res.data.number;
      isUpdateDialog.value = true;
      // loading.close();
    });
  };
  const FETCH_REMAINDER_TO_EKSPEDITOR = async (id: number) => {
    try {
      const { data } = await requestApi("ekspeditors/galyndy/web", "GET", {
        ekspeditorId: id,
      });
      remainderToEkspeditor.value = data;
    } catch (error) {
      console.error("Operation failed.");
    }
  };

  return {
    FETCH_EKSPEDITORS,
    FETCH_EKSPEDITORS_UPDATE,
    FETCH_EKSPEDITORS_DELETE,
    FETCH_EKSPEDITORS_LOCK,
    FETCH_EKSPEDITORS_CREATE,
    FETCH_EKSPEDITORS_BY_ID,
    FETCH_REMAINDER_TO_EKSPEDITOR,
  };
});
