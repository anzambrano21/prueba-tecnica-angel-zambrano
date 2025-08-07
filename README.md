# Prueba Técnica de Tablero de Control (Ángel Zambrano)

Este proyecto es una prueba técnica para un tablero de control, desarrollado con **Vue 3** y **Vite**. La aplicación utiliza el **Composition API** con `<script setup>` para una arquitectura moderna y modular.

---

## Requisitos Previos

Para ejecutar este proyecto, necesitas tener **Node.js** instalado en tu sistema. Se recomienda usar la versión LTS (Long-Term Support) para mayor estabilidad.

* **Node.js**: Puedes descargarlo e instalarlo desde la [página oficial de Node.js](https://nodejs.org/).
* **npm**: El gestor de paquetes de Node.js, que se instala automáticamente con Node.

---

## Instalación y Uso

Sigue estos pasos para poner el proyecto en marcha en tu entorno local:

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/anzambrano21/prueba-tecnica-angel-zambrano.git](https://github.com/anzambrano21/prueba-tecnica-angel-zambrano.git)
    ```

2.  **Navega al directorio del proyecto:**
    ```bash
    cd prueba-tecnica-angel-zambrano
    ```

3.  **Instala las dependencias:**
    ```bash
    npm install
    ```

4.  **Ejecuta el proyecto en modo de desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación se iniciará en `http://localhost:5173/` (o un puerto similar) y se actualizará automáticamente con cada cambio que realices en el código.

---

## Decisiones de Desarrollo

A continuación, se explican algunas de las decisiones clave tomadas durante el desarrollo de este proyecto:

1.  **Componentización**: El proyecto se ha dividido en **componentes reutilizables** (`.vue` Single-File Components). Este enfoque mejora la modularidad, la organización del código y facilita la reutilización de la lógica y la interfaz en otros proyectos similares.
2.  **Centralización de Funciones**: Se creó un archivo llamado `funciones.js` para agrupar y exportar funciones reutilizables (como las de formato de precios y texto). Esto mejora la legibilidad y evita la duplicación de código en múltiples componentes.
3.  **Uso de la Tasa de Cambio del DolarToday**: Para las conversiones de precios, se utilizó la tasa de cambio de DolarToday. Esta decisión se basó en su popularidad y en su dinámica, que se asemeja a la tasa oficial del Banco Central de Venezuela (BCV), permitiendo una simulación realista de los precios en moneda local.

---

