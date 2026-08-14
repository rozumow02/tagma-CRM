<script setup lang="ts">
import Header from "@/components/main/Header.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
import Trans from "@/i18n/translation";
import { useDilerStore } from "@/store/Dilers/Dilers";
import type { IDiler, IFormOption, ISelectAll } from "@/types";
import { resetObject } from "@/utils/utils";
import Block from "@/views/Dynamic/block.vue";
import Table from "@/views/Dynamic/Table.vue";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, reactive, ref } from "vue";
import type {} from "@/types";
import { requestApi } from "@/api";
import Add from "@/views/Dynamic/add.vue";
const dilerStore = useDilerStore();
const { dilers, formDiler, dialogs, query } = storeToRefs(dilerStore);
const { t } = Trans;

const formDilerTopUp = reactive({
  price1: 0,
  price2: 0,
});

const allCities = ref<ISelectAll[]>([]);
onBeforeMount(() => {
  dilerStore.fetchData("dealer");
  requestApi("points/cities").then((res) => (allCities.value = res.data));
});
interface IDropdowns {
  title: string;
}

const accountData = computed<IFormOption[]>(() => [
  {
    model: "price1",
    label: "currency_man",
    type: "number",
    suffixText: Trans.t("currency_man"),
  },
  {
    model: "price2",
    label: "currency_tng",
    type: "number",
    suffixText: Trans.t("currency_tng"),
    max: 99,
    valid: true,
  },
]);

const data = computed<IFormOption[]>(() => [
  {
    model: "name_ru",
    label: "name_ru",
    type: "input",
  },
  {
    model: "name_tm",
    label: "name_tm",
    type: "input",
  },
  {
    model: "address_ru",
    label: "address_ru",
    type: "input",
  },
  {
    model: "address_tm",
    label: "address_tm",
    type: "input",
  },
  {
    model: "company",
    label: "company",
    type: "input",
  },
  {
    model: "phone_number",
    label: "phone_number",
    type: "input",
  },
  {
    model: "city_id",
    label: "city",
    type: "select",
    options: allCities.value,
  },
  {
    model: "email",
    label: "email",
    type: "input",
  },
]);

const headers = [
  { text: "name_ru", value: "name_ru" },
  { text: "name_tm", value: "name_tm" },
  { text: "email", value: "email" },
  { text: "address_ru", value: "address_ru" },
  { text: "address_tm", value: "address_tm" },
  { text: "city", value: "city" },
  { text: "company", value: "company" },
  { text: "phone_number", value: "phone_number" },
  { text: "date_of_replenishment", value: "updated_at" },
  { text: "shipments", value: "debt", align: "right" },
  { text: "paid", value: "account", align: "right" },
  { text: "balans", value: "total", align: "right" },
  { text: "status", value: "status" },
  { text: "action", value: "action" },
];

const selectedId = ref();
const clickByRow = (row: IDiler, type?: string) => {
  selectedId.value = row.id;
  if (type === "edit") {
    dialogs.value.isUpdate = true;
    const { id, city, account, created_at, debt, ...filteredRow } = row;
    Object.assign(formDiler.value, filteredRow);
  } else if (type === "block") {
    dialogs.value.isBlock = true;
  } else if (type === "top_up_account") {
    dialogs.value.isAccount = true;
  }
};
const changePage = (page: number) => {
  query.value.pageNumber = page;
  dilerStore.fetchData("dealer");
};
const changeSize = (size: number) => {
  query.value.pageNumber = 1;
  query.value.pageSize = size;
  dilerStore.fetchData("dealer");
};
const dropdowns: IDropdowns[] = [
  { title: "edit" },
  { title: "block" },
  { title: "top_up_account" },
];

const beforeTopUpAccount = (row: IDiler | any) => {
  const formData = new FormData();
  if (row) formData.append("dealerId", String(row.id));
  formData.append("price1", String(formDilerTopUp.price1));
  formData.append("price2", String(formDilerTopUp.price2));

  dilerStore.handleSubmit(`dealer/topup`, "POST", {}, formData);
};

const clearObject = () => {
  formDilerTopUp.price1 = 0;
  formDilerTopUp.price2 = 0;
};
</script>

<template>
  <div class="border rounded-lg">
    <Header :title="Trans.t('menuItems.dilers')">
      <Add
        :data="formDiler"
        :forms="data"
        label="dilers.add"
        @clear-object="resetObject(formDiler)"
        add
        @update-forms="dilerStore.handleSubmit('dealer', 'POST', {}, formDiler)"
        v-model="dialogs.isAdd"
      />
    </Header>
    <Table
      :headers="headers"
      :rows="dilers"
      :dropdowns="dropdowns"
      @click-by-id="clickByRow"
      height="50"
    >
      <template #dialog="{ row }">
        <Add
          v-if="row.id === selectedId"
          :data="formDiler"
          :forms="data"
          label="dilers.update"
          @update-forms="
            dilerStore.handleSubmit(`dealer/${row.id}`, 'PUT', {}, formDiler)
          "
          v-model="dialogs.isUpdate"
        />
        <Add
          v-if="row.id === selectedId"
          :data="formDilerTopUp"
          :forms="accountData"
          width="400"
          :button="false"
          add
          @clear-object="clearObject"
          label="top_up_account"
          @update-forms="beforeTopUpAccount(row)"
          v-model="dialogs.isAccount"
        />
        <Block
          v-if="row.id === selectedId"
          v-model="dialogs.isBlock"
          :row="row"
          :append-to-body="true"
          @submit="dilerStore.handleSubmit(`dealer/${row.id}/lock`, 'GET')"
        />
      </template>
    </Table>
  </div>
  <div class="flex items-center justify-between mt-6">
    <ElPagination
      v-model:current-page="query.pageNumber"
      v-model:page-size="query.pageSize"
      :prev-text="t('pagination.previous')"
      :next-text="t('pagination.next')"
      popper-class="!bg-gray1 !m-0"
      layout="prev, pager, next, sizes"
      :total="query.pageCount * query.pageSize"
      :page-count="query.pageCount"
      class="!text-gray3 !font-medium"
      :page-sizes="[10, 50, 100, 200, 300, 400, 500]"
      :default-page-size="query.pageNumber"
      background
      @current-change="changePage"
      @size-change="changeSize"
    />
    <span class="text-gray3"
      >{{ t("total") }}: <b>{{ query.total }}</b></span
    >
  </div>
</template>
