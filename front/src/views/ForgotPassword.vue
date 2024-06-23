<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
            <h2 class="text-2xl font-bold mb-6">Réinitialiser le mot de passe</h2>
            <form @submit.prevent="sendResetEmail" class="space-y-6">
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
                <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 transition">Envoyer l'email de réinitialisation</button>
            </form>
        </div>
    </div>
</template>

<script setup>
    import FormInput from '@/components/Forms/FormInput.vue';

    import { ref } from 'vue';
    import { forgotPasswordSchema } from '@/composables/validation';

    const email = ref('');
    const message = ref('');
    const errors = ref({ email: '', general: '' });

    const sendResetEmail = async () => {
        message.value = '';
        errors.value = { email: '', general: '' };

        // Validation avec Zod
        const validationResult = forgotPasswordSchema.safeParse({ email: email.value });
        if (!validationResult.success) {
            message.value = validationResult.error.errors[0].message;
            errors.value.email = validationResult.error.errors[0].message;
            return;
        }

        try {
            const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email.value
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    data.errors.forEach((error) => {
                        if (error.field === 'email') {
                            errors.value.email = error.message;
                        } else {
                            errors.value.general = error.message;
                        }
                    });
                } else {
                    errors.value.general = data.message || 'Network response was not ok';
                }
                return;
            }

            errors.value.general = 'Email de réinitialisation du mot de passe envoyé';
            console.log('Email de réinitialisation du mot de passe envoyé', data);
        } catch (error) {
            errors.value.general = 'Identifiants invalides'
            console.error('Erreur lors de l\'envoi de l\'email de réinitialisation du mot de passe', error);
        }
    };
</script>

<style scoped></style>
