<template>
  <div class="relative inline-block text-left" @click="closeDropdown">
    <!-- Trigger Button -->
    <div @click.stop="toggleDropdown" class="flex items-center cursor-pointer">
      <slot name="button"></slot>
      <svg
        class="w-5 h-5 ml-2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.292 7.293a1 1 0 011.415 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
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
