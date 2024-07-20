<template>
  <div>
    <h2>Options de livraison</h2>
    <ul>
      <li v-for="option in deliveryOptions" :key="option.id">
        <label>
          <input type="radio" name="deliveryOption" :value="option.id" v-model="selectedOptionId">
          {{ option.name }} - ${{ option.price }} ({{ option.estimatedDays }} jours)
        </label>
      </li>
    </ul>
    <div>
      <label>
        Adresse de livraison:
        <input type="text" v-model="address">
      </label>
    </div>
    <button @click="createDelivery">Créer livraison</button>

    <div v-if="trackingInfo">
      <h3>Informations de suivi</h3>
      <p>Numéro de suivi: {{ trackingInfo.trackingNumber }}</p>
      <p>Statut: {{ trackingInfo.status }}</p>
      <p>Date de livraison estimée: {{ trackingInfo.estimatedDeliveryDate }}</p>
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
};
</script>

<style scoped>
/* Add some basic styling */
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
