<template>
  <div class="flex mt-20 flex-col justify-center items-center text-gray-800">
    <el-result
      icon="error"
      :title="t('404.title')"
      :sub-title="t('404.subTitle')"
    >
      <template #extra>
        <el-button
          type="primary"
          size="large"
          @click="goHome()"
          class="transition-all duration-300 transform hover:scale-105"
        >
          {{ t("404.goHome") }}
        </el-button>
      </template>
    </el-result>
    <div class="mt-10 text-center text-gray-600">
      <p class="text-lg">{{ t("404.message1") }}</p>
      <p class="text-sm mt-2">{{ t("404.message2") }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const { t } = useI18n();

const router = useRouter();

const goHome = () => {
  router.push({ name: "cityManager" });
};
</script>
