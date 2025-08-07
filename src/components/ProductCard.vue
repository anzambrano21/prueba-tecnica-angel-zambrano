<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
    <div class="aspect-square bg-gray-100 relative overflow-hidden">
      <div v-if="!imageLoaded && !imageError" class="absolute inset-0 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
      </div>
      <img
        v-if="!imageError"
        :src="product.image"
        :alt="product.title"
        class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        :class="{ 'opacity-0': !imageLoaded }"
        loading="lazy"
        @load="imageLoaded = true"
        @error="imageError = true"
      />
      <div v-if="imageError" class="absolute inset-0 flex items-center justify-center bg-gray-100">
        <Package class="w-12 h-12 text-gray-400" />
      </div>
      <div class="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-semibold text-gray-600 shadow-sm">
        ⭐ {{ product.rating.rate }}
      </div>
    </div>
    <div class="p-4">
      <div class="mb-2">
        <span class="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
          {{ formatCategory(product.category) }}
        </span>
      </div>
      <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight">
        {{ product.title }}
      </h3>
      <div class="space-y-1">
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold text-blue-600">{{ formatPrice(product.price, 'USD') }}</span>
        </div>
        <div class="text-sm text-gray-600">
          {{ formatPrice(product.price, 'VES',exchangeRate) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
//importaciones
import { ref } from 'vue'
import { Package } from 'lucide-vue-next'
import { formatPrice,formatCategory} from '../assets/funciones'

//Propiedades
const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  exchangeRate: {
    type: Number,
    default: null
  }
})

const imageLoaded = ref(false)
const imageError = ref(false)


</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
