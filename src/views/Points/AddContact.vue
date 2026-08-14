<template>
  <Dialog :title="t('contact.add')" v-model="isAddDialog" :d_key="isAddDialog">
    <template #content>
      <el-form
        :model="formContacts"
        label-position="top"
        class="px-8"
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
            v-model="formContacts.post_id"
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
        @click="FETCH_CONTACTS_CREATE"
      >
        {{ t("add") }}
      </el-button>
    </template>
  </Dialog>
  <ElButton
    type="primary"
    class="!rounded-md p-2"
    size="large"
    v-permission="[isAdmin]"
    @click="() => (isAddDialog = !isAddDialog)"
  >
    <span class="mr-2 text-lg">+</span>
    {{ t("add") }}
  </ElButton>
</template>

<script setup lang="ts">
import { ElDialog, ElForm, ElFormItem, ElInput } from "element-plus";
import { computed, onBeforeMount, reactive, ref, watch } from "vue";
import Dialog from "@/components/modal/Dialog.vue";
import InputField from "@/components/input/inputField.vue";
import {
  useContactsStore,
  formContacts,
  isAddDialog,
  contactForUprs,
  contactForPosts,
  contactForKinds,
} from "@/store/Points/Contacts";
import { useI18n } from "vue-i18n";
import { resetObject } from "@/utils/utils";
import { useUserData } from "@/store/UseAppDataStore";
const { FETCH_CONTACTS_CREATE } = useContactsStore();
const { t } = useI18n();
const { getUserData } = useUserData();
const isAdmin = computed(() => getUserData("ROLE"));

watch(isAddDialog, () => {
  if (typeof formContacts == "object") {
    formContacts.kind_id = 0;
    formContacts.name_ru = "";
    formContacts.name_tm = "";
    formContacts.number = "";
    formContacts.post_id = 0;
    formContacts.uprs_ids = [];
  }
});
</script>
