<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import {
  CONTROL,
  MAGNITUDE,
  STRUCTURE,
  TYPE,
  type ITRADE_CHANNELS,
} from "@/constants";
import DialogUpdate from "@/views/TradeChannels/DialogUpdate.vue";
import CardComponent from "@/views/TradeChannels/CardComponent.vue";
import AddCannels from "@/views/TradeChannels/AddCannels.vue";
import {
  useSettingChannelsStore,
  sizes,
  types,
  structures,
  managments,
} from "@/store/Channels/Setting";
const { FETCH_CHANNELS_GROUP } = useSettingChannelsStore();

onMounted(async () => {
  await FETCH_CHANNELS_GROUP();
});

const items = computed(() => [
  { title: "channels.type", items: types.value, channel: TYPE },
  { title: "channels.structure", items: structures.value, channel: STRUCTURE },
  { title: "channels.size", items: sizes.value, channel: MAGNITUDE },
  { title: "channels.management", items: managments.value, channel: CONTROL },
]);
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2 gap-6">
    <AddCannels />
    <DialogUpdate />
    <CardComponent
      v-for="(item, i) in items"
      :key="item.channel"
      :items="item.items"
      :title="t(`${item.title}`)"
      :channel="item.channel"
    />
  </div>
</template>
