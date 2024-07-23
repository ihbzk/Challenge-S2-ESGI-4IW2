<template>
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Historique des commandes</h2>
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produits</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse de Livraison</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in orders" :key="order.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ formatDate(order.orderDate) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ order.user.firstname }} {{ order.user.lastname }}<br>
              <a :href="'mailto:' + order.user.email" class="text-blue-500">{{ order.user.email }}</a>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <ul>
                <li v-for="item in order.products" :key="item.id">{{ item.productName }} (x{{ item.OrderProduct.quantity }})</li>
              </ul>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatCurrency(order.totalAmount) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.status }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ order.shippingAddress }}<br>
              {{ order.shippingCity }}, {{ order.shippingPostalCode }}<br>
              {{ order.shippingCountry }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import useAuth from '@/composables/useAuth';

  const { user } = useAuth();
  
  const orders = ref([]);
  
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders/user/${user.value.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      orders.value = data;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };
  
  onMounted(() => {
    fetchOrders();
  });
</script>
  
<style scoped></style>
  
