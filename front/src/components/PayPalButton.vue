<template>
  <div class="max-w-md mx-auto p-4 bg-white shadow-md rounded">
    <div id="paypal-button-container"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  if (window.paypal) {
    window.paypal.Buttons({
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: '20.00'
            }
          }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          alert('Transaction complétée par ' + details.payer.name.given_name);
          
        });
      },
      onError: function(err) {
        console.error('Erreur lors de la transaction', err);
      }
    }).render('#paypal-button-container');
  } else {
    console.error('SDK PayPal non chargé.');
  }
});
</script>

<style scoped>
#paypal-button-container {
  margin-top: 20px;
}
</style>