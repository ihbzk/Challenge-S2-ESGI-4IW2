<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import CookieConsent from './components/Cookies/CookieConsent.vue';
import Header from './components/Header/Header.vue';
import Cart from './components/Cart/Cart.vue';

const products = ref([]);
const categories = ref([]);
const cart = reactive([]);
const cartOpen = ref(false);

const showCookieConsent = ref(false);
const router = useRouter();

const totalPrice = computed(() =>
  cart.reduce((acc, product) => acc + product.price * product.quantity, 0)
);

const addProductToCart = (product) => {
  const productInCart = cart.find(item => item.id === product.id);
  if (productInCart) {
    productInCart.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  sessionStorage.setItem('cart', JSON.stringify(cart));
  cartOpen.value = true;
};

const removeProductFromCart = (productId) => {
  const index = cart.findIndex(product => product.id === productId);
  if (index !== -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }
};

const handleCheckout = () => {
  sessionStorage.setItem('cart', JSON.stringify(cart));
  router.push({ name: 'Checkout' });
  cartOpen.value = false;
};

const loadCart = () => {
  const savedCart = sessionStorage.getItem('cart');
  if (savedCart) {
    const parsedCart = JSON.parse(savedCart);
    cart.splice(0, cart.length, ...parsedCart);
  }
};

onMounted(() => {
  const cookiesAccepted = localStorage.getItem('cookiesAccepted');
  if (!cookiesAccepted) {
    showCookieConsent.value = true;
  }
  loadCart();
});
</script>

<template>
  <div id="app">
    <CookieConsent v-if="showCookieConsent" />
    <Header :products="products" :categories="categories" :cart="cart" :cartOpen="cartOpen" @open-cart="cartOpen = true" @close-cart="cartOpen = false" @remove-product-from-cart="removeProductFromCart" />
    <router-view :products="products" :categories="categories" :cart="cart" :cartOpen="cartOpen" @add-product-to-cart="addProductToCart" @remove-product-from-cart="removeProductFromCart" />
    <Cart :cart="cart" :cart-open="cartOpen" @close-cart="cartOpen = false" @remove-product-from-cart="removeProductFromCart" :totalPrice="totalPrice" @checkout="handleCheckout" />
  </div>
</template>

<style lang="scss">
@use './assets/scss/base.scss' as *;
@use './assets/scss/debug.scss' as *;
</style>