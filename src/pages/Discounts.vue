<template>
  <div class="mx-auto border rounded-lg">
    <Header :title="t('menuItems.discounts')">
      <AddDiscounts
        v-model="isAddDialog"
        title="discounts.add"
        add
        @submit="FETCH_DISCOUNTS_CREATE"
      />
    </Header>
    <Search @search="performSearch" />
    <CustomTable
      @expand-change="expandChange"
      :data="discounts"
      :columns="columns"
      @page-change="FETCH_DISCOUNTS"
      @size-change="FETCH_DISCOUNTS"
      :expand-row-keys="expandArray"
      :query="query"
      :cell-class-name="cellClassNameActiveExpand"
    >
      <template #is_procent="{ row }">
        <span>{{ row.is_procent ? "%" : t("currency_man") }}</span>
      </template>
      <template #is_direct="{ row }">
        <span class="!whitespace-nowrap"
          >{{
            row.is_direct ? DISCOUNT_TYPES[0].name : DISCOUNT_TYPES[1].name
          }}
          - {{ row.is_group ? t("group") : t("single") }}
        </span>
      </template>
      <template #status="{ row }">
        <ElTag :type="row.status ? 'primary' : 'danger'" round>
          {{ row.status ? t("active") : t("blocked") }}:
          {{ row.updated_at }}
        </ElTag>
      </template>
      <template #trade_agents="{ row }">
        <div v-if="row?.trade_agents && row?.trade_agents?.length">
          <div v-for="item in row.trade_agents" :key="item.id">
            {{ item.name }},
          </div>
        </div>
        <div v-else>-</div>
      </template>
      <template #action="{ row }">
        <el-dropdown popper-class="bg-gray1">
          <button class="outline-none p-1 text-gray-500">
            <Ellipsis />
          </button>
          <template #dropdown>
            <el-dropdown-menu class="p-1 flex flex-col">
              <span
                @click="FETCH_DISCOUNTS_EDIT_BY_ID(row)"
                class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
                >{{ t("edit") }}</span
              >
              <span
                @click="() => (isBlockDialog = true)"
                class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
              >
                {{ row.status ? t("block") : t("unblock") }}
              </span>
              <span
                @click="() => (isDeleteDialog = true)"
                class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
              >
                {{ t("delete") }}
              </span>

              <Block
                v-model="isBlockDialog"
                @submit="FETCH_DISCOUNTS_LOCK(row.id)"
                :row="row"
              />

              <Block
                v-model="isDeleteDialog"
                @submit="FETCH_DISCOUNTS_DELETE(row.id)"
                :row="row"
                dialog-type="delete"
              />
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template #channel_types="{ row }">
        <div v-for="item in row.channel_types" :key="item.id">
          {{ item.name }},
        </div>
      </template>
      <template #is_increase="{ row }">
        <el-button type="success" link :icon="Check" v-if="row?.is_increase" />
        <el-button link type="danger" :icon="Close" v-else="row?.is_increase" />
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
    <Add
      :forms="editData"
      :data="formEditDiscounts"
      v-model="isUpdateDialog"
      label="discounts.update"
      @update-forms="FETCH_DISCOUNTS_UPDATE_INFO"
    />
  </div>
</template>

<script setup lang="ts">
import { Ellipsis } from "lucide-vue-next";
import { onBeforeMount, onMounted, ref } from "vue";
import AddDiscounts from "@/views/Discounts/AddDiscount.vue";
import Search from "@/components/input/Search.vue";
import {
  useDiscountsStore,
  query,
  discounts,
  allProducts,
  isAddDialog,
  isUpdateDialog,
  isBlockDialog,
  isDeleteDialog,
  selectedIdDiscout,
  formEditDiscounts,
} from "@/store/Discounts";
import Header from "@/components/main/Header.vue";
import { useI18n } from "vue-i18n";
import CustomTable from "@/components/Table/CustomTable.vue";
import type { IAllProduct, IElColumnTable, IDiscounts } from "@/types";
import Block from "@/views/Dynamic/block.vue";
import { DISCOUNT_TYPES } from "@/constants";
import { splitNumber } from "@/utils/utils";
import Add from "@/views/Dynamic/add.vue";
import Trans from "@/i18n/translation";
import { storeToRefs } from "pinia";
import { Check, Close } from "@element-plus/icons-vue";
const {
  FETCH_DISCOUNTS,
  FETCH_ALL_SELECT,
  FETCH_DISCOUNTS_UPDATE,
  FETCH_DISCOUNTS_CREATE,
  FETCH_DISCOUNTS_BY_ID,
  FETCH_DISCOUNTS_LOCK,
  FETCH_DISCOUNTS_UPDATE_INFO,
  FETCH_DISCOUNTS_EDIT_BY_ID,
  FETCH_DISCOUNTS_DELETE,
} = useDiscountsStore();
const storeDiscount = useDiscountsStore();
const { editData } = storeToRefs(storeDiscount);
const { t } = useI18n();
onBeforeMount(() => {
  performSearch("");
  FETCH_ALL_SELECT();
});
const dynamicExpand = ref<boolean>(true);
const expandArray = ref<number[]>([]);

const performSearch = (name: string) => {
  query.name = name;
  query.pageNumber = 1;
  FETCH_DISCOUNTS();
};

const changePage = (page: number) => {
  query.pageNumber = page;
  FETCH_DISCOUNTS();
};
const columns = ref<IElColumnTable[]>([
  { type: "expand", prop: "", label: "" },
  { label: "sort_order", prop: "sort_order" },
  { label: "name", prop: "name_ru" },
  // { label: "name_tm", prop: "name_tm" },
  { label: "points.trade_channel_type", prop: "channel_types" },
  { label: "points.trade_agent", prop: "trade_agents" },
  { label: "start_date", prop: "start" },
  { label: "end_date", prop: "end" },
  { label: "discounts.type", prop: "is_direct", width: "100" },
  { label: "percentage", prop: "is_procent" },
  { label: "adding_price", prop: "is_increase" },
  { label: "status", prop: "status" },
  { label: "action", prop: "action" },
]);
const childColumns = ref<IElColumnTable[]>([
  { label: "product.name_tm", prop: "name" },
  { label: "product.product_type_id", prop: "product_type_name" },
  { label: "taste", prop: "taste" },
  { label: "count", prop: "count" },
  { label: "coefficient", prop: "coefficient" },
  { label: "product.volume", prop: "volume" },
]);

const filteredProducts = ref<IAllProduct[]>([]);

const expandChange = (value: IDiscounts) => {
  if (expandArray.value[0] === value.id) expandArray.value = [];
  else expandArray.value = [value.id];

  const getProductDetails = (item: any, match: any, topar: string) => ({
    ...item,
    count: match.count,
    coefficient: `${value.is_procent ? match.coefficient + "%" : splitNumber(match.coefficient).whole + t("currency_man") + splitNumber(match.coefficient).remainder + t("currency_tng")} `,
    topar,
  });
  filteredProducts.value = allProducts.value.reduce((acc: any[], item) => {
    const matchFirst = value.first?.find(
      (item2) => item.Id === item2.product_id,
    );
    const matchSecond = value.second?.find(
      (item2) => item.Id === item2.product_id,
    );

    if (matchFirst) {
      acc.push(getProductDetails(item, matchFirst, "first"));
    } else if (matchSecond) {
      acc.push(getProductDetails(item, matchSecond, "second"));
    }

    return acc;
  }, []);
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
