<template>
  <Dialog :title="t('route.add')" v-model="isAddDialog" :d_key="isAddDialog">
    <template #content>
      <el-form :model="formRoutes" label-position="top" class="px-4">
        <el-form-item :label="t('city')">
          <ElSelect
            class="font-medium text-text mb-2"
            v-model="selected.cityId"
            placeholder=""
          >
            <ElOption
              v-for="city in routeForCities"
              :key="city.id"
              :value="city.id"
              :label="city.name"
            ></ElOption>
          </ElSelect>
        </el-form-item>
        <el-form-item :label="t('district')">
          <ElSelect
            placeholder=""
            :disabled="!selected.cityId"
            class="font-medium text-text mb-2"
            v-model="selected.districtId"
          >
            <ElOption
              v-for="item in allDistricts"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></ElOption>
          </ElSelect>
        </el-form-item>
        <el-form-item :label="t('name_point')">
          <el-select
            :disabled="!selected.districtId"
            v-model="formRoutes.trade_point_id"
            filterable
            @change="selectedItem"
            class="font-medium text-text mb-2"
            size="large"
            placeholder=""
            :no-data-text="t('no_data')"
            :no-match-text="t('no_data')"
          >
            <el-option
              v-for="item in allPoints"
              :key="item.id"
              @click="selectedItem(item)"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <p class="bg-gray1 m-1 px-1 rounded-lg" v-if="selectedItemRow">
            {{ selectedItemRow }}
          </p>
        </el-form-item>
        <el-form-item :label="t('points.trade_agent')">
          <ElSelect
            placeholder=""
            v-model="formRoutes.trade_agent_id"
            class="w-full mb-2 font-medium text-text"
            disabled
          >
            <ElOption
              v-for="agent in routeForAgents"
              :key="agent.id"
              :label="agent.name"
              :value="agent.id"
            >
            </ElOption>
          </ElSelect>
        </el-form-item>
        <el-form-item :label="t('ekspeditors.title')">
          <ElSelect
            placeholder=""
            class="mb-2 font-medium text-text"
            v-model="formRoutes.ekspeditor_id"
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
        <el-form-item :label="t('week_day')">
          <ElSelect
            placeholder=""
            v-model="formRoutes.day_id"
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
      </el-form>
    </template>
    <template #footer>
      <el-button
        :disabled="
          !formRoutes.day_id ||
          !formRoutes.trade_agent_id ||
          !formRoutes.trade_point_id
        "
        size="large"
        :type="
          formRoutes.day_id &&
          formRoutes.trade_agent_id &&
          formRoutes.trade_point_id
            ? 'primary'
            : ''
        "
        @click="FETCH_ROUTES_CREATE"
      >
        {{ t("add") }}
      </el-button>
    </template>
  </Dialog>
  <ElButton
    type="primary"
    class="!rounded-md p-2"
    size="large"
    @click="() => (isAddDialog = !isAddDialog)"
  >
    <span class="mr-2 text-lg">+</span>
    {{ t("add") }}
  </ElButton>
</template>

<script setup lang="ts">
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
} from "element-plus";
import { computed, onBeforeMount, reactive, ref, toRef, watch } from "vue";
import Dialog from "@/components/modal/Dialog.vue";
import {
  useRoutesStore,
  formRoutes,
  allDistricts,
  allPoints,
  selected,
  isAddDialog,
  routeForDays,
  routeForEkspeditors,
  routeForPoints,
  routeForAgents,
  selectedItemRow,
  routeForCities,
} from "@/store/Route";
import { useI18n } from "vue-i18n";
import type { IRoutePoints, ISelectAll } from "@/types";
import { resetObject } from "@/utils/utils";
import { requestApi } from "@/api";
const { FETCH_ROUTES_CREATE } = useRoutesStore();
const { t } = useI18n();
watch(isAddDialog, () => {
  if (typeof formRoutes == "object") {
    resetObject(formRoutes);
    resetObject(selected);
    selectedItemRow.value = "";
  }
});
const selectedItem = (item: IRoutePoints) => {
  selectedItemRow.value = `${item.city}, ${item.location},${item.name}`;
  formRoutes.trade_agent_id = item.trade_agent_id;
};
</script>
