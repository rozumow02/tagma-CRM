import Trans from "@/i18n/translation";
import { defineStore } from "pinia";
import { ElLoading } from "element-plus";
import { reactive, ref } from "vue";
import { toast } from "vue3-toastify";
import type { IGifts, IGiftsForm, IQuery, ISelectAll } from "@/types";
import { giftsApi } from "@/api/gifts";

export const useGiftsStore = defineStore("gifts", () => {
  // Reactive states
  const dialogs = reactive({ isAdd: false, isUpdate: false, isBlock: false });
  const formGifts = reactive<IGiftsForm>({
    name_ru: "",
    name_tm: "",
    gift_type_id: 0,
  });
  const query = reactive<IQuery>({ pageCount: 0, pageNumber: 1, pageSize: 10 });
  const selectedIdGifts = ref<number | null>(null);
  const giftTypes = ref<ISelectAll[]>([]);
  const gifts = ref<IGifts[]>([]);
  const giftForPoints = ref<ISelectAll[]>([]);
  const loading = ref(false);

  // Common method to fetch gifts
  const fetchGifts = async () => {
    try {
      const { data } = await giftsApi("gifts", "GET", query);
      gifts.value = data.items;
      query.pageCount = data.pageCount;
    } catch (error) {
      console.error("Operation failed.");
    }
  };

  // Create and update gifts
  const handleGiftAction = async (id?: number) => {
    const method = id ? "PUT" : "POST";
    const url = id ? `gifts/${id}` : "gifts";
    try {
      await giftsApi(url, method, {}, formGifts);
      toast(Trans.t("messages.success"), { type: "success" });
      dialogs.isAdd = dialogs.isUpdate = false;
      fetchGifts();
    } catch (error) {
      console.error("Operation failed.");
    }
  };

  // Fetch gift by ID
  const fetchGiftById = async (id: number) => {
    try {
      selectedIdGifts.value = id;
      const { data } = await giftsApi(`gifts/${id}`);
      Object.assign(formGifts, data);
      dialogs.isUpdate = true;
    } catch (error) {
      console.error("Operation failed.");
    }
  };

  // Fetch all gift types
  const fetchAllSelect = async () => {
    try {
      const { data } = await giftsApi("gifts/types");
      giftTypes.value = data;
    } catch (error) {
      console.error("Operation failed.");
    }
  };

  // Delete or lock gift
  const modifyGift = async (id: number, action: "DELETE" | "GET") => {
    try {
      const url = action === "DELETE" ? `gifts/${id}` : `gifts/${id}/lock`;
      await giftsApi(url, action);
      toast(Trans.t("messages.success"), { type: "success" });
      dialogs.isBlock = false;
      fetchGifts();
    } catch (error) {
      console.error("Operation failed.");
    }
  };

  // Remote search method
  const fetchRemoteMethod = async (name?: string) => {
    loading.value = true;
    try {
      const { data } = await giftsApi("routes/points", "GET", { name });
      giftForPoints.value = data;
    } finally {
      loading.value = false;
    }
  };

  return {
    fetchGifts,
    handleGiftAction,
    fetchGiftById,
    fetchAllSelect,
    modifyGift,
    fetchRemoteMethod,
    dialogs,
    formGifts,
    query,
    selectedIdGifts,
    giftTypes,
    gifts,
    giftForPoints,
    loading,
  };
});
