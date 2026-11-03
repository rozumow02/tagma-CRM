import { defineStore } from "pinia";
import { ElLoading } from "element-plus";
import { reactive, ref, type Ref } from "vue";
import { toast } from "vue3-toastify";
import type { IDriversForm, IDrivers, IQuery } from "@/types";
import {
  driversDeleteApi,
  driversPostApi,
  driversGetApi,
  driversPutApi,
  driversGetByIdApi,
  driversLockApi,
} from "@/api/Trade-team/driver";
import Trans from "@/i18n/translation";
const { t } = Trans;
export const isBlockDialog = ref(false);
export const isUpdateDialog = ref(false);
export const isAddDialog = ref(false);

export const formDrivers = reactive<IDriversForm>({
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

export const drivers = ref<IDrivers[]>([]);

export const useDriversStore = defineStore("drivers", () => {
  const FETCH_DRIVERS = async () => {
    try {
      const { data } = await driversGetApi(query);
      drivers.value = data.items;
      query.pageCount = data.pageCount;
    } catch (error) {
      console.error("Operation failed.");
    }
  };

  const FETCH_DRIVERS_CREATE = async () => {
    await driversPostApi(formDrivers).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isAddDialog.value = false;
      FETCH_DRIVERS();
    });
  };

  const FETCH_DRIVERS_UPDATE = async (id: number) => {
    await driversPutApi(formDrivers, id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isUpdateDialog.value = false;
      FETCH_DRIVERS();
    });
  };

  const FETCH_DRIVERS_DELETE = async (id: number) => {
    driversDeleteApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_DRIVERS();
    });
  };

  const FETCH_DRIVERS_LOCK = async (id: number) => {
    driversLockApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_DRIVERS();
    });
  };

  const FETCH_DRIVERS_BY_ID = async (id: number) => {
    // const loading = ElLoading.service({
    //   lock: true,
    //   text: t("loading"),
    //   background: "rgba(0, 0, 0, 0.7)",
    // });
    selectedId.value = id;
    await driversGetByIdApi(id).then((res) => {
      formDrivers.name_ru = res.data.name_ru;
      formDrivers.name_tm = res.data.name_tm;
      formDrivers.status = res.data.status;
      formDrivers.number = res.data.number;
      isUpdateDialog.value = true;
      // loading.close();
    });
  };

  return {
    FETCH_DRIVERS,
    FETCH_DRIVERS_UPDATE,
    FETCH_DRIVERS_DELETE,
    FETCH_DRIVERS_LOCK,
    FETCH_DRIVERS_CREATE,
    FETCH_DRIVERS_BY_ID,
  };
});
