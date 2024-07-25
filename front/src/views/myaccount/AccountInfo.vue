<template>
  <section class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Informations personnelles</h2>
    <form @submit.prevent="updateInfo" class="space-y-4">
      <div>
        <label for="firstname" class="block text-sm font-medium text-gray-700">Prénom :</label>
        <input v-model="firstname" type="text" id="firstname" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        <p v-if="errors.firstname" class="text-red-600 text-sm">{{ errors.firstname }}</p>
      </div>
      <div>
        <label for="lastname" class="block text-sm font-medium text-gray-700">Nom :</label>
        <input v-model="lastname" type="text" id="lastname" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        <p v-if="errors.lastname" class="text-red-600 text-sm">{{ errors.lastname }}</p>
      </div>
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email :</label>
        <input v-model="email" type="email" id="email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        <p v-if="errors.email" class="text-red-600 text-sm">{{ errors.email }}</p>
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe :</label>
        <input v-model="password" type="password" id="password" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        <p v-if="errors.password" class="text-red-600 text-sm">{{ errors.password }}</p>
      </div>
      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirmer le mot de passe :</label>
        <input v-model="confirmPassword" type="password" id="confirmPassword" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        <p v-if="errors.confirmPassword" class="text-red-600 text-sm">{{ errors.confirmPassword }}</p>
      </div>
      <button type="submit" class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Mettre à jour</button>
      <button @click.prevent="deleteAccount" class="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">Supprimer mon compte</button>
    </form>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import useAuth from '@/composables/useAuth';
import { userInfoSchema } from '@/composables/validation';
import { useRouter } from 'vue-router';

const { user, checkAuth, isAuthenticated } = useAuth();
const router = useRouter();

const firstname = ref('');
const lastname = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errors = ref({});

onMounted(() => {
  if (user.value) {
    firstname.value = user.value.firstname || '';
    lastname.value = user.value.lastname || '';
    email.value = user.value.email || '';
  }
});

const updateInfo = async () => {
  // Reset errors
  errors.value = {};

  // Validate input
  const validationResult = userInfoSchema.safeParse({
    firstname: firstname.value,
    lastname: lastname.value,
    email: email.value,
    password: password.value || undefined,
    confirmPassword: confirmPassword.value || undefined,
  });
  if (!validationResult.success) {
    validationResult.error.errors.forEach((e) => {
      errors.value[e.path[0]] = e.message;
    });
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({
        firstname: firstname.value,
        lastname: lastname.value,
        email: email.value,
        password: password.value || undefined, // Ensure password is only included if it's provided
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la mise à jour des informations : ${response.statusText}`);
    }

    const updatedUser = await response.json();
    user.value = updatedUser;
    await checkAuth();
    alert('Informations mises à jour avec succès');
  } catch (error) {
    console.error('Erreur lors de la mise à jour des informations:', error);
    alert('Une erreur est survenue lors de la mise à jour des informations');
  }
};

const deleteAccount = async () => {
  const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${user.value.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression du compte : ${response.statusText}`);
      }

      alert('Compte supprimé avec succès');
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      isAuthenticated.value = false;
      
      router.push({ name: 'Login' });
    } catch (error) {
      console.error('Erreur lors de la suppression du compte', error);
      alert('Une erreur est survenue lors de la suppression du compte');
    }
  }
};
</script>

<style scoped></style>
