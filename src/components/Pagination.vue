<template>
    <div class="flex flex-col sm:flex-row items-center justify-between bg-white px-6 py-4 rounded-lg shadow-sm">
      <div class="text-sm text-gray-600 mb-4 sm:mb-0">
        Mostrando {{ (currentPage - 1) * 5 + 1 }} - {{ Math.min(currentPage * 5, totalItems) }} de {{ totalItems }} productos
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        
        <button
          v-if="visiblePages[0] > 1"
          @click="goToPage(1)"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          1
        </button>
        
        <span v-if="visiblePages[0] > 2" class="px-2 text-gray-500">...</span>
        
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-md',
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
          ]"
        >
          {{ page }}
        </button>
        
        <span v-if="visiblePages[visiblePages.length - 1] < totalPages - 1" class="px-2 text-gray-500">...</span>
        
        <button
          v-if="visiblePages[visiblePages.length - 1] < totalPages"
          @click="goToPage(totalPages)"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {{ totalPages }}
        </button>
        
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    }
  })
  
  const emit = defineEmits(['page-change'])
  
  const goToPage = (page) => {
    if (page >= 1 && page <= props.totalPages) {
      emit('page-change', page)
    }
  }
  
  const visiblePages = computed(() => {
    const pages = []
    const start = Math.max(1, props.currentPage - 2)
    const end = Math.min(props.totalPages, props.currentPage + 2)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  })
  </script>
  