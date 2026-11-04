<template>
  <div class="w-full">
    <Header :title="t('general.view_point')">
      <template #default>
        <Add
          v-model="isPointDebtDialog"
          :data="formPointDebt"
          label="points.add_point_debt"
          :forms="debtData"
          customClass="w-[80%] mx-auto gap-4"
          @update-forms="FETCH_POINTS_DEBT_CREATE"
        />
        <ElButton
          type="primary"
          class="!rounded-md p-2"
          size="large"
          v-permission="[isAdmin]"
          @click="beforePointDebt"
        >
          <Money
            class="mr-2 h-5 w-5"
            aria-hidden="true"
            focusable="false"
          />
          {{ t("add_debt") }}
        </ElButton>
        <ElButton
          type="primary"
          class="!rounded-md mx-2 p-2"
          size="large"
          v-permission="[isAdmin]"
          @click="beforeUpdateDays"
        >
          <CalendarPlus class="mr-2" :size="18" />
          {{ t("edit_day") }}
        </ElButton>
        <Dialog width="700" :title="t('edit_week_text')" v-model="isUpdateDays">
          <template #content>
            <el-form :model="formDays" label-position="top" class="px-8 py-4">
              <el-form-item :label="t('week_day')">
                <ElSelect
                  placeholder=""
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                  :max-collapse-tags="3"
                  v-model="formDays.input"
                  class="mb-2 font-medium text-text"
                >
                  <ElOption
                    v-for="day in routeForDays"
                    :key="day.id"
                    :value="day.id"
                    :label="day.name"
                  >
                  </ElOption>
                </ElSelect>
              </el-form-item>
            </el-form>
          </template>
          <template #footer>
            <el-button
              size="large"
              type="primary"
              @click="
                FETCH_POINTS_DAYS_UPDATE(
                  Number(route.params.id),
                  formDays.input,
                )
              "
            >
              {{ t("save_changes") }}
            </el-button>
          </template>
        </Dialog>
        <ElButton
          type="primary"
          class="!rounded-md p-2"
          size="large"
          v-permission="[isAdmin]"
          @click="FETCH_POINTS_BY_ID(Number(route.params.id))"
        >
          <PencilLine class="mr-2" :size="18" />
          {{ t("edit") }}
        </ElButton>
        <Dialog
          :title="t('points.update')"
          v-model="isUpdateDialog"
          width="1000"
        >
          <template #content>
            <el-form :model="formPoints" label-position="top" class="px-8">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item :label="t('city')">
                    <MySelect
                      v-model="formPoints.city_id"
                      :options="pointForCities"
                      value-key="id"
                      label-key="name"
                      class-name="w-full"
                    />
                  </el-form-item>
                  <el-form-item :label="t('district')">
                    <MySelect
                      v-model="formPoints.district_id"
                      :options="pointForDistricts"
                      :key="pointForDistricts.length"
                      value-key="id"
                      label-key="name"
                      class-name="w-full"
                    />
                  </el-form-item>
                  <el-form-item :label="t('points.trade_agent')">
                    <MySelect
                      v-model="formPoints.trade_agent_id"
                      :options="pointForAgents"
                      value-key="id"
                      label-key="name"
                      class-name="w-full"
                    />
                  </el-form-item>
                  <el-form-item :label="t('ekspeditors.title')">
                    <ElSelect
                      placeholder=""
                      class="mb-2 font-medium text-text"
                      v-model="formPoints.ekspeditor_id"
                    >
                      <ElOption
                        v-for="item in routeForEkspeditors"
                        :value="item.id"
                        :label="item.name"
                        :key="item.id"
                      >
                      </ElOption>
                    </ElSelect>
                  </el-form-item>

                  <el-form-item :label="t('name_ru')">
                    <InputField v-model="formPoints.name_ru" />
                  </el-form-item>
                  <el-form-item :label="t('name_tm')">
                    <InputField v-model="formPoints.name_tm" />
                  </el-form-item>

                  <!-- <Upload v-model="formPoints.images" class="mt-2" /> -->
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="t('week_day')">
                    <ElSelect
                      placeholder=""
                      v-model="formPoints.day_id"
                      class="mb-2 font-medium text-text"
                    >
                      <ElOption
                        v-for="day in routeForDays"
                        :key="day.id"
                        :value="day.id"
                        :label="day.name"
                      >
                      </ElOption>
                    </ElSelect>
                  </el-form-item>
                  <el-form-item :label="t('location_name_ru')">
                    <InputField v-model="formPoints.location_ru" />
                  </el-form-item>
                  <el-form-item :label="t('location_name_tm')">
                    <InputField v-model="formPoints.location_tm" />
                  </el-form-item>
                  <el-form-item :label="t('orientir_name_ru')">
                    <InputField v-model="formPoints.orientir_ru" />
                  </el-form-item>
                  <el-form-item :label="t('orientir_name_tm')">
                    <InputField v-model="formPoints.orientir_tm" />
                  </el-form-item>
                  <el-form-item :label="t('points.trade_channel_type')">
                    <MySelect
                      v-model="formPoints.trade_channel_id"
                      :options="pointForChannels"
                      value-key="id"
                      label-key="name"
                      class-name="w-full"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
          <template #footer>
            <el-button
              :disabled="
                !formPoints.name_ru ||
                !formPoints.name_tm ||
                !formPoints.city_id ||
                !formPoints.location_ru ||
                !formPoints.location_tm ||
                !formPoints.orientir_ru ||
                !formPoints.orientir_tm ||
                !formPoints.trade_agent_id ||
                !formPoints.trade_channel_id
              "
              size="large"
              :type="
                formPoints.name_ru &&
                formPoints.name_tm &&
                formPoints.city_id &&
                formPoints.location_ru &&
                formPoints.location_tm &&
                formPoints.orientir_ru &&
                formPoints.orientir_tm &&
                formPoints.trade_agent_id &&
                formPoints.trade_channel_id
                  ? 'primary'
                  : ''
              "
              @click="FETCH_POINTS_UPDATE(Number(route.params.id))"
            >
              {{ t("save_changes") }}
            </el-button>
          </template>
        </Dialog>
      </template>
    </Header>
    <!-- <div class="flex justify-end border-b pb-4 px-4"> -->
    <!-- </div>  -->

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
    >
      <InfoItem :label="`${t('code')}:`" :value="byIdGenerals?.code" />
      <InfoItem :label="`${t('city')}:`" :value="byIdGenerals?.city" />
      <InfoItem :label="`${t('district')}:`" :value="byIdGenerals?.district" />
      <InfoItem :label="`${t('location')}:`" :value="byIdGenerals?.location" />
      <InfoItem :label="`${t('orientir')}:`" :value="byIdGenerals?.orientir" />

      <InfoItem :label="`${t('name')}:`" :value="byIdGenerals?.name" />
      <InfoItem
        :label="`${t('points.trade_channel_type')}:`"
        :value="byIdGenerals?.trade_channel"
      />
      <InfoItem
        :label="`${t('points.trade_category')}:`"
        :value="byIdGenerals?.trade_category"
      />
      <InfoItem
        :label="`${t('points.trade_agent')}:`"
        :value="byIdGenerals?.trade_agent"
      />
      <InfoItem
        :label="`${t('ekspeditor')}:`"
        :value="byIdGenerals?.ekspeditor"
      />
      <InfoItem :label="`${t('week_day')}:`" :value="formattedDays()" />
      <InfoItem
        :label="t('debts_amount')"
        :value="`${formatNumber(byIdGenerals?.debt)} ${t('currency_man')}`"
      >
      </InfoItem>
      <InfoItem
        :label="t('transfers')"
        :value="`${formatNumber(byIdGenerals?.transfer)} ${t('currency_man')}`"
      >
      </InfoItem>
      <InfoItem
        :label="t('terminal')"
        :value="`${formatNumber(byIdGenerals?.terminal)} ${t('currency_man')}`"
      >
      </InfoItem>
      <InfoItem
        :label="t('availability')"
        :value="`${formatNumber(byIdGenerals?.cash)} ${t('currency_man')}`"
      >
      </InfoItem>

      <!-- <InfoItem
        :label="`${t('total_goods_turnover')}:`"
        :value="byIdGenerals?.oborot"
      />
      <InfoItem :label="`${t('total_debt')}:`" :value="byIdGenerals?.dolg" /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { requestApi } from "@/api";
import { Money } from "@element-plus/icons-vue";
import InfoItem from "@/components/item/InfoItem.vue";
import Header from "@/components/main/Header.vue";
import Trans from "@/i18n/translation";
import {
  usePointsStore,
  formPoints,
  isUpdateDialog,
  pointForCities,
  pointForChannels,
  pointForAgents,
  routeForDays,
  routeForEkspeditors,
  isUpdateDays,
  formPointDebt,
  isPointDebtDialog,
  allPaymentTypes,
} from "@/store/Point";
import { useProsmotrStore, byIdGenerals } from "@/store/Points/Prosmotr";
import { useUserData } from "@/store/UseAppDataStore";
import type { IFormOption } from "@/types";
import { formatNumber, resetObject } from "@/utils/utils";
import { ElOption } from "element-plus";
import { computed, onMounted, reactive, ref, watch } from "vue";
const { FETCH_POINTS_BY_ID, FETCH_ALL_SELECT, FETCH_POINTS_DEBT_CREATE } =
  usePointsStore();
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
const { t } = useI18n();
import Add from "../Dynamic/add.vue";
import Dialog from "@/components/modal/Dialog.vue";
import { CalendarPlus, PencilLine } from "lucide-vue-next";
const { getUserData } = useUserData();
const isAdmin = computed(() => getUserData("ROLE"));

const tradePointid = computed(() => Number(route.params.id));

const { FETCH_POINTS_UPDATE, FETCH_POINTS_DAYS_UPDATE } = useProsmotrStore();
const route = useRoute();
onMounted(FETCH_ALL_SELECT);
const forDistricts = ref([]);
const pointForDistricts = computed({
  get: () => forDistricts.value,
  set: (value) => (forDistricts.value = value),
});
watch(
  () => formPoints.city_id,
  (newValue) => {
    requestApi("points/districts", "GET", { cityId: newValue }).then((res) => {
      pointForDistricts.value = res.data;
    });
  },
);

const formattedDays = () => {
  if (byIdGenerals.value?.weekExtraDays)
    return byIdGenerals.value?.weekExtraDays
      .map((num) => Trans.t(`days.${num}`))
      .join(" ");
  else return "";
};

const formDays = reactive<{ input: number[] }>({
  input: [],
});

const beforeUpdateDays = () => {
  formDays.input = byIdGenerals.value?.weekExtraDays || [];
  isUpdateDays.value = true;
};

const beforePointDebt = () => {
  isPointDebtDialog.value = true;
  formPointDebt.id = tradePointid.value;
};

const debtData = computed<IFormOption[]>(() => [
  {
    type: "select",
    model: "paymentTypeId",
    label: Trans.t("payment_type"),
    options: allPaymentTypes.value,
    clearable: true,
  },
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
</script>
