<template>
  <div class="relative inline-block text-left" @click="closeDropdown">
    <!-- Trigger Button -->
    <div @click.stop="toggleDropdown" class="flex items-center cursor-pointer">
      <slot name="button"></slot>
      <ArrowDown
        class="w-5 h-5 ml-2"
        aria-hidden="true"
        focusable="false"
      />
    </div>

    <!-- Dropdown Menu with Transition -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10"
      >
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown } from "@element-plus/icons-vue";
import { ref } from "vue";

// Dropdown state
const isOpen = ref(false);

// Toggle dropdown visibility
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// Close dropdown when clicking outside
const closeDropdown = (event: MouseEvent) => {
  if (isOpen.value) {
    const target = event.target as HTMLElement;
    if (!target.closest(".relative")) {
      isOpen.value = false;
    }
  }
};

// Close dropdown on document click
document.addEventListener("mousedown", closeDropdown);
</script>

<style scoped>
/* Transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
  .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

/* Adjust dropdown position */
.absolute {
  position: absolute;
  top: 100%; /* Dropdown menu can be placed directly below the button */
}
</style>
