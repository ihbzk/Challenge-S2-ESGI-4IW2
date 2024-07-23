<template>
  <div class="max-w-2xl mx-auto p-4 bg-white shadow-md rounded">
    <h2 class="text-2xl font-bold mb-4">Options de livraison</h2>
    <ul class="mb-4">
      <li v-for="option in deliveryOptions" :key="option.id" class="mb-2">
        <label class="flex items-center">
          <input type="radio" name="deliveryOption" :value="option.id" v-model="selectedOptionId" class="mr-2">
          {{ option.name }} - €{{ option.price }} ({{ option.estimatedDays }} jours)
        </label>
      </li>
    </ul>
    <div class="mb-4">
      <label class="block mb-2">
        Adresse de livraison:
        <input type="text" v-model="address" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </label>
    </div>
    <button @click="createDelivery" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Créer livraison</button>

    <div v-if="trackingInfo" class="mt-6">
      <h3 class="text-xl font-bold mb-2">Informations de suivi</h3>
      <p>Numéro de suivi: {{ trackingInfo.trackingNumber }}</p>
      <p>Statut: {{ trackingInfo.status }}</p>
      <p>Date de livraison estimée: {{ trackingInfo.estimatedDeliveryDate }}</p>
    </div>

    <div v-if="successMessage" class="mt-6 text-green-500">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const deliveryOptions = ref([]);
const selectedOptionId = ref(null);
const address = ref('');
const trackingInfo = ref(null);
const successMessage = ref('');

onMounted(async () => {
  const { data } = await axios.get('http://localhost:3000/api/delivery/options');
  deliveryOptions.value = data;
});

const createDelivery = async () => {
  if (!selectedOptionId.value || !address.value) {
    alert('Veuillez sélectionner une option de livraison et saisir une adresse.');
    return;
  }

  const { data } = await axios.post('http://localhost:3000/api/delivery/create', {
    address: address.value,
    optionId: selectedOptionId.value
  });
  trackingInfo.value = data;
  successMessage.value = 'La livraison a été créée avec succès !';
};
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
}
label {
  display: flex;
  align-items: center;
}
input[type="radio"] {
  margin-right: 10px;
}
input[type="text"] {
  margin-left: 10px;
}
button {
  margin-top: 10px;
}
</style>