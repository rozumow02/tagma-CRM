import Trans from "@/i18n/translation";
import { DEMO_MODE } from "@/demo/config";
import router from "@/router";
import { useUserData } from "@/store/UseAppDataStore";
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  AxiosAdapter,
} from "axios";
import axios from "axios";
import { toast } from "vue3-toastify";

const demoOnlyAdapter: AxiosAdapter = async config =>
  (await import("@/demo/adapter")).demoAdapter(config);

const service: AxiosInstance = axios.create(
  DEMO_MODE
    ? { adapter: demoOnlyAdapter }
    : { baseURL: import.meta.env.VITE_APP_BASE_URL },
);
// Request interceptor
service.interceptors.request.use(
  (config) => {
    if (DEMO_MODE) {
      // Enforce isolation even if an individual call supplies an adapter/base URL.
      config.adapter = demoOnlyAdapter;
      config.baseURL = undefined;
      config.auth = undefined;
      config.withCredentials = false;
      config.headers.delete("Authorization");
      config.headers["language"] = Trans.currentLocale ?? "ru";
      return config;
    }
    const { getUserData } = useUserData();
    // You can modify the request configuration here if needed
    config.headers["language"] = Trans.currentLocale ?? "ru";
    config.headers["Authorization"] = "Bearer " + getUserData("TOKEN");
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // Check if the response status is within the successful range
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      return Promise.reject(response);
    }
  },
  (error: AxiosError) => {
    // if(error.code  == "ERR_NETWORK") router.replace("/login");

    // Handle response errors
    if (error.response) {
      if (error.response.status >= 400) {
        const errorMessage =
          (error.response.data as { message?: string })?.message ||
          `Error: ${error.response.status}`;
        toast.error(errorMessage, {
          position: toast.POSITION.TOP_RIGHT,
        });
        if (error.response.status == 401) router.replace("/login");
      }
    } else if (!error.response) {
      toast.error("Network Error", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    return Promise.reject(error);
  },
);

export default service;
