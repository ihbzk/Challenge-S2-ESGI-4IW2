<script setup>
import Table from '@/components/Table.vue';
import Modal from '@/components/Modal.vue';
import { ref, onMounted } from 'vue';

const headers = ['ID', 'Nom'];
const categories = ref([]);
const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const categoryToDelete = ref(null);
const newCategory = ref({
    name: '',
});
const editingCategory = ref({});
const errors = ref({});

const getCategories = async () => {
    try {
        let authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
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

const createCategory = async () => {
    errors.value = {};

    if (!newCategory.value.name) {
        errors.value.name = 'Le nom est obligatoire';
        return;
    }

    try {
        let authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

        const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(newCategory.value),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la création de la catégorie');
        }

        const createdCategory = await response.json();
        categories.value.push(createdCategory);

        newCategory.value = { name: '' };
        isCreateModalOpen.value = false;
    } catch (error) {
        errors.value.general = error.message;
        console.error('Échec de la création de la catégorie', error);
    }
};

const editCategory = (index) => {
    editingCategory.value = { ...categories.value[index] };
    isEditModalOpen.value = true;
};

const updateCategory = async () => {
    errors.value = {}; // Clear previous errors

    if (!editingCategory.value.name) {
        errors.value.name = 'Le nom est obligatoire';
        return;
    }

    try {
        let authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const categoryId = editingCategory.value.id;

        const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/categories/${categoryId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(editingCategory.value),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour de la catégorie');
        }

        const updatedCategory = await response.json();
        const index = categories.value.findIndex(category => category.id === categoryId);
        categories.value[index] = updatedCategory;

        isEditModalOpen.value = false;
    } catch (error) {
        errors.value.general = error.message;
        console.error('Échec de la mise à jour de la catégorie', error);
    }
};

const confirmDeleteCategory = (index) => {
    categoryToDelete.value = index;
    isDeleteModalOpen.value = true;
};

const deleteCategory = async () => {
    if (categoryToDelete.value !== null) {
        try {
            let authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            const categoryId = categories.value[categoryToDelete.value].id;

            const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/categories/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de la catégorie');
            }

            categories.value.splice(categoryToDelete.value, 1);
            categoryToDelete.value = null;
            isDeleteModalOpen.value = false;
        } catch (error) {
            console.error('Échec de la suppression de la catégorie', error);
        }
    }
};

onMounted(async () => {
    await getCategories();
});
</script>

<template>
    <div>
        <div class="flex justify-between items-center m-6">
            <h2 class="text-2xl font-semibold">Liste des catégories</h2>
            <button @click="isCreateModalOpen = true" class="px-4 py-2 bg-green-500 text-white rounded">Créer une
                catégorie</button>
        </div>
        <Table :headers="headers" :rows="categories" @edit-row="editCategory" @delete-row="confirmDeleteCategory" />
        <Modal v-if="isCreateModalOpen" :isOpen="isCreateModalOpen" title="Créer une catégorie"
            confirmText="Enregistrer" @close="isCreateModalOpen = false" @confirm="createCategory">
            <div>
                <label for="name">Nom de la catégorie :</label>
                <input v-model="newCategory.name" type="text" id="name" class="border p-2 rounded mb-4 w-full" />
                <div v-if="errors.name" class="text-red-500">{{ errors.name }}</div>
            </div>
        </Modal>
        <Modal v-if="isEditModalOpen" :isOpen="isEditModalOpen" title="Modifier la catégorie" confirmText="Enregistrer"
            @close="isEditModalOpen = false" @confirm="updateCategory">
            <div>
                <label for="name">Nom de la catégorie :</label>
                <input v-model="editingCategory.name" type="text" id="name" class="border p-2 rounded mb-4 w-full" />
                <div v-if="errors.name" class="text-red-500">{{ errors.name }}</div>
            </div>
        </Modal>
        <Modal v-if="isDeleteModalOpen" :isOpen="isDeleteModalOpen" title="Confirmation de suppression"
            confirmText="Supprimer" @close="isDeleteModalOpen = false" @confirm="deleteCategory">
            <p>Êtes-vous sûr de vouloir supprimer cette catégorie ?</p>
        </Modal>
    </div>
</template>