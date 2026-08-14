<script lang="ts" setup>
import { useUserData } from "@/store/UseAppDataStore";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import SkeletonTable from "@/components/loading/SkeletonTable.vue";

const { t } = useI18n();
interface TableProps {
  headers: Array<{
    text: string;
    value: string;
    width?: string;
    align?: "left" | "center" | "right";
  }>;
  rows: Array<Record<string, any>>;
  loading?: boolean;
  tableHeightOffset?: string | number; // Height props
}

const emit = defineEmits(["row-double-click"]);
const props = withDefaults(defineProps<TableProps>(), {});
const { getUserData } = useUserData();
const isAdmin = computed(() => getUserData("ROLE"));
</script>

<template>
  <div class="table-wrapper">
    <el-scrollbar
      class="!z-20"
      :style="
        props.tableHeightOffset
          ? { height: `calc(80vh - ${props.tableHeightOffset}px)` }
          : {}
      "
    >
      <SkeletonTable v-if="props.loading" :headers="props.headers" :rows="10" />
      <table v-else class="bg-white table-auto w-full">
        <thead class="">
          <tr class="text-text text-sm leading-normal">
            <template v-for="header in props.headers" :key="header.value">
              <th
                v-if="header.value === 'action'"
                v-permission="[isAdmin]"
                :style="{ width: header.width ? header.width + 'px' : 'auto' }"
                class="border-y sticky top-[-1px] z-10 shadow-lg bg-gray1 p-3 text-left"
              >
                {{ t(header.text) }}
              </th>
              <th
                v-else
                :style="{ width: header.width ? header.width + 'px' : 'auto' }"
                class="border-y sticky top-[-1px] z-10 shadow-lg bg-gray1 p-3 text-left"
              >
                {{ t(header.text) }}
              </th>
            </template>
          </tr>
        </thead>
        <tbody class="text-gray-600 h-20 text-sm font-light" tabindex="-1">
          <tr
            v-for="(row, i) in props.rows"
            :key="i"
            class="border-b border-gray-200 hover:bg-gray-100"
            @dblclick="emit('row-double-click', row)"
          >
            <template v-for="header in props.headers" :key="header.value">
              <td
                class="p-3"
                :class="header.align ? 'text-' + header.align : 'text-left'"
                v-if="header.value == 'action'"
                v-permission="[isAdmin]"
              >
                <slot :name="header.value" :index="i + 1" :row="row">
                  {{ row[header.value] }}
                </slot>
              </td>
              <td
                class="p-3"
                v-else
                :class="header.align ? 'text-' + header.align : 'text-left'"
              >
                <slot :name="header.value" :index="i + 1" :row="row">
                  {{ row[header.value] }}
                </slot>
              </td>
            </template>
          </tr>
          <tr v-if="props.rows.length === 0">
            <td
              :colspan="props.headers.length"
              class="py-3 px-6 text-center border-b whitespace-nowrap"
            >
              {{ t("no_data") }}
            </td>
          </tr>
        </tbody>
      </table>
    </el-scrollbar>
  </div>
</template>
<style scoped>
.table-wrapper {
  max-width: 100%;
  overflow-x: auto;
  overflow-y: auto;
}

thead,
tbody tr {
  min-width: 100%;
  table-layout: fixed;
}
@media (max-width: 640px) {
  thead {
    display: none; /* Hide table header on small screens */
  }

  tbody tr {
    display: block;
    margin-bottom: 10px;
  }

  tbody td {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #e5e7eb;
  }

  tbody td::before {
    content: attr(data-label); /* Use the header name as a label */
    font-weight: bold;
    text-transform: capitalize;
  }

  tbody td:last-child {
    border-bottom: none;
  }
}
</style>
