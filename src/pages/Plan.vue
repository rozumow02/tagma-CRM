<script setup lang="ts">
import Header from "@/components/main/Header.vue";
import Trans from "@/i18n/translation";
import { usePlanStore } from "@/store/Plan";
import type { IPlan } from "@/types";
import { formatNumber, formatNumberCount } from "@/utils/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import { Edit, Plus } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from "vue";

const storePlan = usePlanStore();
const { allProducts, allAgets, plans, formPlan, dialogs, query } =
  storeToRefs(storePlan);

onBeforeMount(() => storePlan.FETCH_ALL_SELECT());
onMounted(() => storePlan.FETCH_PLANS());

const countsMap = ref<Record<number, Record<number, number>>>({});

// Auto-planning state
const productTotalByProduct = ref<Record<number, number>>({});
const agentPercentByBrand = ref<Record<number, Record<number, number>>>({});
const mode = ref<"manual" | "auto">("auto");

watch(
  plans,
  (newPlans) => {
    const map: Record<number, Record<number, number>> = {};
    newPlans.forEach((plan) => {
      map[plan.product_id] = { ...plan.list };
    });
    countsMap.value = map;
    initTotalsAndPercentsFromCounts();
  },
  { immediate: true },
);
/**
 * 2D reactive object: product_id -> agent_id -> count
 */
// const countsMap = reactive<Record<number, Record<number, number>>>({});

onMounted(() => {
  // Init with zeros
  for (const product of allProducts.value) {
    if (!countsMap.value[product.Id]) countsMap.value[product.Id] = {};
    for (const agent of allAgets.value) {
      countsMap.value[product.Id][agent.id] = 0;
    }
  }

  // Load from plans
  for (const plan of plans.value) {
    const { product_id, list } = plan;
    if (!countsMap.value[product_id]) countsMap.value[product_id] = {};
    for (const [agentIdStr, count] of Object.entries(list)) {
      const agentId = Number(agentIdStr);
      countsMap.value[product_id][agentId] = count;
    }
  }
});

function initTotalsAndPercentsFromCounts() {
  if (allProducts.value.length === 0 || allAgets.value.length === 0) return;
  // Initialize product totals from existing counts
  for (const product of allProducts.value) {
    const counts = countsMap.value[product.Id] || {};
    const total = allAgets.value.reduce(
      (sum, agent) => sum + (counts[agent.id] || 0),
      0,
    );
    productTotalByProduct.value[product.Id] = total;
  }

  // Initialize agent percents per brand from existing counts
  const brandToAgentSum: Record<number, Record<number, number>> = {};
  for (const product of allProducts.value) {
    const brandId = product.group_id;
    if (!brandToAgentSum[brandId]) brandToAgentSum[brandId] = {};
    for (const agent of allAgets.value) {
      const count = countsMap.value[product.Id]?.[agent.id] || 0;
      brandToAgentSum[brandId][agent.id] =
        (brandToAgentSum[brandId][agent.id] || 0) + count;
    }
  }
  for (const [brandIdStr, agentSumMap] of Object.entries(brandToAgentSum)) {
    const brandId = Number(brandIdStr);
    const total = Object.values(agentSumMap).reduce((a, b) => a + b, 0);
    agentPercentByBrand.value[brandId] = {};
    if (total > 0) {
      for (const agent of allAgets.value) {
        const pct = ((agentSumMap[agent.id] || 0) * 100) / total;
        agentPercentByBrand.value[brandId][agent.id] = Number(pct.toFixed(2));
      }
    } else {
      const equal = allAgets.value.length
        ? Number((100 / allAgets.value.length).toFixed(2))
        : 0;
      for (const agent of allAgets.value) {
        agentPercentByBrand.value[brandId][agent.id] = equal;
      }
    }
  }
}

watch([allProducts, allAgets], () => {
  // If plans already loaded and products/agents are now available, initialize
  if (plans.value.length > 0) initTotalsAndPercentsFromCounts();
});

// Fair distribution helper using largest remainder method
function distributeWithRemainders(total: number, weights: number[]) {
  const sumWeights = weights.reduce((a, b) => a + b, 0);
  if (total <= 0 || sumWeights <= 0) return new Array(weights.length).fill(0);
  const raws = weights.map((w) => (total * w) / sumWeights);
  const floors = raws.map((v) => Math.floor(v));
  let remainder = total - floors.reduce((a, b) => a + b, 0);
  const order = raws
    .map((v, i) => [i, v - floors[i]] as const)
    .sort((a, b) => b[1] - a[1])
    .map(([i]) => i);
  const result = [...floors];
  for (let k = 0; k < order.length && remainder > 0; k += 1) {
    result[order[k]] += 1;
    remainder -= 1;
  }
  return result;
}

function recomputeCounts() {
  if (mode.value !== "auto") return;
  for (const product of allProducts.value) {
    const brandId = product.group_id;
    const total = productTotalByProduct.value[product.Id] ?? 0;
    const percentsMap =
      total > 0 ? agentPercentByBrand.value[brandId] || {} : {};
    const agents = allAgets.value.map((a) => a.id);
    const weights = agents.map((aid) => Math.max(0, percentsMap[aid] ?? 0));
    const distributed = distributeWithRemainders(total, weights);
    if (!countsMap.value[product.Id]) countsMap.value[product.Id] = {};
    agents.forEach((aid, idx) => {
      countsMap.value[product.Id][aid] = distributed[idx];
    });
  }
}

watch(
  [productTotalByProduct, agentPercentByBrand, mode],
  () => {
    recomputeCounts();
  },
  { deep: true },
);

const formattedRows = computed(() => {
  const result: any[] = [];
  const grouped = new Map<number, any[]>();

  for (const product of allProducts.value) {
    const row = {
      product: product.taste,
      brand: `${product.name} ${product.volume} ${Trans.t("litr")}`,
      brand_id: product.group_id,
      product_id: product.Id,
      counts: countsMap.value[product.Id] || {},
    };

    if (!grouped.has(product.group_id)) grouped.set(product.group_id, []);
    grouped.get(product.group_id)!.push(row);
  }

  const totalRow: any = {
    product: Trans.t("general_sales"),
    brand: "",
    counts: {},
    total: 0,
    groupTotal: true,
    planTotal: 0,
  };
  allAgets.value.forEach((agent) => (totalRow.counts[agent.id] = 0));

  for (const [brand_id, rows] of grouped.entries()) {
    // Insert a brand-level percent editor row above products
    result.push({
      product: "",
      brand: "",
      brand_id,
      counts: {},
      percentRow: true,
      total: 0,
      rowspan: 0,
    });
    const subtotalRow: any = {
      product: `${Trans.t("total")}: ${rows[0].brand}`,
      brand: rows[0].brand,
      brand_id,
      counts: {},
      groupTotal: true,
      total: 0,
      planTotal: 0,
    };
    allAgets.value.forEach((agent) => (subtotalRow.counts[agent.id] = 0));

    rows.forEach((row, index) => {
      const rowTotal = allAgets.value.reduce(
        (sum, agent) => sum + (row.counts[agent.id] || 0),
        0,
      );
      const productPlanTotal = productTotalByProduct.value[row.product_id] || 0;
      result.push({
        ...row,
        total: rowTotal,
        rowspan: index === 0 ? rows.length + 1 : 0,
      });

      allAgets.value.forEach((agent) => {
        subtotalRow.counts[agent.id] += row.counts[agent.id] || 0;
        totalRow.counts[agent.id] += row.counts[agent.id] || 0;
      });
      subtotalRow.total += rowTotal;
      totalRow.total += rowTotal;
      subtotalRow.planTotal += productPlanTotal;
      totalRow.planTotal += productPlanTotal;
    });

    result.push({ ...subtotalRow, rowspan: 0 });
  }

  result.unshift({ ...totalRow, rowspan: 0 });

  return result;
});

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  if (column.property === "brand") {
    // Percent editor row should not merge brand cell
    if (row.percentRow) return { rowspan: 1, colspan: 1 };

    const currentBrand = row.brand_id;
    const prevRow = formattedRows.value[rowIndex - 1];

    const isRowspan =
      prevRow && prevRow?.brand_id === currentBrand && !prevRow?.percentRow;
    if (isRowspan) return { rowspan: 0, colspan: 0 };

    // Count product rows only (exclude percentRow and groupTotal rows)
    const rowspan = formattedRows.value.filter(
      (r) => r.brand_id === currentBrand && !r.percentRow,
    ).length;
    return { rowspan, colspan: 1 };
  }
};

const tableRowClassName = ({ row }: { row: any }) =>
  row.groupTotal ? "font-bold" : "";

const submit = (isAdd: boolean) => {
  formPlan.value = [];
  for (const productId in countsMap.value) {
    const list: Record<number, number> = {};
    for (const agentId in countsMap.value[productId]) {
      const count = countsMap.value[productId][agentId];
      if (count > 0) list[Number(agentId)] = count;
    }

    formPlan.value.push({
      product_id: Number(productId),
      list,
    });
  }
  if (isAdd) {
    storePlan.CREATE_PLAN();
  } else {
    storePlan.UPDATE_PLANS();
  }
};

const getCount = (productId: number, agentId: number): number => {
  return countsMap.value[productId]?.[agentId] ?? 0;
};

const setCount = (productId: number, agentId: number, value: number) => {
  if (!countsMap.value[productId]) {
    countsMap.value[productId] = {};
  }
  countsMap.value[productId][agentId] = value;
};

const getProductTotal = (productId: number): number => {
  return productTotalByProduct.value[productId] ?? 0;
};

const setProductTotal = (productId: number, value: number) => {
  productTotalByProduct.value[productId] = Math.max(0, Number(value) || 0);
};

const getAgentPercent = (brandId: number, agentId: number): number => {
  return agentPercentByBrand.value[brandId]?.[agentId] ?? 0;
};

const setAgentPercent = (brandId: number, agentId: number, value: number) => {
  if (!agentPercentByBrand.value[brandId]) {
    agentPercentByBrand.value[brandId] = {};
  }
  const v = Number(value);
  agentPercentByBrand.value[brandId][agentId] = isNaN(v) ? 0 : Math.max(0, v);
};

const getBrandPercentSum = (brandId: number): number => {
  const map = agentPercentByBrand.value[brandId] || {};
  const sum = allAgets.value.reduce((acc, ag) => acc + (map[ag.id] || 0), 0);
  return Number(sum.toFixed(2));
};

const isBrandPercentSumValid = (brandId: number): boolean => {
  const sum = getBrandPercentSum(brandId);
  return Math.abs(sum - 100) < 0.01;
};

const getBrandProducts = (brandId: number) => {
  return allProducts.value.filter((p) => p.group_id === brandId);
};

const getBrandTotalsSum = (brandId: number): number => {
  const products = getBrandProducts(brandId);
  const total = products.reduce(
    (acc, p) => acc + (productTotalByProduct.value[p.Id] || 0),
    0,
  );
  return total;
};

const getEffectiveAgentPercent = (brandId: number, agentId: number): number => {
  const brandTotal = getBrandTotalsSum(brandId);
  if (brandTotal <= 0) return 0;
  return getAgentPercent(brandId, agentId);
};

const getEffectiveBrandPercentSum = (brandId: number): number => {
  const brandTotal = getBrandTotalsSum(brandId);
  if (brandTotal <= 0) return 0;
  return getBrandPercentSum(brandId);
};

const edit = () => {
  if (dialogs.value.update) {
    submit(false);
  } else {
    dialogs.value.update = true;
  }
};

const newAddPlan = () => {
  if (dialogs.value.add) submit(true);
  else dialogs.value.add = true;
};

const cancel = () => {
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
      dialogs.value.update = false;
      storePlan.FETCH_PLANS();
    })
    .catch(() => {
      // catch error
    });
};
</script>

<template>
  <div class="border rounded-lg">
    <Header :title="Trans.t('menuItems.plan')">
      <div class="flex">
        <el-button type="primary" @click="newAddPlan" v-if="plans.length === 0">
          <Plus :size="16" class="mr-2" />
          {{ dialogs.update ? Trans.t("save_changes") : Trans.t("add") }}
        </el-button>
        <el-button type="primary" @click="edit" v-else>
          <Edit :size="16" class="mr-2" />
          {{ dialogs.update ? Trans.t("save_changes") : Trans.t("edit") }}
        </el-button>
        <el-button v-if="dialogs.update || dialogs.add" @click="cancel">
          {{ Trans.t("cancel") }}</el-button
        >
        <div class="ml-6 flex items-center gap-2">
          <span class="text-sm text-text">{{
            mode === "auto" ? Trans.t("auto") : Trans.t("odinochnyy")
          }}</span>
          <el-switch
            v-model="mode"
            :active-value="'auto'"
            :inactive-value="'manual'"
            :disabled="!(dialogs.update || dialogs.add)"
          />
        </div>
      </div>
    </Header>
    <div class="p-4 justify-center lg:justify-start flex flex-wrap gap-4">
      <el-date-picker
        @change="storePlan.FETCH_PLANS"
        :clearable="false"
        v-model="query.year"
        format="YYYY"
        value-format="YYYY"
        type="year"
        :placeholder="Trans.t('pick_year')"
      />
      <el-date-picker
        @change="storePlan.FETCH_PLANS"
        :clearable="false"
        v-model="query.month"
        format="MM"
        value-format="MM"
        type="month"
        :placeholder="Trans.t('pick_month')"
      />
    </div>
    <el-table
      size="small"
      height="calc(100vh - 250px)"
      :data="formattedRows"
      border
      :row-class-name="tableRowClassName"
      :span-method="objectSpanMethod"
      header-cell-class-name="!bg-gray1 text-text !border-y"
      table-layout="auto"
    >
      <el-table-column :label="Trans.t('brand_volume')" prop="brand">
        <template #default="{ row }">
          <div class="flex items-center gap-2">
            <span>{{ row.brand }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="Trans.t('name')" prop="product">
        <template #default="{ row }">
          <span v-if="!row.percentRow && !row.groupTotal">{{
            row.product
          }}</span>
        </template>
      </el-table-column>
      <!-- Unified Sum column: percent tag, product totals, subtotals -->
      <el-table-column :label="Trans.t('sum')">
        <template #default="{ row }">
          <template v-if="row.percentRow">
            <el-tag
              :type="
                getEffectiveBrandPercentSum(row.brand_id) === 100
                  ? 'success'
                  : 'danger'
              "
              size="small"
            >
              {{ getEffectiveBrandPercentSum(row.brand_id).toFixed(2) }}%
            </el-tag>
          </template>
          <template v-else-if="row.groupTotal">
            <span>{{
              mode === "auto"
                ? (formatNumberCount(row.planTotal) ?? 0)
                : (formatNumberCount(row.total) ?? 0)
            }}</span>
          </template>
          <template v-else>
            <template v-if="mode === 'auto'">
              <el-input-number
                v-if="dialogs.update || dialogs.add"
                :model-value="getProductTotal(row.product_id)"
                @update:model-value="
                  (val: number) => setProductTotal(row.product_id, val)
                "
                :min="0"
                :controls="false"
                size="small"
              />
              <span v-else>{{
                formatNumberCount(getProductTotal(row.product_id))
              }}</span>
            </template>
            <template v-else>
              <span>{{ formatNumberCount(row.total) }}</span>
            </template>
          </template>
        </template>
      </el-table-column>

      <el-table-column
        v-for="agent in allAgets"
        :key="agent.id"
        :label="agent.name"
      >
        <template #default="{ row }">
          <!-- Percent editor row -->
          <template v-if="row.percentRow">
            <template v-if="mode === 'auto'">
              <el-input-number
                v-if="dialogs.update || dialogs.add"
                :model-value="getEffectiveAgentPercent(row.brand_id, agent.id)"
                @update:model-value="
                  (val: number) => setAgentPercent(row.brand_id, agent.id, val)
                "
                :min="0"
                :max="100"
                :precision="2"
                :step="0.1"
                :controls="false"
                size="small"
              />
              <span v-else>
                {{
                  getEffectiveAgentPercent(row.brand_id, agent.id).toFixed(2)
                }}%
              </span>
            </template>
            <template v-else>
              <span>-</span>
            </template>
          </template>

          <!-- Product rows -->
          <template v-else-if="!row.groupTotal">
            <template v-if="mode === 'manual'">
              <el-input-number
                v-if="dialogs.update || dialogs.add"
                :model-value="getCount(row.product_id, agent.id)"
                @update:model-value="
                  (val: number) => setCount(row.product_id, agent.id, val)
                "
                :min="0"
                :controls="false"
                size="small"
              />
              <span v-else>
                {{ formatNumberCount(row.counts[agent.id]) }}ggggg
              </span>
            </template>
            <template v-else>
              <span>{{ formatNumberCount(row.counts[agent.id]) }}</span>
            </template>
          </template>

          <!-- Subtotal rows: counts only -->
          <template v-else>
            <span>{{ formatNumberCount(row.counts[agent.id]) }}</span>
          </template>
        </template>
      </el-table-column>

      <!-- Remove separate Total column since Sum is unified -->
    </el-table>

    <div class="mt-4 text-right px-4"></div>
  </div>
</template>
