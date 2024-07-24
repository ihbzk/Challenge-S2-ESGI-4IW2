<script setup lang="ts">
import { ref } from 'vue'
import { registerSchema } from '@/composables/validation'

const firstname = ref('')
const lastname = ref('')
const email = ref('')
const password = ref('')
const repeatPassword = ref('')
const rgpd = ref(false)
const errors = ref({})
const successMessage = ref('')

const register = async () => {
    errors.value = {}
    successMessage.value = ''

    if (!rgpd.value) {
        errors.value.general = 'Vous devez accepter les termes et conditions pour continuer.'
        return
    }

    const formData = {
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
        password: password.value,
        repeatPassword: repeatPassword.value,
    }

    const result = registerSchema.safeParse(formData)

    if (!result.success) {
        result.error.errors.forEach((e) => {
            errors.value[e.path[0]] = e.message
        })
        return
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname: firstname.value,
                lastname: lastname.value,
                email: email.value,
                password: password.value,
            })
        })

        const data = await response.json();
        console.log("Response data:", data); // Ajout de ce log pour vérifier la réponse

        if (!response.ok) {
            throw new Error(data.message || 'Network response was not ok')
        }

        if (data.verificationRequired) {
            successMessage.value = 'Inscription réussie avec succès. Veuillez vérifier votre email pour confirmer votre inscription.'
        }
    } catch (error) {
        errors.value.general = error.message
        console.error('Échec de l\'inscription', error)
    }
}
</script>

<template>
    <main>
        <div class="flex min-h-full flex-1 h-screen">
            <div class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div class="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <img src="../assets/images/logo2.svg" alt="InformaCart" class="h-10 w-auto">
                        <h2 class="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">S'inscrire</h2>
                        <p class="mt-2 text-sm leading-6 text-gray-500">
                            Déjà un compte ?
                            {{ ' ' }}
                            <a href="/login" class="font-semibold text-indigo-600 hover:text-indigo-500">Se connecter</a>
                        </p>
                    </div>

                    <div class="mt-10">
                        <form @submit.prevent="register" class="space-y-6">
                            <div v-if="errors.general" class="text-red-500 font-bold mb-4">{{ errors.general }}</div>
                            <div v-if="successMessage" class="text-green-500 font-bold mb-4">{{ successMessage }}</div>

                            <div>
                                <label for="firstname"
                                    class="block text-sm font-medium leading-6 text-gray-900">Prénom</label>
                                <div class="mt-2">
                                    <input id="firstname" name="firstname" type="text" v-model="firstname" required
                                        :class="{ 'border-red-500': errors.firstname }"
                                        class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="Entrez votre prénom" />
                                    <p v-if="errors.firstname" class="text-red-500 text-xs mt-2">{{ errors.firstname }}</p>
                                </div>
                            </div>

                            <div>
                                <label for="lastname" class="block text-sm font-medium leading-6 text-gray-900">Nom</label>
                                <div class="mt-2">
                                    <input id="lastname" name="lastname" type="text" v-model="lastname" required
                                        :class="{ 'border-red-500': errors.lastname }"
                                        class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="Entrez votre nom" />
                                    <p v-if="errors.lastname" class="text-red-500 text-xs mt-2">{{ errors.lastname }}</p>
                                </div>
                            </div>

                            <div>
                                <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Adresse
                                    email</label>
                                <div class="mt-2">
                                    <input id="email" name="email" type="email" v-model="email" required
                                        :class="{ 'border-red-500': errors.email }"
                                        class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="Entrez votre adresse email" />
                                    <p v-if="errors.email" class="text-red-500 text-xs mt-2">{{ errors.email }}</p>
                                </div>
                            </div>

                            <div>
                                <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Mot de
                                    passe</label>
                                <div class="mt-2">
                                    <input id="password" name="password" type="password" v-model="password" required
                                        :class="{ 'border-red-500': errors.password }"
                                        class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="Entrez votre mot de passe" />
                                    <p v-if="errors.password" class="text-red-500 text-xs mt-2">{{ errors.password }}</p>
                                </div>
                            </div>

                            <div>
                                <label for="repeatPassword"
                                    class="block text-sm font-medium leading-6 text-gray-900">Confirmer le mot de
                                    passe</label>
                                <div class="mt-2">
                                    <input id="repeatPassword" name="repeatPassword" type="password"
                                        v-model="repeatPassword" required :class="{ 'border-red-500': errors.repeatPassword }"
                                        class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="Confirmez votre mot de passe" />
                                    <p v-if="errors.repeatPassword" class="text-red-500 text-xs mt-2">{{
                                        errors.repeatPassword }}</p>
                                </div>
                            </div>

                            <div>
                                <label class="flex items-center">
                                    <input type="checkbox" v-model="rgpd" class="form-checkbox" required />
                                    <span class="ml-2 text-sm text-gray-600">
                                        J'accepte les termes et conditions et reconnais que mes données personnelles seront utilisées conformément à la politique de confidentialité.
                                    </span>
                                </label>
                            </div>

                            <div>
                                <button type="submit"
                                    class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">S'inscrire</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="relative hidden w-0 flex-1 lg:block">
                <img class="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
                    alt="" />
            </div>
        </div>
    </main>
</template>

<style scoped></style>
