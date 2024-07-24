<template>
  <main class="bg-gray-100 min-h-screen flex items-center justify-center">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
      <h1 class="text-2xl font-bold text-center mb-6 text-indigo-600">Confirmation de la commande</h1>
      <div class="text-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <p class="text-lg font-medium">Merci pour votre commande, <span class="font-bold">{{ firstName }} {{ lastName }}</span> !</p>
      </div>
      <div class="bg-gray-50 p-4 rounded-lg shadow-inner mb-6">
        <p class="text-sm text-gray-600">Montant :</p>
        <p class="text-2xl font-bold text-indigo-600">{{ amount }} €</p>
      </div>
      <div class="bg-gray-50 p-4 rounded-lg shadow-inner mb-6">
        <p class="text-sm text-gray-600">Date :</p>
        <p class="text-xl font-medium">{{ formattedDate }}</p>
      </div>
      <div class="bg-gray-50 p-4 rounded-lg shadow-inner mb-6">
        <h2 class="text-lg font-semibold mb-2">Détails de l'adresse de livraison</h2>
        <p><strong>Adresse :</strong> {{ address }}</p>
        <p><strong>Ville :</strong> {{ city }}</p>
        <p><strong>Code Postal :</strong> {{ postalCode }}</p>
        <p><strong>Pays :</strong> {{ country }}</p>
      </div>
      <div class="text-center">
        <button @click="goBack" class="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition duration-300">
          Retour à l'accueil
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();

const order = JSON.parse(decodeURIComponent(route.query.order || '{}'));

const firstName = computed(() => order.firstName || '');
const lastName = computed(() => order.lastName || '');
const amount = computed(() => order.amount || 0);
const date = computed(() => order.date || '');

const address = computed(() => order.address || '');
const city = computed(() => order.city || '');
const postalCode = computed(() => order.postalCode || '');
const country = computed(() => order.country || '');

const formattedDate = computed(() => {
  const dateObj = new Date(date.value);
  return dateObj.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const goBack = () => {
  router.push('/');
};
</script>

<style scoped>
/* Basic styling for the confirmation page */
main {
  background-color: #f3f4f6;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.text-indigo-600 {
  color: #4f46e5;
}

.text-green-500 {
  color: #10b981;
}

.shadow-inner {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.transition {
  transition: background-color 0.3s ease;
}
</style>
