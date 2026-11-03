import Trans from "@/i18n/translation";
import { requestApi } from "@/api";
import type {
  IAllProduct,
  IPlan,
  IPlanForm,
  IQuery,
  ISelectAll,
} from "@/types";
import { getCurrentMonthYear } from "@/utils/utils";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { toast } from "vue3-toastify";

export const usePlanStore = defineStore("plan", () => {
  const { month, year } = getCurrentMonthYear();
  const plans = ref<IPlan[]>([]);

  const formPlan = ref<IPlan[]>([]);
  const loading = ref(false);
  const selectedId = ref<number | null>(null);

  const dialogs = reactive({
    add: false,
    update: false,
    block: false,
  });

  const query = reactive<IQuery>({
    pageCount: 0,
    pageNumber: 1,
    pageSize: 10,
    month,
    year,
  });
  const allProducts = ref<IAllProduct[]>([]);

  const allAgets = ref<ISelectAll[]>([]);

  const selectedIdPlans = ref();
  const selectedProduct = ref<number[]>([]);
  const selectedGroupIds = ref<number[]>([]);

  const FETCH_PLANS = async () => {
    try {
      const { data } = await requestApi("plans", "GET", query);
      plans.value = data;
      query.pageCount = data.pageCount;
      query.total = data.total;
    } catch (error) {
      console.error("Operation failed.");
    }
  };

  const CREATE_PLAN = async () => {
    try {
      await requestApi(
        "plans",
        "POST",
        { month: query.month, year: query.year },
        formPlan.value,
      );
      dialogs.add = false;
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      await FETCH_PLANS();
    } catch (error) {
      console.error("Operation failed.");
    }
  };

  const UPDATE_PLANS = async () => {
    try {
      await requestApi(
        `plans`,
        "PUT",
        { month: query.month, year: query.year },
        formPlan.value,
      );
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      dialogs.update = false;
      await FETCH_PLANS();
    } catch (error) {
      console.error("Operation failed.");
    }
  };

  const LOCK_PLANS = async (id: number) => {
    try {
      await requestApi(`plans/${id}/lock`, "get");
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      dialogs.block = false;
      await FETCH_PLANS();
    } catch (error) {
      console.error("Operation failed.");
    }
  };
  const FETCH_ALL_SELECT = async () => {
    const [products, agents] = await Promise.all([
      requestApi("orders/products"),
      requestApi("points/agents"),
    ]);

    if (products.data || products.data.length)
      allProducts.value = products.data;

    if (agents.data || agents.data.length) allAgets.value = agents.data;
  };

  return {
    plans,
    formPlan,
    loading,
    selectedId,
    query,
    dialogs,
    allProducts,
    selectedIdPlans,
    selectedGroupIds,
    selectedProduct,
    allAgets,
    FETCH_ALL_SELECT,
    CREATE_PLAN,
    UPDATE_PLANS,
    LOCK_PLANS,
    FETCH_PLANS,
  };
});
