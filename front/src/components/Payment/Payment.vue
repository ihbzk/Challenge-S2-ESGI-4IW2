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
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps(['onPaymentSuccess', 'amount']);

const stripe = ref(null);
const elements = ref(null);
const error = ref('');
const clientSecret = ref('');

onMounted(async () => {
  try {
    // Load Stripe.js
    stripe.value = await loadStripe(`${import.meta.env.VITE_STRIPE_PUBLIC_KEY}`);

    // Fetch the client secret from the backend
    const { data } = await axios.post('http://localhost:3000/api/payments/create-payment-intent', {
      // on convertit le montant en centimes
      amount: props.amount * 100,
    });
    clientSecret.value = data.clientSecret;

    // Create an instance of Elements
    elements.value = stripe.value.elements();

    // Create and mount the Card Element
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

      // on appelle la fonction de succès de paiement
      props.onPaymentSuccess(paymentIntent);

      // on redirige l'utilisateur vers la page de confirmation
      router.push({ name: 'ConfirmationPage' });
    }
  } catch (err) {
    console.error('Error confirming card payment:', err);
    error.value = 'Payment failed. Please try again.';
  }
};
</script>

<style scoped>
/* Add some basic styling */
#card-element {
  margin: 10px 0;
}
button {
  margin-top: 10px;
}
</style>
