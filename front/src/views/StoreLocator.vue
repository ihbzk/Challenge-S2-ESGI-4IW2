<template>
  <main>
    <div class="trouver-un-magasin bg-gray-100 rounded-lg max-w-3xl mx-auto p-5">
      <h1 class="text-gray-900 text-2xl mb-4">Trouver un magasin</h1>
      <p class="text-gray-600 mb-4">
        Utilisez notre outil de localisation pour trouver le magasin InformaCart le plus proche de chez vous.
      </p>
      
      <h2 class="text-indigo-600 text-xl mt-6 mb-4">Localisation des magasins</h2>
      <p class="text-gray-600 mb-4">
        Entrez votre adresse ou code postal pour trouver les magasins à proximité.
      </p>
      
      <div class="search-form mb-6">
        <input type="text" class="w-full p-3 mb-4 rounded-lg border border-gray-300" placeholder="Entrez votre adresse ou code postal" v-model="searchQuery" @keyup.enter="findStores">
        <button @click="findStores" class="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">Rechercher</button>
      </div>
      
      <div v-if="stores.length" class="stores-list mt-6">
        <h3 class="text-indigo-600 text-xl mb-4">Magasins à proximité</h3>
        <ul>
          <li v-for="store in stores" :key="store.id" class="mb-4">
            <h4 class="text-gray-900 text-lg">{{ store.name }}</h4>
            <p class="text-gray-600">{{ store.address }}</p>
            <p class="text-gray-600">{{ store.city }}, {{ store.postalCode }}</p>
            <p class="text-gray-600">{{ store.phone }}</p>
          </li>
        </ul>
      </div>
      
      <div v-if="stores.length" class="map mt-6">
        <h3 class="text-indigo-600 text-xl mb-4">Carte des magasins</h3>
        <div id="map" class="w-full h-64 bg-gray-300 rounded-lg"></div>
      </div>
      
      <div v-if="!stores.length && searchQuery !== ''" class="no-results mt-6">
        <p class="text-gray-600">Aucun magasin trouvé à proximité. Veuillez vérifier votre adresse ou code postal et essayer à nouveau.</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const searchQuery = ref('');
const stores = ref([]);

const findStores = () => {
// Simulation de la recherche de magasins
const allStores = [
  { id: 1, name: 'InformaCart Paris', address: '123 Rue de Paris', city: 'Paris', postalCode: '75001', phone: '01 23 45 67 89' },
  { id: 2, name: 'InformaCart Lyon', address: '456 Avenue de Lyon', city: 'Lyon', postalCode: '69001', phone: '04 56 78 90 12' },
  { id: 3, name: 'InformaCart Marseille', address: '789 Boulevard de Marseille', city: 'Marseille', postalCode: '13001', phone: '04 91 23 45 67' },
];

stores.value = allStores.filter(store => store.postalCode.startsWith(searchQuery.value) || store.city.toLowerCase().includes(searchQuery.value.toLowerCase()));

// Affichage de la carte avec les magasins trouvés
if (stores.value.length) {
  displayMap(stores.value);
}
};

const displayMap = (stores) => {
// Initialiser et afficher la carte avec les magasins trouvés
const map = L.map('map').setView([48.8566, 2.3522], 5); // Coordonées de Paris

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

stores.forEach(store => {
  L.marker([store.lat, store.lon]) // Ajouter les coordonnées de chaque magasin
    .addTo(map)
    .bindPopup(`<b>${store.name}</b><br>${store.address}<br>${store.city}, ${store.postalCode}`)
    .openPopup();
});
};
</script>

<style scoped>
#map {
height: 400px;
}
</style>
