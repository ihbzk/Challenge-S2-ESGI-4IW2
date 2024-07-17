<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { updateProfileSchema } from '@/composables/validation';

const user = ref({
  firstname: '',
  lastname: '',
  email: '',
});
const password = ref('');
const repeatPassword = ref('');
const errors = ref({});
const router = useRouter();

const fetchUserProfile = async () => {
  try {
    let authToken = localStorage.getItem('authToken');
    const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/me`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    const data = await response.json();
    user.value = data;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil utilisateur', error);
  }
};

const updateProfile = async () => {
  errors.value = {};
  const result = updateProfileSchema.safeParse({ ...user.value, password: password.value, repeatPassword: repeatPassword.value });
  if (!result.success) {
    result.error.errors.forEach((e) => {
      errors.value[e.path[0]] = e.message;
    });
    return;
  }

  try {
    let authToken = localStorage.getItem('authToken');
    const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/users/${user.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ ...user.value, password: password.value }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du profil');
    }

    const updatedUser = await response.json();
    user.value = updatedUser;
    alert('Profil mis à jour avec succès');
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil', error);
  }
};

const deleteAccount = async () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) {
    try {
      let authToken = localStorage.getItem('authToken');
      const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/users/${user.value.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du compte');
      }

      alert('Compte supprimé avec succès');
      localStorage.removeItem('authToken');
      router.push('/register');
    } catch (error) {
      console.error('Erreur lors de la suppression du compte', error);
    }
  }
};

onMounted(() => {
  fetchUserProfile();
});
</script>



<template>
    <div class="profile-page bg-gray-100 rounded-lg max-w-3xl mx-auto p-5">
      <h1 class="text-gray-900 text-2xl mb-4">Mon Profil</h1>
      <form @submit.prevent="updateProfile">
        <div class="mb-4">
          <label for="firstname" class="block text-sm font-medium text-gray-700">Prénom</label>
          <input v-model="user.firstname" type="text" id="firstname" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div class="mb-4">
          <label for="lastname" class="block text-sm font-medium text-gray-700">Nom</label>
          <input v-model="user.lastname" type="text" id="lastname" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="user.email" type="email" id="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
          <input v-model="password" type="password" id="password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div class="mb-4">
          <label for="repeatPassword" class="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
          <input v-model="repeatPassword" type="password" id="repeatPassword" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div class="flex justify-between">
          <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-md">Mettre à jour</button>
          <button @click="deleteAccount" type="button" class="bg-red-600 text-white px-4 py-2 rounded-md">Supprimer le compte</button>
        </div>
      </form>
    </div>
  </template>
