<script setup lang="ts">
import Header from "@/components/main/Header.vue";
import Pagination from "@/components/Pagination/Pagination.vue";
import Trans from "@/i18n/translation";
import { useDilerStore } from "@/store/Dilers/Dilers";
import type { IFormOption, IProduct } from "@/types";
import { resetObject } from "@/utils/utils";
import Block from "@/views/Dynamic/block.vue";
import Table from "@/views/Dynamic/Table.vue";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import type {} from "@/types";
import { requestApi } from "@/api";
import Add from "@/views/Dynamic/add.vue";
import { useDilerProductsStore } from "@/store/Dilers/Products";
const dilerProductsStore = useDilerProductsStore();
const { dilerProducts, formDilerProducts, dialogs, query } =
  storeToRefs(dilerProductsStore);
const { t } = Trans;

interface IDropdowns {
  title: string;
}

const data = computed<IFormOption[]>(() => [
  {
    model: "brand_id",
    label: "product.name_tm",
    type: "select",
  },
  {
    model: "taste_ru",
    label: "product.taste_ru",
    type: "input",
  },
  {
    model: "taste_tm",
    label: "product.taste_tm",
    type: "input",
  },
  {
    model: "product_type_id",
    label: "product.product_type_id",
    type: "select",
  },
  {
    model: "price1",
    label: "product.price",
    type: "number",
    suffixText: Trans.t("currency_man"),
  },
  {
    model: "price2",
    label: "product.price",
    type: "number",
    suffixText: Trans.t("currency_tng"),
  },
]);
const headers = [
  { text: "product.code", value: "code" },
  // { text: "product.name_ru", value: "name_ru" },
  { text: "product.name_tm", value: "name" },
  { text: "product.taste_ru", value: "taste_ru" },
  { text: "product.taste_tm", value: "taste_tm" },

  { text: "product.product_type_id", value: "product_type" },
  { text: "product.price", value: "price" },
  { text: "product.bahasy", value: "block_price" },
  { text: "product.volume", value: "volume" },

  { text: "product.status", value: "status" },
  { text: "product.action", value: "action" },
];

const selectedId = ref();
const clickByRow = (row: IProduct | any, type: string) => {
  if (type === "edit") {
    selectedId.value = row.id;
    dialogs.value.isUpdate = true;
  } else if (type === "block") {
    dialogs.value.isBlock = true;
  }
};

onBeforeMount(() => {
  dilerProductsStore.fetchData("products");
});
const changePage = (page: number) => {
  query.value.pageNumber = page;
  dilerProductsStore.fetchData("products");
};
const changeSize = (size: number) => {
  query.value.pageNumber = 1;
  query.value.pageSize = size;
  dilerProductsStore.fetchData("products");
};
const clearObject = () => {
  resetObject(formDilerProducts.value);
  formDilerProducts.value.price1 = 0;
  formDilerProducts.value.price2 = 0;
};

const dropdowns: IDropdowns[] = [{ title: "edit" }, { title: "block" }];
</script>

<template>
  <div class="border rounded-lg">
    <Header :title="Trans.t('menuItems.productList')">
      <Add
        :data="formDilerProducts"
        :forms="data"
        label="product.add_list"
        @clear-object="clearObject"
        add
        @update-forms="
          dilerProductsStore.handleSubmit('', 'POST', {}, formDilerProducts)
        "
        v-model="dialogs.isAdd"
      />
    </Header>
    <Table
      :headers="headers"
      :rows="dilerProducts"
      :dropdowns="dropdowns"
      @click-by-id="clickByRow"
      height="0"
    >
      <template #dialog="{ row }">
        <Add
          v-if="row.id === selectedId"
          :data="formDilerProducts"
          :forms="data"
          label="update_type"
          @update-forms="
            dilerProductsStore.handleSubmit('', 'PUT', {}, formDilerProducts)
          "
          v-model="dialogs.isUpdate"
        />
        <Block
          v-model="dialogs.isBlock"
          :row="row"
          @submit="
            dilerProductsStore.handleSubmit('', 'DELETE', { id: row.id })
          "
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
