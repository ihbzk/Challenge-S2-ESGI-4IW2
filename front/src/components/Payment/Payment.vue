<template>
  <div>
    <form @submit.prevent="handleSubmit">
      <div id="card-element"><!-- Stripe Element will be inserted here --></div>
      <button type="submit">Payer</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps(['onPaymentSuccess', 'amount', 'order']);

const stripe = ref(null);
const elements = ref(null);
const error = ref('');
const clientSecret = ref('');

onMounted(async () => {
  try {
    // Load Stripe.js
    stripe.value = await loadStripe(`${import.meta.env.VITE_STRIPE_PUBLIC_KEY}`);

    // Fetch the client secret from the backend
    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/payments/create-payment-intent`, {
      // Convert the amount to cents
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
          name: `${props.order.firstName} ${props.order.lastName}`,
        },
      },
    });

    if (stripeError) {
      error.value = stripeError.message;
    } else if (paymentIntent.status === 'succeeded') {
      console.log('Payment successful', paymentIntent);
      error.value = '';

      // Call the payment success function
      if (props.onPaymentSuccess) {
        props.onPaymentSuccess(paymentIntent);

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
.error {
  color: red;
}
</style>
