<template>
  <Dialog
    :title="t('points.add')"
    v-model="isAddDialog"
    :d_key="isAddDialog"
    width="1000"
  >
    <template #content>
      <el-form
        :model="formPoints"
        label-position="top"
        class="px-8"
        :show-message="false"
      >
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

            <el-form-item :label="t('points.trade_channel_type')">
              <MySelect
                v-model="formPoints.trade_channel_id"
                :options="pointForChannels"
                value-key="id"
                label-key="name"
                class-name="w-full"
              />
            </el-form-item>

            <el-form-item :label="t('name_ru')">
              <InputField v-model="formPoints.name_ru" />
            </el-form-item>
            <el-form-item :label="t('name_tm')">
              <InputField v-model="formPoints.name_tm" />
            </el-form-item>
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
                ></ElOption>
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

            <Upload v-model="formPoints.images" class="mt-2" />
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
        @click="FETCH_POINTS_CREATE"
      >
        {{ t("add") }}
      </el-button>
    </template>
  </Dialog>
  <ElButton
    type="primary"
    class="!rounded-md p-2"
    size="large"
    v-permission="[isAdmin]"
    @click="() => (isAddDialog = !isAddDialog)"
  >
    <span class="mr-2 text-lg">+</span>
    {{ t("add") }}
  </ElButton>
</template>

<script setup lang="ts">
import { ElDialog, ElForm, ElFormItem, ElInput } from "element-plus";
import { computed, onBeforeMount, reactive, ref, watch } from "vue";
import Dialog from "@/components/modal/Dialog.vue";
import InputField from "@/components/input/inputField.vue";
import {
  usePointsStore,
  formPoints,
  isAddDialog,
  routeForDays,
  routeForEkspeditors,
  pointForCities,
  pointForAgents,
  pointForChannels,
} from "@/store/Point";
import type { ISelectAll } from "@/types";
import { useI18n } from "vue-i18n";
import { resetObject } from "@/utils/utils";
import { getAllSelectApi } from "@/api/point";
import { requestApi } from "@/api";
import { useUserData } from "@/store/UseAppDataStore";
const { FETCH_POINTS_CREATE } = usePointsStore();
const { t } = useI18n();
const { getUserData } = useUserData();
const isAdmin = computed(() => getUserData("ROLE"));

watch(isAddDialog, () => {
  if (typeof formPoints == "object") {
    resetObject(formPoints);
  }
});
const pointForDistricts = ref<ISelectAll[]>([]);

watch(
  () => formPoints.city_id,
  (newValue) => {
    if (newValue)
      requestApi("points/districts", "GET", { cityId: newValue }).then(
        (res) => {
          pointForDistricts.value = res.data;
        },
      );
  },
);
</script>
