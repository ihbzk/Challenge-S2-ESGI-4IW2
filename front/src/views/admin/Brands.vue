<script setup>
import Table from '@/components/Table.vue';
import Modal from '@/components/Modal.vue';
import { ref, onMounted } from 'vue';

const headers = ['ID', 'Nom'];
const brands = ref([]);
const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const brandToDelete = ref(null);
const newBrand = ref({
    name: '',
});
const editingBrand = ref({});
const errors = ref({});

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

const createBrand = async () => {
    errors.value = {};

    if (!newBrand.value.name) {
        errors.value.name = 'Le nom est obligatoire';
        return;
    }

    try {
        let authToken = localStorage.getItem('authToken');

        const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/brands`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(newBrand.value),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la création de la marque');
        }

        const createdBrand = await response.json();
        brands.value.push(createdBrand);

        newBrand.value = { name: '' };
        isCreateModalOpen.value = false;
    } catch (error) {
        errors.value.general = error.message;
        console.error('Échec de la création de la marque', error);
    }
};

const editBrand = (index) => {
    editingBrand.value = { ...brands.value[index] };
    isEditModalOpen.value = true;
};

const updateBrand = async () => {
    errors.value = {};

    if (!editingBrand.value.name) {
        errors.value.name = 'Le nom est obligatoire';
        return;
    }

    try {
        let authToken = localStorage.getItem('authToken');
        const brandId = editingBrand.value.id;

        const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/brands/${brandId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(editingBrand.value),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour de la marque');
        }

        const updatedBrand = await response.json();
        const index = brands.value.findIndex(brand => brand.id === brandId);
        brands.value[index] = updatedBrand;

        isEditModalOpen.value = false;
    } catch (error) {
        errors.value.general = error.message;
        console.error('Échec de la mise à jour de la marque', error);
    }
};

const confirmDeleteBrand = (index) => {
    brandToDelete.value = index;
    isDeleteModalOpen.value = true;
};

const deleteBrand = async () => {
  if (brandToDelete.value !== null) {
    try {
      let authToken = localStorage.getItem('authToken');
      const brandId = brands.value[brandToDelete.value].id;

      const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/brands/${brandId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur lors de la suppression de la marque:', errorData);
        throw new Error(errorData.error || 'Erreur lors de la suppression de la marque');
      }

      brands.value.splice(brandToDelete.value, 1);
      brandToDelete.value = null;
      isDeleteModalOpen.value = false;
    } catch (error) {
      errors.value.general = error.message;
      console.error('Échec de la suppression de la marque', error);
    }
  }
};

onMounted(async () => {
    await getBrands();
});
</script>

<template>
    <div>
        <div class="flex justify-between items-center m-6">
            <h2 class="text-2xl font-semibold">Liste des marques</h2>
            <button @click="isCreateModalOpen = true" class="px-4 py-2 bg-green-500 text-white rounded">Créer une marque</button>
        </div>
        <Table :headers="headers" :rows="brands" @edit-row="editBrand" @delete-row="confirmDeleteBrand" />
        <Modal v-if="isCreateModalOpen" :isOpen="isCreateModalOpen" title="Créer une marque" confirmText="Enregistrer" @close="isCreateModalOpen = false" @confirm="createBrand">
            <div>
                <label for="name">Nom de la marque :</label>
                <input v-model="newBrand.name" type="text" id="name" class="border p-2 rounded mb-4 w-full" />
                <div v-if="errors.name" class="text-red-500">{{ errors.name }}</div>
            </div>
        </Modal>
        <Modal v-if="isEditModalOpen" :isOpen="isEditModalOpen" title="Modifier la marque" confirmText="Enregistrer" @close="isEditModalOpen = false" @confirm="updateBrand">
            <div>
                <label for="name">Nom de la marque :</label>
                <input v-model="editingBrand.name" type="text" id="name" class="border p-2 rounded mb-4 w-full" />
                <div v-if="errors.name" class="text-red-500">{{ errors.name }}</div>
            </div>
        </Modal>
        <Modal v-if="isDeleteModalOpen" :isOpen="isDeleteModalOpen" title="Confirmation de suppression" confirmText="Supprimer" @close="isDeleteModalOpen = false" @confirm="deleteBrand">
            <p>Êtes-vous sûr de vouloir supprimer cette marque ?</p>
            <div v-if="errors.general" class="text-red-500">{{ errors.general }}</div>
        </Modal>
    </div>
</template>