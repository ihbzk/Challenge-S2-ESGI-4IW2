<template>
  <div class="max-w-md mx-auto p-4 bg-white shadow-md rounded">
    <form @submit.prevent="handleSubmit">
      <div id="card-element" class="mb-4"><!-- Stripe Element will be inserted here --></div>
      <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Payer</button>
    </form>
    <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripe = ref(null);
const elements = ref(null);
const error = ref('');
const clientSecret = ref('');
const router = useRouter();

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
    console.error('Erreur lors du chargement de Stripe ou de la création de l\'intention de paiement:', err);
    error.value = 'Échec de l\'initialisation du paiement. Veuillez réessayer plus tard.';
  }
});

const handleSubmit = async () => {
  try {
    const { error: stripeError, paymentIntent } = await stripe.value.confirmCardPayment(clientSecret.value, {
      payment_method: {
        card: elements.value.getElement('card'),
        billing_details: {
          name: 'Utilisateur Test',
        },
      },
    });

    if (stripeError) {
      error.value = stripeError.message;
    } else {
      console.log('Paiement réussi', paymentIntent);
      error.value = '';
      router.push('/delivery'); // Redirection vers la page de livraison
    }
  } catch (err) {
    console.error('Erreur lors de la confirmation du paiement par carte:', err);
    error.value = 'Échec du paiement. Veuillez réessayer.';
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