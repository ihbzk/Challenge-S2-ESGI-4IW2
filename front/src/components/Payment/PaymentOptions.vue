<template>
  <div class="max-w-2xl mx-auto p-4 bg-white shadow-md rounded">
    <h2 class="text-2xl font-bold mb-4">Choisissez votre méthode de paiement</h2>
    <div class="flex justify-around mb-6">
      <button 
        @click="selectPaymentMethod('stripe')" 
        :class="{ 'bg-indigo-600': showStripe, 'bg-indigo-500': !showStripe }"
        class="text-white px-4 py-2 rounded hover:bg-indigo-700">
        Payer avec Stripe
      </button>
      <button 
        @click="selectPaymentMethod('paypal')" 
        :class="{ 'bg-yellow-500': showPayPal, 'bg-yellow-400': !showPayPal }"
        class="text-white px-4 py-2 rounded hover:bg-yellow-600">
        Payer avec PayPal
      </button>
    </div>
    <div v-if="showStripe">
      <Payment :amount="amount" :onPaymentSuccess="onPaymentSuccess" :order="order" />
    </div>
    <div v-if="showPayPal">
      <PayPalButton :amount="amount" :onPaymentSuccess="onPaymentSuccess" :order="order" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import Payment from '@/components/Payment/Payment.vue';
import PayPalButton from '@/components/Payment/PayPalButton.vue';

// Props (if needed)
const props = defineProps(['onPaymentSuccess', 'amount', 'order']);

// State for showing payment methods
const showStripe = ref(false);
const showPayPal = ref(false);

// Methods
const selectPaymentMethod = (method) => {
  if (method === 'stripe') {
    showStripe.value = true;
    showPayPal.value = false;
  } else if (method === 'paypal') {
    showStripe.value = false;
    showPayPal.value = true;
  }
};
</script>


<style scoped>
button {
  margin: 10px;
}
</style>
