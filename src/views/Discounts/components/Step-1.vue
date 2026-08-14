<script setup lang="ts">
import { DISCOUNT_TYPES } from "@/constants";
import {
  allChannelTypes,
  formDiscounts,
  step,
  useDiscountsStore,
  loadingPoints,
} from "@/store/Discounts";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
const { FETCH_POINTS_BY_AGENT } = useDiscountsStore();
import type { CheckboxValueType } from "element-plus";
import Trans from "@/i18n/translation";
import { storeToRefs } from "pinia";
import InputNumber from "@/components/input/InputNumber.vue";
const storeDiscount = useDiscountsStore();
const { allAgents, pointsByAgent } = storeToRefs(storeDiscount);

const checkAll = ref(false);
const indeterminate = ref(false);

const beforeFetchPoints = (id: number) => {
  FETCH_POINTS_BY_AGENT(id).then(() => {
    handleCheckAll(true);
  });
};

watch(
  () => formDiscounts.trade_point_ids,
  (val) => {
    if (val.length === 0) {
      checkAll.value = false;
      indeterminate.value = false;
    } else if (val.length === pointsByAgent.value.length) {
      checkAll.value = true;
      indeterminate.value = false;
    } else {
      indeterminate.value = true;
    }
  },
);

const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false;
  if (val) {
    formDiscounts.trade_point_ids = pointsByAgent.value.map((_) => _.id);
  } else {
    formDiscounts.trade_point_ids = [];
  }
};

const { t } = useI18n();
</script>
<template>
  <el-form
    :model="formDiscounts"
    label-position="top"
    class="px-4"
    v-if="step === 1"
  >
    <el-form-item :label="t('name')">
      <InputField v-model="formDiscounts.name_ru" />
    </el-form-item>
    <!-- <el-form-item :label="t('name_tm')">
      <InputField v-model="formDiscounts.name_tm" />
    </el-form-item> -->
    <el-form-item :label="t('points.trade_channel_type')">
      <el-select
        placeholder=""
        v-model="formDiscounts.channel_type_ids"
        multiple
        class="mb-4"
      >
        <el-option
          v-for="type in allChannelTypes"
          :key="type.id"
          :label="type.name"
          :value="type.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="t('points.trade_agent')">
      <el-select
        placeholder=""
        v-model="formDiscounts.trade_agents"
        @change="beforeFetchPoints"
        class="mb-4"
      >
        <el-option
          v-for="type in allAgents"
          :key="type.id"
          :label="type.name"
          :value="type.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="t('points.title')">
      <el-select
        placeholder=""
        :disabled="!formDiscounts.trade_agents"
        v-model="formDiscounts.trade_point_ids"
        :loading="loadingPoints"
        :max-collapse-tags="7"
        collapse-tags
        multiple
        class=""
      >
        <template #header>
          <el-checkbox
            v-model="checkAll"
            :indeterminate="indeterminate"
            @change="handleCheckAll"
          >
            {{ Trans.t("all") }}
          </el-checkbox>
        </template>
        <el-option
          v-for="type in pointsByAgent"
          :key="type.id"
          :label="type.name"
          :value="type.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <div class="flex mt-4">
      <el-col :span="11">
        <el-form-item :label="t('start_date')">
          <el-date-picker
            v-model="formDiscounts.start"
            type="date"
            format="YYYY.MM.DD"
            style="width: 100%"
            class="font-medium"
          />
        </el-form-item>
      </el-col>
      <el-col class="text-center" :span="2"> </el-col>
      <el-col :span="11">
        <el-form-item :label="t('end_date')">
          <el-date-picker
            v-model="formDiscounts.end"
            type="date"
            style="width: 100%"
            format="YYYY.MM.DD"
            class="font-medium"
          />
        </el-form-item>
      </el-col>
    </div>

    <div class="mt-4 flex">
      <el-col :span="11">
        <el-form-item :label="t('discounts.type')">
          <ElSelect v-model="formDiscounts.is_direct">
            <ElOption
              v-for="item in DISCOUNT_TYPES"
              :label="item.name"
              :value="item.id"
            ></ElOption>
          </ElSelect>
        </el-form-item>
      </el-col>

      <el-col class="text-center" :span="2"> </el-col>
      <el-col :span="11">
        <el-form-item :label="t('sort_order')" class="w-full">
          <InputNumber
            v-model="formDiscounts.sort_order"
            custom-class="!w-full"
            :max="100"
            size="large"
          />
        </el-form-item>
      </el-col>
    </div>
  </el-form>
</template>
