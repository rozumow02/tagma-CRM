import { requestApi } from "@/api";
import type { IFormManual, IManual } from "@/types";
import type { Method } from "axios";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useManualStore = defineStore("manual", () => {
  const dialogs = reactive({
    isAdd: false,
    isBlock: false,
    isImageUpdate: false,
  });
  const formManual = reactive<IFormManual>({
    content_ru: "",
    content_tm: "",
    title_ru: "",
    title_tm: "",
  });
  const manuals = ref<IManual>();

  const fetchData = async (url: string) => {
    try {
      const { data } = await requestApi(url, "GET");
      manuals.value = data;
      if (manuals.value?.id) {
        formManual.content_ru = manuals.value?.content_ru;
        formManual.content_tm = manuals.value?.content_tm;
        formManual.title_ru = manuals.value?.title_ru;
        formManual.title_tm = manuals.value?.title_tm;
      }
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
      dialogs.isAdd = dialogs.isImageUpdate = false;
      fetchData("manual/get");
    } catch (error) {
      console.error(error);
    }
  };

  return {
    manuals,
    formManual,
    dialogs,
    fetchData,
    handleSubmit,
  };
});
