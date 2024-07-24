<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const token = ref(null);
const message = ref('');
const error = ref('');

const router = useRouter();
token.value = router.currentRoute.value.query.token;

const confirmVerifyToken = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/confirm-token-verify?token=${token.value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Échec de la vérification du token de confirmation');
        }

        message.value = data.message;
    } catch (err) {
        error.value = err.message || 'Une erreur est survenue lors de la vérification du token de confirmation';
        console.error('Erreur lors de la vérification du token de confirmation :', err);

        // Rediriger l'utilisateur si le token est invalide
        router.push('/login');
    }
};

onMounted(() => {
    confirmVerifyToken();
});

const confirmAccount = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/confirm?token=${token.value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Échec de la confirmation du compte');
        }

        message.value = data.message;
    } catch (err) {
        error.value = err.message || 'Une erreur est survenue lors de la confirmation du compte';
        console.error('Erreur lors de la confirmation du compte :', err);
    }
};
</script>

<template>
    <div class="flex flex-col min-h-screen bg-gray-50">
        <div class="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div class="w-full max-w-sm space-y-10 bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                <div>
                    <img src="../assets/images/logo.svg" alt="InformaCart" class="mx-auto h-10 w-auto">
                    <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Confirmation de compte</h2>
                </div>
                <div v-if="message" class="text-center text-green-500 font-bold mb-4">{{ message }}</div>
                <div v-if="error" class="text-center text-red-500 font-bold mb-4">{{ error }}</div>
                <button @click="confirmAccount"
                    class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Confirmer
                    mon compte</button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
