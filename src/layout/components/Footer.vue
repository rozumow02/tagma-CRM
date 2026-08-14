<script setup lang="ts">
// import FooterLink from "@/components/footer/link.vue";
// import FooterIcon from "@/components/footer/devloper.vue";
</script>

<template>
  <footer
    class="py-5 border-t bg-slate-950 border-gray-800 mt-10 text-zinc-300"
  >
    <div class="px-6 container max-w-5xl mx-auto">
      <div class="grid grid-cols-1">
        <!-- <FooterLink /> -->
        <!-- <FooterIcon /> -->
      </div>
      <div class="border-t border-gray-800 mt-5 text-center p-2">
        © {{ new Date().getFullYear() }} All rights reserved.
      </div>
    </div>
  </footer>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: all 0.4s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
