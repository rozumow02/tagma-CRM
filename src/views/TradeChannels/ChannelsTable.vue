<template>
  <TwTable :headers="headers" :rows="channels" table-height-offset="50">
    <template #action="{ row }">
      <el-dropdown popper-class="bg-gray1">
        <button class="outline-none p-1 text-gray-500">
          <Ellipsis />
        </button>
        <template #dropdown>
          <el-dropdown-menu class="p-1 flex flex-col">
            <span
              @click="FETCH_CHANNELS_BY_ID(row)"
              class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
              >{{ t("edit") }}</span
            >
            <span
              @click="() => (isBlockDialog = true)"
              class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
            >
              {{ row.status ? t("block") : t("unblock") }}
            </span>
            <Dialog :title="t('channels.edit')" v-model="isUpdateDialog">
              <template #content>
                <el-form
                  :model="formChannelsGroup"
                  label-position="top"
                  class="px-4"
                >
                  <el-form-item :label="t('channels.type')">
                    <MySelect
                      v-model="formChannelsGroup.type_id"
                      :options="allTypes"
                      value-key="id"
                      label-key="name"
                      class-name="w-full"
                    />
                  </el-form-item>
                  <el-form-item :label="t('channels.structure')">
                    <MySelect
                      v-model="formChannelsGroup.structure_id"
                      :options="allStructures"
                      value-key="id"
                      label-key="name"
                      class-name="w-full"
                    />
                  </el-form-item>
                  <el-form-item :label="t('channels.size')">
                    <MySelect
                      v-model="formChannelsGroup.size_id"
                      :options="allSizes"
                      value-key="id"
                      label-key="name"
                      class-name="w-full"
                    />
                  </el-form-item>
                  <el-form-item :label="t('channels.management')">
                    <MySelect
                      v-model="formChannelsGroup.management_id"
                      :options="allManagments"
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
                    !formChannelsGroup.management_id ||
                    !formChannelsGroup.size_id ||
                    !formChannelsGroup.structure_id ||
                    !formChannelsGroup.type_id
                  "
                  size="large"
                  :type="
                    formChannelsGroup.management_id &&
                    formChannelsGroup.size_id &&
                    formChannelsGroup.structure_id &&
                    formChannelsGroup.type_id
                      ? 'primary'
                      : ''
                  "
                  @click="FETCH_CHANNELS_UPDATE(row.id)"
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
                  @click="FETCH_CHANNELS_LOCK(row.id)"
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
      <ElTag :type="row.status ? 'primary' : 'danger'" round size="small">
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
} from "element-plus";
import { Ellipsis } from "lucide-vue-next";
import Dialog from "@/components/modal/Dialog.vue";
import {
  isBlockDialog,
  isUpdateDialog,
  useChannelsStore,
  formChannelsGroup,
  channels,
  allManagments,
  allSizes,
  allStructures,
  allTypes,
} from "@/store/Channels/Channels";
import TwTable from "@/components/Table/TwTable.vue";
import successSvg from "@/assets/svg/success.svg";
import warningSvg from "@/assets/svg/warning.svg";
import { useI18n } from "vue-i18n";
import MySelect from "@/components/input/my-select.vue";
import { onBeforeMount } from "vue";
const {
  FETCH_CHANNELS,
  FETCH_ALL_SELECT,
  FETCH_CHANNELS_LOCK,
  FETCH_CHANNELS_UPDATE,
  FETCH_CHANNELS_BY_ID,
} = useChannelsStore();
const { t } = useI18n();

const headers = [
  { text: "channels.type", value: "type" },
  { text: "channels.structure", value: "structure" },
  { text: "channels.size", value: "size" },
  { text: "channels.management", value: "management" },
  { text: "status", value: "status" },
  { text: "action", value: "action" },
];

onBeforeMount(() => {
  FETCH_ALL_SELECT();
  FETCH_CHANNELS();
});
</script>
