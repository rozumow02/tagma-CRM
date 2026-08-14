<template>
  <TwTable :headers="headers" :rows="routes">
    <template #action="{ row }">
      <el-dropdown popper-class="bg-gray1">
        <button class="outline-none p-1 text-gray-500">
          <Ellipsis />
        </button>
        <template #dropdown>
          <el-dropdown-menu class="p-1 flex flex-col">
            <span
              @click="FETCH_ROUTES_BY_ID(row.id)"
              class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
              >{{ t("edit") }}</span
            >
            <span
              @click="() => (isBlockDialog = true)"
              class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
            >
              {{ row.status ? t("block") : t("unblock") }}
            </span>
            <Dialog
              :title="t('route.update')"
              v-model="isUpdateDialog"
              append-to-body
              v-if="selectedIdRoute == row.id"
            >
              <template #content>
                <el-form :model="formRoutes" label-position="top" class="px-4">
                  <el-form-item :label="t('city')">
                    <ElSelect
                      class="font-medium text-text mb-2"
                      v-model="selected.cityId"
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
                    <p
                      class="bg-gray1 m-1 px-1 rounded-lg"
                      v-if="selectedItemRow"
                    >
                      {{ selectedItemRow }}
                    </p>
                  </el-form-item>
                  <el-form-item :label="t('points.trade_agent')">
                    <ElSelect
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
                  @click="FETCH_ROUTES_UPDATE(row.id)"
                >
                  {{ t("save_changes") }}
                </el-button>
              </template>
            </Dialog>
            <Dialog :title="t('block_usage')" v-model="isBlockDialog">
              <template #content>
                <div class="flex justify-center">
                  <img :src="warningSvg" v-if="row.status" />
                  <img :src="successSvg" v-else />
                </div>
              </template>
              <template #footer>
                <ElButton
                  :type="row.status ? 'danger' : 'success'"
                  size="large"
                  @click="FETCH_ROUTES_LOCK(row.id)"
                >
                  {{ row.status ? t("block") : t("unblock") }}
                </ElButton>
              </template>
            </Dialog>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
    <template #status="{ row }">
      <ElTag :type="row.status ? 'primary' : 'danger'" round>
        {{ row.status ? t("active") : t("blocked") }}:
        {{ row.updated_at }}
      </ElTag>
    </template>
    <template #index="{ index }">
      {{ index }}
    </template>
  </TwTable>
</template>

<script setup lang="ts">
import {
  ElForm,
  ElFormItem,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElOption,
} from "element-plus";
import { Ellipsis } from "lucide-vue-next";
import Dialog from "@/components/modal/Dialog.vue";
import {
  useRoutesStore,
  isBlockDialog,
  isUpdateDialog,
  formRoutes,
  routes,
  routeForDays,
  routeForPoints,
  routeForAgents,
  selectedItemRow,
  routeForEkspeditors,
  selectedIdRoute,
  allDistricts,
  allPoints,
  routeForCities,
  selected,
} from "@/store/Route";
import TwTable from "@/components/Table/TwTable.vue";
import successSvg from "@/assets/svg/success.svg";
import warningSvg from "@/assets/svg/warning.svg";
import { useI18n } from "vue-i18n";
import type { IRoutePoints } from "@/types";
import MySelect from "@/components/input/my-select.vue";
import { onBeforeMount, ref, watch } from "vue";
import { requestApi } from "@/api";
const {
  FETCH_ROUTES_LOCK,
  FETCH_ROUTES,
  FETCH_ROUTES_BY_ID,
  FETCH_ROUTES_UPDATE,
  FETCH_ALL_SELECT,
} = useRoutesStore();
const { t } = useI18n();

const headers = [
  { text: "index", value: "index" },
  { text: "points.trade_agent", value: "trade_agent" },
  { text: "week_day", value: "day" },
  { text: "city", value: "city" },
  { text: "district", value: "district" },
  { text: "location", value: "location" },
  { text: "orientir", value: "orientir" },
  { text: "ekspeditor", value: "ekspeditor" },
  { text: "name_point", value: "trade_point" },
  { text: "status", value: "status" },
  { text: "action", value: "action" },
];

const selectedItem = (item: IRoutePoints) => {
  selectedItemRow.value = `${item.city}, ${item.location},${item.name}`;
};

onBeforeMount(() => {
  selectedItemRow.value = "";
});
</script>
