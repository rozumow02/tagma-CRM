<script setup lang="ts">
import { ElConfigProvider } from "element-plus";
import Footer from "./Footer.vue";
import Navbar from "./Navbar.vue";
import SideBar from "./SideBar.vue";
const { locale } = useI18n();
import tm from "element-plus/es/locale/lang/tk";
import ru from "element-plus/es/locale/lang/ru";
const computeLocale = computed(() => {
  return Trans.currentLocale == "ru" ? ru : tm;
});
import Trans from "@/i18n/translation";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
</script>

<template>
  <el-config-provider :locale="computeLocale" size="large">
    <div class="flex h-screen">
      <!-- Sidebar -->
      <SideBar class="w-64 border-r" />

      <div class="flex-1 overflow-auto flex flex-col">
        <!-- Navbar -->
        <!-- <Navbar class="" /> -->
        <main class="flex-1 p-6" :key="locale">
          <router-view />
        </main>

        <!-- Footer -->
        <!-- <Footer class="" /> -->
      </div>
    </div>
  </el-config-provider>
</template>
