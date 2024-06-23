<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
            <h2 class="text-2xl font-bold mb-6">Réinitialiser le mot de passe</h2>
            <form @submit.prevent="resetPassword" class="space-y-6">
                <div v-if="message" :class="['font-bold mb-4', isError ? 'text-red-500' : 'text-green-500']">
                    {{ message }}
                </div>
                <FormInput 
                    id="password" 
                    label="Nouveau mot de passe :" 
                    :modelValue="password" 
                    @update:modelValue="password = $event"
                    type="password" 
                    :error="errors.password" 
                    placeholder="Entrez votre nouveau mot de passe"
                />
                <FormInput 
                    id="repeatPassword" 
                    label="Confirmer le mot de passe :" 
                    :modelValue="repeatPassword" 
                    @update:modelValue="repeatPassword = $event"
                    type="password" 
                    :error="errors.repeatPassword" 
                    placeholder="Confirmez votre nouveau mot de passe"
                />
                <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 transition">Réinitialiser le mot de passe</button>
            </form>
        </div>
    </div>
</template>
  
<script setup>
    import FormInput from '@/components/Forms/FormInput.vue';

    import { ref, onMounted } from 'vue';
    import { resetPasswordSchema } from '@/composables/validation';
    import { useRouter } from 'vue-router';
    
    const password = ref('');
    const repeatPassword = ref('');
    const message = ref('');
    const isError = ref(false);
    const token = ref(null);
    const errors = ref({});
    
    const router = useRouter();
    token.value = router.currentRoute.value.query.token;
    
    const resetPasswordVerifyToken = async () => {
        try {
            const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/reset-password-token-verify?token=${token.value}`, {
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
            message.value = err.message || 'Une erreur est survenue lors de la vérification du token de confirmation';
            console.error('Erreur lors de la vérification du token de confirmation :', err);
        
            // Rediriger l'utilisateur si le token est invalide
            router.push('/login');
        }
    };
    
    onMounted(() => {
        resetPasswordVerifyToken();
    });
    
    const resetPassword = async () => {
        message.value = '';
        isError.value = false;
        errors.value = {};
    
        // Validation avec Zod
        const validationResult = resetPasswordSchema.safeParse({
            password: password.value,
            repeatPassword: repeatPassword.value
        });
    
        if (!validationResult.success) {
            // Afficher les messages d'erreur Zod
            validationResult.error.errors.forEach((e) => {
                errors.value[e.path[0]] = e.message;
            });

            return;
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
            });
        
            const data = await response.json();
        
            if (!response.ok) {
                if (response.status === 400 && data.message === 'Token de réinitialisation invalide ou expiré') {
                    message.value = 'Le lien de réinitialisation est expiré. Veuillez demander un nouveau lien.';
                    isError.value = true;
                } else {
                    throw new Error(data.message || 'Network response was not ok');
                }
            } else {
                message.value = 'Réinitialisation du mot de passe réussie';
                isError.value = false;
                console.log('Réinitialisation du mot de passe réussie', data);
            }
        } catch (err) {
            message.value = err.message;
            isError.value = true;
            console.error('Échec de la réinitialisation du mot de passe', err);
        }
    };
</script>
  
<style scoped></style>
  