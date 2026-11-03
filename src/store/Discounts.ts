import { defineStore } from "pinia";
import { ElLoading } from "element-plus";
import { computed, reactive, ref, watch, type Ref } from "vue";
import { toast } from "vue3-toastify";
import type {
  IAllProduct,
  IDiscountFormEdit,
  IDiscounts,
  IDiscountsForm,
  IFormOption,
  IQuery,
  ISelectAll,
  ISelectedProducts,
} from "@/types";
import { discountsApi } from "@/api/discounts";
import Trans from "@/i18n/translation";
import { requestApi } from "@/api";
import { splitNumber } from "@/utils/utils";

export const isDeleteDialog = ref(false);
export const isBlockDialog = ref(false);
export const isUpdateDialog = ref(false);
export const isAddDialog = ref(false);

export const formDiscounts = reactive<IDiscountsForm>({
  name_ru: "",
  name_tm: "",
  status: true,
  end: "",
  start: "",
  first: [
    {
      coefficient: 0,
      count: 0,
      product_id: 0,
      coin: 0,
    },
  ],
  is_direct: false,
  is_procent: false,
  second: null,
  channel_type_ids: [],
  is_increase: false,
  trade_agents: null,
  trade_point_ids: [],
  sort_order: 0,
  is_group: false,
});
// --- Edit Discount Modal State ---
export const isEditDialog = ref(false);
export const formEditDiscounts = reactive<IDiscountFormEdit>({
  id: 0,
  name_ru: "",
  name_tm: "",
  start: "",
  end: "",
  trade_agents: null,
  trade_point_ids: [] as number[],
  channel_type_ids: [] as number[],
  sort_order: 0,
  is_group: false,
});

export const query = reactive<IQuery>({
  pageCount: 0,
  pageNumber: 1,
  pageSize: 10,
});

export const type2ProductCount = ref<number>(1);
export const type2ProductCoefficient = ref<number>(0);
export const type2ProductCoin = ref<number>(0);
// export const isMultiple = ref(false);

export const step = ref<number>(1);

export const selectedIdDiscout = ref();
export const discountTypes = ref<ISelectAll[]>([]);
export const allProducts = ref<IAllProduct[]>([]);

export const allChannelTypes = ref<ISelectAll[]>([]);
export const first = ref<ISelectedProducts[]>([]);
export const second = ref<ISelectedProducts[]>([]);

export const loadingPoints = ref(false);

export const selectedProduct = ref<number[]>([]);
export const selectedGroupIds = ref<number[]>([]);

export const selectedProductSecond = ref<number[]>([]);

export const discounts = ref<IDiscounts[]>([]);

export const useDiscountsStore = defineStore("discounts", () => {
  const pointsByAgent = ref<ISelectAll[]>([]);
  const allAgents = ref<ISelectAll[]>([]);

  const optionPointAgent = computed(() => pointsByAgent.value);
  watch(
    () => formEditDiscounts.trade_agents,
    async (val) => {
      if (typeof val === "number") await FETCH_POINTS_BY_AGENT(val);
      formEditDiscounts.trade_point_ids = pointsByAgent.value.map(
        (item) => item.id,
      );
    },
  );
  const editData = computed<IFormOption[]>(() => [
    {
      model: "name_ru",
      type: "input",
      label: "name",
    },
    {
      model: "channel_type_ids",
      type: "select",
      label: "points.trade_channel_type",
      options: allChannelTypes.value,
      multiple: true,
    },
    {
      type: "select",
      model: "trade_agents",
      label: "points.trade_agent",
      options: allAgents.value,
      valid: true,
    },
    {
      type: "select",
      model: "trade_point_ids",
      label: "points.title",
      options: optionPointAgent.value,
      multiple: true,
      valid: true,
    },
    // {
    //   model: "name_tm",
    //   type: "input",
    //   label: "name_tm",
    // },
    {
      model: "start",
      type: "date",
      label: "start_discount",
    },
    {
      model: "end",
      type: "date",
      label: "end_discount",
    },
    {
      model: "sort_order",
      type: "number",
      label: "sort_order",
    },
  ]);
  const FETCH_DISCOUNTS = async () => {
    try {
      const { data } = await discountsApi("discounts", "GET", query);
      discounts.value = data.items;
      query.pageCount = data.pageCount;
      query.total = data.total;
      step.value = 1;
    } catch (error) {
      console.error("Operation failed.");
    }
  };

  const FETCH_DISCOUNTS_CREATE = async () => {
    await discountsApi(
      "discounts",
      "POST",
      {},
      { ...formDiscounts, trade_agents: [formDiscounts.trade_agents] },
    ).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isAddDialog.value = false;
      FETCH_DISCOUNTS();
    });
  };

  const FETCH_DISCOUNTS_UPDATE = async (id: number) => {
    await discountsApi(`discounts/${id}`, "PUT", {}, formDiscounts).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isUpdateDialog.value = false;
      FETCH_DISCOUNTS();
    });
  };
  const FETCH_DISCOUNTS_UPDATE_INFO = async () => {
    formEditDiscounts.name_tm = formEditDiscounts.name_ru;
    await discountsApi(
      `discounts/info?id=${formEditDiscounts.id}`,
      "PUT",
      {},
      { ...formEditDiscounts, trade_agents: [formEditDiscounts.trade_agents] },
    ).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isUpdateDialog.value = false;
      FETCH_DISCOUNTS();
    });
  };

  const FETCH_DISCOUNTS_LOCK = async (id: number) => {
    discountsApi(`discounts/${id}/lock`, "GET").then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_DISCOUNTS();
    });
  };
  const FETCH_DISCOUNTS_DELETE = async (id: number) => {
    discountsApi(`discounts/${id}`, "DELETE").then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isDeleteDialog.value = false;
      FETCH_DISCOUNTS();
    });
  };
  const FETCH_DISCOUNTS_EDIT_BY_ID = (row: IDiscounts) => {
    formEditDiscounts.name_ru = row.name_ru;
    formEditDiscounts.name_tm = row.name_tm;
    const dateStart = new Date(
      row.start.split(".").reverse().join("-") + "T00:00:00.000Z",
    );
    const dateEnd = new Date(
      row.end.split(".").reverse().join("-") + "T00:00:00.000Z",
    );
    formEditDiscounts.start = dateStart.toISOString();
    formEditDiscounts.end = dateEnd.toISOString();

    // formEditDiscounts.trade_agents =
    //   row.trade_agents && row.trade_agents.length > 0
    //     ? row.trade_agents[0].id
    //     : delete formEditDiscounts.trade_agents;
    if (row.trade_agents && row.trade_agents.length > 0) {
      formEditDiscounts.trade_agents = row.trade_agents[0].id;
    } else {
      formDiscounts.trade_agents = [];
    }
    if (row.trade_points && row.trade_points.length > 0) {
      formEditDiscounts.trade_point_ids = row.trade_points.map(
        (item) => item.id,
      );
    } else {
      formEditDiscounts.trade_point_ids = [];
    }
    formEditDiscounts.channel_type_ids = row.channel_types?.map(
      (type) => type.id,
    );

    formEditDiscounts.sort_order = row.sort_order;

    formEditDiscounts.id = row.id;

    isUpdateDialog.value = true;
  };

  const FETCH_DISCOUNTS_BY_ID = async (row: IDiscounts) => {
    // const loading = ElLoading.service({
    //   lock: true,
    //   text: Trans.t("loading"),
    //   background: "rgba(0, 0, 0, 0.7)",
    // });
    selectedProduct.value = [];
    selectedProductSecond.value = [];
    selectedIdDiscout.value = row.id;
    formDiscounts.first = row.first;
    row.first?.forEach((item) => {
      selectedProduct.value.push(item.product_id);
    });
    row.second?.forEach((item) => {
      selectedProductSecond.value.push(item.product_id);
    });
    formDiscounts.is_direct = row.is_direct;
    formDiscounts.is_procent = row.is_procent;
    formDiscounts.name_ru = row.name_ru;
    formDiscounts.name_tm = row.name_tm;
    formDiscounts.second = row.second;
    formDiscounts.status = row.status;
    const dateStart = new Date(
      row.start.split(".").reverse().join("-") + "T19:00:00.000Z",
    );
    const dateEnd = new Date(
      row.end.split(".").reverse().join("-") + "T19:00:00.000Z",
    );
    formDiscounts.start = dateStart.toISOString();
    formDiscounts.end = dateEnd.toISOString();
    first.value.forEach((item) => {
      formDiscounts.first?.some((value) => {
        if (value.product_id === item.product_id) {
          const { remainder, whole } = splitNumber(value.coefficient);
          item.count = value.count;
          item.coefficient = whole;
          item.coin = remainder;
        }
      });
    });
    second.value.forEach((item) => {
      formDiscounts.second?.some((value) => {
        if (value.product_id === item.product_id) {
          const { remainder, whole } = splitNumber(value.coefficient);
          item.count = value.count;
          item.coefficient = whole;
          item.coin = remainder;
        }
      });
    });
    formDiscounts.channel_type_ids = row.channel_types?.map((type) => type.id);

    isUpdateDialog.value = true;
  };

  const FETCH_ALL_SELECT = async () => {
    const [products, type, agents] = await Promise.all([
      // discountsApi("discounts/types"),
      requestApi("orders/products"),
      requestApi("channels/type"),
      requestApi("points/agents"),
    ]);
    allChannelTypes.value = type.data;
    allAgents.value = agents.data;
    // discountTypes.value = types.data;
    if (products.data || products.data.length)
      allProducts.value = products.data;
    first.value = products.data.map((item: IAllProduct) => {
      return {
        ...item,
        product_id: item.Id,
        count: 0,
        coefficient: 0,
      };
    });
    second.value = products.data.map((item: IAllProduct) => {
      return {
        ...item,
        product_id: item.Id,
        count: 0,
        coefficient: 0,
      };
    });
  };

  const FETCH_POINTS_BY_AGENT = async (agentId: number) => {
    try {
      loadingPoints.value = true;
      const { data } = await requestApi(
        "discounts/get-points-by-agent",
        "GET",
        {
          agentId,
        },
      );
      pointsByAgent.value = data;
    } catch (error) {
      console.error("Operation failed.");
    } finally {
      loadingPoints.value = false;
    }
  };

  return {
    FETCH_DISCOUNTS,
    FETCH_DISCOUNTS_UPDATE,
    FETCH_DISCOUNTS_UPDATE_INFO,
    FETCH_DISCOUNTS_LOCK,
    FETCH_DISCOUNTS_CREATE,
    FETCH_DISCOUNTS_BY_ID,
    FETCH_DISCOUNTS_EDIT_BY_ID,
    FETCH_ALL_SELECT,
    FETCH_POINTS_BY_AGENT,
    FETCH_DISCOUNTS_DELETE,
    editData,
    allAgents,
    pointsByAgent,
  };
});
