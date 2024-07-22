<template>
    <div class="profile-page max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 class="text-2xl font-bold mb-6">Mon Profil</h2>
      <form @submit.prevent="updateProfile" class="space-y-4">
        <div>
          <label for="firstname" class="block text-sm font-medium text-gray-700">Prénom :</label>
          <input v-model="user.firstname" type="text" id="firstname" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label for="lastname" class="block text-sm font-medium text-gray-700">Nom :</label>
          <input v-model="user.lastname" type="text" id="lastname" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email :</label>
          <input v-model="user.email" type="email" id="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Nouveau mot de passe :</label>
          <input v-model="user.password" type="password" id="password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <button type="submit" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Mettre à jour</button>
      </form>
      <button @click="deleteAccount" class="w-full mt-4 bg-red-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Supprimer mon compte</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  const user = ref({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  });
  
  const router = useRouter();
  
  const fetchUserProfile = async () => {
    try {
      let authToken = localStorage.getItem('authToken');
      const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch user profile');
      const data = await response.json();
      user.value = { ...data, password: '' };
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  
  const updateProfile = async () => {
    try {
      let authToken = localStorage.getItem('authToken');
      const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/users/${user.value.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(user.value)
      });
      if (!response.ok) throw new Error('Failed to update profile');
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  const deleteAccount = async () => {
    try {
      let authToken = localStorage.getItem('authToken');
      const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/users/${user.value.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete account');
      alert('Account deleted successfully');
      localStorage.removeItem('authToken');
      router.push('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };
  
  onMounted(fetchUserProfile);
  </script>
  
  <style scoped>
  .profile-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  </style>