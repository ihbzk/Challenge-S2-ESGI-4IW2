<script setup lang="ts">
import { ref, computed } from 'vue'
import { Dialog, DialogPanel, Popover, PopoverButton, PopoverGroup, PopoverPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingCartIcon, UserIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import Cart from '../Cart/Cart.vue'
import type { ProductCartInterface } from '@/interfaces'
import useAuth from '@/composables/useAuth';

const { hasRole, hasAnyRole, isAuthenticated } = useAuth();

const props = defineProps<{
  cart: ProductCartInterface[]
  cartOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'remove-product-from-cart', productId: number): void
  (e: 'open-cart'): void
  (e: 'close-cart'): void
}>()

const currencies = ['CAD', 'USD', 'AUD', 'EUR', 'GBP']
const navigation = {
  categories: [
    {
      "name": "Femmes",
      "featured": [
        { "name": "Nuit", "href": "#" },
        { "name": "Maillots de bain", "href": "#" },
        { "name": "Sous-vêtements", "href": "#" }
      ],
      "collection": [
        { "name": "Tout", "href": "#" },
        { "name": "Essentiel", "href": "#" },
        { "name": "Nouveautés", "href": "#" },
        { "name": "Soldes", "href": "#" }
      ],
      "categories": [
        { "name": "T-shirts basiques", "href": "#" },
        { "name": "T-shirts artistiques", "href": "#" },
        { "name": "Bas", "href": "#" },
        { "name": "Sous-vêtements", "href": "#" },
        { "name": "Accessoires", "href": "#" }
      ],
      "brands": [
        { "name": "Full Nelson", "href": "#" },
        { "name": "À ma façon", "href": "#" },
        { "name": "Réarrangé", "href": "#" },
        { "name": "Contrefaçon", "href": "#" },
        { "name": "Significant Other", "href": "#" }
      ]
    },
    {
      "name": "Hommes",
      "featured": [
        { "name": "Décontracté", "href": "#" },
        { "name": "Boxers", "href": "#" },
        { "name": "Extérieur", "href": "#" }
      ],
      "collection": [
        { "name": "Tout", "href": "#" },
        { "name": "Essentiel", "href": "#" },
        { "name": "Nouveautés", "href": "#" },
        { "name": "Soldes", "href": "#" }
      ],
      "categories": [
        { "name": "T-shirts artistiques", "href": "#" },
        { "name": "Pantalons", "href": "#" },
        { "name": "Accessoires", "href": "#" },
        { "name": "Boxers", "href": "#" },
        { "name": "T-shirts basiques", "href": "#" }
      ],
      "brands": [
        { "name": "Significant Other", "href": "#" },
        { "name": "À ma façon", "href": "#" },
        { "name": "Contrefaçon", "href": "#" },
        { "name": "Réarrangé", "href": "#" },
        { "name": "Full Nelson", "href": "#" }
      ]
    },
  ],
  pages: [
    { name: 'Produits', href: '#' },
  ],
}

const mobileMenuOpen = ref(false)

const cartItemCount = computed(() => props.cart.reduce((acc, product) => acc + product.quantity, 0))

const openCart = () => {
  emit('open-cart')
}

const closeCart = () => {
  emit('close-cart')
}

const logout = async () => {
    try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/logout`, {
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
      <!-- Top navigation -->
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
            <router-link v-if="isAuthenticated" class="text-sm font-medium text-white hover:text-gray-100">
              Mon compte
            </router-link>
            <span v-if="isAuthenticated && hasRole('ROLE_ADMIN')" class="h-6 w-px bg-gray-600" aria-hidden="true"></span>
            <router-link v-if="isAuthenticated && hasRole('ROLE_ADMIN')" :to="{ name: 'AdminLayout' }" class="text-sm font-medium text-white hover:text-gray-100">
              Espace d'administration
            </router-link>
          </div>
        </div>
      </div>

      <!-- Secondary navigation -->
      <div class="bg-white">
        <div class="border-b border-gray-200">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
              <div class="hidden lg:flex lg:items-center">
                <a href="/">
                  <img src="../../assets/images/logo.svg" alt="InformaCart" class="h-10 w-auto">
                </a>
              </div>
              <div class="hidden h-full lg:flex">
                <PopoverGroup class="ml-8">
                  <div class="flex h-full justify-center space-x-8">
                    <Popover v-for="(category, categoryIdx) in navigation.categories" :key="category.name" class="flex" v-slot="{ open }">
                      <div class="relative flex">
                        <PopoverButton :class="[open ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:text-gray-800', 'relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out']">{{ category.name }}</PopoverButton>
                      </div>
                      <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
                        <PopoverPanel class="absolute inset-x-0 top-full text-gray-500 sm:text-sm">
                          <div class="absolute inset-0 top-1/2 bg-white shadow" aria-hidden="true"></div>
                          <div class="relative bg-white">
                            <div class="mx-auto max-w-7xl px-8">
                              <div class="grid grid-cols-2 items-start gap-x-8 gap-y-10 pb-12 pt-10">
                                <div class="grid grid-cols-2 gap-x-8 gap-y-10">
                                  <div>
                                    <p :id="`desktop-featured-heading-${categoryIdx}`" class="font-medium text-gray-900">En vedette</p>
                                    <ul role="list" :aria-labelledby="`desktop-featured-heading-${categoryIdx}`" class="mt-6 space-y-6 sm:mt-4 sm:space-y-4">
                                      <li v-for="item in category.featured" :key="item.name" class="flex">
                                        <a :href="item.href" class="hover:text-gray-800">{{ item.name }}</a>
                                      </li>
                                    </ul>
                                  </div>
                                  <div>
                                    <p id="desktop-categories-heading" class="font-medium text-gray-900">Catégories</p>
                                    <ul role="list" aria-labelledby="desktop-categories-heading" class="mt-6 space-y-6 sm:mt-4 sm:space-y-4">
                                      <li v-for="item in category.categories" :key="item.name" class="flex">
                                        <a :href="item.href" class="hover:text-gray-800">{{ item.name }}</a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                <div class="grid grid-cols-2 gap-x-8 gap-y-10">
                                  <div>
                                    <p id="desktop-collection-heading" class="font-medium text-gray-900">Collection</p>
                                    <ul role="list" aria-labelledby="desktop-collection-heading" class="mt-6 space-y-6 sm:mt-4 sm:space-y-4">
                                      <li v-for="item in category.collection" :key="item.name" class="flex">
                                        <a :href="item.href" class="hover:text-gray-800">{{ item.name }}</a>
                                      </li>
                                    </ul>
                                  </div>
                                  <div>
                                    <p id="desktop-brand-heading" class="font-medium text-gray-900">Marques</p>
                                    <ul role="list" aria-labelledby="desktop-brand-heading" class="mt-6 space-y-6 sm:mt-4 sm:space-y-4">
                                      <li v-for="item in category.brands" :key="item.name" class="flex">
                                        <a :href="item.href" class="hover:text-gray-800">{{ item.name }}</a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </PopoverPanel>
                      </transition>
                    </Popover>
                    <a v-for="page in navigation.pages" :key="page.name" :href="page.href" class="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800">{{ page.name }}</a>
                  </div>
                </PopoverGroup>
              </div>
              <!-- Mobile menu and search (lg-) -->
              <div class="flex flex-1 items-center lg:hidden">
                <button type="button" class="-ml-2 rounded-md bg-white p-2 text-gray-400" @click="mobileMenuOpen = true">
                  <span class="sr-only">Open menu</span>
                  <Bars3Icon class="h-6 w-6" aria-hidden="true"></Bars3Icon>
                </button>
                <!-- Search -->
                <a href="#" class="ml-2 p-2 text-gray-400 hover:text-gray-500">
                  <span class="sr-only">Search</span>
                  <MagnifyingGlassIcon class="h-6 w-6" aria-hidden="true"></MagnifyingGlassIcon>
                </a>
              </div>
              <!-- Logo (lg-) -->
              <a href="#" class="lg:hidden">
                <img src="../assets/images/logo.svg" alt="InformaCart" class="h-8 w-auto">
              </a>
              <div class="flex flex-1 items-center justify-end">
                <div class="flex items-center lg:ml-8">
                  <div class="flex space-x-8">
                    <div class="hidden lg:flex">
                      <a href="#" class="-m-2 p-2 text-gray-400 hover:text-gray-500">
                        <span class="sr-only">Search</span>
                        <MagnifyingGlassIcon class="h-6 w-6" aria-hidden="true"></MagnifyingGlassIcon>
                      </a>
                    </div>
                    <div class="flex">
                      <router-link :to="{ name: 'Login' }" class="-m-2 p-2 text-gray-400 hover:text-gray-500">
                        <span class="sr-only">Account</span>
                        <UserIcon class="h-6 w-6" aria-hidden="true"></UserIcon>
                      </router-link>
                    </div>
                  </div>
                  <span class="mx-4 h-6 w-px bg-gray-200 lg:mx-6" aria-hidden="true"></span>
                  <div class="flow-root">
                    <button @click="openCart" class="group -m-2 flex items-center p-2">
                      <ShoppingCartIcon class="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" aria-hidden="true"></ShoppingCartIcon>
                      <span class="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">{{ cartItemCount }}</span>
                      <span class="sr-only">items in cart, view bag</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <!-- Cart -->
    <TransitionRoot as="template" :show="cartOpen">
      <Dialog class="relative z-10" @close="closeCart">
        <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>
        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
                <DialogPanel class="pointer-events-auto w-screen max-w-md">
                  <Cart :cart="cart" @remove-product-from-cart="$emit('remove-product-from-cart', $event)" />
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </header>
</template>

<style scoped lang="scss">
  @use '../../assets/scss/base.scss' as *;
</style>
