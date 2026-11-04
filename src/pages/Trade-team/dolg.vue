<script setup lang="ts">
import HorizontalFilter from "@/components/filter/horizontalFilter.vue";
import InfoItem from "@/components/item/InfoItem.vue";
import Trans from "@/i18n/translation";
import type {
  FilterOption,
  IElColumnTable,
  IFormAgentDebt,
  IFormOption,
} from "@/types";
import { computed, onBeforeMount, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";
import CustomTable from "@/components/Table/CustomTable.vue";
import { Money } from "@element-plus/icons-vue";
import {
  useAgentsStore,
  agentDebt,
  isAccept,
  isCreateDebtDialog,
} from "@/store/Trade-team/Agents";
import { formatNumber, splitPartNumber } from "@/utils/utils";
import Add from "@/views/Dynamic/add.vue";
const router = useRouter();

const { FETCH_AGENT_DEBT, FETCH_AGENT_DEBT_CONFIRM, FETCH_AGENT_DEBT_CREATE } =
  useAgentsStore();
const route = useRoute();
const id = computed<number>(() => Number(route.params.id));

const fetch = () => FETCH_AGENT_DEBT(id.value);
onBeforeMount(() => {
  fetch();
});
const debtAgentData = computed<IFormOption[]>(() => [
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
    valid: true,
    max: 99,
    suffixText: Trans.t("currency_tng"),
  },
]);

const columns = ref<IElColumnTable[]>([
  { type: "index", label: "index", prop: "" },
  { label: "point", prop: "name" },
  { label: "code", prop: "code" },
  { label: "city", prop: "city" },
  { label: "district", prop: "district" },
  { label: "date", prop: "created_at" },
  { label: "sum", prop: "sum" },
  { label: "delivered", prop: "paid" },
  { label: "shortage", prop: "not_paid" },
]);
const formAgentDolg = reactive<IFormAgentDebt>({
  price1: 0,
  price2: 0,
  agentId: 0,
});

const beforeAccept = () => {
  const { integerPart, fractionalPart } = splitPartNumber(agentDebt.self);
  formAgentDolg.price1 = integerPart;
  formAgentDolg.price2 = fractionalPart;
  formAgentDolg.agentId = id.value;
  isAccept.value = true;
};

const beforeAgentCreateDebt = () => {
  formAgentDolg.agentId = id.value;
  formAgentDolg.price1 = 0;
  formAgentDolg.price2 = 0;
  isCreateDebtDialog.value = true;
};
</script>

<template>
  <div class="mx-auto border rounded-lg">
    <div class="flex items-center justify-between p-4 border-b">
      <div class="flex items-center space-x-4">
        <button
          class="text-gray-500 hover:bg-gray1 p-2 rounded-lg"
          @click="router.back()"
        >
          <ArrowLeft class="h-6 w-6" />
        </button>
        <h1 class="text-xl font-semibold">
          {{ Trans.t("zadoljennost") }}
        </h1>
      </div>
      <div>
        <Add
          v-model="isCreateDebtDialog"
          :data="formAgentDolg"
          label="agents.add_debt"
          :forms="debtAgentData"
          customClass="w-[80%] mx-auto gap-4"
          @update-forms="FETCH_AGENT_DEBT_CREATE(formAgentDolg, fetch)"
        />
        <ElButton
          type="primary"
          class="!rounded-md mx-4 p-2"
          size="large"
          @click="beforeAgentCreateDebt"
        >
          <Money
            class="mr-2 h-5 w-5"
            aria-hidden="true"
            focusable="false"
          />
          {{ Trans.t("agents.add_debt") }}
        </ElButton>
        <Dialog v-model="isAccept" :title="Trans.t('accept_dolg')">
          <template #content>
            <el-form :model="formAgentDolg" label-position="top" class="px-4">
              <el-form-item :label="Trans.t('product.price')">
                <el-input-number
                  v-model="formAgentDolg.price1"
                  :min="0"
                  controls-position="right"
                />
                <span class="flex items-start justify-end p-2">{{
                  Trans.t("currency_man")
                }}</span>
                <el-input-number
                  v-model="formAgentDolg.price2"
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
              @click="FETCH_AGENT_DEBT_CONFIRM(formAgentDolg, fetch)"
              type="primary"
              >{{ Trans.t("accept") }}</el-button
            >
          </template>
        </Dialog>
        <el-button type="primary" @click="beforeAccept">{{
          Trans.t("accept_dolg")
        }}</el-button>
      </div>
    </div>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
    >
      <InfoItem
        :label="Trans.t('points.trade_agent')"
        :value="agentDebt.name"
      ></InfoItem>
      <InfoItem
        :label="Trans.t('phone_number')"
        :value="agentDebt.number"
      ></InfoItem>
      <InfoItem
        :label="Trans.t('total')"
        :value="`${formatNumber(agentDebt.sum)} ${Trans.t('currency_man')}`"
      ></InfoItem>
      <InfoItem
        :label="Trans.t('personal_dolg')"
        :class="agentDebt.self >= 0 ? '' : 'text-error'"
        :value="`${formatNumber(agentDebt.self)} ${Trans.t('currency_man')}`"
      ></InfoItem>
      <InfoItem
        :label="Trans.t('transfers')"
        :value="`${formatNumber(agentDebt.transfer)} ${Trans.t('currency_man')}`"
      ></InfoItem>
      <InfoItem
        :label="Trans.t('terminal')"
        :value="`${formatNumber(agentDebt.terminal)} ${Trans.t('currency_man')}`"
      ></InfoItem>
      <InfoItem
        :label="Trans.t('availability')"
        :value="`${formatNumber(agentDebt.cash)} ${Trans.t('currency_man')}`"
      ></InfoItem>
    </div>
    <!-- <div class="border-y">
      <HorizontalFilter :filters="filters" :query="{}"></HorizontalFilter>
    </div> -->
    <CustomTable :columns="columns" :data="agentDebt.list" height="500">
      <template #sum="{ row }">
        {{ formatNumber(row.sum) }}
      </template>
      <template #paid="{ row }">
        {{ formatNumber(row.paid) }}
      </template>
      <template #not_paid="{ row }">
        {{ formatNumber(row.not_paid) }}
      </template>
    </CustomTable>
  </div>
</template>
