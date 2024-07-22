<template>
  <div class="max-w-md mx-auto p-4 bg-white shadow-md rounded">
    <form @submit.prevent="handleSubmit">
      <div id="card-element" class="mb-4"><!-- Stripe Element will be inserted here --></div>
      <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Payer</button>
    </form>
    <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
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
      amount: Math.round(cartTotal.value * 100) // Montant en centimes
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
          name: formData.value.firstName + ' ' + formData.value.lastName,
        },
      },
    });

    if (stripeError) {
      error.value = stripeError.message;
    } else {
      console.log('Paiement réussi', paymentIntent);
      error.value = '';

      // Enregistrez la commande après paiement réussi
      await submitOrder(paymentIntent.id);
    }
  } catch (err) {
    console.error('Erreur lors de la confirmation du paiement par carte:', err);
    error.value = 'Échec du paiement. Veuillez réessayer.';
  }
};

const submitOrder = async (paymentIntentId) => {
  try {
    const response = await axios.post('http://localhost:3000/api/orders', {
      userId: 'user-id-placeholder',
      totalAmount: cartTotal.value,
      paymentIntentId,
      // Autres détails de la commande
    });

    if (response.status === 200) {
      router.push('/confirmation'); // Redirigez vers une page de confirmation
    }
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement de la commande:', err);
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
