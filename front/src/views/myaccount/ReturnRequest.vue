<template>
  <section class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Demande de Retour Produit</h2>
    <form @submit.prevent="submitReturnRequest" class="space-y-4">
      <div>
        <label for="products" class="block text-sm font-medium text-gray-700">Produits commandés :</label>
        <select v-model="selectedProducts" id="products" multiple class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          <option v-for="product in orderedProducts" :key="product.id" :value="product.id">{{ product.productName }}</option>
        </select>
      </div>
      <div>
        <label for="returnReason" class="block text-sm font-medium text-gray-700">Raison du retour :</label>
        <textarea v-model="returnReason" id="returnReason" rows="4" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
      </div>
      <button type="submit" class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Envoyer la demande</button>
    </form>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import useAuth from '@/composables/useAuth';

const { user, isAuthenticated } = useAuth();

const returnReason = ref('');
const orderedProducts = ref([]);
const selectedProducts = ref([]);

const fetchOrders = async () => {
  let authToken = localStorage.getItem('token') || sessionStorage.getItem('token');

  try {
    const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/orders/user/${user.value.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const orders = await response.json();
    // Flatten the ordered products from all orders
    orderedProducts.value = orders.flatMap(order => order.products);
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

const submitReturnRequest = () => {
  console.log('Produits sélectionnés pour le retour:', selectedProducts.value);
  console.log('Raison du retour:', returnReason.value);
};

onMounted(() => {
  if (isAuthenticated.value) {
    fetchOrders();
  }
});
</script>

<style scoped>
</style>
