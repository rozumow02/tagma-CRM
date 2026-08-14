import { reactive, ref } from "vue";
import { toast } from "vue3-toastify";
import type { IUsers, IFormUsers, IPasswordUsers, IQuery } from "@/types";
import { defineStore } from "pinia";
import { requestApi } from "@/api";
import type { Method, AxiosError } from "axios";
import Trans from "@/i18n/translation";

export const useUserStore = defineStore("user", () => {
  const dialogs = reactive({
    isAdd: false,
    isUpdate: false,
    isBlock: false,
    isPassword: false,
  });

  const formUserPassword = reactive<IPasswordUsers>({
    confirm_password: "",
    password: "",
    user_id: 0,
  });

  const formUser = reactive<IFormUsers>({
    agent_id: null,
    confirm_password: "",
    ekspeditor_id: null,
    id: null,
    name_ru: "",
    name_tm: "",
    password: "",
    type: null,
    username: "",
    merchandiser_id: null,
  });
  const query = reactive<IQuery>({
    pageCount: 0,
    pageNumber: 1,
    pageSize: 50,
  });
  const selectedId = ref();
  const users = ref<IUsers[]>([]);

  const fetchData = async (url: string) => {
    try {
      const { data } = await requestApi(url, "GET", query);
      users.value = data.items;
      query.pageCount = data.pageCount;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (
    url: string,
    method: Method,
    form?: IFormUsers | IPasswordUsers,
  ) => {
    try {
      await requestApi(url, method, {}, form);
      dialogs.isAdd =
        dialogs.isUpdate =
        dialogs.isBlock =
        dialogs.isPassword =
          false;
      fetchData("users");
      toast(`${Trans.t("success")}`, { type: "success" });
    } catch (error: any) {
      console.error(error);
      toast(`${error.response.data.message}`, { type: "error" });
    }
  };

  return {
    users,
    formUser,
    dialogs,
    query,
    selectedId,
    formUserPassword,
    fetchData,
    handleSubmit,
  };
});
