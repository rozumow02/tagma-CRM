<template>
  <Dialog
    :title="t(props.title)"
    v-model="dialogUpdate"
    append-to-body
    :key="dialogs.add ? 'true' : 'false'"
    :before-close="handleClose"
  >
    <template #content>
      <Step1 />
      <Step2 />
      <Step3 />
    </template>
    <template #footer>
      <el-button
        v-if="step > 1"
        @click="step--"
        class="px-4 py-2 text-sm font-medium rounded bg-gray1 border-gray-300 hover:bg-gray-100 disabled:opacity-50 flex"
      >
        <ChevronLeft :size="18" class="mr-2" />
        {{ t("pagination.previous") }}
      </el-button>
      <el-button
        v-if="isVisible()"
        :disabled="
          !formPromo.name_ru ||
          !formPromo.name_tm ||
          !formPromo.channel_type_ids.length ||
          !formPromo.end ||
          !formPromo.start
        "
        size="large"
        @click="step++"
        class="px-4 py-2 mx-4 rounded-lg text-sm font-medium bg-gray1 border-gray-300 hover:bg-gray-100 disabled:opacity-50 flex items-center"
      >
        {{ t("pagination.next") }}
        <ChevronRight :size="18" class="ml-2" />
      </el-button>
      <el-button v-if="!isVisible()" class="mx-4" @click="emit('submit')">
        {{ t("add") }}
      </el-button>
    </template>
  </Dialog>
  <ElButton
    v-if="add"
    type="primary"
    class="!rounded-md p-2"
    size="large"
    v-permission="[isAdmin]"
    @click="() => (dialogs.add = !dialogs.add)"
  >
    <span class="mr-2 text-lg">+</span>
    {{ t("add") }}
  </ElButton>
</template>

<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { computed, onBeforeMount, reactive, ref, watch } from "vue";
import Dialog from "@/components/modal/Dialog.vue";
import { usePromoStore } from "@/store/PromoStore";
const storePromo = usePromoStore();

const { dialogs, formPromo, step } = storeToRefs(storePromo);
import { useI18n } from "vue-i18n";
import { resetObject, uniqueByField } from "@/utils/utils";
import Step1 from "./components/Step-1.vue";
import Step2 from "./components/Step-2.vue";
import Step3 from "./components/Step-3.vue";
import Trans from "@/i18n/translation";
import { useUserData } from "@/store/UseAppDataStore";
import { storeToRefs } from "pinia";
const { t } = useI18n();

watch(
  () => dialogs.value.add,
  (val) => {
    if (typeof formPromo.value == "object") {
      resetObject(formPromo.value);
      step.value = 1;
      formPromo.value.need_count = 1;
      formPromo.value.free_count = 1;
    }
  },
);

const isVisible = () => {
  return (step.value > 0 && step.value < 2) || step.value < 3;
};

interface IProps {
  modelValue: boolean;
  title: string;
  add?: boolean;
}
const props = defineProps<IProps>();

const emit = defineEmits<{
  (e: "submit"): void;
  (e: "update:modelValue", value: boolean): void;
}>();

const dialogUpdate = computed({
  get: () => props.modelValue,
  set: (newValue) => emit("update:modelValue", newValue),
});
const handleClose = (done: () => void) => {
  ElMessageBox.confirm("", {
    confirmButtonText: Trans.t("close"),
    cancelButtonText: Trans.t("discard"),
    message: Trans.t("dialog_not_safe-2"),
    title: Trans.t("dialog_not_safe"),
    confirmButtonClass: "bg-red",
    type: "warning",
    center: true,
  })
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};

const { getUserData } = useUserData();
const isAdmin = computed(() => getUserData("ROLE"));
</script>
