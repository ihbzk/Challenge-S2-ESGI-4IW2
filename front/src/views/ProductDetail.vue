<script setup lang="ts">
import TheHeader from '../components/Header/Header.vue'
import TheFooter from '../components/Footer/Footer.vue'
import { computed, reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Disclosure, DisclosureButton, DisclosurePanel, RadioGroup, RadioGroupOption, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import { HeartIcon, MinusIcon, PlusIcon, StarIcon } from '@heroicons/vue/24/outline'
import type { ProductCartInterface, ProductInterface, CategoryInterface } from '../interfaces'

const state = reactive<{
    product: ProductInterface | null
    cart: ProductCartInterface[]
}>({
    product: null,
    cart: []
})

const selectedColor = ref<ProductInterface['colors'][number] | null>(null)
const route = useRoute()

const products = ref<ProductInterface[]>([])
const categories = ref<CategoryInterface[]>([])

const fetchProduct = async (id: number) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`)
        const data = await response.json()
        state.product = data

        if (state.product && state.product.colors && state.product.colors.length > 0) {
            selectedColor.value = state.product.colors[0]
        }
    } catch (err) {
        console.error('Erreur lors de la récupération du produit:', err)
    }
}

const fetchProducts = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products`)
        const data = await response.json()
        products.value = data
    } catch (err) {
        console.error('Erreur lors de la récupération des produits:', err)
    }
}

const fetchCategories = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`)
        const data = await response.json()
        categories.value = data
    } catch (err) {
        console.error('Erreur lors de la récupération des catégories:', err)
    }
}

const cartOpen = ref(false)

const addProductToCart = (productId: number) => {
  const product = products.value.find(product => product.id === productId);
  if (product) {
    const productInCart = state.cart.find(product => product.id === productId);
    if (productInCart) {
      productInCart.quantity++;
    } else {
      state.cart.push({ ...product, quantity: 1 });
    }
    cartOpen.value = true;
  }
};

const removeProductFromCart = (productId: number): void => {
    const productFromCart = state.cart.find((product) => product.id === productId)
    if (productFromCart) {
        if (productFromCart.quantity === 1) {
            state.cart = state.cart.filter((product) => product.id !== productId)
        } else {
            productFromCart.quantity--
        }
    }
}

const cartEmpty = computed(() => state.cart.length === 0)

onMounted(() => {
    const productId = Number(route.params.id)
    fetchProduct(productId)
    fetchProducts()
    fetchCategories()
})
</script>

<template>
    <div class="bg-white">
        <TheHeader :products="products" :categories="categories" :cart="state.cart" :cart-open="cartOpen"
            @remove-product-from-cart="removeProductFromCart" @open-cart="cartOpen = true" />
        <main v-if="state.product">
            <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <div class="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                    <TabGroup as="div" class="flex flex-col-reverse">
                        <div class="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                            <TabList class="grid grid-cols-4 gap-6">
                                <Tab v-for="image in state.product.images" :key="image.id"
                                    class="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                                    v-slot="{ selected }">
                                    <span class="sr-only">{{ image.name }}</span>
                                    <span class="absolute inset-0 overflow-hidden rounded-md">
                                        <img :src="image.src" alt="" class="h-full w-full object-cover object-center" />
                                    </span>
                                    <span
                                        :class="[selected ? 'ring-indigo-500' : 'ring-transparent', 'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2']"
                                        aria-hidden="true" />
                                </Tab>
                            </TabList>
                        </div>
                        <div class="aspect-h-1 aspect-w-1 w-full">
                            <img :src="state.product.illustration"
                                class="h-full w-full object-cover object-center sm:rounded-lg" />
                        </div>
                    </TabGroup>
                    <div class="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                        <h1 class="text-3xl font-bold tracking-tight text-gray-900">
                            {{ state.product.Brand.name }} {{ state.product.productName }}
                        </h1>
                        <div class="mt-3">
                            <h2 class="sr-only">Product information</h2>
                            <p class="text-3xl tracking-tight text-gray-900">{{ state.product.price }}€</p>
                        </div>
                        <div class="mt-3" v-if="state.product.rating">
                            <h3 class="sr-only">Reviews</h3>
                            <div class="flex items-center">
                                <div class="flex items-center">
                                    <StarIcon v-for="rating in [0, 1, 2, 3, 4]" :key="rating"
                                        :class="[state.product.rating > rating ? 'text-indigo-500' : 'text-gray-300', 'h-5 w-5 flex-shrink-0']"
                                        aria-hidden="true" />
                                </div>
                                <p class="sr-only">{{ state.product.rating }} out of 5 stars</p>
                            </div>
                        </div>
                        <div class="mt-6">
                            <h3 class="sr-only">Description</h3>
                            <div class="space-y-6 text-base text-gray-700" v-html="state.product.description" />
                        </div>
                        <form class="mt-6">
                            <div v-if="state.product.colors && state.product.colors.length">
                                <h3 class="text-sm font-medium text-gray-600">Color</h3>
                                <fieldset aria-label="Choose a color" class="mt-2">
                                    <RadioGroup v-model="selectedColor" class="flex items-center space-x-3">
                                        <RadioGroupOption as="template" v-for="color in state.product.colors"
                                            :key="color.name" :value="color" :aria-label="color.name"
                                            v-slot="{ active, checked }">
                                            <div
                                                :class="[color.selectedColor, active && checked ? 'ring ring-offset-1' : '', !active && checked ? 'ring-2' : '', 'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none']">
                                                <span aria-hidden="true"
                                                    :class="[color.bgColor, 'h-8 w-8 rounded-full border border-black border-opacity-10']" />
                                            </div>
                                        </RadioGroupOption>
                                    </RadioGroup>
                                </fieldset>
                            </div>
                            <div class="mt-10 flex">
                                <button @click.prevent="addProductToCart(state.product.id!)"
                                    class="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full">Ajouter
                                    au panier</button>
                                <button type="button"
                                    class="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                                    <HeartIcon class="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                                    <span class="sr-only">Add to favorites</span>
                                </button>
                            </div>
                        </form>
                        <section aria-labelledby="details-heading" class="mt-12">
                            <h2 id="details-heading" class="sr-only">Additional details</h2>
                            <div class="divide-y divide-gray-200 border-t">
                                <Disclosure as="div" v-for="detail in state.product.details" :key="detail.name"
                                    v-slot="{ open }">
                                    <h3>
                                        <DisclosureButton
                                            class="group relative flex w-full items-center justify-between py-6 text-left">
                                            <span
                                                :class="[open ? 'text-indigo-600' : 'text-gray-900', 'text-sm font-medium']">{{
                                                    detail.name }}</span>
                                            <span class="ml-6 flex items-center">
                                                <PlusIcon v-if="!open"
                                                    class="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                                    aria-hidden="true" />
                                                <MinusIcon v-else
                                                    class="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                                                    aria-hidden="true" />
                                            </span>
                                        </DisclosureButton>
                                    </h3>
                                    <DisclosurePanel as="div" class="prose prose-sm pb-6">
                                        <ul role="list">
                                            <li v-for="item in detail.items" :key="item">{{ item }}</li>
                                        </ul>
                                    </DisclosurePanel>
                                </Disclosure>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
        <TheFooter />
    </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/base.scss' as *;
</style>
