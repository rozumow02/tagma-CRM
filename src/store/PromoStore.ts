import Trans from "@/i18n/translation";
import { requestApi } from "@/api";
import type {
  IAllProduct,
  IPromo,
  IPromoForm,
  IPromoSoldProduct,
  IPromoSoldQuery,
  IQuery,
  ISelectAll,
} from "@/types";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { toast } from "vue3-toastify";

export const usePromoStore = defineStore("promo", () => {
  const allChannelTypes = ref<ISelectAll[]>([]);
  const promo = ref<IPromo[]>([]);
  const formPromo = reactive<IPromoForm>({
    end: "",
    name_ru: "",
    name_tm: "",
    start: "",
    channel_type_ids: [],
    free_count: 0,
    free_ids: [],
    need_count: 1,
    need_ids: [],
  });
  const loading = ref(false);

  const dialogs = reactive({
    add: false,
    update: false,
    block: false,
    soldProducts: false,
  });

  const soldProducts = ref<IPromoSoldProduct[]>([]);
  const soldProductsLoading = ref(false);
  const selectedPromoForSold = ref<number | null>(null);
  const soldProductsQuery = reactive<IPromoSoldQuery>({
    product_type_id: null,
    trade_agent_id: null,
    trade_point_id: null,
    start_date: "",
    end_date: "",
  });

  const query = reactive<IQuery>({
    pageCount: 0,
    pageNumber: 1,
    pageSize: 10,
  });
  const allProducts = ref<IAllProduct[]>([]);

  const step = ref<number>(1);

  const seldctedPromoId = ref<number | null>(null);

  const FETCH_PROMO = async () => {
    try {
      const { data } = await requestApi("promo/page", "GET", query);
      promo.value = data.items;
      query.pageCount = data.pageCount;
      query.total = data.total;
    } catch (error) {
      console.log(error);
    }
  };

  const CREATE_PROMO = async () => {
    try {
      await requestApi("promo", "POST", {}, formPromo);
      dialogs.add = false;
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      await FETCH_PROMO();
    } catch (error) {
      console.log(error);
    }
  };

  const FETCH_PROMO_BY_ID = async (row: IPromo) => {
    seldctedPromoId.value = row.id;
    formPromo.name_ru = row.name_ru;
    formPromo.name_tm = row.name_tm;
    formPromo.start = row.start;
    formPromo.end = row.end;
    formPromo.need_count = row.need_count;
    formPromo.free_count = row.free_count;
    formPromo.need_ids = row.need_ids.map((item) => item);
    formPromo.free_ids = row.free_ids.map((item) => item);
    formPromo.channel_type_ids = row.channel_types.map((item) => item.id);
    step.value = 1;
    dialogs.update = true;
  };

  const UPDATE_PROMO = async (id: number) => {
    try {
      await requestApi(`promo/${id}`, "PUT", {}, formPromo);
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      dialogs.update = false;
      await FETCH_PROMO();
    } catch (error) {
      console.log(error);
    }
  };

  const LOCK_PROMO = async (id: number) => {
    try {
      await requestApi(`promo/${id}/lock`, "get");
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      dialogs.block = false;
      await FETCH_PROMO();
    } catch (error) {
      console.log(error);
    }
  };
  const FETCH_SOLD_PRODUCTS = async (promoId?: number) => {
    const id = promoId ?? selectedPromoForSold.value;
    if (!id) return;
    try {
      soldProductsLoading.value = true;
      const params: Record<string, any> = { promo_id: id };
      if (soldProductsQuery.product_type_id)
        params.product_type_id = soldProductsQuery.product_type_id;
      if (soldProductsQuery.trade_agent_id)
        params.trade_agent_id = soldProductsQuery.trade_agent_id;
      if (soldProductsQuery.trade_point_id)
        params.trade_point_id = soldProductsQuery.trade_point_id;
      if (soldProductsQuery.start_date)
        params.start_date = soldProductsQuery.start_date;
      if (soldProductsQuery.end_date)
        params.end_date = soldProductsQuery.end_date;
      const { data } = await requestApi("promo/sold-products", "GET", params);
      soldProducts.value = Array.isArray(data) ? data : [];
    } catch (error) {
      console.log(error);
    } finally {
      soldProductsLoading.value = false;
    }
  };

  const OPEN_SOLD_PRODUCTS = (row: IPromo) => {
    selectedPromoForSold.value = row.id;
    soldProductsQuery.product_type_id = null;
    soldProductsQuery.trade_agent_id = null;
    soldProductsQuery.trade_point_id = null;
    soldProductsQuery.start_date = "";
    soldProductsQuery.end_date = "";
    soldProducts.value = [];
    dialogs.soldProducts = true;
    FETCH_SOLD_PRODUCTS(row.id);
  };

  const FETCH_ALL_SELECT = async () => {
    const [products, type] = await Promise.all([
      requestApi("orders/products"),

      requestApi("channels/type"),
    ]);

    allChannelTypes.value = type.data;

    if (products.data || products.data.length)
      allProducts.value = products.data;
  };

  return {
    promo,
    formPromo,
    loading,
    query,
    dialogs,
    allProducts,
    step,
    allChannelTypes,
    seldctedPromoId,
    soldProducts,
    soldProductsLoading,
    soldProductsQuery,
    selectedPromoForSold,
    FETCH_ALL_SELECT,
    CREATE_PROMO,
    UPDATE_PROMO,
    LOCK_PROMO,
    FETCH_PROMO,
    FETCH_PROMO_BY_ID,
    FETCH_SOLD_PRODUCTS,
    OPEN_SOLD_PRODUCTS,
  };
});
