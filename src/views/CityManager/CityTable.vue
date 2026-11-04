<template>
  <TwTable :headers="headers" :rows="cities">
    <template #action="{ row }">
      <el-dropdown popper-class="bg-gray1">
        <button class="outline-none p-1 text-gray-500">
          <Ellipsis />
        </button>
        <template #dropdown>
          <el-dropdown-menu class="p-1 flex flex-col">
            <span
              @click="FETCH_CITIES_BY_ID(row.id)"
              class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
              >{{ t("update_city") }}</span
            >
            <span
              @click="() => (isBlockDialog = true)"
              class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
            >
              {{ row.status ? t("block") : t("unblock") }}
            </span>
            <Dialog :title="t('update_city')" v-model="isUpdateDialog">
              <template #content>
                <el-form :model="formCity" label-position="top" class="px-4">
                  <el-form-item :label="t('name_ru')">
                    <InputField v-model="formCity.name_ru" />
                  </el-form-item>
                  <el-form-item :label="t('name_tm')">
                    <InputField v-model="formCity.name_tm" />
                  </el-form-item>
                </el-form>
              </template>
              <template #footer>
                <el-button
                  :disabled="!formCity.name_ru || !formCity.name_tm"
                  size="large"
                  :type="formCity.name_ru && formCity.name_tm ? 'primary' : ''"
                  @click="FETCH_CITIES_UPDATE(row.id)"
                >
                  {{ t("save_changes") }}
                </el-button>
              </template>
            </Dialog>
            <Dialog :title="t('block_usage')" v-model="isBlockDialog">
              <template #content>
                <div class="flex justify-center">
                  <WarningFilled
                    v-if="row.status"
                    class="h-14 w-14 text-error"
                    aria-hidden="true"
                    focusable="false"
                  />
                  <CircleCheckFilled
                    v-else
                    class="h-14 w-14 text-success"
                    aria-hidden="true"
                    focusable="false"
                  />
                </div>
              </template>
              <template #footer>
                <ElButton
                  :type="row.status ? 'danger' : 'success'"
                  size="large"
                  @click="FETCH_CITIES_LOCK(row.id)"
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
  </TwTable>
</template>

<script setup lang="ts">
import { CircleCheckFilled, WarningFilled } from "@element-plus/icons-vue";
import {
  ElForm,
  ElFormItem,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
} from "element-plus";
import { Ellipsis } from "lucide-vue-next";
import Dialog from "@/components/modal/Dialog.vue";
import {
  useCityStore,
  isBlockDialog,
  isUpdateDialog,
  formCity,
  cities,
} from "@/store/City";
import TwTable from "@/components/Table/TwTable.vue";
import { useI18n } from "vue-i18n";
import type { DropdownInstance } from "element-plus";
const { FETCH_CITIES_LOCK, FETCH_CITIES_BY_ID, FETCH_CITIES_UPDATE } =
  useCityStore();
const { t } = useI18n();

const headers = [
  { text: "cityCode", value: "code" },
  { text: "name_ru", value: "name_ru" },
  { text: "name_tm", value: "name_tm" },
  { text: "status", value: "status" },
  { text: "action", value: "action" },
];
</script>
