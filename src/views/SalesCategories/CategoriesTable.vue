<template>
  <TwTable :headers="headers" :rows="categories">
    <template #action="{ row }">
      <el-dropdown popper-class="bg-gray1">
        <button class="outline-none p-1 text-gray-500">
          <Ellipsis />
        </button>
        <template #dropdown>
          <el-dropdown-menu class="p-1 flex flex-col">
            <span
              @click="FETCH_CATEGORIES_BY_ID(row.id)"
              class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
            >
              {{ t("edit") }}
            </span>
            <span
              @click="() => (isBlockDialog = true)"
              class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
            >
              {{ row.status ? t("block") : t("unblock") }}
            </span>

            <Dialog
              :title="t('categories.update')"
              v-model="isUpdateDialog"
              :d_key="isUpdateDialog"
              append-to-body
              v-if="selectedId === row.id"
            >
              <template #content>
                <el-form
                  :model="formCategories"
                  label-position="top"
                  class="px-4"
                  :show-message="false"
                >
                  <!-- <el-form-item :label="t('name_ru')">
                    <InputField v-model="formCategories.name_ru" />
                  </el-form-item> -->
                  <el-form-item :label="t('name')">
                    <InputField v-model="formCategories.name" />
                  </el-form-item>
                  <div class="flex justify-between">
                    <el-form-item :label="t('min_sum')">
                      <el-input-number
                        v-model="formCategories.min_sum"
                        :min="0"
                        controls-position="right"
                      />
                    </el-form-item>
                    <el-form-item :label="t('max_sum')">
                      <el-input-number
                        v-model="formCategories.max_sum"
                        :min="0"
                        controls-position="right"
                      />
                    </el-form-item>
                  </div>
                </el-form>
              </template>
              <template #footer>
                <el-button
                  :disabled="
                    !formCategories.name ||
                    !formCategories.min_sum ||
                    !formCategories.max_sum
                  "
                  size="large"
                  :type="
                    formCategories.name &&
                    formCategories.min_sum &&
                    formCategories.max_sum
                      ? 'primary'
                      : ''
                  "
                  @click="FETCH_CATEGORIES_UPDATE(row.id)"
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
                  @click="FETCH_CATEGORIES_LOCK(row.id)"
                >
                  {{ row.status ? t("block") : t("unblock") }}
                </ElButton>
              </template>
            </Dialog>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
    <template #index="{ index }">
      {{ index }}
    </template>

    <template #status="{ row }">
      <ElTag :type="row.status ? 'primary' : 'danger'" round>
        {{ row.status ? t("active") : t("blocked") }}:
        {{ row.updated_at }}
      </ElTag>
    </template>

    <template #min_sum="{ row }">
      <div class="whitespace-nowrap">
        {{ formatNumber(row.min_sum) }}
      </div>
    </template>

    <template #max_sum="{ row }">
      <div class="whitespace-nowrap">
        {{ formatNumber(row.max_sum) }}
      </div>
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
  useCategoriesStore,
  isBlockDialog,
  isUpdateDialog,
  formCategories,
  selectedId,
  categories,
} from "@/store/Categories";
import TwTable from "@/components/Table/TwTable.vue";
import successSvg from "@/assets/svg/success.svg";
import warningSvg from "@/assets/svg/warning.svg";
import { useI18n } from "vue-i18n";
import { formatNumber } from "@/utils/utils";
const {
  FETCH_CATEGORIES_LOCK,
  FETCH_CATEGORIES_BY_ID,
  FETCH_CATEGORIES_UPDATE,
} = useCategoriesStore();
const { t } = useI18n();

const headers = [
  { text: "index", value: "index" },
  // { text: "name_ru", value: "name_ru" },
  { text: "name", value: "name_tm", width: "50" },
  { text: "min_sum", value: "min_sum", align: "right" },
  { text: "max_sum", value: "max_sum", align: "right" },
  { text: "status", value: "status" },
  { text: "action", value: "action" },
] as Array<{
  text: string;
  value: string;
  align?: "center" | "right" | "left";
  width?: string;
}>;
</script>
