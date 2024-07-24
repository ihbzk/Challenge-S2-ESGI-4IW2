<template>
    <div class="mb-4">
        <label :for="id" class="block text-sm font-bold mb-2">{{ label }}</label>
        <input
            :id="id"
            :type="type"
            :placeholder="placeholder"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
        <div v-if="error" class="text-red-500 mt-1">{{ error }}</div>
    </div>
</template>
  
<script setup>
    import { defineProps, defineEmits } from 'vue';

    const props = defineProps({
        id: { type: String, required: true },
        label: { type: String, required: true },
        modelValue: { type: [String, Number], required: true },
        type: { type: String, default: 'text' },
        error: { type: String, default: '' },
        placeholder: { type: String, default: '' }
    });

    const emit = defineEmits(['update:modelValue']);
</script>
  
<style scoped></style>
  