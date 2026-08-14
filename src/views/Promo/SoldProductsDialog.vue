<template>
  <Dialog
    :title="t('promo.sold_products')"
    v-model="dialogModel"
    width="1200"
    :height="700"
    append-to-body
  >
    <template #content>
      <!-- Filters -->
      <div
        class="px-4 pt-4 pb-3 border-b flex flex-wrap gap-3 items-end bg-gray-50"
      >
        <div class="flex flex-col gap-1">
          <el-select
            v-model="soldProductsQuery.product_type_id"
            :placeholder="t('product.product_type_id')"
            clearable
            filterable
            class="!w-44"
          >
            <el-option
              v-for="type in allProductTypes"
              :key="type.id"
              :label="type.name"
              :value="type.id"
            />
          </el-select>
        </div>

        <div class="flex flex-col gap-1">
          <el-select
            v-model="soldProductsQuery.trade_agent_id"
            :placeholder="t('points.trade_agent')"
            clearable
            filterable
            class="!w-44"
          >
            <el-option
              v-for="agent in allAgents"
              :key="agent.id"
              :label="agent.name"
              :value="agent.id"
            />
          </el-select>
        </div>

        <div class="flex flex-col gap-1">
          <el-input-number
            v-model="soldProductsQuery.trade_point_id"
            :min="0"
            :controls="false"
            :placeholder="t('points.code')"
            class="!w-36"
            clearable
          />
        </div>

        <div class="flex flex-col gap-1">
          <el-date-picker
            v-model="soldProductsQuery.start_date"
            type="date"
            :placeholder="t('start_date')"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="!w-40"
          />
        </div>

        <div class="flex flex-col gap-1">
          <el-date-picker
            v-model="soldProductsQuery.end_date"
            type="date"
            :placeholder="t('end_date')"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="!w-40"
          />
        </div>

        <div class="flex gap-2">
          <el-button
            type="primary"
            @click="storePromo.FETCH_SOLD_PRODUCTS()"
            :loading="soldProductsLoading"
          >
            {{ t("search") }}
          </el-button>
          <el-button @click="resetFilters">
            {{ t("clear") }}
          </el-button>
        </div>
      </div>

      <!-- Table -->
      <div class="px-4 py-3">
        <CustomTable
          :data="soldProducts"
          :columns="columns"
          :is-loading="soldProductsLoading"
        >
          <template #name="{ row }"> {{ row.name }} {{ row.taste }} </template>
          <!-- <template #price="{ row }">
            {{ formatNumber(row.price) }}
          </template> -->
          <!-- <template #sale_price="{ row }">
            {{ formatNumber(row.sale_price) }}
          </template> -->
          <template #volume="{ row }">
            {{ row.volume }} {{ t("litr") }}
          </template>
          <!-- <template #promo="{ row }">
            {{ formatPromo(row.promo) }}
          </template> -->
        </CustomTable>

        <!-- Total row -->
        <div
          v-if="soldProducts.length"
          class="flex items-center justify-end mt-2 gap-4 text-sm text-gray-500 border-t pt-2"
        >
          <span
            >{{ t("total") }}:
            <b class="text-text">{{ soldProducts.length }}</b></span
          >
          <span
            >{{ t("total_count") }}:
            <b class="text-text">{{ totalCount }}</b></span
          >
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import Dialog from "@/components/modal/Dialog.vue";
import CustomTable from "@/components/Table/CustomTable.vue";
import { usePromoStore } from "@/store/PromoStore";
import { useFilterStore } from "@/store/Filters";
import { storeToRefs } from "pinia";
import type { IElColumnTable } from "@/types";

const { t } = useI18n();
const storePromo = usePromoStore();
const storeFilter = useFilterStore();
const { soldProducts, soldProductsLoading, soldProductsQuery } =
  storeToRefs(storePromo);
const { allProductTypes, allAgents } = storeToRefs(storeFilter);

interface IProps {
  modelValue: boolean;
}
const props = defineProps<IProps>();
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

// Load select options when dialog opens
watch(
  () => props.modelValue,
  (val) => {
    if (val) storeFilter.FETCH_ALL_SELECT();
  },
  { immediate: true },
);

const dialogModel = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const resetFilters = () => {
  soldProductsQuery.value.product_type_id = null;
  soldProductsQuery.value.trade_agent_id = null;
  soldProductsQuery.value.trade_point_id = null;
  soldProductsQuery.value.start_date = "";
  soldProductsQuery.value.end_date = "";
  storePromo.FETCH_SOLD_PRODUCTS();
};

const formatNumber = (val: number) => {
  if (!val && val !== 0) return "—";
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};

const formatPromo = (val: number) => {
  if (!val || val < 0.0001) return "0";
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 4 }).format(
    val,
  );
};

const totalCount = computed(() =>
  soldProducts.value.reduce((sum, item) => sum + (item.count || 0), 0),
);

const columns = ref<IElColumnTable[]>([
  { label: "code", prop: "code" },
  { label: "name", prop: "name" },
  // { label: "taste", prop: "taste" },
  { label: "promo.product_type", prop: "product_type" },
  { label: "product.volume", prop: "volume" },
  { label: "count", prop: "count" },
  { label: "product.price", prop: "price" },
  { label: "promo.sale_price", prop: "sale_price" },
  { label: "promo.promo_val", prop: "promo" },
]);
</script>
