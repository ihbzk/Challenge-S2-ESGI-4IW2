<script setup>
import Table from '@/components/Table.vue';
import Modal from '@/components/Modal.vue';
import { ref, onMounted, computed } from 'vue';
import { productSchema } from '@/composables/validation';

const headers = ['Nom', 'Description', 'Catégorie', 'Marque', 'Prix', 'Promotion', 'Stock', 'Illustration', 'Actions'];
const products = ref([]);
const categories = ref([]);
const brands = ref([]);
const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const productToDelete = ref(null);
const newProduct = ref({
  productName: '',
  description: '',
  categoryId: null,
  brandId: null,
  price: '',
  promotion: false,
  stock: 0,
  illustration: '',
});
const editingProduct = ref({});
const errors = ref({});

const getProducts = async () => {
  try {
    let authToken = localStorage.getItem('authToken');
    const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
    });

    if (!response.ok) {
      throw new Error('Impossible de récupérer les produits');
    }

    const data = await response.json();
    products.value = data.map(product => ({
      id: product.id,
      productName: product.productName,
      description: product.description,
      categoryId: product.categoryId,
      brandId: product.brandId,
      price: product.price,
      promotion: product.promotion,
      stock: product.stock,
      illustration: product.illustration,
    }));
  } catch (error) {
    console.error('Échec de la récupération des produits', error);
  }
};

const getCategories = async () => {
  try {
    let authToken = localStorage.getItem('authToken');
    const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
    });

    if (!response.ok) {
      throw new Error('Impossible de récupérer les catégories');
    }

    const data = await response.json();
    categories.value = data.map(category => ({
      id: category.id,
      name: category.name,
    }));
  } catch (error) {
    console.error('Échec de la récupération des catégories', error);
  }
};

const getBrands = async () => {
  try {
    let authToken = localStorage.getItem('authToken');
    const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/brands`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
    });

    if (!response.ok) {
      throw new Error('Impossible de récupérer les marques');
    }

    const data = await response.json();
    brands.value = data.map(brand => ({
      id: brand.id,
      name: brand.name,
    }));
  } catch (error) {
    console.error('Échec de la récupération des marques', error);
  }
};

const createProduct = async () => {
  errors.value = {};

  const result = productSchema.safeParse(newProduct.value);

  if (!result.success) {
    result.error.errors.forEach((e) => {
      errors.value[e.path[0]] = e.message;
    });
    return;
  }

  try {
    let authToken = localStorage.getItem('authToken');
    const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(newProduct.value),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur lors de la création du produit:', errorData);
      throw new Error('Erreur lors de la création du produit');
    }

    const createdProduct = await response.json();
    products.value.push(createdProduct);

    newProduct.value = {
      productName: '',
      description: '',
      categoryId: null,
      brandId: null,
      price: '',
      promotion: false,
      stock: 0,
      illustration: '',
    };
    isCreateModalOpen.value = false;
  } catch (error) {
    errors.value.general = error.message;
    console.error('Échec de la création du produit', error);
  }
};

const editProduct = (index) => {
  editingProduct.value = { ...products.value[index] };
  isEditModalOpen.value = true;
};

const updateProduct = async () => {
  errors.value = {};

  const result = productSchema.safeParse(editingProduct.value);

  if (!result.success) {
    result.error.errors.forEach((e) => {
      errors.value[e.path[0]] = e.message;
    });
    return;
  }

  try {
    let authToken = localStorage.getItem('authToken');
    const productId = editingProduct.value.id;

    const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(editingProduct.value),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour du produit');
    }

    const updatedProduct = await response.json();
    const index = products.value.findIndex(product => product.id === productId);
    products.value[index] = updatedProduct;

    isEditModalOpen.value = false;
  } catch (error) {
    errors.value.general = error.message;
    console.error('Échec de la mise à jour du produit', error);
  }
};

const confirmDeleteProduct = (index) => {
  productToDelete.value = index;
  isDeleteModalOpen.value = true;
};

const deleteProduct = async () => {
  if (productToDelete.value !== null) {
    try {
      let authToken = localStorage.getItem('authToken');
      const productId = products.value[productToDelete.value].id;

      const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du produit');
      }

      products.value.splice(productToDelete.value, 1);
      productToDelete.value = null;
      isDeleteModalOpen.value = false;
    } catch (error) {
      console.error('Échec de la suppression du produit', error);
    }
  }
};

const formattedProducts = computed(() => {
  return products.value.map(product => ({
    productName: product.productName,
    description: product.description,
    category: categories.value.find(category => category.id === product.categoryId)?.name || 'Unknown',
    brand: brands.value.find(brand => brand.id === product.brandId)?.name || 'Unknown',
    price: product.price,
    promotion: product.promotion ? 'Oui' : 'Non',
    stock: product.stock,
    illustration: `<img src="${product.illustration}" alt="${product.productName}" style="width: 100px; height: auto;" />`,
  }));
});

onMounted(async () => {
  await getProducts();
  await getCategories();
  await getBrands();
});
</script>

<template>
  <div>
    <div class="flex justify-between items-center m-6">
      <h2 class="text-2xl font-semibold">Liste des produits</h2>
      <button @click="isCreateModalOpen = true" class="px-4 py-2 bg-green-500 text-white rounded">Créer un
        produit</button>
    </div>
    <Table :headers="headers" :rows="formattedProducts" @edit-row="editProduct" @delete-row="confirmDeleteProduct" />
    <Modal v-if="isCreateModalOpen" :isOpen="isCreateModalOpen" title="Créer un produit" confirmText="Enregistrer"
      @close="isCreateModalOpen = false" @confirm="createProduct">
      <div>
        <label for="productName">Nom du produit :</label>
        <input v-model="newProduct.productName" type="text" id="productName" class="border p-2 rounded mb-4 w-full" />
        <div v-if="errors.productName" class="text-red-500">{{ errors.productName }}</div>
        <label for="description">Description :</label>
        <input v-model="newProduct.description" type="text" id="description" class="border p-2 rounded mb-4 w-full" />
        <div v-if="errors.description" class="text-red-500">{{ errors.description }}</div>
        <label for="category">Catégorie :</label>
        <select v-model="newProduct.categoryId" id="category" class="border p-2 rounded mb-4 w-full">
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
        <input v-model="newProduct.price" type="number" id="price" class="border p-2 rounded mb-4 w-full" />
        <div v-if="errors.price" class="text-red-500">{{ errors.price }}</div>
        <label for="promotion">Promotion :</label>
        <select v-model="newProduct.promotion" id="promotion" class="border p-2 rounded mb-4 w-full">
          <option :value="true">Oui</option>
          <option :value="false">Non</option>
        </select>
        <div v-if="errors.promotion" class="text-red-500">{{ errors.promotion }}</div>
        <label for="stock">Stock :</label>
        <input v-model="newProduct.stock" type="number" id="stock" class="border p-2 rounded mb-4 w-full" />
        <div v-if="errors.stock" class="text-red-500">{{ errors.stock }}</div>
        <label for="illustration">Illustration :</label>
        <input v-model="newProduct.illustration" type="text" id="illustration" class="border p-2 rounded mb-4 w-full" />
        <div v-if="errors.illustration" class="text-red-500">{{ errors.illustration }}</div>
        <div v-if="errors.general" class="text-red-500">{{ errors.general }}</div>
      </div>
    </Modal>
    <Modal v-if="isEditModalOpen" :isOpen="isEditModalOpen" title="Modifier le produit" confirmText="Enregistrer"
      @close="isEditModalOpen = false" @confirm="updateProduct">
      <div>
        <label for="productName">Nom du produit :</label>
        <input v-model="editingProduct.productName" type="text" id="productName"
          class="border p-2 rounded mb-4 w-full" />
        <div v-if="errors.productName" class="text-red-500">{{ errors.productName }}</div>
        <label for="description">Description :</label>
        <input v-model="editingProduct.description" type="text" id="description"
          class="border p-2 rounded mb-4 w-full" />
        <div v-if="errors.description" class="text-red-500">{{ errors.description }}</div>
        <label for="category">Catégorie :</label>
        <select v-model="editingProduct.categoryId" id="category" class="border p-2 rounded mb-4 w-full">
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
        <input v-model="editingProduct.price" type="number" id="price" class="border p-2 rounded mb-4 w-full" />
        <div v-if="errors.price" class="text-red-500">{{ errors.price }}</div>
        <label for="promotion">Promotion :</label>
        <select v-model="editingProduct.promotion" id="promotion" class="border p-2 rounded mb-4 w-full">
          <option :value="true">Oui</option>
          <option :value="false">Non</option>
        </select>
        <div v-if="errors.promotion" class="text-red-500">{{ errors.promotion }}</div>
        <label for="stock">Stock :</label>
        <input v-model="editingProduct.stock" type="number" id="stock" class="border p-2 rounded mb-4 w-full" />
        <div v-if="errors.stock" class="text-red-500">{{ errors.stock }}</div>
        <label for="illustration">Illustration :</label>
        <input v-model="editingProduct.illustration" type="text" id="illustration"
          class="border p-2 rounded mb-4 w-full" />
        <div v-if="errors.illustration" class="text-red-500">{{ errors.illustration }}</div>
        <div v-if="errors.general" class="text-red-500">{{ errors.general }}</div>
      </div>
    </Modal>
    <Modal v-if="isDeleteModalOpen" :isOpen="isDeleteModalOpen" title="Confirmation de suppression"
      confirmText="Supprimer" @close="isDeleteModalOpen = false" @confirm="deleteProduct">
      <p>Êtes-vous sûr de vouloir supprimer ce produit ?</p>
    </Modal>
  </div>
</template>