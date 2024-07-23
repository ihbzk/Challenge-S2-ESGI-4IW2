<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

const products = ref([]);
const category = ref({});
const route = useRoute();
const selectedSortOption = ref('Les plus populaires')

const sortOptions = [
    { id: 'Les plus populaires', name: 'Les plus populaires', current: true },
    { id: 'Les mieux notés', name: 'Les mieux notés', current: false },
    { id: 'Les nouveautés', name: 'Les nouveautés', current: false },
    { id: 'Prix croissant', name: 'Prix croissant', current: false },
    { id: 'Prix décroissant', name: 'Prix décroissant', current: false },
]

onMounted(async () => {
    const categoryId = route.params.id;
    try {
        const categoryResponse = await fetch(`${import.meta.env.VITE_API_URL}/categories/${categoryId}`);
        category.value = await categoryResponse.json();

        const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/${categoryId}/products`);
        products.value = await response.json();
    } catch (error) {
        console.error('Error fetching category or products:', error);
    }
});

const sortProducts = (sortOption) => {
    selectedSortOption.value = sortOption

    switch (sortOption) {
        case 'Les plus populaires':
            products.value.sort((a, b) => b.popularity - a.popularity)
            break
        case 'Les mieux notés':
            products.value.sort((a, b) => b.rating - a.rating)
            break
        case 'Les nouveautés':
            products.value.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
            break
        case 'Prix croissant':
            products.value.sort((a, b) => a.price - b.price)
            break
        case 'Prix décroissant':
            products.value.sort((a, b) => b.price - a.price)
            break
    }
}

const sortedProducts = computed(() => {
    return products.value
})
</script>

<template>
    <main class="bg-white">
        <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl">
            <div class="flex items-center justify-between">
                <h1 class="text-2xl font-bold tracking-tight text-gray-900">{{ category.name }}</h1>
                <Menu as="div" class="relative inline-block text-left">
                    <div>
                        <MenuButton
                            class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                            Trier - {{ selectedSortOption }}
                            <ChevronDownIcon
                                class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true" />
                        </MenuButton>
                    </div>
                    <transition enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95">
                        <MenuItems
                            class="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div class="py-1">
                                <MenuItem v-for="option in sortOptions" :key="option.name" v-slot="{ active }">
                                <a href="#" @click.prevent="sortProducts(option.id)"
                                    :class="[option.current ? 'font-medium text-gray-900' : 'text-gray-500', active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm']">{{
                                        option.name }}</a>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </transition>
                </Menu>
            </div>
            <div class="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                <div v-for="product in sortedProducts" :key="product.id" class="group relative">
                    <div
                        class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                        <img :src="product.illustration" alt="product.description"
                            class="h-full w-full object-cover object-center lg:h-full lg:w-full">
                    </div>
                    <div class="mt-4 flex justify-between">
                        <div>
                            <h3 class="text-sm text-gray-700">
                                <router-link :to="{ name: 'ProductDetail', params: { id: product.id } }">
                                    <span aria-hidden="true" class="absolute inset-0"></span>
                                    {{ product.productName }}
                                </router-link>
                            </h3>
                            <p class="mt-1 text-sm text-gray-500">{{ product.Brand?.name }}</p>
                        </div>
                        <p class="text-sm font-medium text-gray-900">{{ product.price }}€</p>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped></style>
