<template>
  <TwTable :headers="headers" :rows="logs" table-height-offset="100">
    <template #index="{ index }">
      {{ index }}
    </template>
  </TwTable>
</template>

<script setup lang="ts">
import { useLogsStore, logs, logTypes, query } from "@/store/Logs";
import TwTable from "@/components/Table/TwTable.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const headers = [
  { text: "index", value: "index" },
  { text: "logs.log_type", value: "log_type" },
  { text: "logs.info", value: "info" },
  { text: "create_at", value: "create_at" },
  { text: "user", value: "user" },
];
</script>
