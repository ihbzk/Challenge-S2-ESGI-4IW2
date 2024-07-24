<template>
  <main>
    <div class="contact bg-gray-100 rounded-lg max-w-3xl mx-auto p-5">
      <h1 class="text-gray-900 text-2xl mb-4">Contact</h1>
      <p class="text-gray-600 mb-4">
        Pour toute question ou demande d'information, n'hésitez pas à nous contacter.
      </p>
      
      <h2 class="text-indigo-600 text-xl mt-6 mb-4">Coordonnées</h2>
      <p class="text-gray-600 mb-4">
        Adresse : 123 Rue de la Technologie, 75001 Paris<br>
        Téléphone : 01 23 45 67 89<br>
        Email : <a href="mailto:contact@informacart.com" class="text-indigo-600">contact@informacart.com</a>
      </p>
      
      <h2 class="text-indigo-600 text-xl mt-6 mb-4">Formulaire de Contact</h2>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="name" class="block text-gray-700">Nom</label>
          <input type="text" id="name" v-model="form.name" class="w-full p-2 border border-gray-300 rounded-lg" required>
        </div>
        <div>
          <label for="email" class="block text-gray-700">Email</label>
          <input type="email" id="email" v-model="form.email" class="w-full p-2 border border-gray-300 rounded-lg" required>
        </div>
        <div>
          <label for="message" class="block text-gray-700">Message</label>
          <textarea id="message" v-model="form.message" class="w-full p-2 border border-gray-300 rounded-lg" rows="5" required></textarea>
        </div>
        <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Envoyer</button>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const form = ref({
name: '',
email: '',
message: ''
});

const submitForm = () => {
// Logique de soumission du formulaire
console.log('Formulaire soumis', form.value);
form.value = {
  name: '',
  email: '',
  message: ''
};
alert('Votre message a été envoyé avec succès!');
};
</script>
