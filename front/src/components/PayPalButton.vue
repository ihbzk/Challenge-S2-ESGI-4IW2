<template>
  <div>
    <div id="paypal-button-container"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

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
          alert('Transaction completed by ' + details.payer.name.given_name);
        });
      },
      onError: function(err) {
        console.error('Error during the transaction', err);
      }
    }).render('#paypal-button-container');
  } else {
    console.error('PayPal SDK not loaded.');
  }
});
</script>

<style scoped>
#paypal-button-container {
  margin-top: 20px;
}
</style>