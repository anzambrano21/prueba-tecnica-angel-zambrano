// funciones comunes para no repetir la misma funcion en diferentes archivos

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