<template>
  <Dialog
    :title="t(label)"
    v-model="dialogValue"
    :d_key="dialogValue"
    :width="width"
    append-to-body
  >
    <template #content>
      <el-form
        ref="ruleFormRef"
        :model="data"
        label-position="top"
        class="px-4"
        :rules="rules"
        :class="props.customClass"
      >
        <transition-group name="fade" tag="div">
          <el-form-item
            v-for="(form, i) in forms"
            :key="i"
            :prop="form.model"
            :label="t(`${form.label}`)"
            class="form-item"
          >
            <InputField
              v-if="form.type == 'input'"
              v-model="props.data[form.model]"
            />
            <InputField
              v-if="form.type == 'password'"
              :type="form.type"
              v-model="props.data[form.model]"
              show-password
            />
            <ElSelect
              v-if="form.type == 'select'"
              :placeholder="form.placeholder || ''"
              v-model="props.data[form.model]"
              :filterable="form.filterable"
              :multiple="form.multiple"
              :max-collapse-tags="4"
              :collapse-tags="form.multiple ? true : false"
              class="text-text font-medium mb-2"
              :style="{ width: form.width || '100%' }"
              clearable
            >
              <el-option
                v-for="option in form.options"
                :key="option.id"
                :label="option.name"
                :value="option.id"
              />
            </ElSelect>
            <QuillEditor
              v-if="form.type === 'editor'"
              v-model="props.data[form.model]"
            />
            <InputNumber
              v-if="form.type === 'number'"
              v-model="props.data[form.model]"
              :suffix-text="form.suffixText || ''"
              :min="form.min"
              :max="form.max"
              style="width: 100%"
              size="large"
            />
            <ElDatePicker
              v-if="form.type === 'date'"
              :key="form.model"
              :placeholder="form.placeholder"
              v-model="props.data[form.model]"
              format="YYYY.MM.DD"
              :style="{ width: form.width || '100%' }"
              clearable
            ></ElDatePicker>
          </el-form-item>
          <slot name="item"></slot>
        </transition-group>
      </el-form>
    </template>

    <template #footer>
      <el-button
        :disabled="!isFormValid"
        size="large"
        :type="isFormValid ? 'primary' : ''"
        @click="submitForm(ruleFormRef)"
      >
        {{ add ? t("add") : t("save_changes") }}
      </el-button>
    </template>
  </Dialog>
  <slot>
    <ElButton
      v-permission="[isAdmin]"
      v-if="button && add"
      type="primary"
      class="!rounded-md p-2"
      size="large"
      @click="() => (dialogValue = !dialogValue)"
    >
      <!-- <span class="mr-2 text-lg">+</span> -->
      {{ add ? t("add") : t("edit") }}
    </ElButton>
  </slot>
</template>

<script setup lang="ts">
import { ElDialog, ElForm, ElFormItem, ElInput, ElSelect } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import {
  computed,
  inject,
  onBeforeMount,
  reactive,
  ref,
  watch,
  type Ref,
} from "vue";
import Dialog from "@/components/modal/Dialog.vue";
import InputField from "@/components/input/inputField.vue";
import { useI18n } from "vue-i18n";
import type { IFormOption } from "@/types";
import InputNumber from "@/components/input/InputNumber.vue";
import { useUserData } from "@/store/UseAppDataStore";
const { t } = useI18n();
const { getUserData } = useUserData();
const isAdmin = computed(() => getUserData("ROLE"));

const ruleFormRef = ref<FormInstance>();

const isFormValid = computed(() => {
  return props.forms.every((form) => {
    if (form.valid) {
      return true;
    }
    return props.data[form.model];
  });
});

const emit = defineEmits<{
  (e: "updateForms"): void;
  (e: "clearObject"): void;
  (e: "update:modelValue", value: boolean): void;
}>();
interface IProps {
  forms: IFormOption[];
  data: Record<string, string | any>;
  label: string;
  modelValue: boolean;
  add?: boolean;
  button?: boolean;
  width?: string;
  customClass?: string;
  rules?: FormRules<any>;
}

const props = withDefaults(defineProps<IProps>(), {
  button: true,
  width: "600",
});
const dialogValue = computed({
  get: () => props.modelValue,
  set: (newValue) => emit("update:modelValue", newValue),
});

watch(dialogValue, (value) => {
  emit("clearObject");
});
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      emit("updateForms");
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<style scoped>
/* Transition for form item */
.form-item {
  transition:
    opacity 0.5s ease-in-out,
    transform 0.3s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
  transform: translateY(-20px); /* Optionally add vertical translation */
}
</style>
