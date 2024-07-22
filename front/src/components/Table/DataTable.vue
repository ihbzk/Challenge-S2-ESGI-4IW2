<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="mt-8 flow-root">
      <div class="mb-4 flex justify-between items-center">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search table..."
          class="block rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-600 focus:ring-opacity-50"
        />
        <Menu as="div" class="relative inline-block text-left">
          <div>
            <MenuButton
              class="inline-flex w-full justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
            >
              Filters
              <ChevronDownIcon class="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
            </MenuButton>
          </div>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems
              class="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div class="py-1">
                <MenuItem v-for="column in columns" :key="column.key">
                  <label
                    :class="{ 'bg-gray-100': active }"
                    class="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700"
                  >
                    <input
                      type="checkbox"
                      v-model="column.visible"
                      @click.stop
                      class="form-checkbox h-5 w-5 text-indigo-600 rounded"
                    />
                    <span>{{ column.label }}</span>
                  </label>
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div class="relative">
            <!-- Delete Selected Button -->
            <div
              v-if="selectedPeople.length > 0"
              class="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12"
            >
              <button
                type="button"
                @click="deleteSelected"
                class="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
              >
                Delete selected
              </button>
              <button
                type="button"
                @click="exportToCSV"
                class="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
              >
                Export CSV
              </button>
            </div>
            <!-- Table -->
            <table class="min-w-full table-fixed divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" class="relative px-7 sm:w-12 sm:px-6">
                    <input
                      type="checkbox"
                      class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      :checked="indeterminate || selectedPeople.length === props.items.length"
                      :indeterminate="indeterminate"
                      @change="toggleSelectAll"
                    />
                  </th>
                  <!-- Column Headers -->
                  <th
                    v-for="column in visibleColumns"
                    :key="column.key"
                    scope="col"
                    class="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                    @click="sortData(column.key)"
                  >
                    <a href="#" class="group inline-flex cursor-pointer">
                      {{ column.label }}
                      <span
                        class="ml-2 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200"
                      >
                        <ChevronDownIcon
                          class="h-5 w-5"
                          aria-hidden="true"
                          :class="{
                            'rotate-180': sortColumn === column.key && sortOrder === 'desc'
                          }"
                        />
                      </span>
                    </a>
                  </th>
                  <th
                    scope="col"
                    class="relative text-left py-3.5 pl-3 pr-4 sm:pr-3 text-sm font-semibold text-gray-900"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <!-- Table Rows -->
                <tr
                  v-for="item in paginatedItems"
                  :key="item.id"
                  :class="{ 'bg-gray-50': selectedPeople.includes(item.id) }"
                >
                  <td class="relative px-7 sm:w-12 sm:px-6">
                    <input
                      type="checkbox"
                      class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      :value="item.id"
                      v-model="selectedPeople"
                    />
                  </td>
                  <td
                    v-for="column in visibleColumns"
                    :key="column.key"
                    class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                    :class="{
                      'text-indigo-600': selectedPeople.includes(item.id),
                      'text-gray-900': !selectedPeople.includes(item.id)
                    }"
                  >
                    {{ item[column.key] }}
                  </td>
                  <td
                    class="whitespace-nowrap py-4 pl-3 pr-4 text-sm font-medium sm:pr-3 flex gap-4"
                  >
                    <button @click="editItem(item)" class="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </button>
                    <button @click="deleteItem(item)" class="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- Pagination Controls -->
    <div
      class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
    >
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
            to
            <span class="font-medium">{{
              Math.min(currentPage * itemsPerPage, filteredItems.length)
            }}</span>
            of
            <span class="font-medium">{{ filteredItems.length }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-sm text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <span class="sr-only">Previous</span>
              <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
            </button>
            <!-- Dynamic Page Numbers -->
            <template v-for="page in paginationRange" :key="page">
              <button
                @click="setPage(page)"
                :aria-current="page === currentPage ? 'page' : undefined"
                :class="[
                  'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300',
                  page === currentPage
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-900 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
            </template>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-sm text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <span class="sr-only">Next</span>
              <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, defineProps, watch } from 'vue'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/20/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

const props = defineProps({
  items: Array,
  columns: Array
})

const visibleColumns = computed(() => {
  return props.columns.filter((column) => column.visible)
})

const searchQuery = ref('')

const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) return props.items
  return props.items.filter((item) =>
    props.columns.some((column) => {
      const itemValue = String(item[column.key]).toLowerCase()
      return itemValue.includes(searchQuery.value.toLowerCase())
    })
  )
})

const emit = defineEmits(['delete-item', 'delete-selected', 'edit-item'])

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage.value))

// Sorted and paginated items
const sortedItems = computed(() => {
  if (!sortColumn.value) return filteredItems.value
  return [...filteredItems.value].sort((a, b) => {
    const valueA = a[sortColumn.value]
    const valueB = b[sortColumn.value]
    return (valueA < valueB ? -1 : 1) * (sortOrder.value === 'asc' ? 1 : -1)
  })
})
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedItems.value.slice(start, end)
})

// Sorting state
const sortColumn = ref(null)
const sortOrder = ref('asc')

// Selection state
const selectedPeople = ref([])
const indeterminate = computed(
  () => selectedPeople.value.length > 0 && selectedPeople.value.length < props.items.length
)

const toggleSelectAll = (event) => {
  if (event.target.checked) {
    // Select all filtered items, not just those on the current page
    selectedPeople.value = filteredItems.value.map((item) => item.id)
  } else {
    selectedPeople.value = []
  }
}

function sortData(column) {
  if (sortColumn.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortOrder.value = 'asc'
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function setPage(page) {
  currentPage.value = page
}

const paginationRange = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i)
  }
  return pages
})

// Function to handle CSV export of selected items
function exportToCSV() {
  // Ensure CSV export uses only selected items that match the current filter
  const selectedItems = filteredItems.value.filter((item) => selectedPeople.value.includes(item.id))
  if (selectedItems.length === 0) {
    alert('No items selected for export.')
    return
  }
  const headers = props.columns.map((col) => col.label).join(',')
  const rows = selectedItems
    .map((item) =>
      props.columns.map((col) => `"${String(item[col.key]).replace(/"/g, '""')}"`).join(',')
    )
    .join('\n')

  const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(headers + '\n' + rows)}`
  const link = document.createElement('a')
  link.href = csvContent
  link.download = 'export.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function deleteItem(item) {
  emit('delete-item', item.id)
}

function deleteSelected() {
  emit('delete-selected', selectedPeople.value)
  selectedPeople.value = []
}

function editItem(item) {
  emit('edit-item', item)
}
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
</style>
