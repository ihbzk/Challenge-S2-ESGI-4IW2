<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Dialog, DialogPanel, PopoverGroup, TransitionChild, TransitionRoot, Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingCartIcon, UserIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import Cart from '../Cart/Cart.vue'
import SearchBar from '../SearchBar.vue'
import { useSearchBar } from '../../composables/useSearchModal'
import axios from 'axios'

const { openSearchBar } = useSearchBar()
import type { ProductCartInterface } from '@/interfaces'
import useAuth from '@/composables/useAuth';

const { hasRole, hasAnyRole, isAuthenticated } = useAuth();

const props = defineProps<{
  cart: ProductCartInterface[]
  cartOpen: boolean
  products: ProductInterface[]
  categories: CategoryInterface[]
  brands: { id: number, name: string }[]
}>()

const emit = defineEmits<{
  (e: 'remove-product-from-cart', productId: number): void
  (e: 'open-cart'): void
  (e: 'close-cart'): void
}>()

const mobileMenuOpen = ref(false)
const selectedCategoryId = ref<number | null>(null)
const cartItemCount = computed(() => (props.cart || []).reduce((acc, product) => acc + product.quantity, 0))

const openCart = () => {
  emit('open-cart')
}

const closeCart = () => {
  emit('close-cart')
}

const categories = ref([])

onMounted(async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
    categories.value = response.data;
  } catch (error) {
    console.error(error);
  }
})

const logout = async () => {
    try {
        const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        isAuthenticated.value = false;
        localStorage.removeItem('authToken');
    } catch (error) {
        console.error('Échec de la déconnexion', error);
    }
};
</script>

<template>
  <header class="z-10 fixed w-full">
    <nav aria-label="Top">
      <div class="bg-gray-900">
        <div class="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <p class="flex-1 text-center text-sm font-medium text-white lg:flex-none">
            Livraison gratuite à partir de 100€ d'achat
          </p>
          <div class="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
            <router-link :to="{ name: 'Register' }" class="text-sm font-medium text-white hover:text-gray-100">
              Inscription
            </router-link>
            <span class="h-6 w-px bg-gray-600" aria-hidden="true"></span>
            <router-link v-if="!isAuthenticated" :to="{ name: 'Login' }" class="text-sm font-medium text-white hover:text-gray-100">
              Connexion
            </router-link>
            <button v-else @click="logout" class="text-sm font-medium text-white hover:text-gray-100">
              Déconnexion
            </button>
            <span v-if="isAuthenticated" class="h-6 w-px bg-gray-600" aria-hidden="true"></span>
            <router-link v-if="isAuthenticated" :to="{ name: 'AccountLayout' }" class="text-sm font-medium text-white hover:text-gray-100">
              Mon compte
            </router-link>
            <span v-if="isAuthenticated && hasRole('ROLE_ADMIN')" class="h-6 w-px bg-gray-600" aria-hidden="true"></span>
            <router-link v-if="isAuthenticated && hasRole('ROLE_ADMIN')" :to="{ name: 'AdminLayout' }" class="text-sm font-medium text-white hover:text-gray-100">
              Espace d'administration
            </router-link>
          </div>
        </div>
      </div>
      <div class="bg-white">
        <div class="border-b border-gray-200">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
              <div class="hidden lg:flex lg:items-center">
                <router-link :to="{ name: 'Homepage' }">
                  <img src="../../assets/images/logo.svg" alt="InformaCart" class="h-10 w-auto">
                </router-link>
                <PopoverGroup class="inset-x-0 bottom-0 px-4">
                  <div class="flex h-full justify-center space-x-8">
                    <Popover v-for="category in categories" :key="category.id" class="flex">
                      <PopoverButton
                        @click="selectedCategoryId = selectedCategoryId === category.id ? null : category.id"
                        class="relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out"
                        :class="selectedCategoryId === category.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:text-gray-800'"
                      >
                        {{ category.name }}
                      </PopoverButton>
                      <TransitionRoot as="template" :show="selectedCategoryId === category.id">
                        <TransitionChild
                          as="div"
                          enter="transition ease-out duration-150"
                          enter-from="opacity-0"
                          enter-to="opacity-100"
                          leave="transition ease-in duration-150"
                          leave-from="opacity-100"
                          leave-to="opacity-0"
                        >
                          <PopoverPanel class="absolute inset-x-0 top-full text-sm text-gray-500">
                            <div class="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true" />
                            <div class="relative bg-white">
                              <div class="mx-auto max-w-7xl px-8">
                                <h2 class="text-4xl font-bold tracking-tight text-gray-900 py-16">{{ category.name }}</h2>
                                <div class="grid grid-cols-4 gap-x-8 gap-y-10 pb-16">
                                  <div v-for="product in props.products.filter(p => p.categoryId === category.id)" :key="product.id" class="group relative">
                                    <div class="aspect-h-1 aspect-w-1 overflow-hidden rounded-md bg-gray-100 group-hover:opacity-75">
                                      <img :src="product.illustration" :alt="product.name" class="object-cover object-center" />
                                    </div>
                                    <router-link :to="{ name: 'ProductDetail', params: { id: product.id } }" class="mt-4 block font-medium text-gray-900">
                                      <span class="absolute inset-0 z-10" aria-hidden="true" />
                                      {{ product.Brand?.name }} {{ product.productName }}
                                    </router-link>
                                    <p aria-hidden="true" class="mt-1">{{ product.price }} €</p>
                                    <button @click="addProductToCart(product.id)" class="mt-6 flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 w-full">
                                      Voir le produit
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </PopoverPanel>
                        </TransitionChild>
                      </TransitionRoot>
                    </Popover>
                  </div>
                </PopoverGroup>
              </div>
              <div class="flex flex-1 items-center lg:hidden">
                <button type="button" class="-ml-2 rounded-md bg-white p-2 text-gray-400" @click="mobileMenuOpen = true">
                  <span class="sr-only">Open menu</span>
                  <Bars3Icon class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <router-link :to="{ name: 'Homepage' }" class="lg:hidden">
                <img src="../../assets/images/logo.svg" alt="InformaCart" class="h-8 w-auto">
              </router-link>
              <div class="flex flex-1 items-center justify-center lg:justify-end">
                <button @click="openSearchBar" class="text-gray-400 hover:text-gray-500">
                  <MagnifyingGlassIcon class="h-6 w-6" aria-hidden="true" />
                  <span class="sr-only">Search</span>
                </button>
              </div>
              <span class="mx-4 h-6 w-px bg-gray-200 lg:mx-6" aria-hidden="true"></span>
              <div class="flex items-center">
                <router-link :to="{ name: 'AccountLayout' }" class="-m-2 p-2 text-gray-400 hover:text-gray-500">
                  <span class="sr-only">Account</span>
                  <UserIcon class="h-6 w-6" aria-hidden="true" />
                </router-link>
              </div>
              <span class="mx-4 h-6 w-px bg-gray-200 lg:mx-6" aria-hidden="true"></span>
              <div class="flow-root">
                <button @click="openCart" class="group -m-2 flex items-center p-2">
                  <ShoppingCartIcon class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                  <span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{{ cartItemCount }}</span>
                  <span class="sr-only">items in cart, view bag</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <TransitionRoot as="template" :show="props.cartOpen">
      <Dialog class="relative z-10" @close="closeCart">
        <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>
        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
                <DialogPanel class="pointer-events-auto w-screen max-w-md">
                  <Cart :cart="props.cart || []" @remove-product-from-cart="$emit('remove-product-from-cart', $event)" />
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </header>
  <SearchBar />
</template>

<style scoped lang="scss">
@use '../../assets/scss/base.scss' as *;
</style>
