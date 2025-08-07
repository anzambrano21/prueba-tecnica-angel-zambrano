// funciones comunes para no repetir la misma funcion en diferentes archivos
import { ref, watch } from 'vue';
//Funcion para el formato para pasar del formato USD a VE (1.000,00 en ves de 1,000.00)
export const formatPrice = (price, currency = 'USD', exchangeRate = 1) => {
    if (currency === 'VES' && exchangeRate) {
      const vesPrice = price * exchangeRate;
      return new Intl.NumberFormat('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(vesPrice) + ' Bs';
    }
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  
  export const formatCategory = (category) => {
    return category.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

// src/composables/useLocalStorage.js


export function useLocalStorage(key, defaultValue) {
  const data = ref(defaultValue);
  
  // Intentar cargar datos de LocalStorage al inicio
  const storedValue = localStorage.getItem(key);
  if (storedValue) {
    data.value = JSON.parse(storedValue);
  }

  // Guardar datos en LocalStorage cada vez que cambien
  watch(data, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  }, { deep: true });

  return data;
}