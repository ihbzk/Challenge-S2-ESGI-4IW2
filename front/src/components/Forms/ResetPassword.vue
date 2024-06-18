<template>
  <div class="reset-password-container">
    <h2>Reset Password</h2>
    <form @submit.prevent="resetPassword">
      <div v-if="message" class="message" :class="{ error: isError }">
        {{ message }}
      </div>
      <div class="form-group">
        <label for="password">New Password:</label>
        <input type="password" v-model="password" required class="form-input" />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password:</label>
        <input type="password" v-model="confirmPassword" required class="form-input" />
      </div>
      <button type="submit" class="auth-button">Reset Password</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: '',
      confirmPassword: '',
      message: '',
      isError: false
    }
  },
  methods: {
    async resetPassword() {
      this.message = ''
      this.isError = false

      // Vérifier si les mots de passe correspondent
      if (this.password !== this.confirmPassword) {
        this.message = 'Les mots de passe ne correspondent pas'
        this.isError = true

        return
      }

      // Récupérer l'email depuis les paramètres d'URL
      const urlParams = new URLSearchParams(window.location.search)
      const email = urlParams.get('email')

      try {
        const response = await fetch(
          `http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/reset-password`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email,
              password: this.password
            })
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Network response was not ok')
        }

        this.message = 'Réinitialisation du mot de passe réussie'
        this.isError = false
        console.log('Réinitialisation du mot de passe réussie', data)
      } catch (error) {
        this.message = error.message
        this.isError = true
        console.error('Echec de la réinitialisation du mot de passe', error)
      }
    }
  }
}
</script>

<style scoped>
.reset-password-container {
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
