import { loginApi } from "@/api/auth";
import { DEMO_MODE } from "@/demo/config";
import router from "@/router";
import type { AxiosError } from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import { useUserData } from "./UseAppDataStore";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import Trans from "@/i18n/translation";

export const loading = ref(false);
export const useAuthStore = defineStore("auth", () => {
  const { getUserData, setUserData, clearUserData } = useUserData();
  const userLoggedIn = ref<boolean>(false);

  const FETCH_LOGIN = async (user: object) => {
    loading.value = true;
    try {
      const { data } = await loginApi(user);
      setUserData("TOKEN", data?.token);
      setUserData("ROLE", data?.type);

      userLoggedIn.value = data?.token ? true : false;
      router.replace({ path: "/" });
      // localStorage.setItem("token", data?.token);
    } catch (error: any) {
      toast.error(
        `${error?.response?.data?.message || Trans.t("messages.error")}`,
        {
          position: toast.POSITION.TOP_RIGHT,
        },
      );
    } finally {
      loading.value = false;
    }
  };
  const logout = () => {
    if (DEMO_MODE) return;
    userLoggedIn.value = false;
    clearUserData();
    localStorage.clear();
  };
  return { FETCH_LOGIN, userLoggedIn, logout };
});
