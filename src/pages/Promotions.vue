<template>
  <div class="container mx-auto border rounded-lg">
    <Header :title="t('menuItems.promotions')">
      <AddPromotion
        v-model="dialogs.add"
        title="promotions.add"
        add
        @submit="storePromotions.CREATE_PROMOTIONS"
      />
    </Header>
    <Search @search="performSearch" />
    <CustomTable
      @expand-change="expandChange"
      :data="promotions"
      :columns="columns"
      :expand-row-keys="expandArray"
      height="500"
      :cell-class-name="cellClassNameActiveExpand"
    >
      <template #status="{ row }">
        <ElTag :type="row.status ? 'primary' : 'danger'" round>
          {{ row.status ? t("active") : t("blocked") }}:
          {{ row.updated_at }}
        </ElTag>
      </template>
      <template #action="{ row }">
        <el-dropdown popper-class="bg-gray1">
          <button class="outline-none p-1 text-gray-500">
            <Ellipsis />
          </button>
          <template #dropdown>
            <el-dropdown-menu class="p-1 flex flex-col">
              <span
                @click="storePromotions.FETCH_PROMOTIONS_EDIT_BY_ID(row)"
                class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
                >{{ t("edit") }}</span
              >
              <span
                @click="() => (dialogs.block = true)"
                class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
              >
                {{ row.status ? t("block") : t("unblock") }}
              </span>
              <Add
                :forms="editData"
                :data="formEditPromotions"
                v-model="isEditDialog"
                label="promotions.update"
                @update-forms="storePromotions.FETCH_PROMOTIONS_UPDATE_INFO"
              />
              <Block
                :row="row"
                v-model="dialogs.block"
                @submit="storePromotions.LOCK_PROMOTIONS(row.id)"
              />
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template #expand>
        <CustomTable
          :data="filteredProducts"
          :columns="childColumns"
          :cell-class-name="cellClassName"
          height="100%"
        />
      </template>
    </CustomTable>
  </div>
  <div class="flex justify-between items-center mt-4">
    <Pagination
      v-if="query.pageCount"
      class="mt-4"
      :current-page="query.pageNumber"
      :total-pages="query.pageCount"
      @page-change="changePage"
    />
    <span class="text-gray3"
      >{{ t("total") }}: <b>{{ query.total }}</b></span
    >
  </div>
</template>

<script setup lang="ts">
import { Ellipsis } from "lucide-vue-next";
import { onBeforeMount, onMounted, ref } from "vue";
import AddPromotion from "@/views/Promotions/AddPromotions.vue";
import Search from "@/components/input/Search.vue";
import Pagination from "@/components/Pagination/Pagination.vue";

import Header from "@/components/main/Header.vue";
import { useI18n } from "vue-i18n";
import CustomTable from "@/components/Table/CustomTable.vue";
import type { IAllProduct, IElColumnTable, IPromotions } from "@/types";
import Block from "@/views/Dynamic/block.vue";
import { DISCOUNT_TYPES } from "@/constants";
import { splitNumber } from "@/utils/utils";
import { usePromotionsStore } from "@/store/Promotions";
import { storeToRefs } from "pinia";
import Trans from "@/i18n/translation";
import Add from "@/views/Dynamic/add.vue";
const storePromotions = usePromotionsStore();
const {
  dialogs,
  allProducts,
  formPromotions,
  loading,
  selectedId,
  promotions,
  query,
  editData,
  formEditPromotions,
  isEditDialog,
} = storeToRefs(storePromotions);

const { t } = useI18n();
onBeforeMount(() => {
  performSearch("");
  storePromotions.FETCH_ALL_SELECT();
});
const dynamicExpand = ref<boolean>(true);
const expandArray = ref<number[]>([]);

const performSearch = (name: string) => {
  query.value.name = name;
  query.value.pageNumber = 1;
  storePromotions.FETCH_PROMOTIONS();
};

const changePage = (page: number) => {
  query.value.pageSize = page;
  storePromotions.FETCH_PROMOTIONS();
};
const columns = ref<IElColumnTable[]>([
  { type: "expand", prop: "", label: "" },
  { label: "name_ru", prop: "name_ru" },
  { label: "name_tm", prop: "name_tm" },
  { label: "start_date", prop: "start" },
  { label: "end_date", prop: "end" },
  { label: "create_at", prop: "created_at" },
  { label: "count", prop: "count" },
  { label: "status", prop: "status" },
  { label: "action", prop: "action" },
]);
const childColumns = ref<IElColumnTable[]>([
  { label: "product.name_tm", prop: "name" },
  { label: "product.product_type_id", prop: "product_type_name" },
  { label: "taste", prop: "taste" },
  { label: "product.volume", prop: "volume" },
]);

const filteredProducts = ref<IAllProduct[]>([]);

const expandChange = (value: IPromotions) => {
  if (expandArray.value[0] === value.id) expandArray.value = [];
  else expandArray.value = [value.id];

  filteredProducts.value = allProducts.value.reduce((acc: any[], item) => {
    const matchFirst = value.list.find((item2) => item2 === item.Id);
    if (matchFirst) acc.push(item);
    return acc;
  }, []);

  // filteredProducts.value = allProducts.value.reduce((acc: any[], item) => {
  //     const matchFirst = value.first?.find(
  //         (item2) => item.Id === item2.product_id
  //     );
  //     const matchSecond = value.second?.find(
  //         (item2) => item.Id === item2.product_id
  //     );

  //     if (matchFirst) {
  //         acc.push(getProductDetails(item, matchFirst, "first"));
  //     } else if (matchSecond) {
  //         acc.push(getProductDetails(item, matchSecond, "second"));
  //     }

  //     return acc;
  // }, []);
};

const cellClassName = (row: any, index: number) => {
  if (row.row.topar == "second") {
    return "!bg-gray-100";
  } else {
    return "";
  }
  // return "";
};

const cellClassNameActiveExpand = (row: any, index: number) => {
  if (expandArray.value.includes(row.row.id)) {
    return "!bg-gray-100";
  } else {
    return "";
  }
  // return "";
};
</script>
