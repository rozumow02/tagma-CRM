import { requestApi } from "@/api";
import Trans from "@/i18n/translation";
import type { FilterOption, IFormOption, ISelectAll } from "@/types";
import type { IRemainder } from "@/types/Remainder";
import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";

export const useRemainderStore = defineStore("remainder", () => {
  const remainderData = ref<IRemainder[]>([]);
  const allEkspeditors = ref<ISelectAll[]>([]);

  const loading = ref(false);

  const queryRemainder = reactive({
    name: "",
    ekspeditor_id: null,
  });

  const filterOptions = computed<FilterOption[]>(() => [
    {
      type: "input",
      model: "name",
      placeholder: Trans.t("name"),
    },
    {
      type: "select",
      model: "ekspeditor_id",
      placeholder: Trans.t("ekspeditor"),
      options: allEkspeditors.value,
    },
  ]);

  const getRemainder = async () => {
    loading.value = true;
    try {
      const { data } = await requestApi("ekspeditors/car/galyndy/array", "GET");
      remainderData.value = data;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };
  const FETCH_ALL_SELECT = async () => {
    const [ekspeditors] = await Promise.all([requestApi("agents/ekspeditors")]);
    allEkspeditors.value = ekspeditors.data;
  };
  return {
    remainderData,
    getRemainder,
    FETCH_ALL_SELECT,
    allEkspeditors,
    loading,
    queryRemainder,
    filterOptions,
  };
});
