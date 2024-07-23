<script setup>
import axios from 'axios'
import Modal from '@/components/Modal.vue'
import DataTable from '@/components/Table/DataTable.vue'
import { ref, onMounted, computed } from 'vue'
import { productSchema } from '@/composables/validation'

const productColumns = ref([
  { key: 'id', label: 'Id', visible: true },
  { key: 'productName', label: 'Nom', visible: true },
  { key: 'description', label: 'Description', visible: true },
  { key: 'category', label: 'Catégorie', visible: true },
  { key: 'brand', label: 'Marque', visible: true },
  { key: 'price', label: 'Prix', visible: true },
  { key: 'promotion', label: 'Promotion', visible: true },
  { key: 'stock', label: 'Stock', visible: true },
  { key: 'illustration', label: 'Illustration', visible: true, isImage: true }
])
const products = ref([])
const categories = ref([])
const brands = ref([])
const isCreateModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const productToDelete = ref(null)
const newProduct = ref({
  id: null,
  productName: '',
  description: '',
  categoryId: null,
  brandId: null,
  price: '',
  promotion: false,
  stock: 0,
  illustration: ''
})
const editingProduct = ref({})
const errors = ref({})
const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  headers: {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  }
})

const getProducts = async () => {
  try {
    const response = await axiosInstance.get('/products')
    products.value = response.data.map((product) => ({
      id: product.id,
      productName: product.productName,
      description: product.description,
      categoryId: product.categoryId,
      brandId: product.brandId,
      price: product.price,
      promotion: product.promotion,
      stock: product.stock,
      illustration: product.illustration
    }))
  } catch (error) {
    console.error('Échec de la récupération des produits', error)
  }
}

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

const getBrands = async () => {
  try {
    const response = await axiosInstance.get('/brands')
    brands.value = response.data.map((brand) => ({
      id: brand.id,
      name: brand.name
    }))
  } catch (error) {
    console.error('Échec de la récupération des marques', error)
  }
}

const createProduct = async () => {
  errors.value = {}
  const result = productSchema.safeParse(newProduct.value)
  if (!result.success) {
    result.error.errors.forEach((e) => {
      errors.value[e.path[0]] = e.message
    })
    return
  }

  try {
    const response = await axiosInstance.post('/products', newProduct.value)
    products.value.push(response.data)
    newProduct.value = {
      productName: '',
      description: '',
      categoryId: null,
      brandId: null,
      price: '',
      promotion: false,
      stock: 0,
      illustration: ''
    }
    isCreateModalOpen.value = false
  } catch (error) {
    errors.value.general = error.message || 'Erreur lors de la création du produit'
    console.error('Échec de la création du produit', error)
  }
}

const editProduct = (item) => {
  editingProduct.value = { ...item }
  isEditModalOpen.value = true
}

const updateProduct = async () => {
  errors.value = {}

  const validation = productSchema.safeParse(editingProduct.value)
  if (!validation.success) {
    validation.error.errors.forEach((e) => {
      errors.value[e.path[0]] = e.message
    })
    return
  }

  try {
    const response = await axiosInstance.put(
      `/products/${editingProduct.value.id}`,
      editingProduct.value
    )
    if (response.status === 200) {
      const index = products.value.findIndex((product) => product.id === editingProduct.value.id)
      products.value[index] = response.data
      isEditModalOpen.value = false
      errors.value = {}
    } else {
      throw new Error('Response status not OK')
    }
  } catch (error) {
    console.error('Failed to update product:', error)
    errors.value.general = error.response?.data?.message || 'Error updating product.'
  }
}

const confirmDeleteProduct = (index) => {
  productToDelete.value = [index]
  isDeleteModalOpen.value = true
}

const deleteSelectedProducts = (selectedIds) => {
  productToDelete.value = selectedIds
  isDeleteModalOpen.value = true
}

const deleteProduct = async () => {
  if (productToDelete.value && productToDelete.value.length > 0) {
    try {
      for (const productId of productToDelete.value) {
        await axiosInstance.delete(`/products/${productId}`)
        const index = products.value.findIndex((product) => product.id === productId)
        if (index !== -1) {
          products.value.splice(index, 1)
        }
      }
      productToDelete.value = []
      isDeleteModalOpen.value = false
    } catch (error) {
      console.error('Failed to delete products', error)
    }
  }
}

const formattedProducts = computed(() => {
  return products.value.map((product) => ({
    id: product.id,
    productName: product.productName,
    description: product.description,
    category:
      categories.value.find((category) => category.id === product.categoryId)?.name || 'Unknown',
    brand: brands.value.find((brand) => brand.id === product.brandId)?.name || 'Unknown',
    price: product.price,
    promotion: product.promotion ? 'Oui' : 'Non',
    stock: product.stock,
    illustration: product.illustration
  }))
})

onMounted(async () => {
  await getProducts()
  await getCategories()
  await getBrands()
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center m-6">
      <h2 class="text-2xl font-semibold">Liste des produits</h2>
      <button @click="isCreateModalOpen = true" class="px-4 py-2 bg-green-500 text-white rounded">
        Créer un produit
      </button>
    </div>
    <DataTable
      :items="formattedProducts"
      :columns="productColumns"
      @edit-item="editProduct"
      @delete-item="confirmDeleteProduct"
      @delete-selected="deleteSelectedProducts"
    />
    <Modal
      v-if="isCreateModalOpen"
      :isOpen="isCreateModalOpen"
      title="Créer un produit"
      confirmText="Enregistrer"
      @close="isCreateModalOpen = false"
      @confirm="createProduct"
    >
      <div>
        <label for="productName">Nom du produit :</label>
        <input
          v-model="newProduct.productName"
          type="text"
          id="productName"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.productName" class="text-red-500">{{ errors.productName }}</div>
        <label for="description">Description :</label>
        <input
          v-model="newProduct.description"
          type="text"
          id="description"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.description" class="text-red-500">{{ errors.description }}</div>
        <label for="category">Catégorie :</label>
        <select
          v-model="newProduct.categoryId"
          id="category"
          class="border p-2 rounded mb-4 w-full"
        >
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <div v-if="errors.category" class="text-red-500">{{ errors.category }}</div>
        <label for="brand">Marque :</label>
        <select v-model="newProduct.brandId" id="brand" class="border p-2 rounded mb-4 w-full">
          <option v-for="brand in brands" :key="brand.id" :value="brand.id">
            {{ brand.name }}
          </option>
        </select>
        <div v-if="errors.brand" class="text-red-500">{{ errors.brand }}</div>
        <label for="price">Prix :</label>
        <input
          v-model="newProduct.price"
          type="number"
          id="price"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.price" class="text-red-500">{{ errors.price }}</div>
        <label for="promotion">Promotion :</label>
        <select
          v-model="newProduct.promotion"
          id="promotion"
          class="border p-2 rounded mb-4 w-full"
        >
          <option :value="true">Oui</option>
          <option :value="false">Non</option>
        </select>
        <div v-if="errors.promotion" class="text-red-500">{{ errors.promotion }}</div>
        <label for="stock">Stock :</label>
        <input
          v-model="newProduct.stock"
          type="number"
          id="stock"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.stock" class="text-red-500">{{ errors.stock }}</div>
        <label for="illustration">Illustration :</label>
        <input
          v-model="newProduct.illustration"
          type="text"
          id="illustration"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.illustration" class="text-red-500">{{ errors.illustration }}</div>
        <div v-if="errors.general" class="text-red-500">{{ errors.general }}</div>
      </div>
    </Modal>
    <Modal
      v-if="isEditModalOpen"
      :isOpen="isEditModalOpen"
      title="Modifier le produit"
      confirmText="Enregistrer"
      @close="isEditModalOpen = false"
      @confirm="updateProduct"
    >
      <div>
        <label for="productName">Nom du produit :</label>
        <input
          v-model="editingProduct.productName"
          type="text"
          id="productName"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.productName" class="text-red-500">{{ errors.productName }}</div>
        <label for="description">Description :</label>
        <input
          v-model="editingProduct.description"
          type="text"
          id="description"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.description" class="text-red-500">{{ errors.description }}</div>
        <label for="category">Catégorie :</label>
        <select
          v-model="editingProduct.categoryId"
          id="category"
          class="border p-2 rounded mb-4 w-full"
        >
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <div v-if="errors.category" class="text-red-500">{{ errors.category }}</div>
        <label for="brand">Marque :</label>
        <select v-model="editingProduct.brandId" id="brand" class="border p-2 rounded mb-4 w-full">
          <option v-for="brand in brands" :key="brand.id" :value="brand.id">
            {{ brand.name }}
          </option>
        </select>
        <div v-if="errors.brand" class="text-red-500">{{ errors.brand }}</div>
        <label for="price">Prix :</label>
        <input
          v-model="editingProduct.price"
          type="number"
          id="price"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.price" class="text-red-500">{{ errors.price }}</div>
        <label for="promotion">Promotion :</label>
        <select
          v-model="editingProduct.promotion"
          id="promotion"
          class="border p-2 rounded mb-4 w-full"
        >
          <option :value="true">Oui</option>
          <option :value="false">Non</option>
        </select>
        <div v-if="errors.promotion" class="text-red-500">{{ errors.promotion }}</div>
        <label for="stock">Stock :</label>
        <input
          v-model="editingProduct.stock"
          type="number"
          id="stock"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.stock" class="text-red-500">{{ errors.stock }}</div>
        <label for="illustration">Illustration :</label>
        <input
          v-model="editingProduct.illustration"
          type="text"
          id="illustration"
          class="border p-2 rounded mb-4 w-full"
        />
        <div v-if="errors.illustration" class="text-red-500">{{ errors.illustration }}</div>
        <div v-if="errors.general" class="text-red-500">{{ errors.general }}</div>
      </div>
    </Modal>
    <Modal
      v-if="isDeleteModalOpen"
      :isOpen="isDeleteModalOpen"
      title="Confirmation de suppression"
      confirmText="Supprimer"
      @close="isDeleteModalOpen = false"
      @confirm="deleteProduct"
    >
      <p>Êtes-vous sûr de vouloir supprimer ce produit ?</p>
    </Modal>
  </div>
</template>