<template>
    <div class="bg-gray-100 min-h-screen p-6">
        <!-- En-tête du tableau de bord -->
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-3xl font-bold text-gray-700">Tableau de bord</h2>
            <div class="flex space-x-4">
                <!-- Corbeille pour supprimer des widgets -->
                <div class="flex justify-center items-center px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-105" id="widgetTrash">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" width="24px" viewBox="0 0 297.001 297.001">
                        <g>
                        <path d="M241.348,85.53c-2.184-4.45-5.971-7.782-10.662-9.384L94.056,29.498c-9.686-3.303-20.251,1.884-23.558,11.567l-5.573,16.324l171.753,58.638l5.574-16.323C243.854,95.014,243.533,89.979,241.348,85.53z"/>
                        <path d="M148.5,14.472l49.205,16.799l-6.157,18.036l12.069,4.12l8.218-24.07c1.138-3.333-0.642-6.957-3.974-8.095l-61.274-20.92c-1.599-0.547-3.353-0.434-4.871,0.31c-1.518,0.745-2.679,2.064-3.225,3.663l-8.218,24.071l12.07,4.122L148.5,14.472z"/>
                        <path d="M183.237,275.016c0,5.099-4.133,9.232-9.232,9.232s-9.232-4.133-9.232-9.232V104.954l-42.338-14.455H60.256c-0.926,0-1.857,0.152-2.701,0.531c-2.53,1.137-3.953,3.644-3.799,6.226l11.562,193.749c0.201,3.367,2.991,5.996,6.365,5.996h138.741c3.374,0,6.164-2.629,6.365-5.996l9.843-164.931l-43.395-14.816V275.016z M117.333,275.016c0,5.099-4.133,9.232-9.232,9.232s-9.232-4.133-9.232-9.232V103.252h18.464V275.016z"/>
                        </g>
                    </svg>
                </div>
                <!-- Bouton pour ouvrir la modal de création -->
                <button @click="isCreateModalOpen = true" class="px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">Créer un widget</button>
            </div>
        </div>
        <!-- Modal de création de widget -->
        <Modal 
            v-if="isCreateModalOpen"
            :isOpen="isCreateModalOpen"
            title="Créer un widget"
            confirmText="Enregistrer"
            @close="isCreateModalOpen = false" 
            @confirm="createWidget"
        >
            <div class="grid grid-cols-2 gap-8">
                <div>
                    <!-- Champs pour les propriétés du widget -->
                    <label for="title" class="block text-sm font-medium text-gray-700">Titre :</label>
                    <input v-model="newWidget.title" type="text" id="title" class="mt-1 border p-2 rounded-lg w-full" />
                    <div v-if="errors.title" class="text-red-500 mt-1">{{ errors.title }}</div>

                    <label for="x" class="block text-sm font-medium text-gray-700">x :</label>
                    <input v-model.number="newWidget.x" type="number" id="x" class="mt-1 border p-2 rounded-lg w-full" />
                    <div v-if="errors.x" class="text-red-500 mt-1">{{ errors.x }}</div>

                    <label for="y" class="block text-sm font-medium text-gray-700 mt-4">y :</label>
                    <input v-model.number="newWidget.y" type="number" id="y" class="mt-1 border p-2 rounded-lg w-full" />
                    <div v-if="errors.y" class="text-red-500 mt-1">{{ errors.y }}</div>

                    <label for="width" class="block text-sm font-medium text-gray-700 mt-4">width :</label>
                    <input v-model.number="newWidget.width" type="number" id="width" class="mt-1 border p-2 rounded-lg w-full" />
                    <div v-if="errors.width" class="text-red-500 mt-1">{{ errors.width }}</div>

                    <label for="height" class="block text-sm font-medium text-gray-700 mt-4">height :</label>
                    <input v-model.number="newWidget.height" type="number" id="height" class="mt-1 border p-2 rounded-lg w-full" />
                    <div v-if="errors.height" class="text-red-500 mt-1">{{ errors.height }}</div>

                    <label for="type" class="block text-sm font-medium text-gray-700 mt-4">type :</label>
                    <select v-model="newWidget.type" id="type" class="mt-1 border p-2 rounded-lg w-full">
                        <option value="">Sélectionnez un type</option>
                        <option value="bar">Bar</option>
                        <option value="line">Line</option>
                        <option value="pie">Pie</option>
                    </select>
                    <div v-if="errors.type" class="text-red-500 mt-1">{{ errors.type }}</div>

                    <label for="dataset" class="block text-sm font-medium text-gray-700 mt-4">Dataset :</label>
                    <select v-model="newWidget.dataset" id="dataset" class="mt-1 border p-2 rounded-lg w-full">
                        <option value="">Sélectionnez un dataset</option>
                        <option value="users">Users</option>
                        <option value="products">Products</option>
                        <option value="widgets">Widgets</option>
                    </select>

                    <!-- Dimensions draggable list -->
                    <h3 class="block text-sm font-medium text-gray-700 mt-4">Dimensions :</h3>
                    <draggable
                        class="list-group overflow-y-scroll h-20"
                        :list="dimensions"
                        group="dimension"
                        @change="dragChange"
                        item-key="name"
                    >
                        <template #item="{ element, index }">
                        <div class="p-2 mb-1 bg-white border border-gray-300 rounded cursor-pointer">{{ element }}</div>
                        </template>
                    </draggable>
            
                    <!-- Measures draggable list -->
                    <h3 class="block text-sm font-medium text-gray-700 mt-4">Measures :</h3>
                    <draggable
                        class="list-group overflow-y-scroll h-20"
                        :list="measures"
                        group="measure"
                        @change="dragChange"
                        itemKey="name"
                    >
                        <template #item="{ element, index }">
                            <div class="p-2 mb-1 bg-white border border-gray-300 rounded cursor-pointer">{{ element }}</div>
                        </template>
                    </draggable>

                    <div v-if="errors.general" class="text-red-500 mt-1">{{ errors.general }}</div>
                </div>
            <div>
            <h2 class="text-xl font-semibold mb-4">Aperçu</h2>
            <!-- Aperçu du widget en fonction du type sélectionné -->
            <div v-if="newWidget.type === 'bar'" class="border p-4 rounded-lg bg-white shadow">
                <BarChart
                    :dimensionsDatas="dimensionsDatas"
                    :measuresDatas="measuresDatas"
                    :title="newWidget.title"
                />
            </div>
            <div v-if="newWidget.type === 'line'" class="border p-4 rounded-lg bg-white shadow">
                <LineChart
                    :dimensionsDatas="dimensionsDatas"
                    :measuresDatas="measuresDatas"
                    :title="newWidget.title"
                />
            </div>
            <div v-if="newWidget.type === 'pie'" class="border p-4 rounded-lg bg-white shadow">
                <PieChart
                    :dimensionsDatas="dimensionsDatas"
                    :measuresDatas="measuresDatas"
                    :title="newWidget.title"
                />
            </div>

            <!-- liste des dimensions sélectionnées -->
            <div class="mt-4">
                <h3 class="block text-sm font-medium text-gray-700">Dimensions :</h3>
                <draggable 
                    v-model="selectedDimensions" 
                    class="min-h-50 border-dashed border-2 border-gray-300 p-2 mt-2 bg-gray-100" 
                    group="dimension"
                    item-key="dimension"
                    @change="dragChange"
                    :list="selectedDimensions"
                >
                    <template #item="{ element, index }">
                        <div class="p-2 mb-1 bg-white border border-gray-300 rounded cursor-pointer">{{ element }}</div>
                    </template>
                </draggable>
            </div>

            <!-- liste des mesures sélectionnées -->
            <div class="mt-4">
                <h3 class="block text-sm font-medium text-gray-700">Mesures :</h3>
                <draggable 
                    v-model="selectedMeasures" 
                    class="min-h-50 border-dashed border-2 border-gray-300 p-2 mt-2 bg-gray-100" 
                    group="measure"
                    @change="dragChange"
                    item-key="measure"
                    :list="selectedMeasures"
                >
                    <template #item="{ element, index }">
                        <div class="p-2 mb-1 bg-white border border-gray-300 rounded cursor-pointer">{{ element }}</div>
                    </template>
                </draggable>
            </div>
        </div>
    </div>
    </Modal>

        <!-- Section KPI -->
        <div class="grid grid-cols-2 gap-6">
            <!-- KPI: Nombre total d'utilisateurs -->
            <div class="kpi-card bg-white p-4 rounded-lg shadow-lg">
                <h3 class="text-xl font-semibold text-gray-700">Nombre total d'utilisateurs</h3>
                <p class="text-3xl font-bold text-gray-900">{{ users.length }}</p>
            </div>

            <!-- KPI: Nombre total de produits -->
            <div class="kpi-card bg-white p-4 rounded-lg shadow-lg">
                <h3 class="text-xl font-semibold text-gray-700">Nombre total de produits</h3>
                <p class="text-3xl font-bold text-gray-900">{{ products.length }}</p>
            </div>
        </div>

        <!-- Conteneur des widgets -->
        <GridStackContainer v-if="widgetsLoaded" @updateWidgets="handleUpdateWidgets" @deleteWidgets="handleDeleteWidgets" class="mt-8">
            <GridStackItem v-for="widget in widgets"
                :key="widget.id"
                :id="widget.id"
                :x="widget.x"
                :y="widget.y" 
                :w="widget.width" 
                :h="widget.height"
                class="border bg-white p-4 rounded-lg shadow-lg"
            >
                <!-- Affichage du widget en fonction du type -->
                <BarChart v-if="widget.type === 'bar'" :measuresDatas="widget.measuresDatas" :dimensionsDatas="widget.dimensionsDatas" :title="widget.title" />
                <LineChart v-if="widget.type === 'line'" :measuresDatas="widget.measuresDatas" :dimensionsDatas="widget.dimensionsDatas" :title="widget.title" />
                <PieChart v-if="widget.type === 'pie'" :measuresDatas="widget.measuresDatas" :dimensionsDatas="widget.dimensionsDatas" :title="widget.title" />  
            </GridStackItem>
        </GridStackContainer>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch } from 'vue';
    import Modal from '@/components/Modal.vue';
    import { widgetSchema } from '@/composables/validation';
    import GridStackContainer from '@/components/Gridstack/GridStackContainer.vue';
    import GridStackItem from '@/components/Gridstack/GridStackItem.vue';
    import BarChart from '@/components/Chart/BarChart.vue';
    import LineChart from '@/components/Chart/LineChart.vue';
    import PieChart from '@/components/Chart/PieChart.vue';
    import draggable from 'vuedraggable'

    const isCreateModalOpen = ref(false);
    const newWidget = ref({
        x: null,
        y: null,
        width: null,
        height: null,
        dimensionsDatas: [],
        measuresDatas: [],
        type: '',
        dataset: '',
        title: null,
    });

    const errors = ref({});

    const datasetDatas = ref({});

    const dimensions = ref([]);
    const dimensionsDatas = ref([]);
    const selectedDimensions = ref([]);

    const measures = ref([]);
    const measuresDatas = ref([]);
    const selectedMeasures = ref([]);

    // Fonction pour créer un widget
    const createWidget = async () => {
        errors.value = {}; // Effacer les erreurs précédentes

        const result = widgetSchema.safeParse(newWidget.value);
        if (!result.success) {
            result.error.errors.forEach((e) => {
                errors.value[e.path[0]] = e.message;
            });

            return;
        }

        try {
            let authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

            const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/widgets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    x: newWidget.value.x,
                    y: newWidget.value.y,
                    width: newWidget.value.width,
                    height: newWidget.value.height,
                    dimensionsDatas: dimensionsDatas.value,
                    measuresDatas: measuresDatas.value,
                    type: newWidget.value.type,
                    dataset: newWidget.value.dataset,
                    title: newWidget.value.title,
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création du widget');
            }

            await response.json();

            newWidget.value = {
                title: '',
                x: '',
                y: '',
                width: '',
                height: '',
                dimensionsDatas: [],
                measuresDatas: [],
                type: '',
                dataset: '',
            };

            isCreateModalOpen.value = false;
            getWidgets(); // Rafraîchir la liste des widgets
        } catch (error) {
            errors.value.general = error.message;
            console.error('Échec de la création du widget', error);
        }
    };

    // Fonction pour mettre à jour un widget existant
    const updateWidget = async (widget) => {
        try {
            let authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

            const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/widgets/${widget.id}`, {
            method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
            body: JSON.stringify(widget),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du widget');
            }

            await response.json();
        } catch (error) {
            console.error('Échec de la mise à jour du widget', error);
        }
    };

    // Fonction pour supprimer un widget
    const deleteWidget = async (widgetId) => {
        try {
            let authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

            const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/widgets/${widgetId}`, {
            method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression du widget');
            }

            await response.json();
        } catch (error) {
            console.error('Échec de la suppression du widget', error);
        }
    };

    // on récupère la liste des widgets
    const widgets = ref([]);
    // on marque les widgets comme chargés
    const widgetsLoaded = ref(false);

    // Fonction pour récupérer la liste des widgets depuis le backend
    const getWidgets = async () => {
        try {
            let authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/widgets`, {
                headers: {
                    'method': 'GET',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des widgets');
            }

            widgets.value = await response.json();
            // Marquer les widgets comme chargés
            widgetsLoaded.value = true;

            return widgets.value;
        } catch (error) {
            console.error('Échec de la récupération des widgets', error);
        }
    };

    // on récupère la liste des utilisateurs
    const users = ref([]);

    // Fonction pour récupérer la liste des utilisateurs depuis le backend
    const getUsers = async () => {
        try {
            let authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/users`, {
                headers: {
                    'method': 'GET',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des utilisateurs');
            }

            users.value = await response.json();

            return users.value;
        } catch (error) {
            console.error('Échec de la récupération des utilisateurs', error);
            return [];
        }
    };

    // on récupère la liste des produits
    const products = ref([]);

    // Fonction pour récupérer la liste des produits depuis le backend
    const getProducts = async () => {
        try {
            let authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/products`, {
                headers: {
                    'method': 'GET',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des produits');
            }

            products.value = await response.json();

            return products.value;
        } catch (error) {
            console.error('Échec de la récupération des produits', error);
            
            return [];
        }
    };

    const dragChange = (evt) => {
        // Clear datasetDatasSelected before populating it
        dimensionsDatas.value = [];
        measuresDatas.value = [];

        datasetDatas.value.forEach(data => {
            const selectedDimensionsData = [];
            const selectedMeasuresData = [];

            Object.keys(data).forEach(key => {
                if (selectedDimensions.value.includes(key)) {
                    selectedDimensionsData.push(data[key]);
                }
            });

            Object.keys(data).forEach(key => {
                if (selectedMeasures.value.includes(key)) {
                    selectedMeasuresData.push(data[key]);
                }
            });

            dimensionsDatas.value.push(selectedDimensionsData);
            measuresDatas.value.push(selectedMeasuresData);
        });
    };

    // Fonction pour mettre à jour les widgets modifiés
    const handleUpdateWidgets = (items) => {
        items.forEach(item => {
            updateWidget(item);
        });
    };

    // Fonction pour supprimer les widgets sélectionnés
    const handleDeleteWidgets = (items) => {
        items.forEach(item => {
            deleteWidget(item);
        });
    };

    // Fonction pour mettre à jour les données du graphique en fonction du dataset sélectionné
    const updateChartData = async () => {
        let labels = {};

        if (newWidget.value.dataset === 'users') {
            if (labels[newWidget.value.dataset] === undefined) {
                // on vide les listes de dimensions et de mesures
                measures.value = [];
                dimensions.value = [];
                selectedMeasures.value = [];
                selectedDimensions.value = [];

                datasetDatas.value = await getUsers();
            }
        } else if (newWidget.value.dataset === 'products') {
            if (labels[newWidget.value.dataset] === undefined) {
                // on vide les listes de dimensions et de mesures
                measures.value = [];
                dimensions.value = [];
                selectedMeasures.value = [];
                selectedDimensions.value = [];
                
                datasetDatas.value = await getProducts();
            }
        } else {
            if (labels[newWidget.value.dataset] === undefined) {
                // on vide les listes de dimensions et de mesures
                measures.value = [];
                dimensions.value = [];
                selectedMeasures.value = [];
                selectedDimensions.value = [];
                
                datasetDatas.value = await getWidgets();
            }
        }

        // on genere les labels pour les dimensions et les mesures
        if (datasetDatas.value.length > 0) {
            const sample = datasetDatas.value[0];
            const dimensionKeys = Object.keys(sample).filter(key => typeof sample[key] === 'string');
            const measureKeys = Object.keys(sample).filter(key => typeof sample[key] === 'number');

            // on met à jour les listes de dimensions et de mesures
            dimensions.value = dimensionKeys;
            measures.value = measureKeys;
        }
    };

    // Surveiller les changements du dataset sélectionné pour mettre à jour les données du graphique
    watch(() => newWidget.value.dataset, updateChartData);

    // Lorsque le composant est monté, récupérer les widgets
    onMounted(() => {
        getUsers();
        getProducts();
        getWidgets();
    });
</script>


<style scoped>
    .shadow-lg {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
</style>
