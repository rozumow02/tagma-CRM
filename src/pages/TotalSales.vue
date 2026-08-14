<script setup lang="ts">
import Header from "@/components/main/Header.vue";
import Trans from "@/i18n/translation";
import { usePlanMainStore } from "@/store/PlanMain";
import {
  formatNumberCount,
  formatNumberCountFixed,
  getCurrentMonthYear,
  getMonthName,
} from "@/utils/utils";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import "dayjs/locale/ru";
import "dayjs/locale/tk";
const storePlanMain = usePlanMainStore();
const {
  planMain,
  allAgents,
  planMainQuery: query,
} = storeToRefs(storePlanMain);

onBeforeMount(() => {
  storePlanMain.fetchPlanMain();
  storePlanMain.FETCH_ALL_SELECT();
});
// Extract all days from all products and remove duplicates
const allDays = computed(() => {
  const daySet: Set<number> = new Set();
  planMain.value.forEach((product) => {
    product.data.forEach((d) => daySet.add(d.day));
  });
  return Array.from(daySet).sort((a, b) => a - b);
});

const formattedDayRows = computed(() => {
  const result: any[] = [];
  const grouped = new Map<number, any[]>();

  // Group rows by brand_id and prepare daily data
  for (const product of planMain.value) {
    const row: any = {
      product: product.product,
      forecast: product.forecast,
      plan: product.plan,
      forecast_vs_plan: product.forecast_vs_plan,
      brand_id: product.group_id,
      brand: `${product.name} ${product.volume} ${Trans.t("litr")}`,
    };

    // Assign daily counts
    allDays.value.forEach((day) => {
      const dayData = product.data.find((d) => d.day === day);
      row["day_" + day] = dayData ? dayData.count : 0;
    });

    // Group by brand_id
    if (!grouped.has(product.group_id)) grouped.set(product.group_id, []);
    grouped.get(product.group_id)!.push(row);
  }

  // Initialize total row (overall totals)
  const totalRow: any = {
    product: Trans.t("general_sales"),
    forecast: 0,
    plan: 0,
    forecast_vs_plan: 0,
    brand: "",
    groupTotal: true,
    total: 0,
  };
  allDays.value.forEach((day) => {
    totalRow["day_" + day] = 0;
  });

  // Process each brand group
  for (const [brand_id, rows] of grouped.entries()) {
    const subtotalRow: any = {
      product: `${Trans.t("total")}: ${rows[0].brand}`,
      forecast: 0,
      plan: 0,
      forecast_vs_plan: 0,
      brand: rows[0].brand,
      brand_id,
      groupTotal: true,
      total: 0,
    };
    allDays.value.forEach((day) => {
      subtotalRow["day_" + day] = 0;
    });

    rows.forEach((row, index) => {
      let rowTotal = 0;

      // Calculate daily totals and accumulate for subtotal/total rows
      allDays.value.forEach((day) => {
        const key = "day_" + day;
        const val = Number(row[key]) || 0;
        rowTotal += val;
        subtotalRow[key] += val;
        totalRow[key] += val;
      });

      subtotalRow.forecast += row.forecast;
      subtotalRow.plan += row.plan;
      subtotalRow.forecast_vs_plan += row.forecast_vs_plan;

      totalRow.forecast += row.forecast;
      totalRow.plan += row.plan;
      // totalRow.forecast_vs_plan += row.forecast_vs_plan;

      result.push({
        ...row,
        total: rowTotal,
        rowspan: index === 0 ? rows.length + 1 : 0,
      });
    });

    // Finalize subtotal row total
    subtotalRow.total = allDays.value.reduce((sum, day) => {
      return sum + (subtotalRow["day_" + day] || 0);
    }, 0);

    // Bu group b-ca orta bahasyny cykaryar a = (forecast / plan -1 ) *100
    subtotalRow.forecast_vs_plan =
      (subtotalRow.forecast / subtotalRow.plan - 1) * 100;

    result.push({ ...subtotalRow, rowspan: 0 });
  }

  // Finalize overall total row
  totalRow.total = allDays.value.reduce((sum, day) => {
    return sum + (totalRow["day_" + day] || 0);
  }, 0);

  // Bu jemi orta bahasyny cykaryar a = (forecast / plan -1 ) *100
  totalRow.forecast_vs_plan = (totalRow.forecast / totalRow.plan - 1) * 100;

  result.unshift({ ...totalRow, rowspan: 0 });

  return result;
});

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  if (column.property === "brand") {
    // Brand bir xil bo‘lsa, rowspan beramiz
    const currentBrand = row.brand_id;
    const prevRow = formattedDayRows.value[rowIndex - 1];

    const isRowspan = prevRow && prevRow?.brand_id === currentBrand;
    if (isRowspan) {
      return { rowspan: 0, colspan: 0 };
    }

    const rowspan = formattedDayRows.value.filter(
      (r) => r.brand_id === currentBrand,
    ).length;
    return { rowspan, colspan: 1 };
  }
};

const tableRowClassName = ({ row }: { row: any }) =>
  row.groupTotal ? "font-bold !bg-green-100" : "";

const clearFilter = () => {
  const { month, year } = getCurrentMonthYear();
  query.value.month = month;
  query.value.year = year;
  query.value.agent_id = null;
  storePlanMain.fetchPlanMain();
};
</script>

<template>
  <div class="border rounded-lg">
    <Header :title="Trans.t('menuItems.total_sales')" />
    <div class="p-4 justify-center lg:justify-start flex flex-wrap gap-4">
      <el-date-picker
        @change="storePlanMain.fetchPlanMain"
        v-model="query.year"
        v-if="query.year"
        :clearable="false"
        format="YYYY"
        value-format="YYYY"
        type="year"
        :placeholder="Trans.t('pick_year')"
      />
      <el-date-picker
        @change="storePlanMain.fetchPlanMain"
        v-model="query.month"
        format="MMMM"
        :clearable="false"
        value-format="MM"
        type="month"
        :placeholder="Trans.t('pick_month')"
      />
      <el-select
        :style="{ width: '240px' }"
        v-model="query.agent_id"
        clearable
        @clear="clearFilter"
        @change="storePlanMain.fetchPlanMain"
        :placeholder="Trans.t('points.trade_agent')"
      >
        <el-option
          v-for="item in allAgents"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <ElButton @click="clearFilter" type="warning">{{
        Trans.t("clear")
      }}</ElButton>
    </div>
    <el-table
      size="small"
      height="calc(100vh - 250px)"
      :data="formattedDayRows"
      border
      :row-class-name="tableRowClassName"
      :span-method="objectSpanMethod"
      header-cell-class-name="!bg-gray1 text-text !border-y"
      table-layout="auto"
    >
      <el-table-column :label="Trans.t('name')" prop="product" fixed />

      <el-table-column :label="Trans.t('brand_volume')" prop="brand" fixed />

      <el-table-column
        v-for="day in allDays"
        :key="day"
        :label="'Day ' + day"
        :prop="'day_' + day"
        align="right"
      >
        <template #default="scope">
          <span>{{ formatNumberCount(scope.row["day_" + day]) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="Trans.t('total')" prop="total" align="right">
        <template #default="scope">
          <span>{{ formatNumberCount(scope.row.total) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="`${getMonthName(String(query.month), Trans.currentLocale).toUpperCase()} ${Trans.t('forecast_fev')}`"
        prop="forecast"
        fixed="right"
        width="100"
        align="right"
        header-align="center"
      >
        <template #default="scope">
          <span>{{ formatNumberCount(scope.row.forecast) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="` ${getMonthName(String(query.month), Trans.currentLocale).toUpperCase()} ${Trans.t('plan_fev')}`"
        prop="plan"
        fixed="right"
        align="right"
        width="100"
        header-align="center"
      >
        <template #default="scope">
          <span>{{ formatNumberCount(scope.row.plan) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="Trans.t('forecast_vs_plan')"
        prop="forecast_vs_plan"
        fixed="right"
        width="100"
        header-align="center"
      >
        <template #default="scope">
          <span
            :class="
              scope.row.forecast_vs_plan > 0
                ? 'text-green-600 font-bold'
                : scope.row.forecast_vs_plan < 0
                  ? 'text-red-600 font-bold'
                  : ''
            "
          >
            {{
              scope.row.forecast_vs_plan == 0
                ? ""
                : `${formatNumberCountFixed(scope.row.forecast_vs_plan)} %`
            }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
