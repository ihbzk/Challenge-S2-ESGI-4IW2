<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
            <template v-if="!isAuthenticated">
                <h2 class="text-2xl font-bold mb-6">Se connecter</h2>
                <form @submit.prevent="login" class="space-y-6">
                    <div v-if="errors.general" class="text-red-500 font-bold mb-4">{{ errors.general }}</div>
                    <FormInput 
                        id="email" 
                        label="Adresse email :" 
                        :modelValue="email" 
                        @update:modelValue="email = $event"
                        type="email"
                        :error="errors.email" 
                        placeholder="Entrez votre adresse email"
                    />
                    <FormInput 
                        id="password" 
                        label="Mot de passe :" 
                        :modelValue="password"
                        @update:modelValue="password = $event"
                        type="password"
                        :error="errors.password" 
                        placeholder="Entrez votre mot de passe"
                    />
                    <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 transition">Connexion</button>
                    <div class="flex justify-between mt-4">
                        <a href="/register" class="text-blue-500 hover:underline">Pas encore de compte ? S'inscrire</a>
                        <a href="/forgot-password" class="text-blue-500 hover:underline">Mot de passe oublié ?</a>
                    </div>
                </form>
            </template>
            <template v-else>
                <div class="text-center">
                    <h2 class="text-2xl font-bold mb-6">Bienvenue !</h2>
                    <button @click="logout" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 transition">Déconnexion</button>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
    import FormInput from '@/components/Forms/FormInput.vue';

    import { ref } from 'vue';
    import { loginSchema } from '@/composables/validation';
    import useAuth from '@/composables/useAuth';

    const { isAuthenticated, initializeAuth } = useAuth();

    initializeAuth();

    const email = ref('');
    const password = ref('');
    const authToken = ref('');
    // general renvoie des erreurs serveurs liées au compte
    const errors = ref({ email: '', password: '', general: ''});

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

            const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/login`, {
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

            authToken.value = data.authToken;
            isAuthenticated.value = true;
            localStorage.setItem('authToken', authToken.value);
        } catch (error) {
            errors.value.general = 'Échec de la connexion';
            console.error('Échec de la connexion', error);
        }
    };

    const logout = async () => {
        try {
            let authToken = localStorage.getItem('authToken');
            const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            isAuthenticated.value = false;
            localStorage.removeItem('authToken');
        } catch (error) {
            console.error('Échec de la déconnexion', error);
        }
    };
</script>

<style scoped></style>
