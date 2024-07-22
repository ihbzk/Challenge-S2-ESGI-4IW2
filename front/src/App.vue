<script setup lang="ts">
import { ref, onMounted } from 'vue';
import CookieConsent from './components/Cookies/CookieConsent.vue';
import Header from './components/Header/Header.vue';

const products = ref([]);
const categories = ref([]);
const cart = ref([]);
const cartOpen = ref(false);

const showCookieConsent = ref(false);

onMounted(() => {
  const cookiesAccepted = localStorage.getItem('cookiesAccepted');
  if (!cookiesAccepted) {
    showCookieConsent.value = true;
  }
});
</script>

<style lang="scss">
@use './assets/scss/base.scss' as *;
@use './assets/scss/debug.scss' as *;
</style>

<template>
  <div id="app">
    <CookieConsent v-if="showCookieConsent" />
    <Header :products="products" :categories="categories" :cart="cart" :cartOpen="cartOpen" />
    <router-view></router-view>
  </div>
</template>