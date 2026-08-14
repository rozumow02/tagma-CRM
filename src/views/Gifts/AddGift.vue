<template>
  <Dialog :title="t('gifts.add')" v-model="dialogs.isAdd">
    <template #content>
      <ElForm :model="formGifts" label-position="top" class="px-4">
        <ElFormItem :label="t('name_ru')">
          <InputField v-model="formGifts.name_ru" />
        </ElFormItem>
        <ElFormItem :label="t('name_tm')">
          <InputField v-model="formGifts.name_tm" />
        </ElFormItem>
        <ElFormItem :label="t('gifts.type')">
          <MySelect
            v-model="formGifts.gift_type_id"
            :options="giftTypes"
            value-key="id"
            label-key="name"
            class="w-full"
          />
        </ElFormItem>
      </ElForm>
    </template>
    <template #footer>
      <el-button
        :disabled="
          !formGifts.name_ru || !formGifts.name_tm || !formGifts.gift_type_id
        "
        size="large"
        :type="isFormValid ? 'primary' : ''"
        @click="giftStore.handleGiftAction()"
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
    @click="() => (dialogs.isAdd = !dialogs.isAdd)"
  >
    <span class="mr-2 text-lg">+</span>
    {{ t("add") }}
  </ElButton>
</template>

<script setup lang="ts">
import { ElForm, ElFormItem } from "element-plus";
import { ref, watch, computed } from "vue";
import Dialog from "@/components/modal/Dialog.vue";
import InputField from "@/components/input/inputField.vue";
import MySelect from "@/components/input/my-select.vue";
import { useGiftsStore } from "@/store/Gifts";
import { useI18n } from "vue-i18n";
import { resetObject } from "@/utils/utils";
import { storeToRefs } from "pinia";
import { useUserData } from "@/store/UseAppDataStore";

const { t } = useI18n();
const { getUserData } = useUserData();
const isAdmin = computed(() => getUserData("ROLE"));

const giftStore = useGiftsStore();
const { dialogs, formGifts, giftTypes } = storeToRefs(giftStore);

const isFormValid = computed(() => {
  return (
    formGifts.value.name_ru &&
    formGifts.value.name_tm &&
    formGifts.value.gift_type_id
  );
});

watch(
  () => () => dialogs.value.isAdd,
  (newVal) => {
    if (!newVal) {
      resetObject(formGifts.value);
    }
  },
);
</script>
