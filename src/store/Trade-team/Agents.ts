import { defineStore } from "pinia";
import { ElLoading, ElMessageBox } from "element-plus";
import { reactive, ref, type Ref } from "vue";
import { toast } from "vue3-toastify";
import type {
  IAgentDebt,
  IAgentPayments,
  IAgents,
  IAgentsForm,
  IFormAgentDebt,
  IQuery,
  ISelectAll,
} from "@/types";
import {
  agentsDeleteApi,
  agentsPostApi,
  agentsGetApi,
  agentsPutApi,
  agentsGetByIdApi,
  agentsLockApi,
  getAllSelectApi,
} from "@/api/Trade-team/agents";
import { requestApi } from "@/api";
import Trans from "@/i18n/translation";
import { useDownloadFile } from "@/composables/useDownloadFile";
import { formatNumber } from "@/utils/utils";
const { downloadFile } = useDownloadFile();

export const isBlockDialog = ref(false);
export const isUpdateDialog = ref(false);
export const isCreateDebtDialog = ref(false);
export const isAddDialog = ref(false);
export const isAccept = ref(false);

export const formAgents = reactive<IAgentsForm>({
  name_ru: "",
  name_tm: "",
  status: true,
  driver_ids: [],
  ekspeditor_ids: [],
  merchandiser_ids: [],
  number: "",
});

export const query = reactive<IQuery>({
  pageCount: 0,
  pageNumber: 1,
  pageSize: 50,
});

export const agentForDrivers = ref<ISelectAll[]>([]);
export const agentForEkspeditors = ref<ISelectAll[]>([]);
export const agentForMerchandisers = ref<ISelectAll[]>([]);
export const agents = ref<IAgents[]>([]);

export const agentDebt = reactive<IAgentDebt>({
  name: "",
  list: [],
  number: 0,
  sum: 0,
  cash: 0,
  self: 0,
  terminal: 0,
  transfer: 0,
});

export const allAgentPaymentTypes = ref<ISelectAll[]>([]);
export const agentPayments = ref<IAgentPayments[]>([]);
export const paymentTotal = ref<number>(0);

export const selectedId = ref();

export const useAgentsStore = defineStore("agents", () => {
  const FETCH_AGENTS = async () => {
    try {
      const { data } = await agentsGetApi(query);
      agents.value = data.items;
      query.pageCount = data.pageCount;
    } catch (error) {
      console.log(error);
    }
  };

  const FETCH_AGENTS_CREATE = async () => {
    await agentsPostApi(formAgents).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isAddDialog.value = false;
      FETCH_AGENTS();
    });
  };

  const FETCH_AGENTS_UPDATE = async (id: number) => {
    await agentsPutApi(formAgents, id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isUpdateDialog.value = false;
      FETCH_AGENTS();
    });
  };

  const FETCH_AGENTS_DELETE = async (id: number) => {
    agentsDeleteApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_AGENTS();
    });
  };

  const FETCH_AGENTS_LOCK = async (id: number) => {
    agentsLockApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_AGENTS();
    });
  };

  const FETCH_AGENTS_BY_ID = async (id: number) => {
    // const loading = ElLoading.service({
    //   lock: true,
    //   text: "Loading",
    //   background: "rgba(0, 0, 0, 0.7)",
    // });
    selectedId.value = id;
    await agentsGetByIdApi(id).then((res) => {
      formAgents.name_ru = res.data.name_ru;
      formAgents.name_tm = res.data.name_tm;
      formAgents.status = res.data.status;
      formAgents.number = res.data.number;
      formAgents.driver_ids = res.data.drivers.map(
        (driver: { id: number; name: string }) => driver.id,
      );
      formAgents.ekspeditor_ids = res.data.ekspeditors.map(
        (ekspeditor: { id: number; name: string }) => ekspeditor.id,
      );
      if (res.data.merchandisers && res.data.merchandisers.length > 0)
        formAgents.merchandiser_ids = res.data.merchandisers.map(
          (merchandiser: { id: number; name: string }) => merchandiser.id,
        );
      else formAgents.merchandiser_ids = [];
      isUpdateDialog.value = true;
    });
    // .finally(() => loading.close())
  };

  const FETCH_ALL_SELECT = async () => {
    const [driver, ekspeditor, merchandiser] = await Promise.all([
      getAllSelectApi("drivers"),
      getAllSelectApi("ekspeditors"),
      requestApi("merchandisers/select"),
    ]);
    agentForDrivers.value = driver.data;
    agentForEkspeditors.value = ekspeditor.data;
    agentForMerchandisers.value = merchandiser.data;
  };
  const FETCH_AGENTS_EXCEL = async () => {
    requestApi("agents/excel", "GET", query, {}, "blob").then((res) => {
      let date = new Date().toLocaleDateString();
      if (res.data)
        downloadFile(res.data, `${Trans.t("agents.title")}-${date}.xlsx`);
    });
  };

  const FETCH_AGENT_DEBT = async (agentId: number) => {
    try {
      const { data } = await requestApi(`agents/debt?agentId=${agentId}`);
      const debt = data as IAgentDebt;
      agentDebt.list = debt.list;
      agentDebt.name = debt.name;
      agentDebt.number = debt.number;
      agentDebt.sum = debt.sum;
      agentDebt.cash = debt.cash;
      agentDebt.self = debt.self;
      agentDebt.terminal = debt.terminal;
      agentDebt.transfer = debt.transfer;
    } catch (error) {
      console.error(error);
    }
  };

  const FETCH_AGENT_PAYMENT = async (params: object) => {
    try {
      const { data } = await requestApi("payments/list", "GET", params);
      const payments = data as IAgentPayments[];
      paymentTotal.value = payments.reduce(
        (sum, item) => sum + Number(item.currency),
        0,
      );
      agentPayments.value = payments.map((item) => {
        return {
          ...item,
        };
      });
    } catch (error) {
      console.error(error);
    }
  };

  const FETCH_AGENT_PAYMENT_TYPES = async () => {
    try {
      const { data } = await requestApi("payments/types");
      allAgentPaymentTypes.value = data;
    } catch (error) {
      console.error(error);
    }
  };
  const FETCH_AGENT_PAYMENT_CONFIRM = async (
    params: object,
    ids: number[] = [],
    refetch: () => void,
  ) => {
    ElMessageBox.confirm("", {
      confirmButtonText: Trans.t("confirm"),
      cancelButtonText: Trans.t("discard"),
      title: Trans.t("dialog_ship_accept"),
      confirmButtonClass: "bg-red",
      type: "info",
      center: true,
    })
      .then(async () => {
        try {
          await requestApi("payments/confirm", "POST", params, ids);
          toast(Trans.t("messages.success"), {
            type: "success",
          });
          isAccept.value = false;
          refetch();
        } catch (error) {
          console.error(error);
        }
      })
      .catch(() => {
        // catch error
      });
  };
  const FETCH_AGENT_DEBT_CONFIRM = async (
    params: object,
    refetch: () => void,
  ) => {
    ElMessageBox.confirm("", {
      confirmButtonText: Trans.t("confirm"),
      cancelButtonText: Trans.t("discard"),
      title: Trans.t("dialog_ship_accept"),
      confirmButtonClass: "bg-red",
      type: "info",
      center: true,
    })
      .then(async () => {
        try {
          await requestApi("payments/debt", "GET", params);
          toast(Trans.t("messages.success"), {
            type: "success",
          });
          isAccept.value = false;
          refetch();
        } catch (error) {
          console.error(error);
        }
      })
      .catch(() => {
        // catch error
      });
  };
  const FETCH_AGENT_DEBT_UPDATE = async (
    params: object,
    refetch: () => void,
  ) => {
    ElMessageBox.confirm("", {
      confirmButtonText: Trans.t("confirm"),
      cancelButtonText: Trans.t("discard"),
      title: Trans.t("dialog_ship_accept"),
      confirmButtonClass: "bg-red",
      type: "info",
      center: true,
    })
      .then(async () => {
        try {
          await requestApi("payments/update", "GET", params);
          toast(Trans.t("messages.success"), {
            type: "success",
          });
          isUpdateDialog.value = false;
          refetch();
        } catch (error) {
          console.error(error);
        }
      })
      .catch(() => {
        // catch error
      });
  };
  const FETCH_AGENT_DEBT_CREATE = async (
    params: IFormAgentDebt,
    refetch: () => void,
  ) => {
    ElMessageBox.confirm("", {
      confirmButtonText: Trans.t("confirm"),
      cancelButtonText: Trans.t("discard"),
      title: Trans.t("dialog_ship_accept"),
      confirmButtonClass: "bg-red",
      type: "info",
      center: true,
    })
      .then(async () => {
        try {
          await requestApi("payments/add_debt", "GET", params);
          toast(Trans.t("messages.success"), {
            type: "success",
          });
          isCreateDebtDialog.value = false;
          refetch();
        } catch (error) {
          console.error(error);
        }
      })
      .catch(() => {
        // catch error
      });
  };

  return {
    FETCH_AGENTS,
    FETCH_AGENTS_UPDATE,
    FETCH_AGENTS_DELETE,
    FETCH_AGENTS_LOCK,
    FETCH_AGENTS_CREATE,
    FETCH_AGENTS_BY_ID,
    FETCH_ALL_SELECT,
    FETCH_AGENTS_EXCEL,
    FETCH_AGENT_DEBT,
    FETCH_AGENT_PAYMENT,
    FETCH_AGENT_PAYMENT_TYPES,
    FETCH_AGENT_PAYMENT_CONFIRM,
    FETCH_AGENT_DEBT_CONFIRM,
    FETCH_AGENT_DEBT_UPDATE,
    FETCH_AGENT_DEBT_CREATE,
  };
});
