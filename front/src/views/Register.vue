<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
            <h2 class="text-2xl font-bold mb-6">Inscription</h2>
            <form @submit.prevent="register" class="space-y-6">
                <div v-if="errors.general" class="text-red-500 font-bold mb-4">{{ errors.general }}</div>
                <div v-if="successMessage" class="text-green-500 font-bold mb-4">{{ successMessage }}</div>
                <FormInput 
                    id="firstname" 
                    label="Prénom :" 
                    :modelValue="firstname"
                    @update:modelValue="firstname = $event"
                    type="text"
                    :error="errors.firstname" 
                    placeholder="Entrez votre prénom"
                />
                <FormInput 
                    id="lastname" 
                    label="Nom :" 
                    :modelValue="lastname"
                    @update:modelValue="lastname = $event"
                    type="text"
                    :error="errors.lastname" 
                    placeholder="Entrez votre nom"
                />
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
                <FormInput 
                    id="repeatPassword" 
                    label="Confirmer le mot de passe :" 
                    :modelValue="repeatPassword"
                    @update:modelValue="repeatPassword = $event"
                    type="password"
                    :error="errors.repeatPassword"  
                    placeholder="Confirmez votre mot de passe"
                />
                <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 transition">S'inscrire</button>
                <div class="flex justify-between mt-4">
                    <a href="/login" class="text-blue-500 hover:underline">Déjà un compte ? Se connecter</a>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
    import FormInput from '@/components/Forms/FormInput.vue';

    import { ref } from 'vue';
    import { registerSchema } from '@/composables/validation';

    const firstname = ref('');
    const lastname = ref('');
    const email = ref('');
    const password = ref('');
    const repeatPassword = ref('');
    const errors = ref({});
    const successMessage = ref('');

    const register = async () => {
        errors.value = {}; // Clear previous errors
        successMessage.value = ''; // Clear previous success message

        // Validate form data using Zod schema
        const formData = {
            firstname: firstname.value,
            lastname: lastname.value,
            email: email.value,
            password: password.value,
            repeatPassword: repeatPassword.value,
        };

        const result = registerSchema.safeParse(formData);

        if (!result.success) {
            result.error.errors.forEach((e) => {
                errors.value[e.path[0]] = e.message;
            });
            return;
        }

        try {
            const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/register`, {
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
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Network response was not ok');
            }

            const data = await response.json();
            if (data.verificationRequired) {
                successMessage.value = 'Inscription réussit avec succès. Veuillez vérifier votre email pour confirmer votre inscription.';
            }
        } catch (error) {
            errors.value.general = error.message;
            console.error('Échec de l\'inscription', error);
        }
    };
</script>
