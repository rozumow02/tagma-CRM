import Trans from "@/i18n/translation";
import { defineStore } from "pinia";
import { reactive, ref, type Ref } from "vue";
import { toast } from "vue3-toastify";
import type {
  IQuery,
  IChannelsGroup,
  IChannelsFormGroup,
  ISelectAll,
} from "@/types";
import {
  channelsGetApi,
  channelsLockApi,
  channelsPostApi,
  channelsPutApi,
} from "@/api/channel";
import {
  CONTROL,
  MAGNITUDE,
  STRUCTURE,
  TYPE,
  type ITRADE_CHANNELS,
} from "@/constants";
import { getAllSelectApi } from "@/api";

export const isBlockDialog = ref(false);
export const isUpdateDialog = ref(false);
export const isAddDialog = ref(false);

export const formChannelsGroup = reactive<IChannelsFormGroup>({
  management_id: 0,
  size_id: 0,
  status: true,
  structure_id: 0,
  type_id: 0,
});

export const query = reactive<IQuery>({
  pageCount: 0,
  pageNumber: 1,
  pageSize: 10,
});

export const channels = ref<IChannelsGroup[]>([]);

export const allTypes = ref<ISelectAll[]>([]);
export const allSizes = ref<ISelectAll[]>([]);
export const allStructures = ref<ISelectAll[]>([]);
export const allManagments = ref<ISelectAll[]>([]);

export const useChannelsStore = defineStore("channels", () => {
  const FETCH_CHANNELS = async () => {
    try {
      const { data } = await channelsGetApi(query);
      channels.value = data.items;
      query.pageCount = data.pageCount;
    } catch (error) {
      console.log(error);
    }
  };

  const FETCH_CHANNELS_CREATE = async (value: ITRADE_CHANNELS) => {
    console.log(value, formChannelsGroup);
  };
  const FETCH_CHANNELS_CONNECT_GROUP = async () => {
    await channelsPostApi(formChannelsGroup).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isAddDialog.value = false;
      FETCH_CHANNELS();
    });
  };

  const FETCH_CHANNELS_UPDATE = async (id: number) => {
    await channelsPutApi(formChannelsGroup, id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isUpdateDialog.value = false;
      FETCH_CHANNELS();
    });
  };

  const FETCH_CHANNELS_LOCK = async (id: number) => {
    channelsLockApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_CHANNELS();
    });
  };
  const FETCH_CHANNELS_BY_ID = (row: any) => {
    formChannelsGroup.management_id = row.management_id;
    formChannelsGroup.size_id = row.size_id;
    formChannelsGroup.status = row.status;
    formChannelsGroup.structure_id = row.structure_id;
    formChannelsGroup.type_id = row.type_id;
    isUpdateDialog.value = true;
  };
  const FETCH_ALL_SELECT = async () => {
    const [type, control, magnitude, structure] = await Promise.all([
      getAllSelectApi(`channels/${TYPE}`),
      getAllSelectApi(`channels/${CONTROL}`),
      getAllSelectApi(`channels/${MAGNITUDE}`),
      getAllSelectApi(`channels/${STRUCTURE}`),
    ]);
    allTypes.value = type.data;
    allManagments.value = control.data;
    allSizes.value = magnitude.data;
    allStructures.value = structure.data;
  };

  return {
    FETCH_CHANNELS,
    FETCH_CHANNELS_UPDATE,
    FETCH_CHANNELS_LOCK,
    FETCH_CHANNELS_CREATE,
    FETCH_ALL_SELECT,
    FETCH_CHANNELS_BY_ID,
    FETCH_CHANNELS_CONNECT_GROUP,
  };
});
