<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
            <h2 class="text-2xl font-bold mb-6">Confirmation de compte</h2>
            <div v-if="message" class="text-green-500 font-bold mb-4">{{ message }}</div>
            <div v-if="error" class="text-red-500 font-bold mb-4">{{ error }}</div>
            <button @click="confirmAccount" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Confirmer mon compte
            </button>
        </div>
    </div>
</template>

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
            const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/confirm-token-verify?token=${token.value}`, {
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
            const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/confirm?token=${token.value}`, {
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

<style scoped></style>
