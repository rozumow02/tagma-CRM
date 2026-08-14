import { getLogsApi, getLogTypesApi } from "@/api/logs";
import type { ILogs, IQuery } from "@/types";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
export const query = reactive<IQuery>({
  pageCount: 0,
  pageNumber: 1,
  pageSize: 10,
  logType: "",
});

export const logs = ref<ILogs[]>([]);
export const logTypes = ref<string[]>([]);

export const useLogsStore = defineStore("logs", () => {
  const FETCH_LOGS = async () => {
    await getLogsApi(query).then((res) => {
      logs.value = res.data.items || [];
      query.pageCount = res.data.pageCount;
    });
  };
  const FETCH_LOG_TYPES = async () => {
    await getLogTypesApi().then((res) => {
      logTypes.value = res.data;
    });
  };

  return { FETCH_LOGS, FETCH_LOG_TYPES };
});
