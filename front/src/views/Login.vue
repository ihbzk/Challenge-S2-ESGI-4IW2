<script setup lang="ts">
import { ref } from 'vue';
import { loginSchema } from '@/composables/validation';
import useAuth from '@/composables/useAuth';
import { useRouter } from 'vue-router';

const { isAuthenticated, initializeAuth, setAuthToken } = useAuth();
const router = useRouter();

initializeAuth();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const errors = ref({ email: '', password: '', general: '' });

const login = async () => {
    try {
        errors.value = { email: '', password: '', general: '' };

        const validationResult = loginSchema.safeParse({ email: email.value, password: password.value });
        if (!validationResult.success) {
            validationResult.error.errors.forEach((e) => {
                errors.value[e.path[0]] = e.message;
            });
            return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(validationResult.data)
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.errors) {
                data.errors.forEach((error) => {
                    errors.value[error.field] = error.message;
                });
            } else {
                errors.value.general = data.message || 'Network response was not ok';
            }
            return;
        }

        // on vérifie ici si rememberMe est coché
        if (rememberMe.value) {
            // si on coche rememberMe, on stocke le token dans le localStorage
            setAuthToken(data.authToken, true);
        } else {
            // sinon, on stocke le token dans le sessionStorage 
            setAuthToken(data.authToken, false);
        }

        isAuthenticated.value = true;
        // on redirige l'utilisateur vers la page d'accueil
        router.push({ name: 'Homepage' });
    } catch (error) {
        errors.value.general = 'Échec de la connexion';
        console.error('Échec de la connexion', error);
    }
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <div class="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div class="w-full max-w-lg space-y-10 bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
        <div>
          <img src="../assets/images/logo2.svg" alt="InformaCart" class="mx-auto h-10 w-auto">
          <h2 class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">Se connecter à votre compte</h2>
          <p class="mt-2 text-sm leading-6 text-gray-500">
            Pas encore de compte ?
            {{ ' ' }}
            <router-link :to="{ name: 'Register' }" class="font-semibold text-indigo-600 hover:text-indigo-500">S'inscrire</router-link>
          </p>
        </div>
        <div class="mt-10">
          <form @submit.prevent="login" class="space-y-6">
            <div v-if="errors.general" class="text-red-500 font-bold mb-4">{{ errors.general }}</div>
            <div>
              <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Adresse email</label>
              <div class="mt-2">
                <input id="email" name="email" type="email" v-model="email" required
                  :class="{ 'border-red-500': errors.email }"
                  class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Entrez votre adresse email" />
                <p v-if="errors.email" class="text-red-500 text-xs mt-2">{{ errors.email }}</p>
              </div>
            </div>
            <div>
              <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Mot de passe</label>
              <div class="mt-2">
                <input id="password" name="password" type="password" v-model="password" required
                  :class="{ 'border-red-500': errors.password }"
                  class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Entrez votre mot de passe" />
                <p v-if="errors.password" class="text-red-500 text-xs mt-2">{{ errors.password }}</p>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" v-model="rememberMe"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                <label for="remember-me" class="ml-3 block text-sm leading-6 text-gray-700">Se souvenir de moi</label>
              </div>
              <div class="text-sm leading-6">
                <router-link :to="{ name: 'ForgotPassword' }" class="font-semibold text-indigo-600 hover:text-indigo-500">Mot de passe oublié ?</router-link>
              </div>
            </div>
            <div>
              <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
