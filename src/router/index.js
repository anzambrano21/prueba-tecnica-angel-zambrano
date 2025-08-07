// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import AboutView from '../vies/Principal.vue'

const routes = [
  { path: '/', name: 'Home', component: AboutView },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
