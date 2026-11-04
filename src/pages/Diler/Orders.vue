<template>
  <div class="border rounded-lg">
    <Header :title="t('diler_orders')">
      <Add
        add
        v-model="dialogs.isAdd"
        :data="formdOrders"
        :forms="data"
        label="add_order"
        @clear-object="resetObject(formdOrders)"
        @update-forms="beforeAddOrder"
      >
        <template #item>
          <AddProducts
            :products="filteredProducts"
            @update-groups="updatedGroups"
          />
        </template>
      </Add>
    </Header>
    <HorizontalFilter
      @update-query="updateQuery"
      :filters="filters"
      :query="query"
    ></HorizontalFilter>
    <TwTable
      :headers="headers"
      :rows="dilerOrders"
      table-height-offset="100"
      @row-double-click="rowByDOrder"
    >
      <template #index="{ index }">
        {{ index }}
      </template>
      <template #status="{ row }">
        <ElTag :type="row.status ? 'success' : 'danger'" round>
          {{ row.status ? t("confirmed") : t("unconfirmed") }}:
        </ElTag>
      </template>
      <template #is_closed="{ row }">
        <ElTag :type="row.is_closed ? 'success' : 'danger'" round>
          {{ row.is_closed ? t("paid") : t("not_paid") }}:
        </ElTag>
      </template>
      <template #sum="{ row }">
        <div class="whitespace-nowrap">
          {{ formatNumber(row.sum) }} {{ t("currency_man") }}
        </div>
      </template>
      <template #action="{ row }">
        <el-dropdown popper-class="bg-gray1">
          <button class="outline-none p-1 text-gray-500">
            <Ellipsis />
          </button>
          <template #dropdown>
            <el-dropdown-menu class="p-1 flex flex-col">
              <span
                @click="
                  !row.status
                    ? storeDilerOrders.handleSubmit(
                        `dorders/${row?.id}/lock`,
                        'GET',
                      )
                    : null
                "
                :disabled="row.status"
                :class="[
                  'p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1',
                  row.status ? 'opacity-50 cursor-not-allowed' : '',
                ]"
                >{{ t("confirm") }}</span
              >
              <!-- <span
                @click="row.status ? (dialogs.isUpdate = true) : null"
                :disabled="!row.status"
                :class="[
                  'p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1',
                  !row.status ? 'opacity-50 cursor-not-allowed' : '',
                ]"
                >{{ t("ship") }}</span
              > -->
              <span
                @click="!row.status ? beforeEditGroups(row) : null"
                :disabled="row.status"
                :class="[
                  'p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1',
                  row.status ? 'opacity-50 cursor-not-allowed' : '',
                ]"
                class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
                >{{ t("edit") }}</span
              >
              <span
                @click="!row.status ? beforeDelete(row.id) : null"
                :disabled="row.status"
                :class="[
                  'p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1',
                  row.status ? 'opacity-50 cursor-not-allowed' : '',
                ]"
                >{{ t("delete") }}</span
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </TwTable>
    <!--Edit modal  -->
    <Add
      v-model="dialogs.isUpdate"
      :data="formdOrders"
      :forms="data"
      label="update_order"
      @update-forms="beforeAddOrder"
    >
      <template #item>
        <AddProducts
          :products="filteredProducts"
          :preserve-counts="true"
          @update-groups="updatedGroups"
        />
      </template>
    </Add>
    <!-- View double click Order Modal  -->
    <DViewOrder :row="selectedRowDOrder" />
  </div>

  <div class="flex justify-between items-center mt-6">
    <ElPagination
      v-model:current-page="queryBydOrders.pageNumber"
      v-model:page-size="queryBydOrders.pageSize"
      :prev-text="t('pagination.previous')"
      :next-text="t('pagination.next')"
      popper-class="!bg-gray1 !m-0"
      layout="prev, pager, next, sizes"
      :total="queryBydOrders.pageCount * queryBydOrders.pageSize"
      :page-count="queryBydOrders.pageCount"
      class="!text-gray3 !font-medium"
      :page-sizes="[10, 50, 100, 200, 300, 400, 500, 2000]"
      :default-page-size="queryBydOrders.pageNumber"
      background
      @current-change="changePage"
      @size-change="changeSize"
    />

    <div class="ml-10 w-full flex justify-end space-x-16">
      <span class="text-gray3"
        >{{ t("total_sum_orders") }}:
        <b>
          {{ formatNumber(totalSumOrders) }} {{ Trans.t("currency_man") }}</b
        ></span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = Trans;
import { Ellipsis } from "lucide-vue-next";
import { computed, onBeforeMount, reactive, ref } from "vue";
import type {
  FilterOption,
  IDilerOrders,
  IFilteredProducts,
  IFormOption,
} from "@/types";
import HorizontalFilter from "@/components/filter/horizontalFilter.vue";
import Trans from "@/i18n/translation";
import { useRoute, useRouter } from "vue-router";
import TwTable from "@/components/Table/TwTable.vue";
import { formatNumber, getDateParts, resetObject } from "@/utils/utils";
import { useDilerOrdersStore } from "@/store/Dilers/Orders";
import { storeToRefs } from "pinia";
import Header from "@/components/main/Header.vue";
import Add from "@/views/Dynamic/add.vue";
import AddProducts from "@/views/Diler/AddProducts.vue";
import { useDilerStore } from "@/store/Dilers/Dilers";
import DViewOrder from "@/views/Diler/dViewOrder.vue";
import { ElMessageBox } from "element-plus";
import { requestApi } from "@/api";
import { toast } from "vue3-toastify";
const storeDilerOrders = useDilerOrdersStore();
const storeDiler = useDilerStore();
const { allDilers } = storeToRefs(storeDiler);

const {
  dialogs,
  filteredProducts,
  dilerOrders,
  totalSumOrders,
  byDilerOrders,
  query: queryBydOrders,
} = storeToRefs(storeDilerOrders);

const headers = [
  { text: "index", value: "index" },
  { text: "diler", value: "dealer" },
  { text: "create_at", value: "created_at" },
  { text: "paid", value: "is_closed" },
  { text: "sum", value: "sum", align: "center", width: "100" },
  { text: "date_of_shipment", value: "completed_date", align: "center" },
  { text: "payment_date", value: "paid_date", align: "center" },
  { text: "status", value: "status" },
  { text: "action", value: "action" },
] as Array<{
  text: string;
  value: string;
  align?: "center" | "right" | "left";
  width?: string;
}>;

const filters = computed<FilterOption[]>(() => [
  {
    model: "dealerId",
    type: "select",
    options: allDilers.value,
    placeholder: Trans.t("diler"),
  },
  {
    model: "start",
    type: "date",
    placeholder: Trans.t("start_date"),
  },
  {
    model: "end",
    type: "date",
    placeholder: Trans.t("end_date"),
  },
]);

interface IFilter {
  start?: string | null;
  end?: string | null;
  dealerId?: number | null;
  [key: string]: any;
}
const query = reactive<IFilter>({
  start: null,
  end: null,
  dealerId: null,
});
const route = useRoute();
onBeforeMount(() => {
  storeDilerOrders.fetchData("dorders");
  storeDilerOrders.fetchAllProducts();
  storeDiler.fetchAllDilers();
});

const updateQuery = (key: keyof IFilter, value: any) => {
  query[key] = value;
  const updateDateParts = (dateKey: "start" | "end", targetObject: any) => {
    const dateValue = query[dateKey];
    if (dateValue) {
      const { day, month, year } = getDateParts(dateValue);
      targetObject[`${dateKey}Day`] = day;
      targetObject[`${dateKey}Month`] = month;
      targetObject[`${dateKey}Year`] = year;
    } else {
      delete targetObject[`${dateKey}Day`];
      delete targetObject[`${dateKey}Month`];
      delete targetObject[`${dateKey}Year`];
    }
  };

  // Update start and end date parts
  updateDateParts("start", queryBydOrders.value);
  updateDateParts("end", queryBydOrders.value);
  if (query?.dealerId) queryBydOrders.value.dealerId = query.dealerId;
  else delete queryBydOrders.value.dealerId;

  storeDilerOrders.fetchData("dorders");
};

const formdOrders = reactive<{
  dealerId: number | null;
  dealerOrderId?: number | null;
}>({
  dealerId: null,
});

const data = computed<IFormOption[]>(() => [
  {
    type: "select",
    model: "dealerId",
    options: allDilers.value,
    label: "diler",
  },
]);

const updatedGroups = (value: IFilteredProducts) => {
  filteredProducts.value.forEach((item) => {
    if (item.group_id === value.group_id) {
      item.count = value.count;
    }
  });
};

const editGroups = (value: IFilteredProducts) => {
};

const beforeEditGroups = (row: IDilerOrders | any) => {
  storeDilerOrders.fetchByDilerOrder(row.id).then(() => {
    dialogs.value.isUpdate = true;
    formdOrders.dealerId = row.dealer_id;
    formdOrders.dealerOrderId = row.id;
    const countsByProductId = new Map<number, number>();
    byDilerOrders.value.forEach((item: any) => {
      const productId = Number(item.product_id);

      if (!Number.isFinite(productId)) return;
      const count = Number(item.count) || 0;
      countsByProductId.set(
        productId,
        (countsByProductId.get(productId) || 0) + count,
      );
    });
    filteredProducts.value.forEach((product) => {
      product.count = countsByProductId.get(product.id) || 0;
    });
  });
};

const selectedRowDOrder = ref<IDilerOrders>();
const rowByDOrder = (row: IDilerOrders) => {
  selectedRowDOrder.value = row;
  storeDilerOrders.fetchByDilerOrder(row.id);
  dialogs.value.isdView = true;
};

const clearObject = () => {};

const beforeAddOrder = () => {
  const selectedProducts = filteredProducts.value
    .filter((item) => item.count) // Faqat count bor obyektlarni filtrlaymiz
    .map((item) => ({
      id: item.id,
      count: item.count,
    }));

  if (dialogs.value.isAdd) {
    storeDilerOrders.handleSubmit(
      `dorders/save`,
      "POST",
      {
        dealerId: formdOrders.dealerId,
      },
      selectedProducts,
    );
    return;
  }
  if (dialogs.value.isUpdate) {
    storeDilerOrders.handleSubmit(
      `dorders/update`,
      "POST",
      {
        dealerOrderId: formdOrders.dealerOrderId,
      },
      selectedProducts,
    );
    return;
  }
};
const beforeDelete = (id: number) => {
  ElMessageBox.confirm("", {
    confirmButtonText: Trans.t("yes"),
    cancelButtonText: Trans.t("no"),
    title: Trans.t("dialog_delete"),
    confirmButtonClass: "bg-red",
    type: "warning",
    center: true,
  })
    .then(() => {
      requestApi("dorders", "DELETE", { id }).then(() => {
        toast(t("messages.success"), {
          type: "success",
        });
        storeDilerOrders.fetchData("dorders");
      });
    })
    .catch(() => {
      // catch error
    });
};
// const beforeShip = (id: number) => {
//   dialogs.value.isUpdate = true;
//   ElMessageBox.confirm("", {
//     confirmButtonText: Trans.t("yes"),
//     cancelButtonText: Trans.t("discard"),
//     title: Trans.t("dialog_ship_accept"),
//     confirmButtonClass: "bg-red",
//     type: "warning",
//     center: true,
//   })
//     .then(() => {
//       requestApi("dorders/complete", "GET", { id }).then(() => {
//         toast("Успешно", {
//           type: "success",
//         });
//         dialogs.value.isUpdate = false;
//         storeDilerOrders.fetchData("dorders");
//       });
//     })
//     .catch(() => {
//       // catch error
//     });
// };

const changePage = async (page: number) => {
  query.pageNumber = page;
  await storeDilerOrders.fetchData("dorders");
};

const changeSize = async (size: number) => {
  query.pageNumber = 1;
  query.pageSize = size;
  await storeDilerOrders.fetchData("dorders");
};
</script>
