<template>
    <div>
      <h2>Choisissez votre méthode de paiement</h2>
      <div>
        <button @click="showStripe = true; showPayPal = false">Payer avec Stripe</button>
        <button @click="showStripe = false; showPayPal = true">Payer avec PayPal</button>
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