<template>
    <div class="auth-container">
        <div class="auth-box">
            <h2 v-if="!isAuthenticated">Se connecter</h2>
            <form v-if="!isAuthenticated" @submit.prevent="login" class="auth-form">
                <div v-if="message" class="message" :class="{ 'error': isError }">
                    {{ message }}
                </div>
                <div class="form-group">
                    <label for="email">Adresse mail :</label>
                    <input type="email" v-model="email" required class="form-input" />
                </div>
                <div class="form-group">
                    <label for="password">Mot de passe :</label>
                    <input type="password" v-model="password" required class="form-input" />
                </div>
                <button type="submit" class="auth-button">Connexion</button>
                <a href="/register">Pas encore de compte ? S'inscrire</a>
                <a href="/forgot-password">Mot de passe oublié ?</a>
            </form>
            <div v-if="isAuthenticated" class="welcome-box">
                <h2>Bienvenue !</h2>
                <button @click="logout" class="auth-button">Déconnexion</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                email: '',
                password: '',
                message: '',
                isError: false,
                isAuthenticated: false,
                authToken: '',
            };
        },
        mounted() {
            const authToken = localStorage.getItem('authToken');
            if (authToken) {
                this.authToken = authToken;
                this.isAuthenticated = true;
            }
        },
        methods: {
            async login() {
                this.message = '';
                this.isError = false;

            try {
                const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: this.email,
                        password: this.password
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Network response was not ok');
                }

                if (!data.user.isConfirmed) {
                    throw new Error('Votre compte n\'est pas confirmé. Veuillez vérifier votre email pour les instructions de confirmation.');
                }

                this.authToken = data.authToken;
                this.isAuthenticated = true;
                localStorage.setItem('authToken', this.authToken);
                this.message = 'Connexion réussie';
                console.log('Connexion réussie', data);
            } catch (error) {
                this.message = error.message;
                this.isError = true;
                console.error('Échec de la connexion', error);
            }
        },
        async logout() {
            try {
                const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json'
                }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                this.isAuthenticated = false;
                this.authToken = '';
                localStorage.removeItem('authToken');
                this.message = 'Déconnexion réussie';
                this.isError = false;
                console.log('Déconnexion réussie');
            } catch (error) {
                this.message = error.message;
                this.isError = true;
                console.error('Échec de la déconnexion', error);
            }
            },
            async checkAuth() {
                try {
                    const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/me`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${this.authToken}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Erreur lors de la récupération des données utilisateur');
                    }

                    const data = await response.json();

                    if (response.status === 401) {
                        this.isAuthenticated = false;
                        this.authToken = '';
                        localStorage.removeItem('authToken');
                        this.message = 'Session expirée';
                        this.isError = true;
                        console.log('Session expirée');
                    } else {
                        this.isAuthenticated = data.user.isConfirmed;

                        if (!this.isAuthenticated) {
                            throw new Error('Votre compte n\'est pas confirmé. Veuillez vérifier votre email pour les instructions de confirmation.');
                        }
                    }
                } catch (error) {
                    this.message = error.message;
                    this.isError = true;
                    console.error('Échec de la vérification de l\'authentification', error);
                    this.isAuthenticated = false;
                    this.authToken = '';
                    localStorage.removeItem('authToken');
                }
            }
        },
        watch: {
            isAuthenticated(value) {
            if (value) {
                this.checkAuthInterval = setInterval(this.checkAuth, 5000); // Vérifier l'authentification toutes les 5 secondes
            } else {
                clearInterval(this.checkAuthInterval);
            }
            }
        },
        beforeDestroy() {
            clearInterval(this.checkAuthInterval);
        }
};
</script>

<style scoped>
    .auth-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f0f2f5;
    }

    .auth-box {
        background: #fff;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
        max-width: 400px;
        width: 100%;
    }

    .auth-form {
        display: flex;
        flex-direction: column;
    }

    .form-group {
        margin-bottom: 20px;
        text-align: left;
    }

    .form-group label {
        margin-bottom: 5px;
        font-weight: bold;
        display: block;
    }

    .form-input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
    }

    .auth-button {
        background-color: #007bff;
        color: #fff;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s;
    }

    .auth-button:hover {
        background-color: #0056b3;
    }

    .message {
        font-weight: bold;
        margin-bottom: 20px;
    }

    .error {
        color: red;
    }
</style>
