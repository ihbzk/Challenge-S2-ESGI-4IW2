<template>
  <div class="max-w-md mx-auto p-4 bg-white shadow-md rounded">
    <div id="paypal-button-container"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  onPaymentSuccess: Function,
  amount: Number,
  order: Object
});

const router = useRouter();

onMounted(() => {
  // Check if PayPal SDK is loaded
  if (window.paypal) {
    window.paypal.Buttons({
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: props.amount.toFixed(2) // Ensure the amount is in the correct format
            }
          }]
        });
      },
      onApprove: async function(data, actions) {
        try {
          // Capture the order
          const details = await actions.order.capture();
          alert('Transaction complétée par ' + details.payer.name.given_name);

          console.log('Payment successful', details);

          // Call the success payment function
          if (props.onPaymentSuccess) {
            props.onPaymentSuccess(details);

            // Clear the cart
            await sessionStorage.removeItem('cart');

            // Redirect the user to the confirmation page
            router.push({ 
              name: 'ConfirmationPage', 
              query: { 
                order: encodeURIComponent(JSON.stringify({
                  firstName: props.order.firstName,
                  lastName: props.order.lastName,
                  address: props.order.address,
                  city: props.order.city,
                  postalCode: props.order.postalCode,
                  country: props.order.country,
                  amount: props.amount,
                  date: new Date().toISOString()
                }))
              }
            });
          }
        } catch (err) {
          console.error('Erreur lors de la capture de la transaction', err);
        }
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
