<template>
  <TwTable :headers="headers" :rows="agents" table-height-offset="110">
    <template #action="{ row }">
      <el-dropdown popper-class="bg-gray1">
        <button class="outline-none p-1 text-gray-500">
          <Ellipsis />
        </button>
        <template #dropdown>
          <el-dropdown-menu class="p-1 flex flex-col">
            <span
              @click="FETCH_AGENTS_BY_ID(row.id)"
              class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
              >{{ t("edit") }}</span
            >
            <span
              @click="() => (isBlockDialog = true)"
              class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
            >
              {{ row.status ? t("block") : t("unblock") }}
            </span>
            <RouterLink
              :to="{ name: 'dolg', params: { id: row.id } }"
              class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
            >
              {{ t("zadoljennost") }}
            </RouterLink>
            <RouterLink
              :to="{ name: 'agentPayment', params: { id: row.id } }"
              class="p-2 uppercase mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
            >
              {{ t("payment") }}
            </RouterLink>
            <Dialog
              :title="t('agents.update')"
              v-model="isUpdateDialog"
              append-to-body
              v-if="row.id === selectedId"
            >
              <template #content>
                <el-form
                  :model="formAgents"
                  label-position="top"
                  class="px-4"
                  :show-message="false"
                >
                  <el-form-item :label="t('FIO_name_ru')">
                    <InputField v-model="formAgents.name_ru" />
                  </el-form-item>
                  <el-form-item :label="t('FIO_name_tm')">
                    <InputField v-model="formAgents.name_tm" />
                  </el-form-item>
                  <el-form-item :label="t('phone_number')">
                    <InputField v-model="formAgents.number" />
                  </el-form-item>
                  <el-form-item :label="t('drivers.title')">
                    <MySelect
                      v-model="formAgents.driver_ids"
                      :options="agentForDrivers"
                      multiple
                      value-key="id"
                      label-key="name"
                      class-name="w-full"
                    />
                  </el-form-item>
                  <el-form-item :label="t('ekspeditors.title')">
                    <MySelect
                      v-model="formAgents.ekspeditor_ids"
                      multiple
                      :options="agentForEkspeditors"
                      value-key="id"
                      label-key="name"
                      class-name="w-full"
                    />
                  </el-form-item>
                  <el-form-item :label="t('merchandisers.title')">
                    <MySelect
                      v-model="formAgents.merchandiser_ids"
                      multiple
                      :options="agentForMerchandisers"
                      value-key="id"
                      label-key="name"
                      class-name="w-full"
                    />
                  </el-form-item>
                </el-form>
              </template>
              <template #footer>
                <el-button
                  :disabled="
                    !formAgents.name_ru ||
                    !formAgents.name_tm ||
                    !formAgents.number ||
                    !formAgents.driver_ids.length ||
                    !formAgents.ekspeditor_ids.length
                  "
                  size="large"
                  :type="
                    formAgents.name_ru &&
                    formAgents.name_tm &&
                    formAgents.number &&
                    formAgents.driver_ids.length &&
                    formAgents.ekspeditor_ids.length
                      ? 'primary'
                      : ''
                  "
                  @click="FETCH_AGENTS_UPDATE(row.id)"
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
                  @click="FETCH_AGENTS_LOCK(row.id)"
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
    <template #drivers="{ row }">
      {{ row.drivers.map((item: any) => item.name).join(", ") }}
    </template>
    <template #ekspeditors="{ row }">
      {{ row.ekspeditors.map((item: any) => item.name).join(", ") }}
    </template>
    <template #merchandisers="{ row }">
      {{ row.merchandisers.map((item: any) => item.name).join(", ") }}
    </template>
    <template #debt="{ row }">
      {{ formatNumber(row.debt) }}
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
  useAgentsStore,
  isBlockDialog,
  isUpdateDialog,
  formAgents,
  selectedId,
  agents,
  agentForDrivers,
  agentForEkspeditors,
  agentForMerchandisers,
} from "@/store/Trade-team/Agents";
import TwTable from "@/components/Table/TwTable.vue";
import { useI18n } from "vue-i18n";
import MySelect from "@/components/input/my-select.vue";
import { onBeforeMount } from "vue";
import { formatNumber } from "@/utils/utils";
const {
  FETCH_AGENTS_LOCK,
  FETCH_AGENTS,
  FETCH_AGENTS_BY_ID,
  FETCH_AGENTS_UPDATE,
  FETCH_ALL_SELECT,
} = useAgentsStore();
const { t } = useI18n();

const headers = [
  // { text: "agents.code", value: "code" },
  { text: "FIO_name_ru", value: "name_ru" },
  { text: "FIO_name_tm", value: "name_tm" },
  { text: "phone_number", value: "number" },
  { text: "ekspeditors.title", value: "ekspeditors" },
  { text: "drivers.title", value: "drivers" },
  { text: "merchandisers.title", value: "merchandisers" },
  { text: "dolg", value: "debt" },
  { text: "status", value: "status" },
  { text: "action", value: "action" },
];

onBeforeMount(FETCH_ALL_SELECT);
</script>
