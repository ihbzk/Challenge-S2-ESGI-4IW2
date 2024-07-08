<template>
    <div>
      <h2 class="text-2xl font-semibold mb-6">Paramètres</h2>
      <form class="bg-white p-6 rounded-lg shadow">
        <div class="mb-4">
          <label for="site-name" class="block text-gray-700">Site Name</label>
          <input type="text" id="site-name" class="w-full px-4 py-2 border rounded-lg mt-2" placeholder="Enter site name">
        </div>
        <div class="mb-4">
          <label for="email" class="block text-gray-700">Admin Email</label>
          <input type="email" id="email" class="w-full px-4 py-2 border rounded-lg mt-2" placeholder="Enter admin email">
        </div>
        <div class="mb-4">
          <label for="password" class="block text-gray-700">New Password</label>
          <input type="password" id="password" class="w-full px-4 py-2 border rounded-lg mt-2" placeholder="Enter new password">
        </div>
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg">Save Settings</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Settings',
  }
  </script>
  