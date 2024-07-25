<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Dialog, DialogPanel, PopoverGroup, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { Bars3Icon, MagnifyingGlassIcon, ShoppingCartIcon, UserIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import SearchBar from '../SearchBar.vue';
import { useSearchBar } from '../../composables/useSearchModal';
import axios from 'axios';
import useAuth from '@/composables/useAuth';

const { openSearchBar } = useSearchBar();
const { hasRole, isAuthenticated } = useAuth();
const route = useRoute();
const router = useRouter();

const props = defineProps<{
  cart: ProductCartInterface[];
  cartOpen: boolean;
  products: ProductInterface[];
  categories: CategoryInterface[];
  brands: { id: number, name: string }[];
}>();

const emit = defineEmits<{
  (e: 'open-cart'): void;
  (e: 'close-cart'): void;
  (e: 'remove-product-from-cart', productId: number): void;
}>();

const mobileMenuOpen = ref(false);
const selectedCategoryId = ref<number | null>(null);
const categories = ref<CategoryInterface[]>(props.categories);

// Calculer le nombre total d'articles dans le panier
const cartItemCount = computed(() => {
  return (props.cart || []).reduce((acc, product) => acc + product.quantity, 0);
});

// Ouvrir le panier
const openCart = () => {
  emit('open-cart');
};

// Fermer le panier
const closeCart = () => {
  emit('close-cart');
};

// Fonction de déconnexion
const logout = async () => {
  try {
    const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // on delete le token de l'utilisateur
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    isAuthenticated.value = false;
  } catch (error) {
    console.error('Échec de la déconnexion', error);
  }
};

// Charger les catégories depuis l'API lors du montage du composant
const fetchCategories = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
    categories.value = response.data;
  } catch (error) {
    console.error('Échec du chargement des catégories', error);
  }
};

onMounted(() => {
  fetchCategories();
});

watch(route, () => {
  fetchCategories();
});

const navigateToCategory = (categoryId) => {
  selectedCategoryId.value = categoryId;
  mobileMenuOpen.value = false;
  router.push({ name: 'CategoryProducts', params: { id: categoryId } });
};

</script>

<template>
  <header class="z-10 fixed w-full">
    <nav aria-label="Top">
      <div class="bg-gray-900">
        <div class="mx-auto flex h-10 max-w-7xl items-center justify-center gap-4 px-4 sm:px-6 lg:px-8">
          <router-link v-if="!isAuthenticated" :to="{ name: 'Register' }" class="flex-1 text-center text-sm font-medium text-white lg:flex-none">
            Inscription
          </router-link>
          <span class="h-6 w-px bg-gray-600" aria-hidden="true"></span>
          <router-link v-if="!isAuthenticated" :to="{ name: 'Login' }" class="flex-1 text-center text-sm font-medium text-white lg:flex-none">
            Connexion
          </router-link>
          <button v-else @click="logout" class="flex-1 text-center text-sm font-medium text-white lg:flex-none">
            Déconnexion
          </button>
          <span v-if="isAuthenticated" class="h-6 w-px bg-gray-600" aria-hidden="true"></span>
          <router-link v-if="isAuthenticated" :to="{ name: 'AccountLayout' }" class="flex-1 text-center text-sm font-medium text-white lg:flex-none">
            Mon compte
          </router-link>
          <span v-if="isAuthenticated && hasRole('ROLE_ADMIN')" class="h-6 w-px bg-gray-600" aria-hidden="true"></span>
          <router-link v-if="isAuthenticated && hasRole('ROLE_ADMIN')" :to="{ name: 'Dashboard' }" class="flex-1 text-center text-sm font-medium text-white lg:flex-none">
            Espace d'administration
          </router-link>
        </div>
      </div>
      <div class="bg-white">
        <div class="border-b border-gray-200">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 items-center justify-between">
              <div class="hidden lg:flex lg:items-center">
                <router-link :to="{ name: 'Homepage' }">
                  <img src="../../assets/images/logo2.svg" alt="InformaCart" class="h-10 w-auto">
                </router-link>
                <PopoverGroup class="inset-x-0 bottom-0 px-4">
                  <div class="flex h-full justify-center space-x-8">
                    <button
                      v-for="category in categories"
                      :key="category.id"
                      @click="navigateToCategory(category.id)"
                      class="relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out"
                      :class="selectedCategoryId === category.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:text-gray-800'"
                    >
                      {{ category.name }}
                    </button>
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
                <img src="../../assets/images/logo2.svg" alt="InformaCart" class="h-10 w-auto">
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
    <TransitionRoot as="template" :show="mobileMenuOpen">
      <Dialog as="div" class="relative z-40 lg:hidden" @close="mobileMenuOpen = false">
        <TransitionChild
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>
        <div class="fixed inset-0 z-40 grid w-full">
          <TransitionChild
            enter="transition ease-in-out duration-300 transform"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel class="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl h-full w-full">
              <div class="flex px-4 pt-5 pb-2">
                <button type="button" class="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400" @click="mobileMenuOpen = false">
                  <span class="sr-only">Close menu</span>
                  <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div class="mt-2 p-8 w-full">
                <router-link :to="{ name: 'Homepage' }" @click="mobileMenuOpen = false">
                  <img src="../../assets/images/logo2.svg" alt="InformaCart" class="h-10 w-auto mb-8">
                </router-link>
                <router-link :to="{ name: 'Homepage' }" @click="mobileMenuOpen = false" class="block px-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-50">
                  Home
                </router-link>
                <router-link
                  v-for="category in categories"
                  :key="category.id"
                  :to="{ name: 'CategoryProducts', params: { id: category.id } }"
                  @click="mobileMenuOpen = false"
                  class="relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out"
                  :class="selectedCategoryId === category.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-700 hover:text-gray-800'"
                >
                  {{ category.name }}
                </router-link>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
    <SearchBar />
  </header>
</template>

<style scoped lang="scss">
@use '../../assets/scss/base.scss' as *;
</style>