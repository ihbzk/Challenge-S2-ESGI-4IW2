<template>
    <div class="auth-container">
        <div class="auth-box">
            <h2>Inscription</h2>
            <form @submit.prevent="register" class="auth-form">
                <div class="form-group">
                    <label for="firstname">Prénom :</label>
                    <input type="text" v-model="firstname" required class="form-input" />
                    <div v-if="errors.firstname" class="error">{{ errors.firstname }}</div>
                </div>
                <div class="form-group">
                    <label for="lastname">Nom :</label>
                    <input type="text" v-model="lastname" required class="form-input" />
                    <div v-if="errors.lastname" class="error">{{ errors.lastname }}</div>
                </div>
                <div class="form-group">
                    <label for="email">Adresse mail :</label>
                    <input type="email" v-model="email" required class="form-input" />
                    <div v-if="errors.email" class="error">{{ errors.email }}</div>
                </div>
                <div class="form-group">
                    <label for="password">Mot de passe :</label>
                    <input type="password" v-model="password" required class="form-input" />
                <div v-if="errors.password" class="error">{{ errors.password }}</div>
                </div>
                <div class="form-group">
                    <label for="repeatPassword">Confirmation du mot de passe:</label>
                    <input type="password" v-model="repeatPassword" required class="form-input" />
                    <div v-if="errors.repeatPassword" class="error">{{ errors.repeatPassword }}</div>
                </div>
                <button type="submit" class="auth-button">S'inscrire</button>
                <a href="/login">Déjà un compte ? Se connecter</a>
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                repeatPassword: '',
                errors: {}
            };
        },
        methods: {
            async register() {
                this.errors = {};

                if (!this.firstname) {
                    this.errors.firstname = 'Le prénom est requis';
                }

                if (!this.lastname) {
                    this.errors.lastname = 'Le nom est requis';
                }

                if (!this.email) {
                    this.errors.email = 'Email est requis';
                } else if (!/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(this.email)) {
                    this.errors.email = 'Email doit être une adresse email valide';
                }

                if (!this.password) {
                    this.errors.password = 'Mot de passe est requis';
                } else if (this.password.length < 12) {
                    this.errors.password = 'Le mot de passe doit contenir au moins 12 caractères';
                } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/.test(this.password)) {
                    this.errors.password = 'Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial';
                }

                if (!this.repeatPassword) {
                    this.errors.repeatPassword = 'Répéter le mot de passe est requis';
                } else if (this.password !== this.repeatPassword) {
                    this.errors.repeatPassword = 'Les mots de passe ne correspondent pas';
                }

                if (Object.keys(this.errors).length > 0) {
                    return;
                }

                try {
                    const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            firstname: this.firstname,
                            lastname: this.lastname,
                            email: this.email,
                            password: this.password,
                        })
                    });

                    if (!response.ok) {
                        const data = await response.json();

                        throw new Error(data.message || 'Network response was not ok');
                    }

                    const data = await response.json();
                    console.log('Inscription réussie', data);

                    // Rediriger vers la page de login après une inscription réussie
                    this.$router.push('/login');
                } catch (error) {
                    this.errors.general = error.message;
                    console.error('Échec de l\'inscription', error);
                }
            }
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

    .error {
        color: red;
    }
</style>
