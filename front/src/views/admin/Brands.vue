<script setup>
import axios from 'axios'
import DataTable from '@/components/Table/DataTable.vue'
import Modal from '@/components/Modal.vue'
import { ref, onMounted } from 'vue'

const brandsColumns = ref([
  { key: 'id', label: 'Id', visible: true },
  { key: 'name', label: 'Nom', visible: true }
])
const brands = ref([])
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const brandToDelete = ref([])
const newBrand = ref({ name: '' })
const editingBrand = ref({})
const errors = ref({})
const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authToken}`
  }
})

const getBrands = async () => {
  try {
    const response = await axiosInstance.get('/brands')
    brands.value = response.data
  } catch (error) {
    console.error('Failed to retrieve brands:', error)
  }
}

const createBrand = async () => {
  errors.value = {}
  if (!newBrand.value.name) {
    errors.value.name = 'Name is required'
    return
  }

  try {
    const response = await axiosInstance.post('/brands', newBrand.value)
    brands.value.push(response.data)
    newBrand.value = { name: '' }
    isCreateModalOpen.value = false
  } catch (error) {
    errors.value.general = error.response?.data?.message || 'Error creating brand'
    console.error('Creation failed:', error)
  }
}

const editBrand = (item) => {
  editingBrand.value = { ...item }
  isEditModalOpen.value = true
}

const updateBrand = async () => {
  errors.value = {}
  if (!editingBrand.value.name) {
    errors.value.name = 'Name is required'
    return
  }

  try {
    const response = await axiosInstance.put(`/brands/${editingBrand.value.id}`, editingBrand.value)
    const index = brands.value.findIndex((b) => b.id === editingBrand.value.id)
    brands.value[index] = response.data
    isEditModalOpen.value = false
  } catch (error) {
    errors.value.general = error.response?.data?.message || 'Error updating brand'
    console.error('Update failed:', error)
  }
}

const confirmDeleteBrand = (id) => {
  brandToDelete.value = [id]
  isDeleteModalOpen.value = true
}

const confirmDeleteSelectedBrand = (selectedIds) => {
  brandToDelete.value = selectedIds
  isDeleteModalOpen.value = true
}

const deleteBrand = async () => {
  if (brandToDelete.value.length) {
    try {
      const promises = brandToDelete.value.map((id) => axiosInstance.delete(`/brands/${id}`))
      await Promise.all(promises)

      brands.value = brands.value.filter((b) => !brandToDelete.value.includes(b.id))
      brandToDelete.value = []
      isDeleteModalOpen.value = false
    } catch (error) {
      console.error('Failed to delete brands:', error)
    }
  }
}

onMounted(async () => {
  await getBrands()
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center m-6">
      <h2 class="text-2xl font-semibold">Liste des marques</h2>
      <button @click="isCreateModalOpen = true" class="px-4 py-2 bg-green-500 text-white rounded">
        Créer une marque
      </button>
    </div>
    <DataTable
      :items="brands"
      :columns="brandsColumns"
      @edit-item="editBrand"
      @delete-item="confirmDeleteBrand"
      @delete-selected="confirmDeleteSelectedBrand"
    />
    <Modal
      v-if="isCreateModalOpen"
      :isOpen="isCreateModalOpen"
      title="Créer une marque"
      confirmText="Enregistrer"
      @close="isCreateModalOpen = false"
      @confirm="createBrand"
    >
      <div>
        <label for="name">Nom de la marque :</label>
        <input
          v-model="newBrand.name"
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
      title="Modifier la marque"
      confirmText="Enregistrer"
      @close="isEditModalOpen = false"
      @confirm="updateBrand"
    >
      <div>
        <label for="name">Nom de la marque :</label>
        <input
          v-model="editingBrand.name"
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
      @confirm="deleteBrand"
    >
      <p>Êtes-vous sûr de vouloir supprimer cette marque ?</p>
    </Modal>
  </div>
</template>