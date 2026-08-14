import Trans from "@/i18n/translation";
import { requestApi } from "@/api";
import type {
  IAllProduct,
  IFormOption,
  IPromotions,
  IPromotionsForm,
  IQuery,
} from "@/types";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { toast } from "vue3-toastify";

export const usePromotionsStore = defineStore("promotions", () => {
  const promotions = ref<IPromotions[]>([]);
  const formPromotions = reactive<IPromotionsForm>({
    count: 0,
    end: "",
    list: [],
    name_ru: "",
    name_tm: "",
    start: "",
  });
  const loading = ref(false);
  const selectedId = ref<number | null>(null);

  const dialogs = reactive({
    add: false,
    update: false,
    block: false,
  });

  // --- Edit Discount Modal State ---
  const isEditDialog = ref(false);
  const formEditPromotions = reactive({
    id: 0,
    name_ru: "",
    name_tm: "",
    start: "",
    end: "",
  });

  const editData = reactive<IFormOption[]>([
    {
      model: "name_ru",
      type: "input",
      label: "name_ru",
    },
    {
      model: "name_tm",
      type: "input",
      label: "name_tm",
    },
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
  ]);

  const query = reactive<IQuery>({
    pageCount: 0,
    pageNumber: 1,
    pageSize: 10,
  });
  const allProducts = ref<IAllProduct[]>([]);
  const isMultiple = ref(false);

  const step = ref<number>(1);

  const selectedIdPromotions = ref();
  const selectedProduct = ref<number[]>([]);
  const selectedGroupIds = ref<number[]>([]);

  const FETCH_PROMOTIONS = async () => {
    try {
      const { data } = await requestApi("promotions", "GET", query);
      promotions.value = data.items;
      query.pageCount = data.pageCount;
      query.total = data.total;
    } catch (error) {
      console.log(error);
    }
  };

  const CREATE_PROMOTIONS = async () => {
    formPromotions.list = selectedProduct.value;
    try {
      await requestApi("promotions", "POST", {}, formPromotions);
      dialogs.add = false;
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      await FETCH_PROMOTIONS();
    } catch (error) {
      console.log(error);
    }
  };

  const UPDATE_PROMOTIONS = async (id: number) => {
    try {
      await requestApi(`promotions/${id}`, "PUT", {}, formPromotions);
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      dialogs.update = false;
      await FETCH_PROMOTIONS();
    } catch (error) {
      console.log(error);
    }
  };

  const FETCH_PROMOTIONS_UPDATE_INFO = async () => {
    await requestApi(
      `promotions/info?id=${formEditPromotions.id}`,
      "PUT",
      {},
      formEditPromotions,
    ).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isEditDialog.value = false;
      FETCH_PROMOTIONS();
    });
  };

  const FETCH_PROMOTIONS_EDIT_BY_ID = (row: IPromotions) => {
    formEditPromotions.name_ru = row.name_ru;
    formEditPromotions.name_tm = row.name_tm;
    const dateStart = new Date(
      row.start.split(".").reverse().join("-") + "T00:00:00.000Z",
    );
    const dateEnd = new Date(
      row.end.split(".").reverse().join("-") + "T00:00:00.000Z",
    );
    formEditPromotions.start = dateStart.toISOString();
    formEditPromotions.end = dateEnd.toISOString();
    formEditPromotions.id = row.id;

    isEditDialog.value = true;
  };

  const LOCK_PROMOTIONS = async (id: number) => {
    try {
      await requestApi(`promotions/${id}/lock`, "get");
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      dialogs.block = false;
      await FETCH_PROMOTIONS();
    } catch (error) {
      console.log(error);
    }
  };
  const FETCH_ALL_SELECT = async () => {
    const [products] = await Promise.all([requestApi("orders/products")]);

    if (products.data || products.data.length)
      allProducts.value = products.data;
  };

  return {
    editData,
    isEditDialog,
    formEditPromotions,
    promotions,
    formPromotions,
    loading,
    selectedId,
    query,
    dialogs,
    allProducts,
    isMultiple,
    step,
    selectedIdPromotions,
    selectedGroupIds,
    selectedProduct,
    FETCH_PROMOTIONS_EDIT_BY_ID,
    FETCH_PROMOTIONS_UPDATE_INFO,
    FETCH_ALL_SELECT,
    CREATE_PROMOTIONS,
    UPDATE_PROMOTIONS,
    LOCK_PROMOTIONS,
    FETCH_PROMOTIONS,
  };
});
