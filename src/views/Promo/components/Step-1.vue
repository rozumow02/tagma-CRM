<script setup lang="ts">
import { usePromoStore } from "@/store/PromoStore";
import { storeToRefs } from "pinia";
const storePromo = usePromoStore();
const { formPromo, step, allChannelTypes } = storeToRefs(storePromo);
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>
<template>
  <el-form
    :model="formPromo"
    label-position="top"
    class="px-4"
    v-if="step === 1"
  >
    <el-form-item :label="t('name_ru')">
      <InputField v-model="formPromo.name_ru" />
    </el-form-item>
    <el-form-item :label="t('name_tm')">
      <InputField v-model="formPromo.name_tm" />
    </el-form-item>
    <el-form-item :label="t('points.trade_channel_type')">
      <el-select
        placeholder=""
        v-model="formPromo.channel_type_ids"
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
    <el-form-item :label="t('start_date')">
      <el-date-picker
        v-model="formPromo.start"
        type="date"
        style="width: 100%"
        class="mb-4 font-medium"
      />
    </el-form-item>
    <el-form-item :label="t('end_date')">
      <el-date-picker
        v-model="formPromo.end"
        type="date"
        style="width: 100%"
        class="mb-4 font-medium"
      />
    </el-form-item>
  </el-form>
</template>
