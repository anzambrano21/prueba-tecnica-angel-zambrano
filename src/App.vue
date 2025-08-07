<script setup>

</script>

<!-- src/App.vue -->
<template>
  <div>
    <nav class="bg-gray-800 p-4 text-white flex gap-4">
      <router-link to="/">Inicio</router-link>
      <router-link to="/about">Acerca</router-link>
    </nav>
    <router-view />
  </div>
</template>


<style scoped>

</style>
