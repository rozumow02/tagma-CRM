<template>
  <Dialog
    v-model="isViewOrder"
    :title="t('total_order')"
    :footer="false"
    width="1000"
  >
    <template #content>
      <div class="px-5">
        <TwTable
          :rows="selectedOrder"
          :headers="headers"
          class="border rounded-lg border-t-0 border-b-0"
        >
          <template #index="{ index }">
            {{ index }}
          </template>
          <template #is_procent="{ row }">
            <span v-if="row.coefficient">
              {{
                row.is_procent
                  ? row.coefficient
                  : tenneConvertToManat(row?.coefficient)
              }}
              {{ row.is_procent ? "%" : t("currency_man") }}
            </span>
            <span v-else>-</span>
          </template>
          <template #count="{ row }">
            {{ formatNumberCount(row.count) }}
          </template>
        </TwTable>
        <span class="text-lg flex w-full py-2 justify-end">
          {{ t("total") }}:
          <p class="px-1 font-medium">
            {{ formatNumber(row?.sum || 0) }} {{ Trans.t("currency_man") }}
          </p>
        </span>
        <TwTable
          class="border rounded-lg border-t-0 border-b-0"
          :headers="headerPayment"
          :rows="orderByPayments"
          tableHeightOffset="200"
        >
        </TwTable>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "@/components/modal/Dialog.vue";
import TwTable from "@/components/Table/TwTable.vue";
import Trans from "@/i18n/translation";
import {
  useOrdersStore,
  selectedOrder,
  isViewOrder,
  orderByPayments,
} from "@/store/Orders";
import type { IOrders } from "@/types";
import { formatNumber, formatNumberCount, splitNumber } from "@/utils/utils";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const props = defineProps<{
  row?: IOrders;
  order?: boolean;
}>();

const headers = [
  { text: "index", value: "index" },
  { text: "product.name_tm", value: "name" },
  { text: "contact.view", value: "taste" },
  { text: "product.volume", value: "volume" },
  { text: "count", value: "count" },
  { text: "product.price", value: "price" },
  { text: "discount_percentage", value: "is_procent" },
  { text: "promotion_price", value: "discount_price" },
  { text: "start_discount", value: "start" },
  { text: "end_discount", value: "end" },
];
const headerPayment = [
  { text: "points.trade_agent", value: "trade_agent" },
  { text: "date", value: "created_at" },
  { text: "sum", value: "currency" },
  { text: "payment_type", value: "payment_type" },
];
splitNumber;

const tenneConvertToManat = (tenne: number) => {
  const { remainder, whole } = splitNumber(tenne);
  return `${whole}.${remainder}`;
};
</script>
