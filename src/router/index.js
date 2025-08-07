// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import AboutView from '../vies/Principal.vue'
//Definicion de las rutas del proyecto vue con historial
const routes = [
  { path: '/', name: 'Home', component: AboutView },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
