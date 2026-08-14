<template>
  <Dialog
    :title="t(props.title)"
    v-model="dialogUpdate"
    width="750"
    append-to-body
    :key="isAddDialog ? 'true' : 'false'"
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
          !formDiscounts.name_ru ||
          !formDiscounts.channel_type_ids.length ||
          !formDiscounts.end ||
          !formDiscounts.start
        "
        size="large"
        @click="step++"
        class="px-4 py-2 mx-4 rounded-lg text-sm font-medium bg-gray1 border-gray-300 hover:bg-gray-100 disabled:opacity-50 flex items-center"
      >
        {{ t("pagination.next") }}
        <ChevronRight :size="18" class="ml-2" />
      </el-button>
      <el-button v-if="!isVisible()" class="mx-4" @click="updatedData">
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
    @click="() => (isAddDialog = !isAddDialog)"
  >
    <span class="mr-2 text-lg">+</span>
    {{ t("add") }}
  </ElButton>
</template>

<script setup lang="ts">
import { ElMessageBox } from "element-plus";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { computed, reactive, ref, watch } from "vue";
import Dialog from "@/components/modal/Dialog.vue";
import {
  formDiscounts,
  isAddDialog,
  first,
  step,
  selectedProduct,
  selectedProductSecond,
  second,
  type2ProductCoefficient,
  type2ProductCoin,
  type2ProductCount,
  selectedGroupIds,
} from "@/store/Discounts";
import { useI18n } from "vue-i18n";
import { resetObject, uniqueByField } from "@/utils/utils";
import Checkbox from "@/components/Product/checkbox.vue";
import { DISCOUNT_TYPES } from "@/constants";
import type { IAllProduct, ISelectedProducts } from "@/types";
import Step1 from "./components/Step-1.vue";
import Step2 from "./components/Step-2.vue";
import Step3 from "./components/Step-3.vue";
import Trans from "@/i18n/translation";
import { useUserData } from "@/store/UseAppDataStore";
const { t } = useI18n();

const clearProducts = () => {
  first.value.forEach((item) => {
    item.coefficient = 0;
    item.count = 0;
    item.coin = 0;
  });
  second.value.forEach((item) => {
    item.coefficient = 0;
    item.count = 0;
    item.coin = 0;
  });
  selectedProduct.value = [];
  selectedGroupIds.value = [];
  selectedProductSecond.value = [];
  type2ProductCoefficient.value = 0;
  type2ProductCoin.value = 0;
  type2ProductCount.value = 1;
};
watch(
  () => formDiscounts.is_direct,
  (newValue) => {
    if (!newValue) formDiscounts.is_group = false;
  },
);
watch(
  () => formDiscounts.is_group,
  () => {
    clearProducts();
  },
);

watch(isAddDialog, () => {
  if (typeof formDiscounts == "object") {
    resetObject(formDiscounts);
    clearProducts();
    step.value = 1;
    formDiscounts.is_increase = false;
  }
});

const isVisible = () => {
  return (
    (step.value > 0 && step.value < 2) ||
    (!formDiscounts.is_direct && step.value < 3)
  );
};
const updatedData = () => {
  const filteredfirst = first.value.filter((item) =>
    selectedProduct.value.includes(item.Id),
  );

  let filteredsecond = null;
  if (step.value == 3) {
    filteredsecond = second.value.filter((item) =>
      selectedProductSecond.value.includes(item.Id),
    );
    formDiscounts.second = filteredsecond.map((item) => {
      return {
        coefficient: item.coefficient,
        count: item.count,
        product_id: item.product_id,
      };
    });
  }
  formDiscounts.first = filteredfirst.map((item) => {
    return {
      coefficient: formDiscounts.is_direct
        ? formDiscounts.is_procent
          ? item.coefficient
          : item.coefficient * 100 + item.coin
        : formDiscounts.is_procent
          ? type2ProductCoefficient.value
          : type2ProductCoefficient.value * 100 + type2ProductCoin.value,
      count: formDiscounts.is_direct ? item.count : type2ProductCoin.value,
      product_id: item.product_id,
    };
  });

  formDiscounts.name_tm = formDiscounts.name_ru;

  emit("submit");
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
