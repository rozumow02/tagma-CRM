<script setup lang="ts">
import { Edit } from "lucide-vue-next";
import HorizontalFilter from "@/components/filter/horizontalFilter.vue";
import CustomTable from "@/components/Table/CustomTable.vue";
import Trans from "@/i18n/translation";
import { ArrowLeft } from "lucide-vue-next";
import {
  useAgentsStore,
  agentPayments,
  allAgentPaymentTypes,
  paymentTotal,
  isAccept,
  isUpdateDialog,
} from "@/store/Trade-team/Agents";
import type { FilterOption, IAgentPayments, IElColumnTable } from "@/types";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatNumber, splitNumber, splitPartNumber } from "@/utils/utils";
import Dialog from "@/components/modal/Dialog.vue";

const {
  FETCH_AGENT_PAYMENT,
  FETCH_AGENT_PAYMENT_TYPES,
  FETCH_AGENT_PAYMENT_CONFIRM,
  FETCH_AGENT_DEBT_UPDATE,
} = useAgentsStore();

const router = useRouter();
const route = useRoute();
const id = computed<number>(() => Number(route.params.id));

const query = reactive({
  paymentTypeId: 0,
  agentId: 0,
  status: false,
});

const formAgentPayment = reactive({
  price1: 0,
  price2: 0,
  agentId: 0,
});
const formAgentPaymentEdit = reactive({
  price1: 0,
  price2: 0,
  paymentId: 0,
});
const ids = ref<number[]>();

const fetch = () => FETCH_AGENT_PAYMENT(query);

onMounted(async () => {
  await FETCH_AGENT_PAYMENT_TYPES();
  if (allAgentPaymentTypes.value.length)
    query.paymentTypeId = allAgentPaymentTypes.value[0].id;
  if (id.value) query.agentId = id.value;
  fetch();
});
const filters = computed<FilterOption[]>(() => [
  {
    type: "select",
    model: "paymentTypeId",
    placeholder: Trans.t("payment_type"),
    options: allAgentPaymentTypes.value,
    clearable: true,
  },
  {
    type: "select",
    model: "status",
    clearable: true,
    placeholder: Trans.t("status"),
    options: [
      { id: true, name: Trans.t("active") },
      { id: false, name: Trans.t("blocked") },
    ],
  },
  {
    type: "input",
    model: "code",
    placeholder: Trans.t("points.code"),
  },
]);
const columns = ref<IElColumnTable[]>([
  { type: "selection", label: "index", prop: "" },
  { label: "agents.code", prop: "code" },
  { label: "point", prop: "trade_point" },
  { label: "sum", prop: "currency" },
  { label: "payment_type", prop: "payment_type" },
  { label: "create_at", prop: "created_at" },
  { label: "action", prop: "action" },
]);
const currentTotal = ref();
const beforeAccept = () => {
  currentTotal.value = multipleSelection.value.reduce(
    (sum, item) => sum + Number(item.currency),
    0,
  );
  const { integerPart, fractionalPart } = splitPartNumber(currentTotal.value);
  formAgentPayment.price1 = integerPart;
  formAgentPayment.price2 = fractionalPart;
  ids.value = multipleSelection.value.map((item) => item.id);
  formAgentPayment.agentId = id.value;
  isAccept.value = true;
};
const multipleSelection = ref<IAgentPayments[]>([]);

const handleSelectionChange = (val: IAgentPayments[]) => {
  multipleSelection.value = val;
};

const beforeEdit = (row: IAgentPayments) => {
  if (row?.currency) {
    const { fractionalPart, integerPart } = splitPartNumber(
      Number(row.currency),
    );
    formAgentPaymentEdit.price1 = integerPart;
    formAgentPaymentEdit.price2 = fractionalPart;
    formAgentPaymentEdit.paymentId = row.id;
  }
  isUpdateDialog.value = true;
};
</script>

<template>
  <div class="border rounded-lg">
    <div class="flex items-center justify-between p-4 border-b">
      <div class="flex items-center space-x-2">
        <button
          class="text-gray-500 hover:bg-gray1 p-2 rounded-lg"
          @click="router.back()"
        >
          <ArrowLeft class="h-6 w-6" />
        </button>
        <h1 class="text-xl font-semibold">
          {{ Trans.t("accept_payment") }}
        </h1>
      </div>
      <Dialog v-model="isAccept" :title="Trans.t('accept_payment')">
        <template #content>
          <el-form :model="formAgentPayment" label-position="top" class="px-4">
            <el-form-item :label="Trans.t('product.price')">
              <el-input-number
                v-model="formAgentPayment.price1"
                :min="0"
                :max="currentTotal"
                controls-position="right"
              />
              <span class="flex items-start justify-end p-2">{{
                Trans.t("currency_man")
              }}</span>
              <el-input-number
                v-model="formAgentPayment.price2"
                :min="0"
                :max="99"
                controls-position="right"
              />
              <span class="flex items-start justify-end p-2">{{
                Trans.t("currency_tng")
              }}</span>
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <el-button
            type="primary"
            @click="FETCH_AGENT_PAYMENT_CONFIRM(formAgentPayment, ids, fetch)"
            >{{ Trans.t("accept") }}</el-button
          >
        </template>
      </Dialog>
      <el-button
        :disabled="!multipleSelection.length"
        type="primary"
        @click="beforeAccept"
        >{{ Trans.t("accept") }}</el-button
      >
    </div>
    <div class="flex items-center justify-between">
      <HorizontalFilter
        :filters="filters"
        :query="query"
        @update-query="FETCH_AGENT_PAYMENT(query)"
      />
      <span class="text-gray3 m-3"
        >{{ Trans.t("total") }}:
        <b
          >{{ formatNumber(paymentTotal) }} {{ Trans.t("currency_man") }}</b
        ></span
      >
    </div>
    <CustomTable
      :columns="columns"
      :data="agentPayments"
      height="500"
      @selection-change="handleSelectionChange"
    >
      <template #currency="{ row }">
        {{ formatNumber(row.currency) }}
      </template>
      <template #action="{ row }">
        <button class="outline-none p-1 text-gray-500" @click="beforeEdit(row)">
          <Edit :size="18" />
        </button>
      </template>
    </CustomTable>
    <Dialog v-model="isUpdateDialog" :title="Trans.t('sum_update')">
      <template #content>
        <el-form
          :model="formAgentPaymentEdit"
          label-position="top"
          class="px-4"
        >
          <el-form-item :label="Trans.t('product.price')">
            <el-input-number
              v-model="formAgentPaymentEdit.price1"
              :min="0"
              :max="currentTotal"
              controls-position="right"
            />
            <span class="flex items-start justify-end p-2">{{
              Trans.t("currency_man")
            }}</span>
            <el-input-number
              v-model="formAgentPaymentEdit.price2"
              :min="0"
              :max="99"
              controls-position="right"
            />
            <span class="flex items-start justify-end p-2">{{
              Trans.t("currency_tng")
            }}</span>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button
          type="primary"
          @click="FETCH_AGENT_DEBT_UPDATE(formAgentPaymentEdit, fetch)"
          >{{ Trans.t("edit") }}</el-button
        >
      </template>
    </Dialog>
  </div>
</template>
