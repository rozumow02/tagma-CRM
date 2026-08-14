<script setup lang="ts">
import { useI18n } from "vue-i18n";

import ChannelsTable from "@/views/TradeChannels/ChannelsTable.vue";
import ConnectChannels from "@/views/TradeChannels/ConnectChannels.vue";
import { useChannelsStore, query, allTypes } from "@/store/Channels/Channels";
import { computed } from "vue";
import type { FilterOption } from "@/types";

const { t } = useI18n();
const { FETCH_CHANNELS } = useChannelsStore();

const changePage = (page: number) => {
  query.pageNumber = page;
  FETCH_CHANNELS();
};

const changeSize = (size: number) => {
  query.pageNumber = 1;
  query.pageSize = size;
  FETCH_CHANNELS();
};
const filtersTradeChannel = computed<FilterOption[]>(() => [
  {
    model: "typeId",
    type: "select",
    options: allTypes.value,
    placeholder: t("channels.type"),
  },
]);
</script>

<template>
  <div class="border rounded-lg">
    <Header :title="t('menuItems.tradeChannels')">
      <template #default>
        <ConnectChannels />
      </template>
    </Header>
    <HorizontalFilter
      :filters="filtersTradeChannel"
      :query="query"
      @update-query="FETCH_CHANNELS"
    />
    <ChannelsTable />
  </div>

  <ElPagination
    v-model:current-page="query.pageNumber"
    v-model:page-size="query.pageSize"
    :prev-text="t('pagination.previous')"
    :next-text="t('pagination.next')"
    popper-class="!bg-gray1 !m-0"
    layout="prev, pager, next, sizes"
    :total="query.pageCount * query.pageSize"
    :page-count="query.pageCount"
    class="!text-gray3 !font-medium mt-6"
    :page-sizes="[10, 50, 100, 200, 300, 400, 500]"
    :default-page-size="query.pageNumber"
    background
    @current-change="changePage"
    @size-change="changeSize"
  >
  </ElPagination>
</template>
