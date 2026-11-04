<template>
  <TwTable :headers="headers" :rows="productList" table-height-offset="120">
    <template #action="{ row }">
      <button class="outline-none p-1 text-gray-500">
        <el-dropdown popper-class="bg-gray1">
          <Ellipsis class="outline-none" />
          <template #dropdown>
            <el-dropdown-menu class="p-1 flex flex-col">
              <span
                @click="FETCH_PRODUCTLIST_BY_ID(row.id)"
                class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
                >{{ t("edit") }}</span
              >
              <span
                @click="() => (isBlockDialog = true)"
                class="p-2 mx-1 cursor-pointer font-medium text-sm rounded-lg hover:bg-gray1"
              >
                {{ row.status ? t("block") : t("unblock") }}
              </span>

              <!-- Изменить тип диалоги -->
              <Dialog :title="t('update_type')" v-model="isUpdateDialog">
                <template #content>
                  <el-form
                    :model="formProductList"
                    label-position="top"
                    class="px-4"
                  >
                    <el-form-item :label="t('product.name_tm')">
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
                      <Select
                        :options="productTypesAll"
                        label-key="name"
                        v-model="formProductList.product_type_id"
                        :value="formProductList.product_type_id"
                        value-key="id"
                        class-name="w-full"
                      ></Select>
                    </el-form-item>
                    <el-form-item :label="t('product.price')">
                      <!-- <div class="flex"> -->
                      <el-input-number
                        v-model="formProductList.price1"
                        :min="0"
                        :max="1000"
                        controls-position="right"
                      />
                      <!-- <InputField type="number" v-model.number="formProductList.price1" /> -->
                      <span class="flex items-start justify-end p-2">{{
                        t("currency_man")
                      }}</span>
                      <!-- <InputField
              type="number"
              :min="0"
              v-model.number="formProductList.price2"
            /> -->
                      <el-input-number
                        v-model="formProductList.price2"
                        :min="0"
                        :max="99"
                        controls-position="right"
                      />
                      <span class="flex items-start justify-end p-2">{{
                        t("currency_tng")
                      }}</span>
                      <!-- </div> -->
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
                    @click="FETCH_PRODUCTLIST_UPDATE(row.id)"
                  >
                    {{ t("save_changes") }}
                  </el-button>
                </template>
              </Dialog>

              <!-- Блокировка использования диалоги -->
              <Dialog :title="t('block_usage')" v-model="isBlockDialog">
                <template #content>
                  <div class="flex justify-center">
                    <WarningFilled
                      v-if="row.status"
                      class="h-14 w-14 text-error"
                      aria-hidden="true"
                      focusable="false"
                    />
                    <CircleCheckFilled
                      v-else
                      class="h-14 w-14 text-success"
                      aria-hidden="true"
                      focusable="false"
                    />
                  </div>
                </template>
                <template #footer>
                  <ElButton
                    :type="row.status ? 'danger' : 'success'"
                    size="large"
                    @click="FETCH_PRODUCTLIST_LOCK(row.id)"
                  >
                    {{ row.status ? t("block") : t("unblock") }}
                  </ElButton>
                </template>
              </Dialog>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </button>
    </template>
    <template #status="{ row }">
      <ElTag :type="row.status ? 'primary' : 'danger'" round>
        {{ row.status ? t("active") : t("blocked") }}:
        {{ row.updated_at }}
      </ElTag>
    </template>
  </TwTable>
</template>

<script setup lang="ts">
import { CircleCheckFilled, WarningFilled } from "@element-plus/icons-vue";
import Select from "@/components/input/my-select.vue";
import { Dot } from "lucide-vue-next";
import {
  ElForm,
  ElFormItem,
  ElSelect,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
} from "element-plus";
import { Ellipsis } from "lucide-vue-next";
import Dialog from "@/components/modal/Dialog.vue";
import {
  useProductListStore,
  formProductList,
  productList,
  allBrands,
  productTypesAll,
  isBlockDialog,
  isUpdateDialog,
} from "@/store/Products/list";
import TwTable from "@/components/Table/TwTable.vue";
import { useI18n } from "vue-i18n";
import { onBeforeMount, ref } from "vue";
const {
  FETCH_PRODUCTLIST_LOCK,
  FETCH_PRODUCTTYPES_ALL,
  FETCH_PRODUCTLIST_BY_ID,
  FETCH_PRODUCTLIST_UPDATE,
} = useProductListStore();
const { t } = useI18n();

const headers = [
  { text: "product.code", value: "code" },
  // { text: "product.name_ru", value: "name_ru" },
  { text: "product.name_tm", value: "name" },
  { text: "product.taste_ru", value: "taste_ru" },
  { text: "product.taste_tm", value: "taste_tm" },

  { text: "product.product_type_id", value: "product_type" },
  { text: "product.price", value: "price" },
  { text: "product.bahasy", value: "block_price" },
  { text: "product.d_price", value: "d_price" },
  // { text: "product.d_bahasy", value: "block_d_price" },
  { text: "product.volume", value: "volume" },

  { text: "product.status", value: "status" },
  { text: "product.action", value: "action" },
];
onBeforeMount(FETCH_PRODUCTTYPES_ALL);
</script>
