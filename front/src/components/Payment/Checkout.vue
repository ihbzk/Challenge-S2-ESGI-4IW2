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
          <form @submit.prevent="nextStep">
            <label for="email-phone" class="block text-gray-700">E-mail</label>
            <input v-model="formData.email" type="text" id="email-phone" class="w-full mt-1 p-2 border border-gray-300 rounded" />
            <div v-if="showErrors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</div>
            <div class="flex items-center mt-4">
              <input v-model="formData.newsletter" type="checkbox" id="newsletter" class="mr-2" />
              <label for="newsletter" class="text-gray-600">Inscrivez-vous à notre newsletter et recevez par mail un code promo de 10% !</label>
            </div>
          </form>
        </div>

        <!-- Adresse de livraison -->
        <div v-if="currentStep === 2">
          <h2 class="text-xl font-bold mb-4">Adresse de livraison</h2>
          <form @submit.prevent="nextStep">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="first-name" class="block text-gray-700">Prénom</label>
                <input v-model="formData.firstName" type="text" id="first-name" class="w-full mt-1 p-2 border border-gray-300 rounded" />
                <div v-if="showErrors.firstName" class="text-red-500 text-sm mt-1">{{ errors.firstName }}</div>
              </div>
              <div>
                <label for="last-name" class="block text-gray-700">Nom</label>
                <input v-model="formData.lastName" type="text" id="last-name" class="w-full mt-1 p-2 border border-gray-300 rounded" />
                <div v-if="showErrors.lastName" class="text-red-500 text-sm mt-1">{{ errors.lastName }}</div>
              </div>
            </div>
            <div class="mt-4">
              <label for="address" class="block text-gray-700">Adresse</label>
              <input v-model="formData.address" type="text" id="address" class="w-full mt-1 p-2 border border-gray-300 rounded" />
              <div v-if="showErrors.address" class="text-red-500 text-sm mt-1">{{ errors.address }}</div>
            </div>
            <div class="mt-4">
              <label for="apartment" class="block text-gray-700">Appartement, suite, etc. (facultatif)</label>
              <input v-model="formData.apartment" type="text" id="apartment" class="w-full mt-1 p-2 border border-gray-300 rounded" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label for="city" class="block text-gray-700">Ville</label>
                <input v-model="formData.city" type="text" id="city" class="w-full mt-1 p-2 border border-gray-300 rounded" />
                <div v-if="showErrors.city" class="text-red-500 text-sm mt-1">{{ errors.city }}</div>
              </div>
              <div>
                <label for="postal-code" class="block text-gray-700">Code postal</label>
                <input v-model="formData.postalCode" type="text" id="postal-code" class="w-full mt-1 p-2 border border-gray-300 rounded" />
                <div v-if="showErrors.postalCode" class="text-red-500 text-sm mt-1">{{ errors.postalCode }}</div>
              </div>
            </div>
            <div class="mt-4">
              <label for="country" class="block text-gray-700">Pays</label>
              <input v-model="formData.country" type="text" id="country" class="w-full mt-1 p-2 border border-gray-300 rounded" />
              <div v-if="showErrors.country" class="text-red-500 text-sm mt-1">{{ errors.country }}</div>
            </div>
          </form>
          <Delivery />
        </div>

        <!-- Paiement -->
        <div v-if="currentStep === 3">
          <h2 class="text-xl font-bold mb-4">Paiement</h2>
          <div class="flex justify-around mb-6">
            <button @click="showStripe = true; showPayPal = false" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Payer avec Stripe</button>
            <button @click="showStripe = false; showPayPal = true" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Payer avec PayPal</button>
          </div>
          <div v-if="showStripe">
            <Payment :onPaymentSuccess="onPaymentSuccess" :amount="cartTotal" />
          </div>
          <div v-if="showPayPal">
            <PayPalButton :onPaymentSuccess="onPaymentSuccess" :amount="cartTotal" />
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-8">
          <button v-if="currentStep > 1" @click="prevStep" class="btn btn-secondary">Retour</button>
          <button v-if="currentStep < 3" @click="nextStep" class="btn btn-primary">Suivant</button>
          <!-- <button v-if="currentStep === 3" @click="submitOrder" class="btn btn-primary">Valider la commande</button> -->
        </div>

        <!-- Display errors at the end -->
        <div v-if="showFinalErrors" class="mt-8">
          <h3 class="text-lg font-semibold mb-2">Erreur(s) dans le formulaire</h3>
          <div v-if="errors.email" class="text-red-500 text-sm mb-2">{{ errors.email }}</div>
          <div v-if="errors.firstName" class="text-red-500 text-sm mb-2">{{ errors.firstName }}</div>
          <div v-if="errors.lastName" class="text-red-500 text-sm mb-2">{{ errors.lastName }}</div>
          <div v-if="errors.address" class="text-red-500 text-sm mb-2">{{ errors.address }}</div>
          <div v-if="errors.apartment" class="text-red-500 text-sm mb-2">{{ errors.apartment }}</div>
          <div v-if="errors.city" class="text-red-500 text-sm mb-2">{{ errors.city }}</div>
          <div v-if="errors.postalCode" class="text-red-500 text-sm mb-2">{{ errors.postalCode }}</div>
          <div v-if="errors.country" class="text-red-500 text-sm mb-2">{{ errors.country }}</div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Payment from '@/components/Payment/Payment.vue';
import PayPalButton from '@/components/Payment/PayPalButton.vue';
import Delivery from '@/components/Payment/Delivery.vue';
import useAuth from '@/composables/useAuth';
import { informationsSchema, orderSchema } from '@/composables/validation';

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
  newsletter: false
});

const errors = ref({
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  apartment: '',
  city: '',
  postalCode: '',
  country: ''
});

const showErrors = ref({
  email: false,
  firstName: false,
  lastName: false,
  address: false,
  apartment: false,
  city: false,
  postalCode: false,
  country: false
});

const showFinalErrors = ref(false);
const showStripe = ref(false);
const showPayPal = ref(false);

onMounted(() => {
  const savedCart = sessionStorage.getItem('cart');
  if (savedCart) {
    cart.value = JSON.parse(savedCart);
  }
});

// validation de la première étape
const validateInformations = () => {
  const result = informationsSchema.safeParse(formData.value);
  if (result.success) {
    errors.value.email = '';
    showErrors.value.email = false;
    currentStep.value = 2;
  } else {
    errors.value.email = result.error.errors.find(error => error.path[0] === 'email')?.message || '';
    showErrors.value.email = !!errors.value.email;
  }
};

// validation de la deuxième étape
const validateOrder = () => {
  const result = orderSchema.safeParse(formData.value);
  if (result.success) {
    Object.keys(errors.value).forEach(key => errors.value[key] = '');
    Object.keys(showErrors.value).forEach(key => showErrors.value[key] = false);
    currentStep.value = 3;
  } else {
    result.error.errors.forEach(error => {
      errors.value[error.path[0]] = error.message;
      showErrors.value[error.path[0]] = !!error.message;
    });
  }
};

const nextStep = () => {
  if (currentStep.value === 1) {
    validateInformations();
  } else if (currentStep.value === 2) {
    validateOrder();
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const onPaymentSuccess = async () => {
  showFinalErrors.value = true;
  validateOrder();

  if (Object.values(errors.value).every(error => error === '')) {
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
      sessionStorage.removeItem('cart');
      console.log(order);
    } catch (error) {
      alert('Failed to submit order');
      console.error(error);
    }
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

.text-red-500 {
  color: #f56565;
}
</style>
