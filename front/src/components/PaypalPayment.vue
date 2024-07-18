<template>
  <div>
    <div id="paypal-button-container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import axios from 'axios';

onMounted(async () => {
  const { data } = await axios.post('http://localhost:3000/api/paypal/create-order', {
    amount: '20.00'
  });

  paypal.Buttons({
    createOrder: function () {
      return data.id;
    },
    onApprove: async function (data) {
      const response = await axios.post(`http://localhost:3000/api/paypal/capture-order/${data.orderID}`);
      console.log('Capture result', response.data);
      alert('Payment successful!');
    },
    onError: function (err) {
      console.error(err);
      alert('Payment failed. Please try again.');
    }
  }).render('#paypal-button-container');
});
</script>

<style scoped>
/* Add some basic styling */
#paypal-button-container {
  margin: 10px 0;
}
</style>
