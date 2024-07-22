<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { ChevronRightIcon, UsersIcon } from '@heroicons/vue/24/outline'
import {
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'
import axios from 'axios'
import { useSearchBar } from '../composables/useSearchModal'

const { isSearchBarOpen, closeSearchBar } = useSearchBar()

const query = ref('')
const suggestions = ref([])
const recentSearches = ref(JSON.parse(sessionStorage.getItem('recentSearches') || '[]'))
const router = useRouter()

async function fetchSuggestions() {
    if (query.value.trim() === '') {
        suggestions.value = []
        return
    }

    try {
        const response = await axios.get(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/suggest`, {
            params: { q: query.value }
        })
        suggestions.value = response.data
    } catch (error) {
        console.error(error)
    }
}

function onInputChange(event) {
    query.value = event.target.value
}

watch(query, fetchSuggestions)

function onSelect(item) {
    if (typeof item === 'string') {
        recentSearches.value = [item, ...recentSearches.value.filter(q => q !== item)].slice(0, 5)
        sessionStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
        router.push({ name: 'SearchResults', query: { q: item } })
    } else {
        router.push({ name: 'ProductDetail', params: { id: item.id } })
    }
    closeSearchBar()
}

function selectSuggestion(suggestion) {
    if (suggestion) {
        onSelect(suggestion)
        closeSearchBar()
    }
}

function imageError(event, item) {
    event.target.src = 'https://www.kurin.com/wp-content/uploads/placeholder-square.jpg'
}

function onSubmit() {
    if (query.value.trim() !== '') {
        recentSearches.value = [query.value, ...recentSearches.value.filter(q => q !== query.value)].slice(0, 5)
        sessionStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
        router.push({ name: 'SearchResults', query: { q: query.value } })
        closeSearchBar()
    }
}
</script>

<style scoped>
ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    background: white;
    border: 1px solid #ccc;
    max-height: 200px;
    overflow-y: auto;
}

li {
    padding: 8px;
    cursor: pointer;
}

li:hover {
    background: #eee;
}
</style>

<template>
    <div>
        <TransitionRoot :show="isSearchBarOpen" as="template" @after-leave="query = ''" appear>
            <Dialog class="relative z-10" @close="closeSearchBar">
                <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0"
                    enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
                </TransitionChild>
                <div class="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
                    <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="ease-in duration-200" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="mx-auto max-w-3xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                            <Combobox v-slot="{ activeOption }" @update:modelValue="onSelect">
                                <div class="relative">
                                    <MagnifyingGlassIcon
                                        class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                                        aria-hidden="true" />
                                    <ComboboxInput
                                        class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                        placeholder="Rechercher des produits, des marques et des catégories..."
                                        @input="onInputChange" 
                                        @keydown.enter.prevent="onSubmit" />
                                </div>
                                <ComboboxOptions v-if="query === '' || suggestions.length > 0"
                                    class="flex transform-gpu divide-x divide-gray-100" as="div" static hold>
                                    <div
                                        :class="['max-h-96 min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4', activeOption && 'sm:h-96']">
                                        <ComboboxOption :value="query" as="template" v-slot="{ active }">
                                            <div
                                                :class="['group flex cursor-default select-none items-center rounded-md p-2', active && 'bg-gray-100 text-gray-900']">
                                                <span class="ml-3 flex-auto truncate">{{ query }}</span>
                                                <ChevronRightIcon v-if="active"
                                                    class="ml-3 h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                                            </div>
                                        </ComboboxOption>
                                        <ComboboxOption v-for="suggestion in suggestions" :key="suggestion.id"
                                            :value="suggestion" as="template" v-slot="{ active }">
                                            <div
                                                :class="['group flex cursor-default select-none items-center rounded-md p-2', active && 'bg-gray-100 text-gray-900']">
                                                <img :src="suggestion.illustration || 'https://www.kurin.com/wp-content/uploads/placeholder-square.jpg'"
                                                    alt="" @error="imageError($event, suggestion)"
                                                    class="h-6 w-6 flex-none rounded-full" />
                                                <span class="ml-3 flex-auto truncate">{{ suggestion.Brand?.name }}
                                                    {{ suggestion.productName }}</span>
                                                <span class="text-right text-xs flex-auto text-gray-400">{{
                                                    suggestion.Category?.name }}</span>
                                                <ChevronRightIcon v-if="active"
                                                    class="ml-3 h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                                            </div>
                                        </ComboboxOption>
                                        <div hold class="-mx-2 text-sm text-gray-700">
                                            <h2 class="mb-4 mt-2 text-xs font-semibold text-gray-500">Recherches
                                                récentes</h2>
                                            <ComboboxOption v-for="recentQuery in recentSearches" :key="recentQuery"
                                                :value="recentQuery" as="template" v-slot="{ active }">
                                                <div
                                                    :class="['group flex cursor-default select-none items-center rounded-md p-2', active && 'bg-gray-100 text-gray-900']">
                                                    <span class="ml-3 flex-auto truncate">{{ recentQuery }}</span>
                                                    <ChevronRightIcon v-if="active"
                                                        class="ml-3 h-5 w-5 flex-none text-gray-400"
                                                        aria-hidden="true" />
                                                </div>
                                            </ComboboxOption>
                                        </div>
                                    </div>
                                    <div v-if="activeOption"
                                        class="hidden h-96 w-1/2 flex-none flex-col divide-y divide-gray-100 overflow-y-auto sm:flex">
                                        <div class="flex-none p-6 text-center">
                                            <img :src="activeOption.illustration || 'https://www.kurin.com/wp-content/uploads/placeholder-square.jpg'"
                                                alt="" @error="imageError($event, activeOption)"
                                                class="mx-auto h-16 w-16 rounded-full" />
                                            <h2 class="mt-3 font-semibold text-gray-900">{{ activeOption.productName }}
                                            </h2>
                                            <p class="text-sm leading-6 text-gray-500">{{ activeOption.Brand?.name }}
                                            </p>
                                        </div>
                                        <div class="flex flex-auto flex-col justify-between p-6">
                                            <dl class="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700">
                                                <dt class="col-end-1 font-semibold text-gray-900">Catégorie</dt>
                                                <dd>{{ activeOption.Category?.name }}</dd>
                                                <dt class="col-end-1 font-semibold text-gray-900">Prix</dt>
                                                <dd>{{ activeOption.price }} €</dd>
                                                <dt class="col-end-1 font-semibold text-gray-900">Description</dt>
                                                <dd>{{ activeOption.description }}</dd>
                                            </dl>
                                            <button type="button"
                                                class="mt-6 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                @click="selectSuggestion(activeOption)">Voir le produit</button>
                                        </div>
                                    </div>
                                </ComboboxOptions>
                                <div v-if="query !== '' && suggestions.length === 0"
                                    class="px-6 py-14 text-center text-sm sm:px-14">
                                    <UsersIcon class="mx-auto h-6 w-6 text-gray-400" aria-hidden="true" />
                                    <p class="mt-4 font-semibold text-gray-900">Aucun produit trouvé</p>
                                    <p class="mt-2 text-gray-500">Nous n'avons rien trouvé avec ce terme. Veuillez
                                        réessayer.</p>
                                </div>
                            </Combobox>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </TransitionRoot>
    </div>
</template>