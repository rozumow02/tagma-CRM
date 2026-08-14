<template>
  <div class="border mt-4 rounded-lg pb-4">
    <Header :title="t('contacts')">
      <template #default>
        <AddContact />
      </template>
    </Header>
    <TwTable :headers="headers" :rows="contacts">
      <template #action="{ row }">
        <el-dropdown popper-class="bg-gray1">
          <button class="outline-none p-1 text-gray-500">
            <Ellipsis />
          </button>
          <template #dropdown>
            <el-dropdown-menu class="p-1 flex flex-col">
              <span
                @click="FETCH_CONTACTS_BY_ID(row.id)"
                class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
                >{{ t("edit") }}</span
              >
              <span
                @click="() => (isBlockDialog = true)"
                class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
              >
                {{ t("delete") }}
              </span>
              <Dialog
                :title="t('contact.update')"
                v-model="isUpdateDialog"
                append-to-body
                v-if="selectedIdContact == row.id"
              >
                <template #content>
                  <el-form
                    :model="formContacts"
                    label-position="top"
                    class="px-4"
                    :show-message="false"
                  >
                    <el-form-item :label="t('FIO_name_ru')">
                      <InputField v-model="formContacts.name_ru" />
                    </el-form-item>
                    <el-form-item :label="t('FIO_name_tm')">
                      <InputField v-model="formContacts.name_tm" />
                    </el-form-item>
                    <el-form-item :label="t('phone_number')">
                      <InputField v-model="formContacts.number" />
                    </el-form-item>
                    <el-form-item :label="t('contact.view')">
                      <MySelect
                        v-model="formContacts.kind_id"
                        :options="contactForKinds"
                        value-key="id"
                        label-key="name"
                        class-name="w-full"
                      />
                    </el-form-item>
                    <el-form-item :label="t('contact.job_title')">
                      <MySelect
                        v-model="formContacts.kind_id"
                        :options="contactForPosts"
                        value-key="id"
                        label-key="name"
                        class-name="w-full"
                      />
                    </el-form-item>
                    <el-form-item :label="t('contact.uprs')">
                      <MySelect
                        v-model="formContacts.uprs_ids"
                        :options="contactForUprs"
                        value-key="id"
                        multiple
                        label-key="name"
                        class-name="w-full"
                      />
                    </el-form-item>
                  </el-form>
                </template>
                <template #footer>
                  <el-button
                    :disabled="
                      !formContacts.name_ru ||
                      !formContacts.name_tm ||
                      !formContacts.number ||
                      !formContacts.post_id ||
                      !formContacts.kind_id ||
                      !formContacts.uprs_ids.length
                    "
                    size="large"
                    :type="
                      formContacts.name_ru &&
                      formContacts.name_tm &&
                      formContacts.number &&
                      formContacts.kind_id &&
                      formContacts.uprs_ids.length &&
                      formContacts.post_id
                        ? 'primary'
                        : ''
                    "
                    @click="FETCH_CONTACTS_UPDATE(row.id)"
                  >
                    {{ t("save_changes") }}
                  </el-button>
                </template>
              </Dialog>
              <Dialog :title="t('contact.delete')" v-model="isBlockDialog">
                <template #content>
                  <div class="flex justify-center">
                    <img :src="warningSvg" />
                  </div>
                </template>
                <template #footer>
                  <ElButton
                    :type="'danger'"
                    size="large"
                    @click="FETCH_CONTACTS_DELETE(row.id)"
                  >
                    {{ t("delete") }}
                  </ElButton>
                </template>
              </Dialog>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <template #uprs="{ row }">
        <span>
          {{ row.uprs.map((i: string) => i).join(", ") }}
        </span>
      </template>
      <template #index="{ index }">
        {{ index }}
      </template>
    </TwTable>
  </div>
</template>

<script setup lang="ts">
import {
  ElForm,
  ElFormItem,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElButton,
} from "element-plus";
import { Ellipsis } from "lucide-vue-next";
import Dialog from "@/components/modal/Dialog.vue";
import {
  useContactsStore,
  isBlockDialog,
  isUpdateDialog,
  formContacts,
  contacts,
  contactForKinds,
  contactForUprs,
  contactForPosts,
  selectedIdContact,
} from "@/store/Points/Contacts";
import TwTable from "@/components/Table/TwTable.vue";
import successSvg from "@/assets/svg/success.svg";
import warningSvg from "@/assets/svg/warning.svg";
import { useI18n } from "vue-i18n";
import MySelect from "@/components/input/my-select.vue";
import { onBeforeMount, defineProps, onMounted } from "vue";
import AddContact from "./AddContact.vue";
import { useRoute } from "vue-router";
import Header from "@/components/main/Header.vue";
const {
  FETCH_CONTACTS_DELETE,
  FETCH_CONTACTS,
  FETCH_CONTACTS_BY_ID,
  FETCH_CONTACTS_UPDATE,
  FETCH_ALL_SELECT,
} = useContactsStore();
const { t } = useI18n();

const headers = [
  { text: "index", value: "index", width: "50" },
  { text: "FIO", value: "name" },
  { text: "phone_number", value: "number" },
  { text: "contact.job_title", value: "post" },
  { text: "contact.view", value: "kind" },
  { text: "contact.uprs", value: "uprs", width: "300" },
  { text: "action", value: "action" },
];
const route = useRoute();
onMounted(() => {
  if (route.params.id) {
    FETCH_CONTACTS(Number(route.params.id));
    FETCH_ALL_SELECT();
  }
});
</script>
