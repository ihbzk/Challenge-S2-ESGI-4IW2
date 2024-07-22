<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Cart from '../components/Cart/Cart.vue';
import { StarIcon, ShoppingCartIcon } from '@heroicons/vue/20/solid';

const products = ref([]);
const cart = ref([]);
const loading = ref(true);
const cartOpen = ref(false);

const route = useRoute();

// Fetch products based on query parameters
const fetchProducts = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams(route.query as Record<string, string>).toString();
    const response = await axios.get(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/search?${params}`);
    products.value = response.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// Watch for changes in the route query parameters
watch(() => route.query.q, fetchProducts);

// Fetch products when component is mounted
onMounted(fetchProducts);

// Add a product to the cart
const addProductToCart = (productId: number) => {
  const product = products.value.find(product => product.id === productId);
  if (product) {
    const productInCart = cart.value.find(product => product.id === productId);
    if (productInCart) {
      productInCart.quantity++;
    } else {
      cart.value.push({ ...product, quantity: 1 });
    }
    cartOpen.value = true;
  }
};

// Remove a product from the cart
const removeProductFromCart = (productId: number) => {
  const productFromCart = cart.value.find(product => product.id === productId);
  if (productFromCart) {
    if (productFromCart.quantity === 1) {
      cart.value = cart.value.filter(product => product.id !== productId);
    } else {
      productFromCart.quantity--;
    }
  }
};
</script>

<template>
  <div class="bg-white">
    <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900">Résultats de recherche pour "{{ route.query.q }}"</h1>
      </div>
      <section aria-labelledby="products-heading" class="pb-24 pt-6">
        <h2 id="products-heading" class="sr-only">Produits</h2>
        <div v-if="loading" class="text-center">Chargement...</div>
        <div v-else-if="products.length === 0" class="text-center">Aucun produit trouvé.</div>
        <div v-else class="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          <div class="lg:col-span-3">
            <div class="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
              <div class="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
                <div v-for="product in products" :key="product.id" class="group relative border-b border-r border-gray-200 p-4 sm:p-6">
                  <router-link :to="{ name: 'ProductDetail', params: { id: product.id } }">
                    <div class="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                      <img :src="product.illustration" :alt="product.description" class="h-full w-full object-cover object-center" />
                    </div>
                  </router-link>
                  <div class="pb-4 pt-10 text-center">
                    <router-link :to="{ name: 'ProductDetail', params: { id: product.id } }">
                      <p class="text-xs font-normal text-gray-400">{{ product.Brand?.name }}</p>
                      <h3 class="text-sm font-medium text-gray-900">{{ product.productName }}</h3>
                    </router-link>
                    <div class="mt-3 flex flex-col items-center">
                      <div class="flex items-center">
                        <StarIcon v-for="rating in [0, 1, 2, 3, 4]" :key="rating" :class="[product.rating > rating ? 'text-yellow-400' : 'text-gray-200', 'h-5 w-5 flex-shrink-0']" aria-hidden="true" />
                      </div>
                      <p class="mt-1 text-sm text-gray-500">{{ product.reviewCount }} avis</p>
                    </div>
                    <p class="mt-4 text-base font-medium text-gray-900">{{ product.price }}€</p>
                    <button @click="addProductToCart(product.id)" class="mt-12 flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 w-full">
                      <ShoppingCartIcon class="h-6 w-6 flex-shrink-0 text-white group-hover:text-gray-200" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Cart :cart="cart" :cart-open="cartOpen" @close-cart="cartOpen = false" @remove-product-from-cart="removeProductFromCart" />
  </div>
</template>

<style scoped></style>
