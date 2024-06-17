<template>
    <div class="forgot-password-container">
        <h2>Mot de passe oublié</h2>
            <form @submit.prevent="sendResetEmail">
            <div v-if="message" class="message" :class="{ 'error': isError }">
                {{ message }}
            </div>
            <div class="form-group">
                <label for="email">Adresse mail :</label>
                <input type="email" v-model="email" required class="form-input" />
            </div>
            <button type="submit" class="auth-button">Envoyer</button>
        </form>
    </div>
  </template>
  
<script>
    export default {
        data() {
            return {
                email: '',
                message: '',
                isError: false
            };
        },
        methods: {
            async sendResetEmail() {
                this.message = '';
                this.isError = false;

                try {
                    const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/forgot-password`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: this.email
                        })
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Network response was not ok');
                    }

                    this.message = 'Email de réinitialisation du mot de passe envoyé';
                    this.isError = false;
                    console.log('Email de réinitialisation du mot de passe envoyé', data);
                } catch (error) {
                    this.message = error.message;
                    this.isError = true;
                    console.error('Erreur lors de l\'envoi de l\'email de réinitialisation du mot de passe', error);
                }
            }
        }
    };
</script>
  
<style scoped>
    .forgot-password-container {
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    .form-input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    
    .auth-button {
        background-color: #007bff;
        color: #fff;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    
    .auth-button:hover {
        background-color: #0056b3;
    }
    
    .message {
        margin-bottom: 20px;
        font-weight: bold;
    }
    
    .error {
        color: red;
    }
</style>
  