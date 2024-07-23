<template>
  <div>
    <div class="flex justify-between items-center m-6">
      <h2 class="text-2xl font-semibold">Liste des utilisateurs</h2>
      <button @click="isCreateModalOpen = true" class="px-4 py-2 bg-green-500 text-white rounded">
        Créer un utilisateur
      </button>
    </div>
    <DataTable
      :items="users"
      :columns="userColumns"
      @edit-item="editUser"
      @delete-item="confirmDeleteUser"
      @delete-selected="confirmDeleteSelectedUser"
    />

    <!-- création d'un utilisateur -->
    <Modal
      v-if="isCreateModalOpen"
      :isOpen="isCreateModalOpen"
      title="Créer un utilisateur"
      confirmText="Enregistrer"
      @close="isCreateModalOpen = false"
      @confirm="createUser"
    >
      <div>
        <label for="lastname">Nom :</label>
        <input
          v-model="newUser.lastname"
          type="text"
          id="lastname"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.lastname" class="text-red-500">{{ errors.lastname }}</div>

        <label for="firstname">Prénom :</label>
        <input
          v-model="newUser.firstname"
          type="text"
          id="firstname"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.firstname" class="text-red-500">{{ errors.firstname }}</div>

        <label for="email">Email :</label>
        <input
          v-model="newUser.email"
          type="email"
          id="email"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.email" class="text-red-500">{{ errors.email }}</div>

        <label for="role">Rôle :</label>
        <select v-model="newUser.role" id="role" class="border p-2 rounded mb-4 w-full">
          <option value="ROLE_USER">User</option>
          <option value="ROLE_STORE_KEEPER">Store Keeper</option>
          <option value="ROLE_COMPTA">Comptable</option>
          <option value="ROLE_ADMIN">Admin</option>
        </select>
        <div v-if="errors.role" class="text-red-500">{{ errors.role }}</div>

        <label for="password">Mot de passe :</label>
        <input
          v-model="newUser.password"
          type="password"
          id="password"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.password" class="text-red-500">{{ errors.password }}</div>

        <label for="repeatPassword">Confirmer le mot de passe :</label>
        <input
          v-model="newUser.repeatPassword"
          type="password"
          id="repeatPassword"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.repeatPassword" class="text-red-500">{{ errors.repeatPassword }}</div>

        <div v-if="errors.general" class="text-red-500">{{ errors.general }}</div>
      </div>
    </Modal>

    <!-- édition d'un utilisateur -->
    <Modal
      v-if="isEditModalOpen"
      :isOpen="isEditModalOpen"
      title="Modifier l'utilisateur"
      confirmText="Enregistrer"
      @close="isEditModalOpen = false"
      @confirm="updateUser"
    >
      <div>
        <label for="lastname">Nom :</label>
        <input
          v-model="editingUser.lastname"
          type="text"
          id="lastname"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.lastname" class="text-red-500">{{ errors.lastname }}</div>

        <label for="firstname">Prénom :</label>
        <input
          v-model="editingUser.firstname"
          type="text"
          id="firstname"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.firstname" class="text-red-500">{{ errors.firstname }}</div>

        <label for="email">Email :</label>
        <input
          v-model="editingUser.email"
          type="email"
          id="email"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.email" class="text-red-500">{{ errors.email }}</div>

        <label for="role">Rôle :</label>
        <select v-model="editingUser.role" id="role" class="border p-2 rounded mb-4 w-full">
          <option value="ROLE_USER">User</option>
          <option value="ROLE_STORE_KEEPER">Store Keeper</option>
          <option value="ROLE_COMPTA">Comptable</option>
          <option value="ROLE_ADMIN">Admin</option>
        </select>
        <div v-if="errors.role" class="text-red-500">{{ errors.role }}</div>

        <label for="password">Mot de passe :</label>
        <input
          v-model="editingUser.password"
          type="password"
          id="password"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.password" class="text-red-500">{{ errors.password }}</div>

        <label for="repeatPassword">Confirmer le mot de passe :</label>
        <input
          v-model="editingUser.repeatPassword"
          type="password"
          id="repeatPassword"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.repeatPassword" class="text-red-500">{{ errors.repeatPassword }}</div>

        <div v-if="errors.general" class="text-red-500">{{ errors.general }}</div>
      </div>
    </Modal>

    <!-- confirmation de suppression -->
    <Modal
      v-if="isDeleteModalOpen"
      :isOpen="isDeleteModalOpen"
      title="Confirmation de suppression"
      confirmText="Supprimer"
      @close="isDeleteModalOpen = false"
      @confirm="deleteUser"
    >
      <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
    </Modal>
  </div>
</template>

<script setup>
import axios from 'axios'
import Modal from '@/components/Modal.vue'
import DataTable from '@/components/Table/DataTable.vue'
import { ref, onMounted } from 'vue'
import { registerSchema } from '@/composables/validation'

const userColumns = ref([
  { key: 'id', label: 'Id', visible: true },
  { key: 'lastname', label: 'Nom', visible: true },
  { key: 'firstname', label: 'Prénom', visible: true },
  { key: 'email', label: 'Email', visible: true },
  { key: 'role', label: 'Rôle', visible: true }
])
const users = ref([])
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const userToDelete = ref(null)
const newUser = ref({
  firstname: '',
  lastname: '',
  password: '',
  email: '',
  role: ''
})
const editingUser = ref({})
const errors = ref({})

const apiUrl = `${import.meta.env.VITE_API_URL}/users`
const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('authToken')}`
  }
})

const getUsers = async () => {
  try {
    const response = await axiosInstance.get('/')
    users.value = response.data.map((user) => ({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role
    }))
  } catch (error) {
    console.error('Failed to retrieve users', error)
  }
}

const createUser = async () => {
  errors.value = {}
  const validationResult = registerSchema.safeParse(newUser.value)

  if (!validationResult.success) {
    validationResult.error.errors.forEach((err) => {
      errors.value[err.path[0]] = err.message
    })
    return
  }

  try {
    const response = await axiosInstance.post('/', newUser.value)
    users.value.push(response.data)
    newUser.value = {
      firstname: '',
      lastname: '',
      email: '',
      role: '',
      password: '',
      repeatPassword: ''
    }
    isCreateModalOpen.value = false
  } catch (error) {
    errors.value.general = error.response?.data?.message || 'Failed to create user'
    console.error('Failed to create user', error)
  }
}

const editUser = (index) => {
  editingUser.value = { ...index }
  isEditModalOpen.value = true
}

const updateUser = async () => {
  errors.value = {}
  const validationResult = registerSchema.safeParse(editingUser.value)

  if (!validationResult.success) {
    validationResult.error.errors.forEach((err) => {
      errors.value[err.path[0]] = err.message
    })
    return
  }

  try {
    const response = await axiosInstance.put(`/${editingUser.value.id}`, editingUser.value)
    const index = users.value.findIndex((user) => user.id === editingUser.value.id)
    if (index !== -1) users.value[index] = response.data
    isEditModalOpen.value = false
  } catch (error) {
    errors.value.general = error.response?.data?.message || 'Failed to update user'
    console.error('Failed to update user', error)
  }
}

// const updateUser = async () => {
//   errors.value = {} // on vide les erreurs précédentes

//   const result = registerSchema.safeParse(editingUser.value)
//   if (!result.success) {
//     result.error.errors.forEach((e) => {
//       errors.value[e.path[0]] = e.message
//     })

//     return
//   }

//   try {
//     let authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
//     const userId = editingUser.value.id

//     const response = await fetch(
//       `${import.meta.env.VITE_API_URL}/users/${userId}`,
//       {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${authToken}`
//         },
//         body: JSON.stringify(editingUser.value)
//       }
//     )

//     if (!response.ok) {
//       throw new Error("Erreur lors de la mise à jour de l'utilisateur")
//     }

//     const updatedUser = await response.json()
//     const index = users.value.findIndex((user) => user.id === userId)
//     users.value[index] = updatedUser

//     isEditModalOpen.value = false
//   } catch (error) {
//     errors.value.general = error.message
//     console.error("Échec de la mise à jour de l'utilisateur", error)
//   }
// }

const confirmDeleteUser = (index) => {
  userToDelete.value = [index]
  isDeleteModalOpen.value = true
}

const confirmDeleteSelectedUser = (selectedIds) => {
  userToDelete.value = selectedIds
  isDeleteModalOpen.value = true
}

const deleteUser = async () => {
  if (userToDelete.value && userToDelete.value.length > 0) {
    try {
      for (const userId of userToDelete.value) {
        await axiosInstance.delete(`${userId}`)
        const index = users.value.findIndex((user) => user.id === userId)
        if (index !== -1) {
          users.value.splice(index, 1) // Remove the user from the local state
        }
      }
      userToDelete.value = [] // Clear the deletion queue
      isDeleteModalOpen.value = false // Close the modal window
    } catch (error) {
      console.error('Failed to delete users', error)
    }
  }
}

onMounted(async () => {
  await getUsers()
})
</script>