<template>
  <main>
    <div class="flex flex-col lg:flex-row">
      <!-- Right Column: Cart Summary -->
      <div class="lg:w-1/3 bg-white p-6 border border-gray-200 rounded-lg lg:ml-6 shadow-md">
    <h2 class="text-xl font-bold mb-4 border-b border-gray-300 pb-2">Récapitulatif</h2>
    <ul>
      <li v-for="item in cart" :key="item.id" class="mb-4 flex items-start border-b border-gray-200 pb-4">
        <img :src="item.illustration" :alt="item.title" class="h-16 w-16 object-cover rounded-lg mr-4" />
        <div class="flex-1">
          <p class="text-lg font-semibold">{{ item.productName }}</p>
          <p class="text-gray-600">{{ item.quantity }} x {{ item.price }} €</p>
        </div>
        <p class="font-bold text-gray-900">{{ item.quantity * item.price }} €</p>
      </li>
    </ul>
    <div class="flex justify-between items-center font-bold text-xl mt-4 border-t border-gray-300 pt-4">
      <p>Total</p>
      <p class="text-indigo-600">{{ cartTotal }} €</p>
    </div>
  </div>

    <!-- Left Column: Form -->
    <div class="flex-1 bg-white p-6 border border-gray-200 rounded-lg lg:ml-6 mt-6 lg:mt-0">
      <!-- Step Indicator Bar -->
      <div class="mb-6">
        <div class="flex justify-between text-sm font-medium text-gray-600">
          <div :class="['step', { 'active': currentStep === 1 }]">1. Informations</div>
          <div :class="['step', { 'active': currentStep === 2 }]">2. Livraison</div>
          <div :class="['step', { 'active': currentStep === 3 }]">3. Paiement</div>
        </div>
        <div class="relative h-1 bg-gray-200 mt-2">
          <div :style="{ width: progressWidth }" class="absolute h-full bg-blue-500"></div>
        </div>
      </div>

      <!-- Informations -->
      <div v-if="currentStep === 1">
        <h2 class="text-xl font-bold mb-4">Informations</h2>
        <form>
          <label for="email-phone" class="block text-gray-700">E-mail ou numéro de portable</label>
          <input v-model="formData.email" type="text" id="email-phone" class="w-full mt-1 p-2 border border-gray-300 rounded" />
          <div class="flex items-center mt-4">
            <input type="checkbox" id="newsletter" class="mr-2" />
            <label for="newsletter" class="text-gray-600">Inscrivez-vous à notre newsletter et recevez par mail un code promo de 10% !</label>
          </div>
        </form>
      </div>

      <!-- Adresse de livraison -->
      <div v-if="currentStep === 2">
        <h2 class="text-xl font-bold mb-4">Adresse de livraison</h2>
        <form>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="first-name" class="block text-gray-700">Prénom (facultatif)</label>
              <input v-model="formData.firstName" type="text" id="first-name" class="w-full mt-1 p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label for="last-name" class="block text-gray-700">Nom</label>
              <input v-model="formData.lastName" type="text" id="last-name" class="w-full mt-1 p-2 border border-gray-300 rounded" />
            </div>
          </div>
          <div class="mt-4">
            <label for="address" class="block text-gray-700">Adresse</label>
            <input v-model="formData.address" type="text" id="address" class="w-full mt-1 p-2 border border-gray-300 rounded" />
          </div>
          <div class="mt-4">
            <label for="apartment" class="block text-gray-700">Appartement, suite, etc. (facultatif)</label>
            <input v-model="formData.apartment" type="text" id="apartment" class="w-full mt-1 p-2 border border-gray-300 rounded" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label for="city" class="block text-gray-700">Ville</label>
              <input v-model="formData.city" type="text" id="city" class="w-full mt-1 p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label for="postal-code" class="block text-gray-700">Code postal</label>
              <input v-model="formData.postalCode" type="text" id="postal-code" class="w-full mt-1 p-2 border border-gray-300 rounded" />
            </div>
          </div>
          <div class="mt-4">
            <label for="country" class="block text-gray-700">Pays</label>
            <input v-model="formData.country" type="text" id="country" class="w-full mt-1 p-2 border border-gray-300 rounded" />
          </div>
        </form>
        <Delivery />
      </div>

      <!-- Paiement -->
      <div v-if="currentStep === 3">
        <h2 class="text-xl font-bold mb-4">Paiement</h2>
        <PaymentOptions />
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between mt-8">
        <button v-if="currentStep > 1" @click="prevStep" class="btn btn-secondary">Retour</button>
        <button v-if="currentStep < 3" @click="nextStep" class="btn btn-primary">Suivant</button>
        <button v-if="currentStep === 3" @click="submitOrder" class="btn btn-primary">Valider la commande</button>
      </div>
    </div>
  </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import PaymentOptions from '@/components/PaymentOptions.vue';
import Delivery from '@/components/Delivery.vue';
import useAuth from '@/composables/useAuth';

const { user, isAuthenticated } = useAuth();

const currentStep = ref(1);
const cart = ref<ProductCartInterface[]>([]);
const cartTotal = computed(() => 
  cart.value.reduce((acc, product) => acc + product.price * product.quantity, 0)
);

const formData = ref({
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  apartment: '',
  city: '',
  postalCode: '',
  country: '',
});

onMounted(() => {
  const savedCart = sessionStorage.getItem('cart');
  if (savedCart) {
    cart.value = JSON.parse(savedCart);
  }
});

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const submitOrder = async () => {
  try {
    const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({
        userId: user.value.id,
        totalAmount: cartTotal.value,
        email: formData.value.email,
        deliveryAddress: {
          nom: formData.value.lastName,
          prénom: formData.value.firstName,
          rue: formData.value.address,
          ville: formData.value.city,
          code_postal: formData.value.postalCode,
          pays: formData.value.country,
        },
        products: cart.value.map(product => ({
          id: product.id,
          quantity: product.quantity
        })),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit order');
    }

    const order = await response.json();
    alert('Order submitted!');
    console.log(order);
  } catch (error) {
    alert('Failed to submit order');
    console.error(error);
  }
};

// Compute progress width based on currentStep
const progressWidth = computed(() => {
  switch (currentStep.value) {
    case 1:
      return '33%';
    case 2:
      return '66%';
    case 3:
      return '100%';
    default:
      return '0%';
  }
});
</script>

<style scoped>
.step {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-radius: 4px;
  background-color: #f0f0f0;
  color: #666;
  position: relative;
  transition: background-color 0.3s;
}

.step.active {
  background-color: #007bff;
  color: white;
}

.btn {
  @apply px-6 py-3 text-white font-medium rounded-md shadow-sm;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700;
}

.btn-secondary {
  @apply bg-gray-600 hover:bg-gray-700;
}
</style>
