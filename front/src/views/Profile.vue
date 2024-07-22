<template>
    <div class="profile">
      <h1>Mon Profil</h1>
      <form @submit.prevent="updateProfile">
        <div>
          <label for="firstname">Prénom</label>
          <input v-model="user.firstname" id="firstname" type="text" required />
        </div>
        <div>
          <label for="lastname">Nom</label>
          <input v-model="user.lastname" id="lastname" type="text" required />
        </div>
        <div>
          <label for="email">Email</label>
          <input v-model="user.email" id="email" type="email" required />
        </div>
        <div>
          <label for="password">Nouveau mot de passe</label>
          <input v-model="password" id="password" type="password" />
        </div>
        <button type="submit">Mettre à jour</button>
      </form>
      <button @click="deleteAccount">Supprimer mon compte</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import useAuth from '@/composables/useAuth';
  
  const { user, isAuthenticated } = useAuth();
  const password = ref('');
  
  onMounted(async () => {
    if (isAuthenticated.value) {
      try {
        const response = await axios.get(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/me`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        user.value = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur', error);
      }
    }
  });
  
  const updateProfile = async () => {
    try {
      const updatedData = {
        firstname: user.value.firstname,
        lastname: user.value.lastname,
        email: user.value.email,
        ...(password.value && { password: password.value })
      };
  
      await axios.put(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/users/${user.value.id}`, updatedData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
  
      alert('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil', error);
    }
  };
  
  const deleteAccount = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      try {
        await axios.delete(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/users/${user.value.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
  
        alert('Compte supprimé avec succès');
        localStorage.removeItem('authToken');
        isAuthenticated.value = false;
        window.location.href = '/';
      } catch (error) {
        console.error('Erreur lors de la suppression du compte', error);
      }
    }
  };
  </script>
  
  <style scoped>
  .profile {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .profile h1 {
    margin-bottom: 20px;
  }
  
  .profile form {
    display: flex;
    flex-direction: column;
  }
  
  .profile form div {
    margin-bottom: 10px;
  }
  
  .profile form label {
    margin-bottom: 5px;
  }
  
  .profile form input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .profile button {
    padding: 10px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }
  
  .profile button:hover {
    background-color: #0056b3;
  }
  </style>