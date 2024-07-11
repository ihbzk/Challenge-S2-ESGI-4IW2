<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { resetPasswordSchema } from '@/composables/validation'
import TheHeader from '@/components/Header/Header.vue'
import type { ProductCartInterface } from '@/interfaces'

const state = reactive<{
  cart: ProductCartInterface[]
  cartOpen: boolean
}>({
  cart: [],
  cartOpen: false
})

const password = ref('')
const repeatPassword = ref('')
const message = ref('')
const isError = ref(false)
const token = ref(null)
const errors = ref({})

const router = useRouter()
token.value = router.currentRoute.value.query.token

const resetPasswordVerifyToken = async () => {
    try {
        const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/reset-password-token-verify?token=${token.value}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            },
        })
    
        const data = await response.json()
    
        if (!response.ok) {
            throw new Error(data.message || 'Échec de la vérification du token de confirmation')
        }
    
        message.value = data.message
    } catch (err) {
        message.value = err.message || 'Une erreur est survenue lors de la vérification du token de confirmation'
        console.error('Erreur lors de la vérification du token de confirmation :', err)
    
        // Rediriger l'utilisateur si le token est invalide
        router.push('/login')
    }
}

onMounted(() => {
    resetPasswordVerifyToken()
})

const resetPassword = async () => {
    message.value = ''
    isError.value = false
    errors.value = {}
  
    // Validation avec Zod
    const validationResult = resetPasswordSchema.safeParse({
        password: password.value,
        repeatPassword: repeatPassword.value
    })
  
    if (!validationResult.success) {
        // Afficher les messages d'erreur Zod
        validationResult.error.errors.forEach((e) => {
            errors.value[e.path[0]] = e.message
        })
        return
    }
  
    try {
        const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/reset-password`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            token: token.value,
            newPassword: password.value
            })
        })
    
        const data = await response.json()
    
        if (!response.ok) {
            if (response.status === 400 && data.message === 'Token de réinitialisation invalide ou expiré') {
                message.value = 'Le lien de réinitialisation est expiré. Veuillez demander un nouveau lien.'
                isError.value = true
            } else {
                throw new Error(data.message || 'Network response was not ok')
            }
        } else {
            message.value = 'Réinitialisation du mot de passe réussie'
            isError.value = false
            console.log('Réinitialisation du mot de passe réussie', data)
        }
    } catch (err) {
        message.value = err.message
        isError.value = true
        console.error('Échec de la réinitialisation du mot de passe', err)
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
  <div class="flex flex-col min-h-screen">
    <TheHeader :cart="state.cart" :cartOpen="state.cartOpen" @remove-product-from-cart="(productId) => state.cart = state.cart.filter(product => product.id !== productId)" @open-cart="openCart" @close-cart="closeCart" />
    <div class="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div class="w-full max-w-sm space-y-10">
        <div>
          <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="InformaCart" />
          <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Réinitialiser le mot de passe</h2>
          <p class="mt-2 text-center text-sm leading-6 text-gray-500">
            Récupérer l'accès à votre compte ?
            {{ ' ' }}
            <a href="/login" class="font-semibold text-indigo-600 hover:text-indigo-500">Se connecter</a>
          </p>
        </div>
        <form @submit.prevent="resetPassword" class="space-y-6">
          <div v-if="message" :class="['text-center font-bold', isError ? 'text-red-500' : 'text-green-500']">
            {{ message }}
          </div>
          <div class="space-y-6">
            <div>
              <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Nouveau mot de passe</label>
              <div class="mt-2">
                <input id="password" name="password" type="password" autocomplete="new-password" v-model="password" required
                  :class="{ 'border-red-500': errors.password }"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Entrez votre nouveau mot de passe" />
                <p v-if="errors.password" class="text-red-500 text-xs mt-2">{{ errors.password }}</p>
              </div>
            </div>
            <div>
              <label for="repeatPassword" class="block text-sm font-medium leading-6 text-gray-900">Confirmer le mot de passe</label>
              <div class="mt-2">
                <input id="repeatPassword" name="repeatPassword" type="password" autocomplete="new-password" v-model="repeatPassword" required
                  :class="{ 'border-red-500': errors.repeatPassword }"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Confirmez votre nouveau mot de passe" />
                <p v-if="errors.repeatPassword" class="text-red-500 text-xs mt-2">{{ errors.repeatPassword }}</p>
              </div>
            </div>
          </div>
          <div>
            <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Réinitialiser le mot de passe</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
