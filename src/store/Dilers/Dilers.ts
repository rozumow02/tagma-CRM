import Trans from "@/i18n/translation";
import { requestApi } from "@/api";
import type { Method } from "axios";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import type { IDiler, IDilerForm, IQuery, ISelectAll } from "@/types";
import { toast } from "vue3-toastify";
import { formatNumber } from "@/utils/utils";

export const useDilerStore = defineStore("diler", () => {
  const query = reactive<IQuery>({
    pageCount: 0,
    pageNumber: 1,
    pageSize: 10,
  });
  const dialogs = reactive({
    isAdd: false,
    isBlock: false,
    isUpdate: false,
    isAccount: false,
  });

  const formDiler = reactive<IDilerForm>({
    name_ru: "",
    name_tm: "",
    address_ru: "",
    address_tm: "",
    company: "",
    phone_number: "",
    city_id: 0,
    email: "",
  });
  const dilers = ref<IDiler[]>([]);
  const allDilers = ref<ISelectAll[]>([]);

  const fetchData = async (url: string) => {
    try {
      const { data } = await requestApi(url, "GET", query);
      if (data?.items && data.items.length)
        dilers.value = data.items.map((item: IDiler) => {
          return {
            ...item,
            total: item.account - item.debt,
            updated_at:
              item.updated_at == "01.01.0001 00:00" ? "-" : item.updated_at,
          };
        });
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
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      await requestApi(url, method, params, form);
      dialogs.isAdd =
        dialogs.isBlock =
        dialogs.isUpdate =
        dialogs.isAccount =
          false;
      fetchData("dealer");
    } catch (error) {
      console.error(error);
    }
  };
  const fetchAllDilers = async () => {
    try {
      const { data } = await requestApi("dealer/all");
      allDilers.value = data;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    fetchAllDilers,
    allDilers,
    fetchData,
    handleSubmit,
    dilers,
    query,
    formDiler,
    dialogs,
  };
});
