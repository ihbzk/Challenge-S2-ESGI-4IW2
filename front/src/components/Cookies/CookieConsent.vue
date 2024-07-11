<template>
  <PopUp :visible="visible" @close="handleClose">
    <h2>Politique de Cookies</h2>
    <p>
      Nous utilisons des cookies pour améliorer votre expérience sur notre site. En poursuivant votre navigation, vous acceptez notre politique de cookies.
    </p>
    <div>
      <input type="checkbox" id="accept-cookies" v-model="accepted" />
      <label for="accept-cookies">J'accepte les cookies</label>
    </div>
    <button @click="acceptCookies">Accepter</button>
  </PopUp>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PopUp from './PopUp.vue';

const visible = ref(true);
const accepted = ref(false);

const handleClose = () => {
  visible.value = false;
};

const acceptCookies = () => {
  if (accepted.value) {
    // Logique pour enregistrer le consentement des cookies
    localStorage.setItem('cookiesAccepted', 'true');
    visible.value = false;
  } else {
    alert("Vous devez accepter les cookies pour continuer.");
  }
};
</script>

<style scoped lang="scss">
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #0056b3;
}
</style>
