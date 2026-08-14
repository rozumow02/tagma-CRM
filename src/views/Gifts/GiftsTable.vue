<template>
  <TwTable :headers="headers" :rows="gifts">
    <template #action="{ row }">
      <el-dropdown popper-class="bg-gray1">
        <button class="outline-none p-1 text-gray-500">
          <Ellipsis />
        </button>
        <template #dropdown>
          <el-dropdown-menu class="p-1 flex flex-col">
            <span
              @click="fetchGiftById(row.id)"
              class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
            >
              {{ t("edit") }}
            </span>
            <span
              @click="() => (dialogs.isBlock = true)"
              class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
            >
              {{ row.status ? t("block") : t("unblock") }}
            </span>
            <Dialog
              :title="t('gifts.update')"
              v-model="dialogs.isUpdate"
              append-to-body
              v-if="selectedIdGifts === row.id"
            >
              <template #content>
                <el-form :model="formGifts" label-position="top" class="px-4">
                  <el-form-item :label="t('name_ru')">
                    <InputField v-model="formGifts.name_ru" />
                  </el-form-item>
                  <el-form-item :label="t('name_tm')">
                    <InputField v-model="formGifts.name_tm" />
                  </el-form-item>
                  <el-form-item :label="t('gifts.type')">
                    <MySelect
                      v-model="formGifts.gift_type_id"
                      :options="giftTypes"
                      value-key="id"
                      label-key="name"
                      class="w-full"
                    />
                  </el-form-item>
                </el-form>
              </template>
              <template #footer>
                <el-button
                  :disabled="
                    !formGifts.name_ru ||
                    !formGifts.name_tm ||
                    !formGifts.gift_type_id
                  "
                  size="large"
                  :type="
                    formGifts.name_ru &&
                    formGifts.name_tm &&
                    formGifts.gift_type_id
                      ? 'primary'
                      : ''
                  "
                  @click="handleGiftAction(row.id)"
                >
                  {{ t("save_changes") }}
                </el-button>
              </template>
            </Dialog>
            <Dialog :title="t('block_usage')" v-model="dialogs.isBlock">
              <template #content>
                <div class="flex justify-center">
                  <img :src="row.status ? warningSvg : successSvg" />
                </div>
              </template>
              <template #footer>
                <ElButton
                  :type="row.status ? 'danger' : 'success'"
                  size="large"
                  @click="modifyGift(row.id, 'GET')"
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
        {{ row.status ? t("active") : t("blocked") }}: {{ row.updated_at }}
      </ElTag>
    </template>
  </TwTable>
</template>
<script setup lang="ts">
import { ElForm, ElFormItem, ElDropdown, ElDropdownMenu } from "element-plus";
import { Ellipsis } from "lucide-vue-next";
import Dialog from "@/components/modal/Dialog.vue";
import TwTable from "@/components/Table/TwTable.vue";
import MySelect from "@/components/input/my-select.vue";
import InputField from "@/components/input/inputField.vue";
import successSvg from "@/assets/svg/success.svg";
import warningSvg from "@/assets/svg/warning.svg";
import { useI18n } from "vue-i18n";
import { onMounted } from "vue";
import { useGiftsStore } from "@/store/Gifts";
import { storeToRefs } from "pinia";

// I18n setup
const { t } = useI18n();

// Pinia store import and reactive state access
const giftsStore = useGiftsStore();
const { handleGiftAction, fetchGiftById, fetchAllSelect, modifyGift } =
  giftsStore;
const { gifts, dialogs, formGifts, selectedIdGifts, giftTypes } =
  storeToRefs(giftsStore);
// Table headers
const headers = [
  { text: "name_ru", value: "name_ru" },
  { text: "name_tm", value: "name_tm" },
  { text: "gifts.type", value: "gift_type" },
  { text: "status", value: "status" },
  { text: "action", value: "action" },
];

// Fetch data on component mount
onMounted(() => {
  fetchAllSelect();
});
</script>
