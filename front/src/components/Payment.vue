<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div id="card-element"><!-- Stripe Element will be inserted here --></div>
      <button type="submit">Payer</button>
    </form>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripe = ref(null);
const elements = ref(null);
const error = ref('');
const clientSecret = ref('');

onMounted(async () => {
  try {
    stripe.value = await loadStripe('pk_test_51PbKHAIwDc1XOowALUAMUSiEm7AvQkTkCp097tPeoq8Xl1N4ZfdjmJL979D8QUdnltcenf0cMHFECVtcn01tR90S00m3VtnWuV');
    const { data } = await axios.post('http://localhost:3000/api/payments/create-payment-intent', {
      amount: 2000
    });
    clientSecret.value = data.clientSecret;
    elements.value = stripe.value.elements();
    const cardElement = elements.value.create('card');
    cardElement.mount('#card-element');
  } catch (err) {
    console.error('Error loading Stripe or creating payment intent:', err);
    error.value = 'Failed to initialize payment. Please try again later.';
  }
});

const handleSubmit = async () => {
  try {
    const { error: stripeError, paymentIntent } = await stripe.value.confirmCardPayment(clientSecret.value, {
      payment_method: {
        card: elements.value.getElement('card'),
        billing_details: {
          name: 'Test User',
        },
      },
    });

    if (stripeError) {
      error.value = stripeError.message;
    } else {
      console.log('Payment successful', paymentIntent);
      error.value = '';
    }
  } catch (err) {
    console.error('Error confirming card payment:', err);
    error.value = 'Payment failed. Please try again.';
  }
};
</script>

<style scoped>
#card-element {
  margin: 10px 0;
}
button {
  margin-top: 10px;
}
</style>