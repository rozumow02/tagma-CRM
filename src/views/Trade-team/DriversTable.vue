<template>
  <TwTable :headers="headers" :rows="drivers">
    <template #action="{ row }">
      <el-dropdown popper-class="bg-gray1">
        <button class="outline-none p-1 text-gray-500">
          <Ellipsis />
        </button>
        <template #dropdown>
          <el-dropdown-menu class="p-1 flex flex-col">
            <span
              @click="FETCH_DRIVERS_BY_ID(row.id)"
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
              v-if="selectedId === row.id"
              :title="t('drivers.update')"
              v-model="isUpdateDialog"
              append-to-body
            >
              <template #content>
                <el-form
                  :model="formDrivers"
                  label-position="top"
                  class="px-4"
                  :show-message="false"
                >
                  <el-form-item :label="t('FIO_name_ru')">
                    <InputField v-model="formDrivers.name_ru" />
                  </el-form-item>
                  <el-form-item :label="t('FIO_name_tm')">
                    <InputField v-model="formDrivers.name_tm" />
                  </el-form-item>

                  <el-form-item :label="t('phone_number')">
                    <InputField v-model="formDrivers.number" />
                  </el-form-item>
                </el-form>
              </template>
              <template #footer>
                <el-button
                  :disabled="
                    !formDrivers.name_ru ||
                    !formDrivers.name_tm ||
                    !formDrivers.number
                  "
                  size="large"
                  :type="
                    formDrivers.name_ru &&
                    formDrivers.name_tm &&
                    formDrivers.number
                      ? 'primary'
                      : ''
                  "
                  @click="FETCH_DRIVERS_UPDATE(row.id)"
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
                  @click="FETCH_DRIVERS_LOCK(row.id)"
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
  useDriversStore,
  isBlockDialog,
  isUpdateDialog,
  selectedId,
  formDrivers,
  drivers,
} from "@/store/Trade-team/Drivers";
import TwTable from "@/components/Table/TwTable.vue";
import { useI18n } from "vue-i18n";
const {
  FETCH_DRIVERS_LOCK,
  FETCH_DRIVERS,
  FETCH_DRIVERS_BY_ID,
  FETCH_DRIVERS_UPDATE,
} = useDriversStore();
const { t } = useI18n();

const headers = [
  // { text: "agents.code", value: "code" },
  { text: "points.trade_agent", value: "trade_agent" },
  { text: "FIO_name_ru", value: "name_ru" },
  { text: "FIO_name_tm", value: "name_tm" },
  { text: "phone_number", value: "number" },
  { text: "status", value: "status" },
  { text: "action", value: "action" },
];
</script>
