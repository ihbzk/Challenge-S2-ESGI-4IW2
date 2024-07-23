<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { forgotPasswordSchema } from '@/composables/validation'
import TheHeader from '@/components/Header/Header.vue'
import type { ProductCartInterface } from '@/interfaces'

const state = reactive<{
  cart: ProductCartInterface[]
  cartOpen: boolean
}>({
  cart: [],
  cartOpen: false
})

const email = ref('')
const message = ref('')
const errors = ref({ email: '', general: '' })

const router = useRouter()

const sendResetEmail = async () => {
    message.value = ''
    errors.value = { email: '', general: '' }

    // Validation avec Zod
    const validationResult = forgotPasswordSchema.safeParse({ email: email.value })
    if (!validationResult.success) {
        message.value = validationResult.error.errors[0].message
        errors.value.email = validationResult.error.errors[0].message
        return
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email.value
            })
        })

        const data = await response.json()

        if (!response.ok) {
            if (data.errors) {
                data.errors.forEach((error) => {
                    if (error.field === 'email') {
                        errors.value.email = error.message
                    } else {
                        errors.value.general = error.message
                    }
                })
            } else {
                errors.value.general = data.message || 'Network response was not ok'
            }
            return
        }

        errors.value.general = 'Email de réinitialisation du mot de passe envoyé'
        console.log('Email de réinitialisation du mot de passe envoyé', data)
    } catch (error) {
        errors.value.general = 'Identifiants invalides'
        console.error('Erreur lors de l\'envoi de l\'email de réinitialisation du mot de passe', error)
    }
}

const openCart = () => {
    state.cartOpen = true
}

const closeCart = () => {
    state.cartOpen = false
}

const cartItemCount = computed(() => state.cart.reduce((acc, product) => acc + product.quantity, 0))
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white">
    <TheHeader :cart="state.cart" :cartOpen="state.cartOpen" @remove-product-from-cart="(productId) => state.cart = state.cart.filter(product => product.id !== productId)" @open-cart="openCart" @close-cart="closeCart" />
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img src="../assets/images/logo.svg" alt="InformaCart" class="mx-auto h-10 w-auto">
        <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Réinitialiser le mot de passe</h2>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form @submit.prevent="sendResetEmail" class="space-y-6">
          <div v-if="errors.general" class="text-green-500 font-bold mb-4">{{ errors.general }}</div>
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Adresse email</label>
            <div class="mt-2">
              <input id="email" name="email" type="email" autocomplete="email" v-model="email" required
                :class="{ 'border-red-500': errors.email }"
                class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Entrez votre adresse email" />
              <p v-if="errors.email" class="text-red-500 text-xs mt-2">{{ errors.email }}</p>
            </div>
          </div>

          <div>
            <button type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Envoyer l'email de réinitialisation</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
