<template>
  <div ref="selectRef" class="relative mb-2 font-gotham" :class="className">
    <div
      class="flex items-center justify-between w-full min-h-[41.5px] px-3 text-left bg-white border rounded-md cursor-pointer focus:outline-none"
      :class="isOpen ? 'border-main' : 'border-gray-300'"
      @click="toggleDropdown"
      :tabindex="0"
    >
      <span class="block truncate font-gotham font-medium">
        {{
          selectedOptions.length > 0
            ? selectedOptions.map((option) => option[labelKey]).join(", ")
            : placeholder || "&nbsp"
        }}
      </span>
      <ChevronDownIcon
        class="w-5 h-5 ml-2 -mr-1 text-gray-400 transition-transform duration-300"
        :class="{ 'rotate-180': isOpen }"
      />
    </div>
    <ul
      v-if="isOpen"
      class="absolute p-2 z-50 w-full text-base border mt-1 rounded-lg overflow-auto bg-[#f5f7fa] shadow-shadow2 max-h-52 focus:outline-none"
    >
      <li
        v-for="option in options"
        :key="option[valueKey]"
        class="relative flex items-center rounded-md py-1 pl-3 text-text select-none hover:bg-gray-200 pr-9 cursor-pointer"
        :class="isSelected(option) ? 'font-medium active:bg-gray1' : ''"
        @click="selectOption(option)"
      >
        <ElCheckbox
          v-if="multiple"
          :model-value="isSelected(option)"
          @change="toggleSelection(option)"
        />
        <span class="ml-2 min-h-7">
          {{ option[labelKey] }}
        </span>
      </li>
      <li
        class="relative flex items-center rounded-md py-1 pl-3 text-text select-none hover:bg-gray1 pr-9 cursor-pointer"
        v-if="(options && options.length == 0) || options == null"
      >
        <span class="text-sm">
          {{ t("no_data") }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, type Ref } from "vue";
import { ChevronDownIcon } from "lucide-vue-next";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// Option must be typed more strictly for valueKey & labelKey access
interface Option {
  [key: string]: string | number;
}

type Primitive = string | number;
type ModelValue = Primitive | Primitive[];

// Props typing
interface SelectProps {
  options: Option[];
  placeholder?: string;
  modelValue?: ModelValue;
  className?: string;
  valueKey: string;
  labelKey: string;
  multiple?: boolean;
}

// Define props and emits
const props = defineProps<SelectProps>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Primitive[] | Primitive): void;
  (e: "change", value: Primitive): void;
}>();

// State refs
const isOpen: Ref<boolean> = ref(false);
const selectedOptions: Ref<Option[]> = ref([]);
const selectRef: Ref<HTMLElement | null> = ref(null);

// --- Watcher: sync modelValue → selectedOptions
watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    if (newValue === oldValue) return;

    const { options, valueKey } = props;

    if (!options || !options.length || newValue == null) {
      selectedOptions.value = [];
      return;
    }

    // Single value
    if (typeof newValue === "string" || typeof newValue === "number") {
      const selected = options.find((opt) => opt[valueKey] === newValue);
      selectedOptions.value = selected ? [selected] : [];
    }

    // Multiple values
    else if (Array.isArray(newValue)) {
      const valueArray = newValue as Primitive[];
      selectedOptions.value = options.filter((opt) =>
        valueArray.includes(opt[valueKey]),
      );
    }
  },
  { immediate: true },
);

// --- DOM click outside handler
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
      isOpen.value = false;
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
});

// --- UI: toggle dropdown open state
const toggleDropdown = (): void => {
  isOpen.value = !isOpen.value;
};

// --- Selection logic
const selectOption = (option: Option): void => {
  const { multiple, valueKey } = props;

  if (multiple) {
    const index = selectedOptions.value.findIndex(
      (selected) => selected[valueKey] === option[valueKey],
    );

    if (index > -1) {
      selectedOptions.value.splice(index, 1);
    } else {
      selectedOptions.value.push(option);
    }

    const updatedValues = selectedOptions.value.map((opt) => opt[valueKey]);
    emit("update:modelValue", updatedValues);
  } else {
    selectedOptions.value = [option];
    emit("update:modelValue", option[valueKey]);
    isOpen.value = false;
  }
};

// --- Check if an option is selected
const isSelected = (option: Option): boolean => {
  return selectedOptions.value.some(
    (selected) => selected[props.valueKey] === option[props.valueKey],
  );
};

// --- Toggle selection for multi-select (e.g. with checkbox)
const toggleSelection = (option: Option): void => {
  const index = selectedOptions.value.findIndex(
    (selected) => selected[props.valueKey] === option[props.valueKey],
  );

  if (index > -1) {
    selectedOptions.value.splice(index, 1);
  } else {
    selectedOptions.value.push(option);
  }

  const updatedValues = selectedOptions.value.map((opt) => opt[props.valueKey]);
  emit("update:modelValue", updatedValues);
};
</script>
