<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Catálogo de Productos</h1>
        <p class="text-gray-600">Descubre nuestra selección de productos</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar productos</label>
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Buscar por título..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select
              v-model="selectedCategory"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ formatCategory(category) }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
            <select
              v-model="sortBy"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="title">Título A-Z</option>
              
              <option value="price-0-25">Precio: $0 - $25</option>
              <option value="price-25-50">Precio: $25 - $50</option>
              <option value="price-50-100">Precio: $50 - $100</option>
              <option value="price-100-200">Precio: $100 - $200</option>
              <option value="price-200-plus">Precio: $200+</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Exchange Rate Info -->
      <div v-if="exchangeRate" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <DollarSign class="w-5 h-5 text-green-600 mr-2" />
          <span class="text-sm text-green-800">
            Tasa de cambio BCV: <strong>{{ formatPrice(exchangeRate, 'VES') }}</strong> por USD
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Cargando productos...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-red-800 mb-2">Error al cargar productos</h3>
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
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
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
          <h3 class="text-lg font-semibold text-gray-600 mb-2">No se encontraron productos</h3>
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

// Reactive data
const products = ref([])
const exchangeRate = ref(null)
const loading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const searchTerm = ref('')
const selectedCategory = ref('')
const sortBy = ref('title')

// Computed properties
const categories = computed(() => {
  return [...new Set(products.value.map(product => product.category))]
})

const filteredProducts = computed(() => {
  let filtered = products.value

  // Filter by search term
  if (searchTerm.value) {
    filtered = filtered.filter(product =>
      product.title.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.category === selectedCategory.value)
  }

  // Sort products
  switch (sortBy.value) {
    case 'title':
      filtered.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      filtered.sort((a, b) => b.rating.rate - a.rating.rate)
      break
    case 'price-0-25':
      filtered = filtered.filter(product => product.price >= 0 && product.price <= 25)
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-25-50':
      filtered = filtered.filter(product => product.price > 25 && product.price <= 50)
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-50-100':
      filtered = filtered.filter(product => product.price > 50 && product.price <= 100)
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-100-200':
      filtered = filtered.filter(product => product.price > 100 && product.price <= 200)
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-200-plus':
      filtered = filtered.filter(product => product.price > 200)
      filtered.sort((a, b) => a.price - b.price)
      break
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / 5)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * 5
  const end = start + 5
  return filteredProducts.value.slice(start, end)
})

// Methods
const formatPrice = (price, currency = 'USD') => {
  if (currency === 'VES' && exchangeRate.value) {
    const vesPrice = price * exchangeRate.value
    return new Intl.NumberFormat('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(vesPrice) + ' Bs'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

const formatCategory = (category) => {
  return category.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

// 🔥 CONSULTA API #1: PRODUCTOS
// Función que consume la API de FakeStore para obtener los productos
const fetchProducts = async () => {
  try {
    console.log('🛒 Consultando API de productos...')
    const response = await fetch('https://fakestoreapi.com/products')
    if (!response.ok) throw new Error('Error al cargar productos')
    const data = await response.json()
    console.log('✅ Productos obtenidos:', data.length)
    products.value = data
  } catch (err) {
    console.error('❌ Error en API de productos:', err)
    throw new Error('No se pudieron cargar los productos: ' + err.message)
  }
}

// 🔥 CONSULTA API #2: TASA DE CAMBIO
// Función que consume la API de pyDolarVenezuela para obtener la tasa BCV
const fetchExchangeRate = async () => {
  try {
    console.log('💱 Consultando API de tasa de cambio...')
    const response = await fetch('https://pydolarve.org/api/v1/dollar?page=bcv')
    if (!response.ok) throw new Error('Error al cargar tasa de cambio')
    const data = await response.json()
    exchangeRate.value = data.monitors.usd.price
    console.log('✅ Tasa de cambio obtenida:', exchangeRate.value, 'Bs por USD')
  } catch (err) {
    console.warn('⚠️ Error en API de tasa de cambio:', err.message)
    exchangeRate.value = 36.5 // Fallback rate
    console.log('🔄 Usando tasa de respaldo:', exchangeRate.value)
  }
}

// 🔥 FUNCIÓN PRINCIPAL QUE EJECUTA AMBAS CONSULTAS
// Esta función coordina las llamadas a ambas APIs
const fetchData = async () => {
  loading.value = true
  error.value = null
  
  try {
    console.log('🚀 Iniciando consultas a las APIs...')
    // Ejecuta ambas consultas en paralelo para mejor rendimiento
    await Promise.all([fetchProducts(), fetchExchangeRate()])
    console.log('🎉 Todas las APIs consultadas exitosamente')
  } catch (err) {
    console.error('💥 Error general:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watchers
watch([searchTerm, selectedCategory, sortBy], () => {
  currentPage.value = 1
})

// 🔥 PUNTO DE ENTRADA - AQUÍ SE EJECUTAN LAS CONSULTAS
// Cuando el componente se monta, se ejecutan las consultas a las APIs
onMounted(() => {
  console.log('🎬 Componente montado, iniciando consultas...')
  fetchData()
})
</script>

<style scoped>
@media (max-width: 640px) {
  .grid-cols-1 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
