import Trans from "@/i18n/translation";
import { defineStore } from "pinia";
import { ElLoading } from "element-plus";
import { reactive, ref, type Ref } from "vue";
import { toast } from "vue3-toastify";
import type { IChannels, IChannelsForm } from "@/types";
import { channelsApi } from "@/api/channel";
import {
  CONTROL,
  MAGNITUDE,
  STRUCTURE,
  TYPE,
  type ITRADE_CHANNELS,
} from "@/constants";

export const isBlockDialog = ref(false);
export const isUpdateDialog = ref(false);
export const isAddDialog = ref(false);
export const isActiveDialog = ref<ITRADE_CHANNELS>("type");

export const formChannels = reactive<IChannelsForm>({
  name_ru: "",
  name_tm: "",
});

export const selectedId = ref();
export const types = ref<IChannels[]>([]);
export const sizes = ref<IChannels[]>([]);
export const structures = ref<IChannels[]>([]);
export const managments = ref<IChannels[]>([]);

const virtualPush = (value: ITRADE_CHANNELS) => {
  if (value === TYPE) {
    types.value.unshift({ ...formChannels });
  } else if (value === MAGNITUDE) {
    sizes.value.unshift({ ...formChannels });
  } else if (value === STRUCTURE) {
    structures.value.unshift({ ...formChannels });
  } else if (value === CONTROL) {
    managments.value.unshift({ ...formChannels });
  }
};

export const useSettingChannelsStore = defineStore("settingChannels", () => {
  const FETCH_CHANNELS_GROUP = async () => {
    const [type, control, magnitude, structure] = await Promise.all([
      channelsApi(`channels/${TYPE}s`),
      channelsApi(`channels/${CONTROL}s`),
      channelsApi(`channels/${MAGNITUDE}s`),
      channelsApi(`channels/${STRUCTURE}s`),
    ]);
    types.value = type.data;
    managments.value = control.data;
    sizes.value = magnitude.data;
    structures.value = structure.data;
  };

  const FETCH_CHANNELS_CREATE = async (value: ITRADE_CHANNELS) => {
    channelsApi(`channels/${value}s`, "POST", {}, formChannels).then(() => {
      virtualPush(value);
      isAddDialog.value = false;
    });
  };

  const FETCH_CHANNELS_UPDATE = async () => {
    channelsApi(
      `channels/${isActiveDialog.value}s/${selectedId.value}`,
      "PUT",
      {},
      formChannels,
    ).then(() => {
      virtualPush(isActiveDialog.value);
      isUpdateDialog.value = false;
      toast(Trans.t("messages.success"), {
        type: "success",
      });
    });
  };

  const FETCH_CHANNELS_DELETE = async () => {
    channelsApi(
      `channels/${isActiveDialog.value}s/${selectedId.value}`,
      "DELETE",
    ).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_CHANNELS_GROUP();
    });
  };
  const FETCH_CHANNELS_BY_ID = (row: IChannels, channel: ITRADE_CHANNELS) => {
    formChannels.name_ru = row.name_ru;
    formChannels.name_tm = row.name_tm;
    selectedId.value = row.id;
    isActiveDialog.value = channel;
    isUpdateDialog.value = true;
  };

  return {
    FETCH_CHANNELS_GROUP,
    FETCH_CHANNELS_UPDATE,
    FETCH_CHANNELS_DELETE,
    FETCH_CHANNELS_CREATE,
    FETCH_CHANNELS_BY_ID,
  };
});
