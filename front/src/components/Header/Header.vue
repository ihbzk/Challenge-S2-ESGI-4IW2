<script setup lang="ts"></script>

<template>
  <header class="px-20 d-flex flex-row align-items-center">
    <a href="#" class="d-flex flex-row align-items-center mr-20">
      <img src="../../assets/logo.svg" />
      <span class="logo">InformaCart</span>
    </a>
    <ul class="d-flex flex-row flex-fill">
      <li class="mr-10">
        <a href="#">Boutique</a>
      </li>
      <li>
        <router-link :to="{ name: 'AdminLayout' }">Admin</router-link>
      </li>
    </ul>
    <ul class="d-flex flex-row">
      <li class="mr-10">
        <router-link :to="{ name: 'Register' }">Inscription</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'Login' }">Connexion</router-link>
      </li>
    </ul>
  </header>
</template>

<style lang="scss" scoped>
header {
  background-color: var(--primary-1);
  a {
    color: var(--text-primary-color);
    img {
      width: 20px;
      margin-right: 5px;
    }
    .logo {
      font-weight: 700;
      font-size: 20px;
    }
  }
}
</style>
