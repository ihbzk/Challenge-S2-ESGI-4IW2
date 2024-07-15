<template>
    <div class="grid-stack">
        <slot></slot>
    </div>
</template>

<script setup>
    import { onMounted, ref, defineEmits } from 'vue';
    import { GridStack } from 'gridstack';
    import 'gridstack/dist/gridstack.css';

    const emit = defineEmits(['updateWidgets']);

    const isGridStackInitialized = ref(false);

    onMounted(() => {
        if (!isGridStackInitialized.value) {
            const grid = GridStack.init({
                removable: "#widgetTrash",
            });

            // à chaque changement sur un widget, on enregistre ses positions
            grid.on('change', function(event, items) {
                const updatedItems = items.map(item => ({
                    id: item.id,
                    x: item.x,
                    y: item.y,
                    width: item.w,
                    height: item.h
                }));

                emit('updateWidgets', updatedItems);
            });

            // à chaque suppression d'un widget, on enregistre son id
            grid.on('removed', function(event, items) {
                const removedItems = items.map(item => item.id);

                emit('deleteWidgets', removedItems);
            });

            isGridStackInitialized.value = true;
        }
    });
</script>

<style scoped></style>
