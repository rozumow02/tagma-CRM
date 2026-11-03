<script setup lang="ts">
import { DEMO_MODE } from "@/demo/config";
import { requestApi } from "@/api";
import Draggable from "@/components/Drag/draggable.vue";
import HorizontalFilter from "@/components/filter/horizontalFilter.vue";
import Header from "@/components/main/Header.vue";
import Trans from "@/i18n/translation";
import { useRouteOrdersStore } from "@/store/routeOrders";
import type { FilterOption, ISelectAll } from "@/types";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";

const storeRouteOrders = useRouteOrdersStore();
const { allAgents, pointsByDays, query, routeOrders } =
  storeToRefs(storeRouteOrders);

const allfetch = async () => {
  const today = new Date();
  let todayDay: number = today.getDay();
  todayDay = todayDay === 0 ? 7 : todayDay;

  await storeRouteOrders.fetchAgents();
  if (allAgents.value.length) query.value.agentId = allAgents.value[0].id;
  query.value.dayId = todayDay;
  await storeRouteOrders.fetchDays();
  await storeRouteOrders.fetchData();
};

onBeforeMount(() => {
  allfetch();
});

const filters = computed<FilterOption[]>(() => [
  {
    type: "select",
    model: "agentId",
    options: allAgents.value,
    placeholder: Trans.t("points.trade_agent"),
  },
  {
    type: "select",
    model: "dayId",
    placeholder: Trans.t("week_day"),
    options: pointsByDays.value,
  },
]);
function updateRouteOrders(newOrders: any) {
  storeRouteOrders.routeOrders = newOrders;
}

const sortableDrag = () => {
  routeOrders.value = routeOrders.value.sort((a, b) => a.id - b.id);
};
</script>

<template>
  <div class="border rounded-lg">
    <Header :title="Trans.t('menuItems.routes')">
      <ElButton
        v-if="!DEMO_MODE"
        type="primary"
        @click="storeRouteOrders.FETCH_ROUTE_ORDERS_EXCEL"
      >
        {{ Trans.t("export") }}
      </ElButton>
    </Header>
    <div
      class="flex flex-col justify-between"
      style="height: calc(100vh - 150px)"
    >
      <HorizontalFilter
        :filters="filters"
        :query="query"
        class="border-b"
        @update-query="storeRouteOrders.fetchData"
      />
      <Draggable
        :model-value="routeOrders"
        @update:model-value="updateRouteOrders"
      />
      <div class="border-t">
        <!-- <ElButton class="flex justify-center m-3" @click="sortableDrag">{{
          Trans.t("orginal_state")
        }}</ElButton> -->
        <ElButton
          class="flex justify-center m-3"
          type="primary"
          :disabled="!routeOrders.length"
          @click="storeRouteOrders.handleSubmit(routeOrders)"
          >{{ Trans.t("save_changes") }}</ElButton
        >
      </div>
    </div>
  </div>
</template>
