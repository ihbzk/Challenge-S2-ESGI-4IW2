<template>
  <div id="app">
    <CookieConsent v-if="showCookieConsent" />
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import CookieConsent from './components/Cookies/CookieConsent.vue';

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
