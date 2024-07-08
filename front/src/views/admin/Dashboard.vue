<template>
    <div>
      <h2 class="text-2xl font-semibold mb-6">Tableau de bord</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-4">Card Title 1</h3>
          <p class="text-gray-700">Some interesting content about this card.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-4">Card Title 2</h3>
          <p class="text-gray-700">Some more interesting content about another card.</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-4">Card Title 3</h3>
          <p class="text-gray-700">Even more interesting content in this card.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Dashboard',
  }
  </script>
  