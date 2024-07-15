<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50" v-if="visible">
    <div class="bg-white p-5 rounded-lg relative max-w-md w-full z-50">
      <slot></slot>
      <button class="absolute top-2 right-2 text-xl text-gray-700 hover:text-gray-900" @click="closePopup">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  }
});

const emits = defineEmits(['close']);

const closePopup = () => {
  emits('close');
};
</script>
