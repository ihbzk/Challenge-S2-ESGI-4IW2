<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
      <slot></slot>
      <div class="flex justify-end">
        <button @click="onClose" class="px-4 py-2 mr-2 bg-gray-500 text-white rounded">Annuler</button>
        <button @click="onConfirm" class="px-4 py-2 bg-green-500 text-white rounded">{{ confirmText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineProps, defineEmits } from 'vue';

  const props = defineProps({
    isOpen: Boolean,
    title: String,
    confirmText: {
      type: String,
      default: 'Confirmer',
    },
  });

  const emits = defineEmits(['close', 'confirm']);

  const onClose = () => emits('close');
  const onConfirm = () => emits('confirm');
</script>

<style scoped></style>
