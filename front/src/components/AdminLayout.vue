<template>
  <main>
    <div class="min-h-screen flex">
    <!-- Sidebar -->
    <aside :class="['flex flex-col justify-between fixed inset-y-0 left-0 transform bg-gray-800 text-white overflow-y-auto transition-transform duration-300 lg:static lg:transform-none lg:translate-x-0', { '-translate-x-full': !isSidebarOpen }]" @click.away="isSidebarOpen = false">
      <div class="p-4 flex justify-between items-center lg:justify-center">
        <h1 class="text-xl font-bold">Panel d'administration</h1>
        <button class="lg:hidden text-white focus:outline-none" @click="isSidebarOpen = false">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <nav class="flex-1">
        <ul>
          <li>
            <router-link :to="{ name: 'Dashboard' }" class="block py-2 px-4 hover:bg-gray-700">Tableau de bord</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'Users' }" class="block py-2 px-4 hover:bg-gray-700">Utilisateurs</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'Products' }" class="block py-2 px-4 hover:bg-gray-700">Produits</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'Categories' }" class="block py-2 px-4 hover:bg-gray-700">Catégories de produits</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'Brands' }" class="block py-2 px-4 hover:bg-gray-700">Marques de produits</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'Settings' }" class="block py-2 px-4 hover:bg-gray-700">Paramètres</router-link>
          </li>
        </ul>
      </nav>
      <div class="p-4">
        <button class="w-full block py-2 px-4 bg-red-600 text-center rounded mt-4" @click="logout">Déconnexion</button>
      </div>
    </aside>
    
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="w-full bg-white shadow p-4 flex justify-between items-center lg:hidden">
        <button class="text-gray-700 focus:outline-none" @click="isSidebarOpen = true">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <h1 class="text-xl font-bold">Panel d'administration</h1>
      </header>
      <main class="flex-1 bg-gray-100 p-6">
        <router-view></router-view>
      </main>
    </div>
  </div>
  </main>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import useAuth from '@/composables/useAuth';
  import { useRouter } from 'vue-router';

  const isSidebarOpen = ref(false);
  const { isAuthenticated, initializeAuth } = useAuth();
  const router = useRouter();

  initializeAuth();

  const logout = async () => {
    try {
        let authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
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
        router.push({ name: 'Login' });
    } catch (error) {
        console.error('Échec de la déconnexion', error);
    }
  };
</script>

<style scoped></style>
