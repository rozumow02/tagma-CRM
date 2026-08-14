import { getAllSelectApi, requestApi } from "@/api";
import type { IPlanMain, ISelectAll } from "@/types";
import { getCurrentMonthYear } from "@/utils/utils";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const usePlanMainStore = defineStore("planMain", () => {
  const { month, year } = getCurrentMonthYear();
  const loading = ref(false);
  const allAgents = ref<ISelectAll[]>([]);
  const planMainQuery = reactive({
    month,
    year,
    agent_id: null,
  });
  const planMain = ref<IPlanMain[]>([]);

  const fetchPlanMain = async () => {
    loading.value = true;
    try {
      const { data } = await requestApi("plans/main", "GET", planMainQuery);
      planMain.value = data;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };
  const FETCH_ALL_SELECT = async () => {
    const [agents] = await Promise.all([getAllSelectApi("points/agents")]);

    allAgents.value = agents.data;
  };

  return {
    loading,
    planMainQuery,
    planMain,
    allAgents,
    fetchPlanMain,
    FETCH_ALL_SELECT,
  };
});
