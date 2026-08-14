import { defineStore } from "pinia";
import { ElLoading } from "element-plus";
import { reactive, ref, type Ref } from "vue";
import { toast } from "vue3-toastify";
import type { IQuery, ICategories, ICategoriesForm } from "@/types";
import {
  categoriesDeleteApi,
  categoriesGetApi,
  categoriesGetByIdApi,
  categoriesLockApi,
  categoriesPostApi,
  categoriesPutApi,
} from "@/api/categories";
import Trans from "@/i18n/translation";
const { t } = Trans;

export const isBlockDialog = ref(false);
export const isUpdateDialog = ref(false);
export const isAddDialog = ref(false);

export const formCategories = reactive<ICategoriesForm>({
  // name_ru: "",
  name: "",
  status: true,
  max_sum: 0,
  min_sum: 0,
});

export const query = reactive<IQuery>({
  pageCount: 0,
  pageNumber: 1,
  pageSize: 10,
});

export const selectedId = ref();

export const categories = ref<ICategories[]>([]);

export const useCategoriesStore = defineStore("categories", () => {
  const FETCH_CATEGORIES = async () => {
    try {
      const { data } = await categoriesGetApi(query);
      categories.value = data.items ? data.items : [];
      query.pageCount = data.pageCount;
    } catch (error) {
      console.log(error);
    }
  };

  const FETCH_CATEGORIES_CREATE = async () => {
    await categoriesPostApi(formCategories).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isAddDialog.value = false;
      FETCH_CATEGORIES();
    });
  };

  const FETCH_CATEGORIES_UPDATE = async (id: number) => {
    await categoriesPutApi(formCategories, id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isUpdateDialog.value = false;
      FETCH_CATEGORIES();
    });
  };

  // const FETCH_CATEGORIES_DELETE = async (id: number) => {
  //   categoriesDeleteApi(id).then(() => {
  //     toast("", {
  //       type: "success",
  //     });
  //     isBlockDialog.value = false;
  //     FETCH_CATEGORIES();
  //   });
  // };

  const FETCH_CATEGORIES_LOCK = async (id: number) => {
    categoriesLockApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
        delay: 1000,
      });
      isBlockDialog.value = false;
      FETCH_CATEGORIES();
    });
  };

  const FETCH_CATEGORIES_BY_ID = async (id: number) => {
    // const loading = ElLoading.service({
    //   lock: true,
    //   text: t("loading"),
    //   background: "rgba(0, 0, 0, 0.7)",
    // });
    selectedId.value = id;
    await categoriesGetByIdApi(id).then((res) => {
      // formCategories.name_ru = res.data.name_ru;
      formCategories.name = res.data.name_ru;
      formCategories.min_sum = res.data.min_sum;
      formCategories.max_sum = res.data.max_sum;
      formCategories.status = res.data.status;
      isUpdateDialog.value = true;
      // loading.close();
    });
  };

  return {
    FETCH_CATEGORIES,
    FETCH_CATEGORIES_UPDATE,
    FETCH_CATEGORIES_LOCK,
    FETCH_CATEGORIES_CREATE,
    FETCH_CATEGORIES_BY_ID,
  };
});
