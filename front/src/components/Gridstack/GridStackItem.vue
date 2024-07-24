<template>
    <div class="grid-stack-item" :gs-x="x" :gs-y="y" :gs-w="w" :gs-h="h" :gs-id="id">
      <div class="grid-stack-item-content">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  // Déclarez les propriétés que ce composant attend de son parent
  const props = defineProps({
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    w: {
      type: Number,
      required: true
    },
    h: {
      type: Number,
      required: true
    },
    id: {
        type: Number,
        required: true
    }
  });
  </script>
  
  <style>
  .grid-stack-item {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .grid-stack-item-content {
    padding: 10px;
  }
  </style>
  