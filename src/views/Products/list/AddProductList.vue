<template>
  <Dialog
    :title="t('product.add_list')"
    v-model="isAddDialog"
    :d_key="isAddDialog"
  >
    <template #content>
      <el-form :model="formProductList" label-position="top" class="px-4">
        <el-form-item :label="t('product.name_tm')">
          <!-- <InputField v-model="formProductList.name" /> -->
          <MySelect
            :options="allBrands"
            label-key="name"
            v-model="formProductList.brand_id"
            :value="formProductList.brand_id"
            value-key="id"
            class-name="w-full"
          />
        </el-form-item>
        <!-- <el-form-item :label="t('product.name_tm')">
          <InputField v-model="formProductList.name_tm" />
        </el-form-item> -->
        <el-form-item :label="t('product.taste_ru')">
          <InputField v-model="formProductList.taste_ru" />
        </el-form-item>
        <el-form-item :label="t('product.taste_tm')">
          <InputField v-model="formProductList.taste_tm" />
        </el-form-item>
        <el-form-item :label="t('product.product_type_id')">
          <MySelect
            :options="productTypesAll"
            label-key="name"
            v-model="formProductList.product_type_id"
            :value="formProductList.product_type_id"
            value-key="id"
            class-name="w-full"
          />
          <!-- <el-select
            v-model="formProductList.product_type_id"
            size="large"
          >
            <el-option
              v-for="item in productTypesAll"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item :label="t('product.price')">
          <el-input-number
            v-model="formProductList.price1"
            :min="0"
            :max="1000"
            controls-position="right"
          />
          <span class="flex items-start justify-end p-2">{{
            t("currency_man")
          }}</span>
          <el-input-number
            v-model="formProductList.price2"
            :min="0"
            :max="99"
            controls-position="right"
          />
          <span class="flex items-start justify-end p-2">{{
            t("currency_tng")
          }}</span>
        </el-form-item>
        <el-form-item :label="t('product.d_price')">
          <el-input-number
            v-model="formProductList.d_price1"
            :min="0"
            controls-position="right"
          />
          <span class="flex items-start justify-end p-2">{{
            t("currency_man")
          }}</span>
          <el-input-number
            v-model="formProductList.d_price2"
            :min="0"
            :max="99"
            controls-position="right"
          />
          <span class="flex items-start justify-end p-2">{{
            t("currency_tng")
          }}</span>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button
        :disabled="
          !formProductList.brand_id ||
          !formProductList.product_type_id ||
          !formProductList.taste_ru ||
          !formProductList.taste_tm
        "
        size="large"
        :type="
          formProductList.brand_id &&
          formProductList.product_type_id &&
          formProductList.taste_ru &&
          formProductList.taste_tm
            ? 'primary'
            : ''
        "
        @click="FETCH_PRODUCTLIST_CREATE"
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
import { Dot } from "lucide-vue-next";
import { computed, onBeforeMount, reactive, ref, watch } from "vue";
import Dialog from "@/components/modal/Dialog.vue";
import InputField from "@/components/input/inputField.vue";
import {
  useProductListStore,
  formProductList,
  productTypesAll,
  allBrands,
  isAddDialog,
} from "@/store/Products/list";
import { useI18n } from "vue-i18n";
import MySelect from "@/components/input/my-select.vue";
import { resetObject } from "@/utils/utils";
import { useUserData } from "@/store/UseAppDataStore";
const { FETCH_PRODUCTLIST_CREATE } = useProductListStore();
const { t } = useI18n();
const { getUserData } = useUserData();
const isAdmin = computed(() => getUserData("ROLE"));

watch(isAddDialog, () => {
  if (typeof formProductList == "object") {
    resetObject(formProductList);
  }
});
</script>
