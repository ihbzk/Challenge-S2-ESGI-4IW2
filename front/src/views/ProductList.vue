<script setup lang="ts">
import Cart from '../components/Cart/Cart.vue'
import { computed, reactive, ref, onMounted } from 'vue'
import { StarIcon } from '@heroicons/vue/20/solid'
import { ShoppingCartIcon, XMarkIcon, ChevronDownIcon, FunnelIcon, PlusIcon, MinusIcon, Squares2X2Icon } from '@heroicons/vue/24/outline'
import { Dialog, DialogPanel, Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems, TransitionChild, TransitionRoot } from '@headlessui/vue'
import type { ProductCartInterface, ProductInterface, CategoryInterface } from '../interfaces'

const state = reactive<{
  products: ProductInterface[]
  cart: ProductCartInterface[]
  categories: CategoryInterface[]
  filters: Array<{ id: string; name: string; options: Array<{ value: string; label: string; checked: boolean }> }>
}>({
  products: [],
  cart: [],
  categories: [],
  filters: []
})

const cartOpen = ref(false)
const selectedCategory = ref<number | null>(null)
const mobileFiltersOpen = ref(false)
const selectedSortOption = ref('Les plus populaires')

function addProductToCart(productId: number): void {
    const product = state.products.find(product => product.id === productId)
    if (product) {
        const productInCart = state.cart.find(product => product.id === productId)
        if (productInCart) {
            productInCart.quantity++
        } else {
            state.cart.push({ ...product, quantity: 1 })
        }
        cartOpen.value = true
    }
}

function removeProductFromCart(productId: number): void {
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

const fetchProducts = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/products`)
    const data = await response.json()
    console.log('Produits récupérés:', data)
    state.products = data
  } catch (err) {
    console.error('Erreur lors de la récupération des produits:', err)
  }
}

const fetchCategories = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`)
    const data = await response.json()
    console.log('Catégories récupérées:', data)
    state.categories = data
  } catch (err) {
    console.error('Erreur lors de la récupération des catégories:', err)
  }
}

const filterByCategory = (categoryId: number | null) => {
  selectedCategory.value = categoryId
}

const filteredProducts = computed(() => {
  return state.products.filter(product => {
    const matchesCategory = selectedCategory.value === null || product.categoryId === selectedCategory.value
    return matchesCategory
  })
})

onMounted(() => {
  fetchProducts()
  fetchCategories()
})

const sortOptions = [
  { id: 'Les plus populaires', name: 'Les plus populaires', current: true },
  { id: 'Les mieux notés', name: 'Les mieux notés', current: false },
  { id: 'Les nouveautés', name: 'Les nouveautés', current: false },
  { id: 'Prix croissant', name: 'Prix croissant', current: false },
  { id: 'Prix décroissant', name: 'Prix décroissant', current: false },
]

const sortProducts = (sortOption: string) => {
  selectedSortOption.value = sortOption

  switch (sortOption) {
    case 'Les plus populaires':
      state.products.sort((a, b) => b.popularity - a.popularity)
      break
    case 'Les mieux notés':
      state.products.sort((a, b) => b.rating - a.rating)
      break
    case 'Les nouveautés':
      state.products.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      break
    case 'Prix croissant':
      state.products.sort((a, b) => a.price - b.price)
      break
    case 'Prix décroissant':
      state.products.sort((a, b) => b.price - a.price)
      break
  }
}
</script>


<template>
  <div class="bg-white">
    <div>
      <TransitionRoot as="template" :show="mobileFiltersOpen">
        <Dialog class="relative z-40 lg:hidden" @close="mobileFiltersOpen = false">
          <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
            enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100"
            leave-to="opacity-0">
            <div class="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>
          <div class="fixed inset-0 z-40 flex">
            <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
              enter-from="translate-x-full" enter-to="translate-x-0"
              leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
              leave-to="translate-x-full">
              <DialogPanel
                class="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                <div class="flex items-center justify-between px-4">
                  <h2 class="text-lg font-medium text-gray-900">Filtres</h2>
                  <button type="button"
                    class="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                    @click="mobileFiltersOpen = false">
                    <span class="sr-only">Fermer le menu</span>
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <form class="mt-4 border-t border-gray-200">
                  <h3 class="sr-only">Catégories</h3>
                  <ul role="list" class="px-2 py-3 font-medium text-gray-900">
                    <li>
                      <a href="#" @click.prevent="filterByCategory(null)" class="block px-2 py-3">Tous les produits</a>
                    </li>
                    <li v-for="category in state.categories" :key="category.id">
                      <a href="#" @click.prevent="filterByCategory(category.id)" class="block px-2 py-3">{{
                        category.name }}</a>
                    </li>
                  </ul>
                  <Disclosure as="div" v-for="section in filters" :key="section.id"
                    class="border-t border-gray-200 px-4 py-6" v-slot="{ open }">
                    <h3 class="-mx-2 -my-3 flow-root">
                      <DisclosureButton
                        class="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <span class="font-medium text-gray-900">{{ section.name }}</span>
                        <span class="ml-6 flex items-center">
                          <PlusIcon v-if="!open" class="h-5 w-5" aria-hidden="true" />
                          <MinusIcon v-else class="h-5 w-5" aria-hidden="true" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel class="pt-6">
                      <div class="space-y-6">
                        <div v-for="(option, optionIdx) in section.options" :key="option.value"
                          class="flex items-center">
                          <input :id="`filter-mobile-${section.id}-${optionIdx}`" :name="`${section.id}[]`"
                            :value="option.value" type="checkbox" :checked="option.checked"
                            class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                          <label :for="`filter-mobile-${section.id}-${optionIdx}`"
                            class="ml-3 min-w-0 flex-1 text-gray-500">{{ option.label }}</label>
                        </div>
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </TransitionRoot>
      <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900">Nouveautés</h1>
          <div class="flex items-center">
            <Menu as="div" class="relative inline-block text-left">
              <div>
                <MenuButton
                  class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Trier - {{ selectedSortOption }}
                  <ChevronDownIcon class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true" />
                </MenuButton>
              </div>
              <transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
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
            <button type="button" class="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
              <span class="sr-only">Voir la grille</span>
              <Squares2X2Icon class="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" class="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              @click="mobileFiltersOpen = true">
              <span class="sr-only">Filtres</span>
              <FunnelIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <section aria-labelledby="products-heading" class="pb-24 pt-6">
          <h2 id="products-heading" class="sr-only">Produits</h2>
          <div class="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            <form class="hidden lg:block">
              <h3 class="sr-only">Catégories</h3>
              <ul role="list" class="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                <li>
                  <a href="#" @click.prevent="filterByCategory(null)">Tous les produits</a>
                </li>
                <li v-for="category in state.categories" :key="category.id">
                  <a href="#" @click.prevent="filterByCategory(category.id)">{{ category.name }}</a>
                </li>
              </ul>
              <Disclosure as="div" v-for="section in filters" :key="section.id" class="border-b border-gray-200 py-6"
                v-slot="{ open }">
                <h3 class="-my-3 flow-root">
                  <DisclosureButton
                    class="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                    <span class="font-medium text-gray-900">{{ section.name }}</span>
                    <span class="ml-6 flex items-center">
                      <PlusIcon v-if="!open" class="h-5 w-5" aria-hidden="true" />
                      <MinusIcon v-else class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel class="pt-6">
                  <div class="space-y-4">
                    <div v-for="(option, optionIdx) in section.options" :key="option.value" class="flex items-center">
                      <input :id="`filter-${section.id}-${optionIdx}`" :name="`${section.id}[]`" :value="option.value"
                        type="checkbox" :checked="option.checked"
                        class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                      <label :for="`filter-${section.id}-${optionIdx}`" class="ml-3 text-sm text-gray-600">{{
                        option.label }}</label>
                    </div>
                  </div>
                </DisclosurePanel>
              </Disclosure>
            </form>
            <div class="lg:col-span-3">
              <div class="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
                <div class="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
                  <div v-for="product in filteredProducts" :key="product.id"
                    class="group relative border-b border-r border-gray-200 p-4 sm:p-6">
                    <router-link :to="{ name: 'ProductDetail', params: { id: product.id } }">
                      <div class="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                        <img :src="product.illustration" alt="product.description"
                          class="h-full w-full object-cover object-center" />
                      </div>
                    </router-link>
                    <div class="pb-4 pt-10 text-center">
                      <router-link :to="{ name: 'ProductDetail', params: { id: product.id } }">
                        <p class="text-xs font-normal text-gray-400">
                          {{ product.Brand.name }}
                        </p>
                        <h3 class="text-sm font-medium text-gray-900">
                          {{ product.productName }}
                        </h3>
                      </router-link>
                      <div class="mt-3 flex flex-col items-center">
                        <div class="flex items-center">
                          <StarIcon v-for="rating in [0, 1, 2, 3, 4]" :key="rating"
                            :class="[product.rating > rating ? 'text-yellow-400' : 'text-gray-200', 'h-5 w-5 flex-shrink-0']"
                            aria-hidden="true" />
                        </div>
                        <p class="mt-1 text-sm text-gray-500">{{ product.reviewCount }} reviews</p>
                      </div>
                      <p class="mt-4 text-base font-medium text-gray-900">{{ product.price }}€</p>
                      <button @click="addProductToCart(product.id)"
                        class="mt-12 flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 w-full">
                        <ShoppingCartIcon class="h-6 w-6 flex-shrink-0 text-white group-hover:text-gray-200"
                          aria-hidden="true"></ShoppingCartIcon>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
    <Cart :cart="state.cart" :cart-open="cartOpen" @close-cart="cartOpen = false"
      @removeProductFromCart="removeProductFromCart" />
  </div>
</template>

<style scoped></style>
