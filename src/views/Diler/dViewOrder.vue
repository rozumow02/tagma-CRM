<template>
  <Dialog
    v-model="dialogs.isdView"
    :title="t('total_order')"
    :footer="false"
    width="1000"
  >
    <template #content>
      <div class="px-5">
        <TwTable
          :rows="byDilerOrders"
          :headers="headers"
          table-height-offset="100"
          class="border rounded-lg border-t-0"
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
        <div class="flex w-full p-5 justify-end">
          <ElButton
            type="primary"
            v-if="row && row?.status === false"
            @click="
              storebyDilerOrders.handleSubmit(`dorders/${row?.id}/lock`, 'GET')
            "
            >{{ Trans.t("confirm") }}</ElButton
          >
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from "@/components/modal/Dialog.vue";
import TwTable from "@/components/Table/TwTable.vue";
import Trans from "@/i18n/translation";
import { useDilerOrdersStore } from "@/store/Dilers/Orders";
import type {
  IByDilerOrders,
  IDilerOrderQuery,
  IDilerOrders,
  IOrders,
} from "@/types";
import { formatNumberCount, splitNumber } from "@/utils/utils";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
const storebyDilerOrders = useDilerOrdersStore();
const { byDilerOrders, dialogs } = storeToRefs(storebyDilerOrders);

const { t } = useI18n();

const props = defineProps<{
  row?: IDilerOrders;
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
const tenneConvertToManat = (tenne: number) => {
  const { remainder, whole } = splitNumber(tenne);
  return `${whole}.${remainder}`;
};
</script>
