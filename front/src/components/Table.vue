<template>
    <div class="overflow-x-auto">
        <table class="min-w-full bg-white">
            <thead>
                <tr>
                    <th v-for="(header, index) in headers" :key="index" class="px-4 py-2 text-center">
                        {{ header }}
                    </th>
                    <th class="px-4 py-2 text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, rowIndex) in rows" :key="rowIndex" class="border-t">
                    <td v-for="(cell, cellIndex) in Object.values(row)" :key="cellIndex" class="px-4 py-2 text-center">
                        <span v-if="headers[cellIndex] === 'Illustration'" v-html="cell"></span>
                        <span v-else>{{ cell }}</span>
                    </td>
                    <td class="px-4 py-2">
                        <button @click="$emit('edit-row', rowIndex)" class="text-blue-500">Edit</button>
                        <button @click="$emit('delete-row', rowIndex)" class="text-red-500 ml-2">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    headers: {
        type: Array,
        required: true
    },
    rows: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['edit-row', 'delete-row']);
</script>

<style scoped></style>