import { defineStore } from "pinia";
import { ElLoading } from "element-plus";
import { reactive, ref, type Ref } from "vue";
import { toast } from "vue3-toastify";
import type { IMerchandiserForm, IMerchandiser, IQuery } from "@/types";
import {
  merchandisersDeleteApi,
  merchandisersPostApi,
  merchandisersGetApi,
  merchandisersPutApi,
  merchandisersGetByIdApi,
  merchandisersLockApi,
} from "@/api/Trade-team/merchandiser";
import Trans from "@/i18n/translation";
const { t } = Trans;
export const isBlockDialog = ref(false);
export const isUpdateDialog = ref(false);
export const isAddDialog = ref(false);

export const formMerchandisers = reactive<IMerchandiserForm>({
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

export const selectedId = ref();

export const merchandisers = ref<IMerchandiser[]>([]);

export const useMerchandisersStore = defineStore("merchandisers", () => {
  const FETCH_MERCHANDISERS = async () => {
    try {
      const { data } = await merchandisersGetApi(query);
      merchandisers.value = data.items || [];
      query.pageCount = data.pageCount;
    } catch (error) {
      console.error("Operation failed.");
    }
  };

  const FETCH_MERCHANDISERS_CREATE = async () => {
    await merchandisersPostApi(formMerchandisers).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isAddDialog.value = false;
      FETCH_MERCHANDISERS();
    });
  };

  const FETCH_MERCHANDISERS_UPDATE = async (id: number) => {
    await merchandisersPutApi(formMerchandisers, id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isUpdateDialog.value = false;
      FETCH_MERCHANDISERS();
    });
  };

  const FETCH_MERCHANDISERS_DELETE = async (id: number) => {
    merchandisersDeleteApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_MERCHANDISERS();
    });
  };

  const FETCH_MERCHANDISERS_LOCK = async (id: number) => {
    merchandisersLockApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_MERCHANDISERS();
    });
  };

  const FETCH_MERCHANDISERS_BY_ID = async (id: number) => {
    // const loading = ElLoading.service({
    //   lock: true,
    //   text: t("loading"),
    //   background: "rgba(0, 0, 0, 0.7)",
    // });
    selectedId.value = id;
    await merchandisersGetByIdApi(id).then((res) => {
      formMerchandisers.name_ru = res.data.name_ru;
      formMerchandisers.name_tm = res.data.name_tm;
      formMerchandisers.status = res.data.status;
      formMerchandisers.number = res.data.number;
      isUpdateDialog.value = true;
      // loading.close();
    });
  };

  return {
    FETCH_MERCHANDISERS,
    FETCH_MERCHANDISERS_UPDATE,
    FETCH_MERCHANDISERS_DELETE,
    FETCH_MERCHANDISERS_LOCK,
    FETCH_MERCHANDISERS_CREATE,
    FETCH_MERCHANDISERS_BY_ID,
  };
});
