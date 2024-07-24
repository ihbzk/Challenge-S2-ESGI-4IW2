<template>
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Demande de facturation</h2>
      <form @submit.prevent="submitBillingRequest" class="space-y-4">
        <div>
          <label for="invoiceEmail" class="block text-sm font-medium text-gray-700">Email pour la facture :</label>
          <input v-model="invoiceEmail" type="email" id="invoiceEmail" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <button type="submit" class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Envoyer la demande</button>
      </form>
    </section>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const invoiceEmail = ref('');
  
  const submitBillingRequest = () => {
    console.log('Demande de facturation envoyée pour:', invoiceEmail.value);
  };
  </script>
  
  <style scoped>
  </style>
  