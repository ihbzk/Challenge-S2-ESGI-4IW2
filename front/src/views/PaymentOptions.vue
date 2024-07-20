<template>
  <div class="max-w-2xl mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Choisissez votre méthode de paiement</h2>
    <div class="flex justify-around mb-6">
      <button @click="showStripe = true; showPayPal = false" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Payer avec Stripe</button>
      <button @click="showStripe = false; showPayPal = true" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Payer avec PayPal</button>
    </div>
    <div v-if="showStripe">
      <Payment />
    </div>
    <div v-if="showPayPal">
      <PayPalButton />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Payment from '../components/Payment.vue';
import PayPalButton from '../components/PayPalButton.vue';

const showStripe = ref(false);
const showPayPal = ref(false);
</script>

<style scoped>
button {
  margin: 10px;
}
</style>