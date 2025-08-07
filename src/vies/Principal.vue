<template>
  <nav class="bg-gray-800 p-4 text-white flex gap-4">
    <router-link to="/">Inicio</router-link>
  </nav>

  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow flex items-center">
          <Package class="w-6 h-6 text-blue-500 mr-3" />
          <div>
            <p class="text-sm text-gray-500">Total productos</p>
            <p class="text-2xl font-semibold text-gray-900">{{ totalProducts }}</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow flex items-center">
          <Search class="w-6 h-6 text-green-500 mr-3" />
          <div>
            <p class="text-sm text-gray-500">Categorías únicas</p>
            <p class="text-2xl font-semibold text-gray-900">{{ uniqueCategories }}</p>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg shadow flex items-center">
          <DollarSign class="w-6 h-6 text-yellow-500 mr-3" />
          <div>
            <p class="text-sm text-gray-500">Precio promedio USD</p>
            <p class="text-2xl font-semibold text-gray-900">
              {{ formatPrice(avgPriceUSD, 'USD') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Filtro: Categoría -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              id="category"
              v-model="selectedCategory"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ formatCategory(category) }}
              </option>
            </select>
          </div>

          <!-- Filtro: Precios -->
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
              Rango de precios
            </label>
            <select
              id="price"
              v-model="sortBy"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="title">Todos los precios</option>
              <option value="price-0-25">Precio: $0 - $25</option>
              <option value="price-25-50">Precio: $25 - $50</option>
              <option value="price-50-100">Precio: $50 - $100</option>
              <option value="price-100-200">Precio: $100 - $200</option>
              <option value="price-200-plus">Precio: $200+</option>
            </select>
          </div>

          <!-- Botón de acción -->
          <div class="flex items-end">
            <button
              @click="clearFilters"
              class="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      <!-- Exchange Rate Info -->
      <div
        v-if="exchangeRate !== null"
        class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
      >
        <div class="flex items-center">
          <DollarSign class="w-5 h-5 text-green-600 mr-2" />
          <span class="text-sm text-green-800">
            Tasa de cambio BCV:
            <strong>{{ formatPrice(exchangeRate, 'VES') }}</strong> por USD
          </span>
        </div>
      </div>

      <!-- Estado de Carga -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Cargando productos...</span>
      </div>

      <!-- Estado de error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-red-800 mb-2">Error al cargar datos</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="fetchData"
          class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>

      <!-- Products Grid -->
      <div v-else>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8"
        >
          <ProductCard
            v-for="product in paginatedProducts"
            :key="product.id"
            :product="product"
            :exchange-rate="exchangeRate"
          />
        </div>

        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="text-center py-12">
          <Package class="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-600 mb-2">
            No se encontraron productos
          </h3>
          <p class="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="filteredProducts.length > 0"
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="filteredProducts.length"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Search, DollarSign, AlertCircle, Package } from 'lucide-vue-next'
import ProductCard from '../components/ProductCard.vue'
import Pagination from '../components/Pagination.vue'
import axios from 'axios'

// reactive state
const products = ref([])
const exchangeRate = ref(null)
const loading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const selectedCategory = ref('')
const sortBy = ref('title')

// clear filters
const clearFilters = () => {
  selectedCategory.value = ''
  sortBy.value = 'title'
}

// computed collections
const categories = computed(() => {
  return [...new Set(products.value.map((p) => p.category))]
})
const filteredProducts = computed(() => {
  let filtered = products.value.slice()

  // filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter((p) => p.category === selectedCategory.value)
  }

  // filter & sort by price-range
  switch (sortBy.value) {
    case 'price-0-25':
      filtered = filtered.filter((p) => p.price <= 25)
      break
    case 'price-25-50':
      filtered = filtered.filter((p) => p.price > 25 && p.price <= 50)
      break
    case 'price-50-100':
      filtered = filtered.filter((p) => p.price > 50 && p.price <= 100)
      break
    case 'price-100-200':
      filtered = filtered.filter((p) => p.price > 100 && p.price <= 200)
      break
    case 'price-200-plus':
      filtered = filtered.filter((p) => p.price > 200)
      break
    default:
      // title or full list – no extra filter
      break
  }

  // apply sorting for title or default
  if (sortBy.value === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortBy.value === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / 5))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * 5
  return filteredProducts.value.slice(start, start + 5)
})

// statistics
const totalProducts = computed(() => filteredProducts.value.length)
const uniqueCategories = computed(
  () => new Set(filteredProducts.value.map((p) => p.category)).size
)
const avgPriceUSD = computed(() => {
  if (filteredProducts.value.length === 0) return 0
  const sum = filteredProducts.value.reduce((acc, p) => acc + p.price, 0)
  return sum / filteredProducts.value.length
})

// format helpers
const formatPrice = (value, currency = 'USD') => {
  if (currency === 'VES' && exchangeRate.value) {
    const ves = value * exchangeRate.value
    return new Intl.NumberFormat('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(ves) + ' Bs'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}
const formatCategory = (cat) =>
  cat
    .split(' ')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')

// API calls
const fetchProducts = async () => {
  const res = await axios.get('https://fakestoreapi.com/products')
  if (res.status !== 200) throw new Error('Error al cargar productos')
  products.value = res.data
}

const fetchExchangeRate = async () => {
  const res = await axios.get('https://pydolarve.org/api/v1/dollar?page=bcv')
  if (res.status !== 200) throw new Error('Error al cargar tasa')
  // extraer primer valor de la respuesta
  console.log(res.data?.monitors.usd.price);
  
  const rate = res.data?.monitors?.usd?.price
  if (!rate) throw new Error('Tasa no encontrada')
  exchangeRate.value = parseFloat(rate)
}

const fetchData = async () => {
  loading.value = true
  error.value = null
  try {
    await Promise.all([fetchProducts(), fetchExchangeRate()])
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// reset page on filter change
watch([selectedCategory, sortBy], () => {
  currentPage.value = 1
})

// on mount
onMounted(fetchData)
</script>

<style scoped>
@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
