<template>
  <PopUp :visible="visible" @close="handleClose">
    <h2 class="text-indigo-600 text-xl mb-4">Politique de Cookies</h2>
    <p class="text-gray-600 mb-4">
      Nous utilisons des cookies pour améliorer votre expérience sur notre site. En poursuivant votre navigation, vous acceptez notre politique de cookies.
      Vous pouvez consulter notre politique de cookies <router-link to="/cookie-policy" class="text-indigo-600 hover:underline">ici</router-link>.
      Vous pouvez également gérer vos préférences de cookies via les paramètres de votre navigateur.
      Pour plus d'informations, vous pouvez consulter les pages d'aide de votre navigateur.
    </p>
    <div class="mb-4">
      <input type="checkbox" id="accept-cookies" v-model="accepted" class="mr-2" />
      <label for="accept-cookies" class="text-gray-600">J'accepte les cookies</label>
    </div>
    <button @click="acceptCookies" class="bg-indigo-600 text-white py-2 px-4 mt-2 rounded hover:bg-[#4b46e5]">Accepter</button>
  </PopUp>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PopUp from './PopUp.vue';

const visible = ref(false);
const accepted = ref(false);

onMounted(() => {
  const cookiesAccepted = localStorage.getItem('cookiesAccepted');
  if (!cookiesAccepted) {
    visible.value = true;
  }
});

const handleClose = () => {
  visible.value = false;
};

const acceptCookies = () => {
  if (accepted.value) {
    localStorage.setItem('cookiesAccepted', 'true');
    visible.value = false;
  } else {
    alert("Vous devez accepter les cookies pour continuer.");
  }
};
</script>
