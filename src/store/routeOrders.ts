import { requestApi } from "@/api";
import { useDownloadFile } from "@/composables/useDownloadFile";
import Trans from "@/i18n/translation";
import type { ISelectAll } from "@/types";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { toast } from "vue3-toastify";
const { downloadFile } = useDownloadFile();

export const useRouteOrdersStore = defineStore("routeOrders", () => {
  const query = reactive({
    agentId: 0,
    dayId: 0,
  });

  const routeOrders = ref<ISelectAll[]>([]);
  const allAgents = ref<ISelectAll[]>([]);
  const pointsByDays = ref<ISelectAll[]>([]);

  const fetchData = async () => {
    try {
      const { data } = await requestApi("routes/orders/get", "GET", query);
      routeOrders.value = data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAgents = async () => {
    try {
      const { data } = await requestApi("points/agents");
      allAgents.value = data;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDays = async () => {
    try {
      const { data } = await requestApi("routes/days");
      pointsByDays.value = data;
    } catch (error) {
      console.error(error);
    }
  };
  const handleSubmit = async (data: ISelectAll[]) => {
    try {
      await requestApi("routes/orders/post", "POST", query, data);
      toast(Trans.t("messages.success"), {
        type: "success",
      });
    } catch (error) {
      console.error(error);
    }
  };
  const FETCH_ROUTE_ORDERS_EXCEL = async () => {
    requestApi("routes/excel", "GET", query, {}, "blob").then((res) => {
      let date = new Date().toLocaleDateString();
      if (res.data)
        downloadFile(res.data, `${Trans.t("menuItems.routes")}-${date}.xlsx`);
    });
  };
  return {
    fetchAgents,
    fetchData,
    fetchDays,
    handleSubmit,
    pointsByDays,
    allAgents,
    routeOrders,
    query,
    FETCH_ROUTE_ORDERS_EXCEL,
  };
});
