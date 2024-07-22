<template>
  <main>
    <div class="flex flex-col min-h-screen bg-gray-100">
      <header class="bg-blue-600 text-white py-4 shadow-md">
        <div class="container mx-auto flex items-center justify-between">
          <h1 class="text-2xl font-bold">Mon Compte</h1>
          <nav>
            <ul class="flex space-x-4">
              <li><router-link class="text-white hover:text-gray-300" :to="{ name: 'AccountInfo' }">Informations personnelles</router-link></li>
              <li><router-link class="text-white hover:text-gray-300" :to="{ name: 'OrderHistory' }">Historique des commandes</router-link></li>
              <li><router-link class="text-white hover:text-gray-300" :to="{ name: 'BillingRequest' }">Facturation</router-link></li>
              <li><router-link class="text-white hover:text-gray-300" :to="{ name: 'ReturnRequest' }">Retours</router-link></li>
              <li><router-link class="text-white hover:text-gray-300" :to="{ name: 'Search' }">Recherche</router-link></li>
              <li><router-link class="text-white hover:text-gray-300" :to="{ name: 'Reorder' }">Commander à nouveau</router-link></li>
            </ul>
          </nav>
        </div>
      </header>
  
      <main class="flex-1 container mx-auto p-6">
        <router-view />
      </main>
  
      <footer class="bg-blue-600 text-white py-4 text-center">
        <p>©2024 InformaCart. Tous droits réservés.</p>
      </footer>
    </div>
  </main>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  </style>
  