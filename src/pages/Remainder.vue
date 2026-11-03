<script setup lang="ts">
import HorizontalFilter from "@/components/filter/horizontalFilter.vue";
import Header from "@/components/main/Header.vue";
import Trans from "@/i18n/translation";
import { useRemainderStore } from "@/store/RemainderStore";
import { formatNumberCount } from "@/utils/utils";
import { storeToRefs } from "pinia";
import { onBeforeMount, computed } from "vue";

const storeRemainder = useRemainderStore();
const {
  allEkspeditors,
  remainderData,
  loading,
  filterOptions,
  queryRemainder,
} = storeToRefs(storeRemainder);

onBeforeMount(() => {
  storeRemainder.FETCH_ALL_SELECT();
  storeRemainder.getRemainder();
});

const filteredMappedRemainder = computed(() => {
  try {
    loading.value = true;
    const search = queryRemainder.value.name?.toLowerCase() || "";

    return remainderData.value
      .filter((row) => {
        // Name filtering
        const combined = `${row.name} ${row.taste} ${row.volume}`.toLowerCase();
        const matchName = !search || combined.includes(search);
        return matchName;
      })
      .map((row) => {
        const map: Record<number, any> = {};
        row.list.forEach((item) => (map[item.ekspeditor_id] = item));
        return { ...row, map };
      });
  } catch (error) {
    console.error("Operation failed.");
  } finally {
    loading.value = false;
  }
});
const filteredEkspeditors = computed(() => {
  if (!queryRemainder.value.ekspeditor_id) {
    return allEkspeditors.value;
  }
  return allEkspeditors.value.filter(
    (e) => e.id === queryRemainder.value.ekspeditor_id,
  );
});
function highlightParts(text: string, search: string | undefined) {
  if (!search) return [{ text, highlighted: false }];

  const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.split(new RegExp(`(${escaped})`, "gi")).map((part, index) => ({
    text: part,
    highlighted: index % 2 === 1,
  }));
}
</script>

<template>
  <div class="border rounded-lg">
    <Header :title="Trans.t('menuItems.remainders')" />
    <HorizontalFilter :filters="filterOptions" :query="queryRemainder" />
    <el-table
      v-loading="loading"
      height="calc(100vh - 200px)"
      size="small"
      border
      :data="filteredMappedRemainder"
      header-cell-class-name="!bg-gray1 text-text !border-y"
      table-layout="auto"
    >
      <!-- Name Column -->
      <el-table-column :label="Trans.t('name')" prop="name" :width="200">
        <template #default="{ row }">
          <span>
            <template
              v-for="(part, index) in highlightParts(
                `${row.taste} ${row.name} ${row.volume} ${Trans.t('litr')}`,
                queryRemainder.name,
              )"
              :key="index"
            >
              <mark v-if="part.highlighted" class="highlight">{{ part.text }}</mark>
              <template v-else>{{ part.text }}</template>
            </template>
          </span>
        </template>
      </el-table-column>

      <!-- Dynamic Ekspeditor Columns -->
      <el-table-column
        v-for="ekspeditor in filteredEkspeditors"
        :key="ekspeditor.id"
        :label="ekspeditor.name"
        :align="queryRemainder.ekspeditor_id ? 'center' : 'right'"
      >
        <template #default="{ row }">
          <div class="flex flex-col font-bold">
            <!-- Count -->
            <el-tooltip
              :content="Trans.t('count')"
              placement="right"
              effect="light"
            >
              <span>{{
                formatNumberCount(row.map[ekspeditor.id]?.count || "")
              }}</span>
            </el-tooltip>

            <!-- Excess -->
            <el-tooltip
              :content="Trans.t('excess')"
              placement="right"
              effect="light"
            >
              <span class="text-main">
                {{ formatNumberCount(row.map[ekspeditor.id]?.free || "") }}
              </span>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.highlight {
  background: yellow;
  padding: 2px 0;
}
</style>
