<template>
  <el-table
    v-loading="props.isLoading"
    v-bind="tableProps"
    style="width: 100%"
    :data="props.data"
    header-cell-class-name="!bg-gray1 overf text-text !border-y header_cell"
    :row-class-name="cellClassName"
    header-row-class-name=""
    :row-key="rowKey"
    table-layout="auto"
    class="w-full"
    @select="emit('select', $event)"
    @select-all="emit('select-all', $event)"
    @selection-change="emit('selection-change', $event)"
    @cell-mouse-enter="emit('cell-mouse-enter', $event)"
    @cell-mouse-leave="emit('cell-mouse-leave', $event)"
    @cell-click="emit('cell-click', $event)"
    @cell-dblclick="emit('cell-dblclick', $event)"
    @row-click="emit('row-click', $event)"
    @row-contextmenu="emit('row-contextmenu', $event)"
    @row-dblclick="emit('row-dblclick', $event)"
    @header-click="emit('header-click', $event)"
    @header-contextmenu="emit('header-contextmenu', $event)"
    @sort-change="emit('sort-change', $event)"
    @filter-change="emit('filter-change', $event)"
    @current-change="emit('current-change', $event)"
    @header-dragend="emit('header-dragend', $event)"
    @expand-change="emit('expand-change', $event)"
  >
    <template v-for="(column, index) in props.columns" :key="index">
      <el-table-column
        v-if="!column.type && column.prop !== 'action'"
        :prop="column.prop"
        :label="Trans.t(column.label)"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :sortable="column.sortable"
        :resizable="column.resizable"
        :formatter="column.formatter"
        :show-overflow-tooltip="column.showOverflowTooltip"
        :align="column.align"
        :header-align="column.headerAlign"
      >
        <template #default="scope">
          <slot :name="column.prop" v-bind="scope">{{
            scope.row[column.prop]
          }}</slot>
        </template>
        <template v-if="$slots.header" #header>
          <slot name="header" :column="column">
            {{ column.label }}
          </slot>
        </template>
      </el-table-column>

      <el-table-column
        v-if="column.type"
        :type="column.type"
        :label="column.label ? Trans.t(column.label) : ''"
      >
        <template #default="scope">
          <slot
            v-if="column.type === 'expand'"
            name="expand"
            v-bind="scope"
          ></slot>
        </template>
      </el-table-column>

      <el-table-column
        v-if="column.prop === 'action'"
        v-permission="[isAdmin]"
        :label="column.label ? Trans.t(column.label) : ''"
      >
        <template #default="scope">
          <slot :name="column.prop" v-bind="scope">{{
            scope.row[column.prop]
          }}</slot>
        </template>
      </el-table-column>
    </template>
  </el-table>
  <ElPagination
    v-if="query?.pageCount && query?.pageNumber"
    v-model:current-page="query.pageNumber"
    v-model:page-size="query.pageSize"
    :prev-text="Trans.t('pagination.previous')"
    :next-text="Trans.t('pagination.next')"
    layout="sizes, prev, pager, next"
    :total="query.pageCount * query.pageSize"
    :page-count="query.pageCount"
    class="!font-medium flex justify-end m-3"
    :page-sizes="pageSizes"
    :default-page-size="query.pageNumber"
    background
    size="default"
    @current-change="emit('page-change')"
    @size-change="emit('size-change')"
  >
  </ElPagination>
</template>

<script lang="ts" setup>
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import type { IElColumnTable } from "@/types";
import Trans from "@/i18n/translation";
import { useUserData } from "@/store/UseAppDataStore";

const tableHeight = ref("calc(100vh - 250px)"); // boshlang'ich qiymat
// const setTableHeight = () => {
//   tableHeight.value = `${window.innerHeight * 0.8}px`; // 80% ekranning balandligi
// };

onMounted(() => {
  //   setTableHeight();
  //   window.addEventListener("resize", setTableHeight);
  // });
  onMounted;
  onBeforeUnmount;

  // onBeforeUnmount(() => {
  //   window.removeEventListener("resize", setTableHeight);
});

interface IQuery {
  pageNumber: number;
  pageSize: number;
  pageCount: number;
}

// Propsni e'lon qilish va default qiymatlarni o'rnatish
const props = withDefaults(
  defineProps<{
    cellClassName?: string | Function;
    query?: IQuery | undefined;
    data: Record<string, any>[];
    rowKey?: string;
    columns: IElColumnTable[];
    stripe?: boolean;
    border?: boolean;
    fit?: boolean;
    showHeader?: boolean;
    height?: string | number | null;
    maxHeight?: string | number | null;
    highlightCurrentRow?: boolean;
    defaultExpandAll?: boolean;
    expandRowKeys?: any[];
    defaultSort?: Record<string, any>;
    tooltipEffect?: string;
    showSummary?: boolean;
    sumText?: string;
    summaryMethod?: (columns: any, data: any) => any[];
    pageSizes?: number[];
    isLoading?: boolean;
  }>(),
  {
    data: () => [],
    columns: () => [],
    rowKey: "id",
    stripe: false,
    border: false,
    fit: true,
    showHeader: true,
    height: null,
    maxHeight: null,
    highlightCurrentRow: false,
    defaultExpandAll: false,
    expandRowKeys: () => [],
    defaultSort: () => ({}),
    tooltipEffect: "",
    showSummary: false,
    sumText: "Sum",
    pageSizes: () => [10, 50, 100, 200, 300, 400, 500],
    isLoading: false,
    // summaryMethod: [],
  },
);

// Emitsni e'lon qilish
const emit = defineEmits([
  "select",
  "select-all",
  "selection-change",
  "cell-mouse-enter",
  "cell-mouse-leave",
  "cell-click",
  "cell-dblclick",
  "row-click",
  "row-contextmenu",
  "row-dblclick",
  "header-click",
  "header-contextmenu",
  "sort-change",
  "filter-change",
  "current-change",
  "header-dragend",
  "expand-change",
  "page-change",
  "size-change",
]);

// Table propsni avtomatik tarzda tarqatish uchun computed method
const tableProps = computed(() => ({
  stripe: props.stripe,
  border: props.border,
  fit: props.fit,
  showHeader: props.showHeader,
  height: props.height || tableHeight.value,
  maxHeight: props.maxHeight,
  highlightCurrentRow: props.highlightCurrentRow,
  defaultExpandAll: props.defaultExpandAll,
  expandRowKeys: props.expandRowKeys,
  defaultSort: props.defaultSort,
  tooltipEffect: props.tooltipEffect,
  showSummary: props.showSummary,
  sumText: props.sumText,
  summaryMethod: props.summaryMethod,
  pageSizes: props.pageSizes,
  isLoading: props.isLoading,
}));

const { getUserData } = useUserData();
const isAdmin = computed(() => getUserData("ROLE"));
</script>

<style>
.header_cell .cell {
  text-overflow: clip;
  overflow-wrap: normal;
}
</style>
