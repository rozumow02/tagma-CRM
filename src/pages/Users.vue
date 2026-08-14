<script setup lang="ts">
import { requestApi } from "@/api";
import Header from "@/components/main/Header.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
import { USER_TYPES } from "@/constants";
import Trans from "@/i18n/translation";
import { useUserStore } from "@/store/users";
import { resetObject } from "@/utils/utils";
import Add from "@/views/Dynamic/add.vue";
import Block from "@/views/Dynamic/block.vue";
import Table from "@/views/Dynamic/Table.vue";
import { storeToRefs } from "pinia";
import { onBeforeMount, reactive, ref, watch } from "vue";
import type { IFormOption, IUsers, IUserType } from "@/types";
import type { FormRules } from "element-plus";
import { isValidUsername } from "@/utils/validators";

const storeUsers = useUserStore();
const { dialogs, formUser, query, selectedId, users, formUserPassword } =
  storeToRefs(storeUsers);

const headers = ref([
  { text: "index", value: "index" },
  { text: "name_ru", value: "name_ru" },
  { text: "name_tm", value: "name_tm" },
  { text: "username", value: "username" },
  { text: "type", value: "type_name" },
  { text: "create_at", value: "created_at" },
  { text: "status", value: "status" },
  { text: "action", value: "action" },
]);

const passwordData = ref<IFormOption[]>([
  {
    type: "password",
    model: "password",
    label: "password",
  },
  {
    type: "password",
    model: "confirm_password",
    label: "confirm_password",
  },
]);

const orginalData: IFormOption[] = [
  {
    type: "input",
    model: "username",
    label: "username",
  },
  {
    type: "password",
    model: "password",
    label: "password",
  },
  {
    type: "password",
    model: "confirm_password",
    label: "confirm_password",
  },
  {
    type: "select",
    model: "type",
    label: "user_type",
    options: USER_TYPES,
  },
];
const data = ref<IFormOption[]>([...orginalData]);
const dropdowns = ref([
  { title: "edit" },
  { title: "delete" },
  { title: "update_password" },
]);

const filteredData = () => {
  data.value = data.value.filter(
    (item) =>
      ![
        "agent_id",
        "ekspeditor_id",
        "name_ru",
        "name_tm",
        "merchandiser_id",
      ].includes(item.model),
  );
};

const updateDataByType = async (type: string) => {
  // Ma'lumotlarni tozalash
  filteredData();
  // Statik va dinamik ma'lumotlarni qo'shish uchun funksiyalarni ajratish
  const addStaticFields = (fields: IFormOption[]) => {
    data.value.push(...fields);
  };

  const addDynamicFields = async (
    label: string,
    model: string,
    apiUrl: string,
  ) => {
    const response = await requestApi(apiUrl);
    data.value.push({
      type: "select",
      label,
      model,
      options: response.data,
    });
  };

  const typeMapping: Record<string, () => Promise<void>> = {
    admin: async () => {
      addStaticFields([
        { type: "input", label: "name_ru", model: "name_ru" },
        { type: "input", label: "name_tm", model: "name_tm" },
      ]);
    },
    viewer: async () => {
      addStaticFields([
        { type: "input", label: "name_ru", model: "name_ru" },
        { type: "input", label: "name_tm", model: "name_tm" },
      ]);
    },
    agent: async () => {
      await addDynamicFields("points.trade_agent", "agent_id", "points/agents");
    },
    ekspeditor: async () => {
      await addDynamicFields(
        "ekspeditor",
        "ekspeditor_id",
        "agents/ekspeditors",
      );
    },
    merchandiser: async () => {
      await addDynamicFields(
        "merchandiser",
        "merchandiser_id",
        "merchandisers/select",
      );
    },
  };
  // Xaritada tur mavjudligini tekshirish va mos funksiyani chaqirish
  if (type in typeMapping) {
    await typeMapping[type]();
  }
};

watch(
  () => formUser.value.type,
  (newType: IUserType | null) => {
    if (newType) updateDataByType(newType);
  },
);

const clearUser = (add?: string) => {
  if (add) data.value = [...orginalData];

  filteredData();
  resetObject(formUser.value);
};

const changePage = (page: number) => {
  query.value.pageNumber = page;
  storeUsers.fetchData("users");
};

const clickByOption = (row: IUsers, item?: string) => {
  selectedId.value = row.id;
  if (item === "edit") {
    data.value = data.value.filter((item) => item.type !== "password");
    formUser.value.type = row.type;
    formUser.value.username = row.username;
    formUser.value.name_ru = row.name_ru;
    formUser.value.name_tm = row.name_tm;
    formUser.value.agent_id = row.agent_id;
    formUser.value.ekspeditor_id = row.ekspeditor_id;
    formUser.value.merchandiser_id = row.merchandiser_id;
  }
  if (item === "update_password") {
    resetObject(formUserPassword.value);
    formUserPassword.value.user_id = row.id;
  }
  dialogs.value[
    item === "edit" ? "isUpdate" : item === "delete" ? "isBlock" : "isPassword"
  ] = true;
};

onBeforeMount(() => storeUsers.fetchData("users"));
const validateUsername = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error(Trans.t("rules.required")));
  } else {
    if (!isValidUsername(formUser.value.username)) {
      callback(new Error(Trans.t("rules.invalid_username")));
    }
    callback();
  }
};

const userRules = reactive<FormRules<typeof formUser.value>>({
  username: [
    {
      validator: validateUsername,
      trigger: "blur",
    },
  ],
});
</script>

<template>
  <div class="border rounded-lg">
    <Header :title="Trans.t('menuItems.users')">
      <Add
        :data="formUser"
        :forms="data"
        label="users.add"
        :rules="userRules"
        @clear-object="clearUser('add')"
        @update-forms="storeUsers.handleSubmit('users', 'POST', formUser)"
        add
        v-model="dialogs.isAdd"
      />
    </Header>
    <Table
      :headers="headers"
      :rows="users"
      :height="10"
      :dropdowns="dropdowns"
      @click-by-id="clickByOption"
    >
      <template #dialog="{ row }">
        <Add
          v-if="row.id === selectedId"
          v-model="dialogs.isUpdate"
          :data="formUser"
          :forms="data"
          :rules="userRules"
          label="users.update"
          :button="false"
          @update-forms="
            storeUsers.handleSubmit(`users/${row.id}`, 'PUT', formUser)
          "
        />
        <Block
          v-model="dialogs.isBlock"
          dialog-type="delete"
          @submit="storeUsers.handleSubmit(`users/${row.id}`, 'DELETE')"
        />
        <Add
          v-if="row.id === selectedId"
          v-model="dialogs.isPassword"
          :data="formUserPassword"
          :forms="passwordData"
          label="update_password"
          :button="false"
          @update-forms="
            storeUsers.handleSubmit(`users/password`, 'PUT', formUserPassword)
          "
        />
      </template>
    </Table>
  </div>
  <Pagination
    class="mt-4"
    v-if="query.pageCount"
    :pageSizes="[50, 100]"
    :current-page="query.pageNumber"
    :total-pages="query.pageCount"
    @page-change="changePage"
  />
</template>
