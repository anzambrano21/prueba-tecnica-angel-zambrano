<template> 
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-lg flex items-center">
          <Package class="w-6 h-6 text-blue-500 mr-3" />
          <div>
            <p class="text-sm text-gray-500">Total productos</p>
            <p class="text-lg font-semibold text-gray-900">{{ totalProducts }}</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-lg flex items-center">
          <Search class="w-6 h-6 text-green-500 mr-3" />
          <div>
            <p class="text-sm text-gray-500">Categorías únicas</p>
            <p class="text-lg font-semibold text-gray-900">{{ uniqueCategories }}</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-lg flex items-center">
          <DollarSign class="w-6 h-6 text-yellow-500 mr-3" />
          <div>
            <p class="text-sm text-gray-500">Precio promedio USD</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ formatPrice(avgPriceUSD, 'USD',exchangeRate) }}
            </p>
          </div>
        </div>
      </div>
</template>
<script setup>
  import {formatPrice} from '../assets/funciones'
  import { Search, DollarSign, Package } from 'lucide-vue-next'
  const props = defineProps({
    avgPriceUSD: {
      type: Number,
      required: true
    },
    exchangeRate: {
      type: Number,
      required: true
    },
    uniqueCategories: {
      type: Number,
      required: true
    },
    totalProducts: {
      type: Number,
      required: true
    }
  })
</script>
