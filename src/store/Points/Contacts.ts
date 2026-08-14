import Trans from "@/i18n/translation";
import { defineStore } from "pinia";
import { ElLoading } from "element-plus";
import { reactive, ref, type Ref } from "vue";
import { toast } from "vue3-toastify";
import type { IContacts, IContactsForm, IQuery, ISelectAll } from "@/types";
import {
  contactsDeleteApi,
  contactsPostApi,
  contactsGetApi,
  contactsPutApi,
  contactsGetByIdApi,
  contactsLockApi,
  getAllSelectApi,
} from "@/api/Point/contact";

export const isBlockDialog = ref(false);
export const isUpdateDialog = ref(false);
export const isAddDialog = ref(false);

export const formContacts = reactive<IContactsForm>({
  name_ru: "",
  name_tm: "",
  number: "",
  kind_id: 0,
  post_id: 0,
  trade_point_id: 0,
  uprs_ids: [],
});

export const contactForKinds = ref<ISelectAll[]>([]);
export const contactForPosts = ref<ISelectAll[]>([]);
export const contactForUprs = ref<ISelectAll[]>([]);
export const contacts = ref<IContacts[]>([]);

export const selectedIdContact = ref();

export const useContactsStore = defineStore("contacts", () => {
  const FETCH_CONTACTS = async (id?: number) => {
    if (id) formContacts.trade_point_id = id;
    // const loading = ElLoading.service({
    //   lock: true,
    //   text: "Loading",
    //   background: "rgba(0, 0, 0, 0.7)",
    // });
    try {
      const { data } = await contactsGetApi({
        id: formContacts.trade_point_id,
      });
      contacts.value = data == null ? [] : data;
    } catch (error) {
      console.log(error);
    } finally {
      // loading.close();
    }
  };

  const FETCH_CONTACTS_CREATE = async () => {
    await contactsPostApi(formContacts).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isAddDialog.value = false;
      FETCH_CONTACTS();
    });
  };

  const FETCH_CONTACTS_UPDATE = async (id: number) => {
    await contactsPutApi(formContacts, id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isUpdateDialog.value = false;
      FETCH_CONTACTS();
    });
  };

  const FETCH_CONTACTS_DELETE = async (id: number) => {
    contactsDeleteApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_CONTACTS();
    });
  };

  const FETCH_CONTACTS_LOCK = async (id: number) => {
    contactsLockApi(id).then(() => {
      toast(Trans.t("messages.success"), {
        type: "success",
      });
      isBlockDialog.value = false;
      FETCH_CONTACTS();
    });
  };

  const FETCH_CONTACTS_BY_ID = async (id: number) => {
    const loading = ElLoading.service({
      lock: true,
      text: "Loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    selectedIdContact.value = id;
    await contactsGetByIdApi(id)
      .then((res) => {
        formContacts.name_ru = res.data.name_ru;
        formContacts.name_tm = res.data.name_tm;
        formContacts.kind_id = res.data.kind_id;
        formContacts.number = res.data.number;
        formContacts.post_id = res.data.post_id;
        formContacts.trade_point_id = res.data.trade_point_id;
        formContacts.uprs_ids = res.data.uprs.map(
          (upr: { id: number }) => upr.id,
        );
        isUpdateDialog.value = true;
      })
      .finally(() => loading.close());
  };

  const FETCH_ALL_SELECT = async () => {
    const [kinds, posts, uprs] = await Promise.all([
      getAllSelectApi("kinds"),
      getAllSelectApi("posts"),
      getAllSelectApi("uprs"),
    ]);
    contactForKinds.value = kinds.data;
    contactForPosts.value = posts.data;
    contactForUprs.value = uprs.data;
  };

  return {
    FETCH_CONTACTS,
    FETCH_CONTACTS_UPDATE,
    FETCH_CONTACTS_DELETE,
    FETCH_CONTACTS_LOCK,
    FETCH_CONTACTS_CREATE,
    FETCH_CONTACTS_BY_ID,
    FETCH_ALL_SELECT,
  };
});
