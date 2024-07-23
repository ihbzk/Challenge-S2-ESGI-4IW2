<template>
  <main>
    <div class="careers bg-gray-100 rounded-lg max-w-3xl mx-auto p-5">
      <h1 class="text-gray-900 text-2xl mb-4">Carrières</h1>
      <p class="text-gray-600 mb-4">
        Rejoignez notre équipe et contribuez à façonner l'avenir de la technologie. Découvrez nos opportunités de carrière.
      </p>
      
      <h2 class="text-indigo-600 text-xl mt-6 mb-4">Postes Ouverts</h2>
      <p class="text-gray-600 mb-4">
        Consultez nos offres d'emploi actuelles et postulez en ligne.
      </p>
      <ul class="list-disc list-inside text-gray-600 mb-4">
        <li>
          <strong>Développeur Full Stack</strong><br>
          Localisation : Paris, France<br>
          <button @click="apply('Développeur Full Stack')" class="text-indigo-600 hover:underline">Postuler</button>
        </li>
        <li>
          <strong>Chef de Projet IT</strong><br>
          Localisation : Lyon, France<br>
          <button @click="apply('Chef de Projet IT')" class="text-indigo-600 hover:underline">Postuler</button>
        </li>
        <li>
          <strong>Analyste de Données</strong><br>
          Localisation : Marseille, France<br>
          <button @click="apply('Analyste de Données')" class="text-indigo-600 hover:underline">Postuler</button>
        </li>
      </ul>
      
      <h2 class="text-indigo-600 text-xl mt-6 mb-4">Postuler en Ligne</h2>
      <form @submit.prevent="submitApplication" class="space-y-4">
        <div>
          <label for="job" class="block text-gray-700">Poste</label>
          <input type="text" id="job" v-model="application.job" class="w-full p-2 border border-gray-300 rounded-lg" readonly>
        </div>
        <div>
          <label for="name" class="block text-gray-700">Nom</label>
          <input type="text" id="name" v-model="application.name" class="w-full p-2 border border-gray-300 rounded-lg" required>
        </div>
        <div>
          <label for="email" class="block text-gray-700">Email</label>
          <input type="email" id="email" v-model="application.email" class="w-full p-2 border border-gray-300 rounded-lg" required>
        </div>
        <div>
          <label for="resume" class="block text-gray-700">CV</label>
          <input type="file" id="resume" @change="handleFileUpload" class="w-full p-2 border border-gray-300 rounded-lg" required>
        </div>
        <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">Envoyer</button>
      </form>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const application = ref({
job: '',
name: '',
email: '',
resume: null
});

const apply = (jobTitle: string) => {
application.value.job = jobTitle;
};

const handleFileUpload = (event: Event) => {
const target = event.target as HTMLInputElement;
const files = target.files;
if (files && files.length > 0) {
  application.value.resume = files[0];
}
};

const submitApplication = () => {
// Logique de soumission de la candidature
console.log('Candidature soumise', application.value);
application.value = {
  job: '',
  name: '',
  email: '',
  resume: null
};
alert('Votre candidature a été envoyée avec succès!');
};
</script>
