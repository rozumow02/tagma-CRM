<template>
  <TwTable :headers="headers" :rows="productTypes">
    <template #action="{ row }">
      <button class="outline-none p-1 text-gray-500">
        <el-dropdown popper-class="bg-gray1">
          <Ellipsis />
          <template #dropdown>
            <el-dropdown-menu class="p-1 flex flex-col">
              <span
                @click="FETCH_PRODUCTTYPES_BY_ID(row.id)"
                class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
                >{{ t("edit") }}</span
              >
              <span
                @click="() => (isBlockDialog = true)"
                class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
              >
                {{ row.status ? t("block") : t("unblock") }}
              </span>

              <!-- Изменить тип диалоги -->
              <Dialog
                v-if="selectedId === row.id"
                :title="t('update_type')"
                v-model="isUpdateDialog"
                append-to-body
              >
                <template #content>
                  <el-form
                    :model="formProductTypes"
                    label-position="top"
                    class="px-4"
                    :show-message="false"
                  >
                    <el-form-item :label="t('name_ru')">
                      <InputField v-model="formProductTypes.name_ru" />
                    </el-form-item>
                    <el-form-item :label="t('name_tm')">
                      <InputField v-model="formProductTypes.name_tm" />
                    </el-form-item>
                    <el-form-item :label="t('product.volume')">
                      <MySelect
                        v-model="formProductTypes.volume"
                        :options="typeForVolumes"
                        value-key="volume"
                        label-key="volume"
                        class-name="w-full"
                      />
                    </el-form-item>
                    <el-form-item :label="t('product.count')">
                      <el-input-number
                        v-model="formProductTypes.count"
                        :min="1"
                        style="width: 100%"
                        controls-position="right"
                      />
                    </el-form-item>
                  </el-form>
                </template>
                <template #footer>
                  <el-button
                    :disabled="
                      !formProductTypes.name_ru ||
                      !formProductTypes.name_tm ||
                      !formProductTypes.count ||
                      !formProductTypes.volume
                    "
                    size="large"
                    :type="
                      formProductTypes.name_ru &&
                      formProductTypes.name_tm &&
                      formProductTypes.count &&
                      formProductTypes.volume
                        ? 'primary'
                        : ''
                    "
                    @click="FETCH_PRODUCTTYPES_UPDATE(row.id)"
                  >
                    {{ t("save_changes") }}
                  </el-button>
                </template>
              </Dialog>

              <!-- Блокировка использования диалоги -->
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
                    @click="FETCH_PRODUCTTYPES_LOCK(row.id)"
                  >
                    {{ row.status ? t("block") : t("unblock") }}
                  </ElButton>
                </template>
              </Dialog>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </button>
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
  useProductTypesStore,
  formProductTypes,
  productTypes,
  isBlockDialog,
  isUpdateDialog,
  selectedId,
  typeForVolumes,
} from "@/store/Products/types";
import TwTable from "@/components/Table/TwTable.vue";
import successSvg from "@/assets/svg/success.svg";
import warningSvg from "@/assets/svg/warning.svg";
import { useI18n } from "vue-i18n";
import { onMounted } from "vue";
const {
  FETCH_PRODUCTTYPES_LOCK,
  FETCH_PRODUCTTYPES,
  FETCH_PRODUCTTYPES_BY_ID,
  FETCH_PRODUCTTYPES_UPDATE,
  FETCH_ALL_SELECT,
} = useProductTypesStore();
const { t } = useI18n();

const headers = [
  { text: "code", value: "code" },
  { text: "name_ru", value: "name_ru" },
  { text: "name_tm", value: "name_tm" },
  { text: "product.volume", value: "volume" },
  { text: "product.count", value: "count" },
  { text: "status", value: "status" },
  { text: "action", value: "action" },
];
onMounted(FETCH_ALL_SELECT);
</script>
