import { getAllSelectApi, requestApi } from "@/api";
import { useDownloadFile } from "@/composables/useDownloadFile";
import Trans from "@/i18n/translation";
import type {
  IOrderByPayments,
  IOrders,
  IQuery,
  ISelectAll,
  ISelectedOrder,
} from "@/types";
import { ElLoading, ElMessageBox } from "element-plus";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { toast } from "vue3-toastify";
const { downloadFile } = useDownloadFile();

export const query = reactive<IQuery>({
  pageCount: 0,
  pageNumber: 1,
  pageSize: 100,
  cityId: null,
  name: "",
  startDay: null,
  startMonth: null,
  startYear: null,
  endDay: null,
  endMonth: null,
  endYear: null,
  sum: 0,
  paid: 0,
  not_paid: 0,
  start: null,
  end: null,
});

export const isViewOrder = ref(false);

export const allAgents = ref<ISelectAll[]>([]);
export const allCities = ref<ISelectAll[]>([]);
export const allDistricts = ref<ISelectAll[]>([]);
export const allPaymentTypes = ref<ISelectAll[]>([]);

export const selectedOrder = ref<ISelectedOrder[]>([]);
export const orders = ref<IOrders[]>([]);
export const orderByPayments = ref<IOrderByPayments[]>([]);
export const loading = ref(false);

export const useOrdersStore = defineStore("orders", () => {
  const FETCH_ORDERS = async () => {
    loading.value = true;
    try {
      const { data } = await requestApi("orders/page", "GET", query);
      orders.value = data.items;
      query.pageCount = data.pageCount;
      query.total = data.total;
      query.sum = data.sum ?? 0;
      query.paid = data.paid ?? 0;
      query.not_paid = data.not_paid ?? 0;
    } finally {
      loading.value = false;
    }
  };
  const FETCH_ORDER_EXCEL = async () => {
    requestApi("orders/excel", "GET", query, {}, "blob").then((res) => {
      let date = new Date().toLocaleDateString();
      if (res.data)
        downloadFile(res.data, `${Trans.t("menuItems.orders")}-${date}.xlsx`);
    });
  };
  const FETCH_ALL_SELECT = async () => {
    const [agents, cities, paymentTypes] = await Promise.all([
      getAllSelectApi("points/agents"),
      getAllSelectApi("points/cities"),
      getAllSelectApi("payments/types"),
    ]);

    allAgents.value = agents.data;
    allCities.value = cities.data;
    allPaymentTypes.value = paymentTypes.data;
  };
  const FETCH_BY_ORDER = async (id: number) => {
    const loading = ElLoading.service({
      lock: true,
      text: Trans.t("loading"),
      background: "rgba(0, 0, 0, 0.7)",
    });
    await requestApi("orders/list", "GET", { orderId: id })
      .then((res) => {
        if (res.data) {
          selectedOrder.value = res.data.map((item: ISelectedOrder) => {
            if (item.start === "") {
              (item.start = "-"),
                (item.end = "-"),
                (item.discount_price = "-"),
                (item.is_procent = "-");
            }
            return {
              ...item,
            };
          });
        }
        isViewOrder.value = true;
      })
      .finally(() => {
        loading.close();
      });
    requestApi("payments/order", "GET", { orderId: id }).then((res) => {
      orderByPayments.value = res.data;
    });
  };

  // const FETCH_ORDER_ACCEPT = async (id: number) => {
  //   ElMessageBox.confirm("", {
  //     confirmButtonText: Trans.t("close"),
  //     cancelButtonText: Trans.t("discard"),
  //     title: Trans.t("dialog_accept_order"),
  //     confirmButtonClass: "bg-red",
  //     type: "warning",
  //     center: true,
  //   })
  //     .then(() => {
  //       requestApi("orders/close", "GET", { orderId: id }).then(() => {
  //         toast(Trans.t("messages.success"), {
  //           type: "success",
  //         });
  //         isViewOrder.value = false;
  //         FETCH_ORDERS();
  //       });
  //     })
  //     .catch(() => {
  //       // catch error
  //     });
  // };
  return {
    FETCH_ORDERS,
    FETCH_BY_ORDER,
    FETCH_ORDER_EXCEL,
    FETCH_ALL_SELECT,
  };
});
