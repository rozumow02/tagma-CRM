<template>
  <div class="mx-auto border rounded-lg">
    <Header :title="t('menuItems.promo')">
      <AddPromo
        v-model="dialogs.add"
        title="promo.add"
        add
        @submit="storePromo.CREATE_PROMO"
      />
    </Header>
    <Search @search="performSearch" />
    <CustomTable
      @expand-change="expandChange"
      :data="promo"
      :columns="columns"
      :expand-row-keys="expandArray"
      height="calc(100vh - 300px)"
      :cell-class-name="cellClassNameActiveExpand"
    >
      <template #status="{ row }">
        <ElTag :type="row.status ? 'primary' : 'danger'" round>
          {{ row.status ? t("active") : t("blocked") }}:
          {{ formatDate(row.updated_at) }}
        </ElTag>
      </template>
      <template #start="{ row }">
        {{ formatDate(row.start) }}
      </template>
      <template #end="{ row }">
        {{ formatDate(row.end) }}
      </template>
      <template #channel_types="{ row }">
        {{ row.channel_types?.map((item: any) => item.name).join(", ") }}
      </template>
      <template #action="{ row }">
        <el-dropdown popper-class="bg-gray1">
          <button class="outline-none p-1 text-gray-500">
            <Ellipsis />
          </button>
          <template #dropdown>
            <el-dropdown-menu class="p-1 flex flex-col">
              <span
                @click="storePromo.FETCH_PROMO_BY_ID(row)"
                class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
                >{{ t("edit") }}</span
              >
              <span
                @click="() => (dialogs.block = true)"
                class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
              >
                {{ row.status ? t("block") : t("unblock") }}
              </span>
              <AddPromo
                v-if="seldctedPromoId == row.id"
                v-model="dialogs.update"
                title="promo.update"
                @submit="storePromo.UPDATE_PROMO(row.id)"
              >
              </AddPromo>
              <Block
                :row="row"
                v-model="dialogs.block"
                @submit="storePromo.LOCK_PROMO(row.id)"
              />
              <span
                @click="storePromo.OPEN_SOLD_PRODUCTS(row)"
                class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
              >
                {{ t("promo.sold_products") }}
              </span>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template #expand="{ row }">
        <div class="p-6 bg-slate-50">
          <div class="flex items-center justify-center space-x-8">
            <!-- Buy Section -->
            <div class="flex-1 p-4 border rounded-lg bg-white shadow-sm">
              <div class="flex items-center mb-3">
                <ShoppingBasket class="w-6 h-6 mr-2 text-blue-500" />
                <h4 class="font-bold text-lg text-gray-700">
                  {{ Trans.t("buy") }} {{ row.need_count }}
                  {{ Trans.t("items") }}
                </h4>
              </div>
              <p class="text-sm text-gray-500 mb-3">
                {{ Trans.t("buy_text") }}
              </p>
              <div class="flex flex-wrap gap-2">
                <el-tag v-for="id in row.need_ids" :key="id" class="text-base">
                  {{ productMap[id] }}
                </el-tag>
              </div>
            </div>

            <!-- Arrow Separator -->
            <div class="flex-shrink-0">
              <ArrowRight class="w-8 h-8 text-gray-400" />
            </div>

            <!-- Gift Section -->
            <div class="flex-1 p-4 border rounded-lg bg-white shadow-sm">
              <div class="flex items-center mb-3">
                <Gift class="w-6 h-6 mr-2 text-green-500" />
                <h4 class="font-bold text-lg text-gray-700">
                  {{ Trans.t("get") }} {{ row.free_count }}
                  {{ Trans.t("menuItems.gifts") }}
                </h4>
              </div>
              <p class="text-sm text-gray-500 mb-3">
                {{ Trans.t("get_text") }}
              </p>
              <div class="flex flex-wrap gap-2">
                <el-tag
                  type="success"
                  v-for="id in row.free_ids"
                  :key="id"
                  class="text-base"
                >
                  {{ productMap[id] }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
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
  <SoldProductsDialog v-model="dialogs.soldProducts" />
</template>

<script setup lang="ts">
import { Ellipsis, ArrowRight, Gift, ShoppingBasket } from "lucide-vue-next";
import { onBeforeMount, ref, computed } from "vue";
import AddPromo from "@/views/Promo/AddPromo.vue";
import SoldProductsDialog from "@/views/Promo/SoldProductsDialog.vue";
import Search from "@/components/input/Search.vue";
import Pagination from "@/components/Pagination/Pagination.vue";

import Header from "@/components/main/Header.vue";
import { useI18n } from "vue-i18n";
import CustomTable from "@/components/Table/CustomTable.vue";
import type { IAllProduct, IElColumnTable, IPromo } from "@/types";
import Block from "@/views/Dynamic/block.vue";
import { usePromoStore } from "@/store/PromoStore";
import { storeToRefs } from "pinia";
import Trans from "@/i18n/translation";
import { formatDate } from "@/utils/utils";
const storePromo = usePromoStore();
const { dialogs, allProducts, promo, query, seldctedPromoId } =
  storeToRefs(storePromo);

const { t } = useI18n();

const productMap = computed(() => {
  return allProducts.value.reduce((map: any, product: IAllProduct) => {
    map[product.Id] =
      `${product.name}, ${product.taste}, ${product.volume}${Trans.t("litr")}`;
    return map;
  }, {});
});
onBeforeMount(() => {
  performSearch("");
  storePromo.FETCH_ALL_SELECT();
});
const dynamicExpand = ref<boolean>(true);
const expandArray = ref<number[]>([]);

const performSearch = (name: string) => {
  query.value.name = name;
  query.value.pageNumber = 1;
  storePromo.FETCH_PROMO();
};

const changePage = (page: number) => {
  query.value.pageSize = page;
  storePromo.FETCH_PROMO();
};
const columns = ref<IElColumnTable[]>([
  { type: "expand", prop: "", label: "" },
  { label: "name_ru", prop: "name_ru" },
  { label: "name_tm", prop: "name_tm" },
  { label: "promo.channel_type_ids", prop: "channel_types" },
  { label: "start_date", prop: "start" },
  { label: "end_date", prop: "end" },
  { label: "status", prop: "status" },
  { label: "action", prop: "action" },
]);
const expandChange = (value: IPromo) => {
  if (expandArray.value[0] === value.id) {
    expandArray.value = [];
  } else {
    expandArray.value = [value.id];
  }
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
