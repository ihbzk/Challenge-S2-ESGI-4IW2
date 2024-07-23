<template>
  <div class="max-w-md mx-auto p-4 bg-white shadow-md rounded">
    <div id="paypal-button-container"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps(['onPaymentSuccess', 'amount']);

onMounted(() => {
  if (window.paypal) {
    window.paypal.Buttons({
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: props.amount
            }
          }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          alert('Transaction complétée par ' + details.payer.name.given_name);

          // Appeler la fonction de succès de paiement
          props.onPaymentSuccess(details);

          // on redirige l'utilisateur vers une page de confirmation
          router.push({ name: 'ConfirmationPage'});
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
