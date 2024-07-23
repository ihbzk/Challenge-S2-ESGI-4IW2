<script setup>
import axios from 'axios'
import DataTable from '@/components/Table/DataTable.vue'
import Modal from '@/components/Modal.vue'
import { ref, onMounted } from 'vue'

const categoriesColumns = ref([
  { key: 'id', label: 'Id', visible: true },
  { key: 'name', label: 'Nom', visible: true }
])
const categories = ref([])
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const categoryToDelete = ref(null)
const newCategory = ref({ name: '' })
const editingCategory = ref({})
const errors = ref({})
const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
const axiosInstance = axios.create({
  baseURL: `http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authToken}`
  }
})

const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/categories')
    categories.value = response.data.map((category) => ({
      id: category.id,
      name: category.name
    }))
  } catch (error) {
    console.error('Échec de la récupération des catégories', error)
  }
}

const createCategory = async () => {
  errors.value = {}
  if (!newCategory.value.name) {
    errors.value.name = 'Le nom est obligatoire'
    return
  }

  try {
    const response = await axiosInstance.post('/categories', newCategory.value)
    categories.value.push(response.data)
    newCategory.value = { name: '' }
    isCreateModalOpen.value = false
  } catch (error) {
    errors.value.general =
      error.response?.data?.message || 'Erreur lors de la création de la catégorie'
    console.error('Échec de la création de la catégorie', error)
  }
}

const editCategory = (item) => {
  editingCategory.value = { ...item }
  isEditModalOpen.value = true
}

const updateCategory = async () => {
  errors.value = {}
  if (!editingCategory.value.name) {
    errors.value.name = 'Le nom est obligatoire'
    return
  }

  try {
    const response = await axiosInstance.put(
      `/categories/${editingCategory.value.id}`,
      editingCategory.value
    )
    const index = categories.value.findIndex((category) => category.id === editingCategory.value.id)
    categories.value[index] = response.data
    isEditModalOpen.value = false
  } catch (error) {
    errors.value.general =
      error.response?.data?.message || 'Erreur lors de la mise à jour de la catégorie'
    console.error('Échec de la mise à jour de la catégorie', error)
  }
}

const confirmDeleteCategory = (index) => {
  categoryToDelete.value = [index]
  isDeleteModalOpen.value = true
}

const confirmDeleteSelectedCategory = (selectedIds) => {
  categoryToDelete.value = selectedIds
  isDeleteModalOpen.value = true
}

const deleteCategory = async () => {
  if (categoryToDelete.value && categoryToDelete.value.length > 0) {
    try {
      for (const categoryId of categoryToDelete.value) {
        await axiosInstance.delete(`/categories/${categoryId}`)
        const index = categories.value.findIndex((categories) => categories.id === categoryId)
        if (index !== -1) {
          categories.value.splice(index, 1)
        }
      }
      categoryToDelete.value = []
      isDeleteModalOpen.value = false
    } catch (error) {
      console.error('Échec de la suppression de la catégorie', error)
    }
  }
}

onMounted(async () => {
  await getCategories()
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center m-6">
      <h2 class="text-2xl font-semibold">Liste des catégories</h2>
      <button @click="isCreateModalOpen = true" class="px-4 py-2 bg-green-500 text-white rounded">
        Créer une catégorie
      </button>
    </div>
    <DataTable
      :items="categories"
      :columns="categoriesColumns"
      @edit-item="editCategory"
      @delete-item="confirmDeleteCategory"
      @delete-selected="confirmDeleteSelectedCategory"
    />
    <Modal
      v-if="isCreateModalOpen"
      :isOpen="isCreateModalOpen"
      title="Créer une catégorie"
      confirmText="Enregistrer"
      @close="isCreateModalOpen = false"
      @confirm="createCategory"
    >
      <div>
        <label for="name">Nom de la catégorie :</label>
        <input
          v-model="newCategory.name"
          type="text"
          id="name"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.name" class="text-red-500">{{ errors.name }}</div>
      </div>
    </Modal>
    <Modal
      v-if="isEditModalOpen"
      :isOpen="isEditModalOpen"
      title="Modifier la catégorie"
      confirmText="Enregistrer"
      @close="isEditModalOpen = false"
      @confirm="updateCategory"
    >
      <div>
        <label for="name">Nom de la catégorie :</label>
        <input
          v-model="editingCategory.name"
          type="text"
          id="name"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.name" class="text-red-500">{{ errors.name }}</div>
      </div>
    </Modal>
    <Modal
      v-if="isDeleteModalOpen"
      :isOpen="isDeleteModalOpen"
      title="Confirmation de suppression"
      confirmText="Supprimer"
      @close="isDeleteModalOpen = false"
      @confirm="deleteCategory"
    >
      <p>Êtes-vous sûr de vouloir supprimer cette catégorie ?</p>
    </Modal>
  </div>
</template>
