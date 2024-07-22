<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    categories: {
        type: Array,
        required: true
    }
});

const images = [
    "https://img.freepik.com/photos-gratuite/close-up-mains-hommes-utilisant-ordinateur-portable-maison_1150-790.jpg",
    "https://img.freepik.com/photos-gratuite/jeune-femme-travaillant-tablette_23-2147859240.jpg",
    "https://img.freepik.com/photos-gratuite/gros-plan-male-technicien-tenue-moderne-informatique-carte-mere_23-2147883867.jpg",
    "https://img.freepik.com/photos-gratuite/arrangement-collecte-stationnaire-moderne_23-2149309649.jpg",
    "https://img.freepik.com/photos-gratuite/gros-plan-homme-reparant-puces-informatiques_23-2150880997.jpg",
    "https://img.freepik.com/photos-gratuite/ordinateur-portable-surface-pierre-mer-fond_1232-430.jpg",
    "https://img.freepik.com/photos-gratuite/gros-plan-clavier-ordinateur-portable-clavier-retroeclaire-eclairage-neon-colore_169016-29227.jpg",
    "https://img.freepik.com/photos-gratuite/crop-man-holding-camera-dans-bureau_23-2147772280.jpg",
    "https://img.freepik.com/photos-gratuite/gros-plan-male-technicien-reparation-cpu-socket-table-bois_23-2147883807.jpg",
    "https://img.freepik.com/photos-gratuite/commutateur-reseau-cables_1137-6.jpg"
];

function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
}
</script>

<template>
    <div class="grid grid-cols-1 gap-y-12 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-16 lg:gap-x-8">
        <div v-for="category in categories" :key="category.id" class="group relative">
            <router-link :to="{ name: 'CategoryProducts', params: { id: category.id } }">
                <div
                    class="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                    <img :src="getRandomImage()" alt="Category Image"
                        class="h-full w-full object-cover object-center" />
                </div>
                <h3 class="mt-6 text-sm text-gray-500">
                    {{ category.name }}
                </h3>
            </router-link>
        </div>
    </div>
</template>

<style scoped></style>