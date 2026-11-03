import { requestApi } from "@/api";
import { useDownloadFile } from "@/composables/useDownloadFile";
import Trans from "@/i18n/translation";
import type { ISales, ISalesQuery } from "@/types";
import { getDateParts } from "@/utils/utils";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const useSalesStore = defineStore("sales", () => {
  const sales = ref<ISales[]>([]);
  const query = reactive<ISalesQuery>({});
  const loadingSales = ref(false);

  const { downloadFile } = useDownloadFile();

  const fetchData = async (url: string) => {
    try {
      loadingSales.value = true;
      const { data } = await requestApi(url, "GET", query);
      sales.value = data;
    } catch (error) {
      console.error("Operation failed.");
    } finally {
      loadingSales.value = false;
    }
  };
  const FETCH_SALES_EXCEL = async (title: string) => {
    let date = new Date().toLocaleDateString();
    const { day, month, year } = getDateParts(date);
    requestApi(
      `products/daily/excel`,
      "GET",
      { ...query, year, month, day },
      {},
      "blob",
    ).then((res) => {
      if (res.data)
        downloadFile(res.data, `${Trans.t(`${title}`)}-${date}.xlsx`);
    });
  };
  return { sales, query, fetchData, FETCH_SALES_EXCEL, loadingSales };
});
