<template>
  <v-navigation-drawer
    expand-on-hover
    rail
  >
    <v-list nav>
      <v-list-item  prepend-icon="fa-solid fa-gauge" title="Panel" to="/admin/dashboard" />
      <v-list-item  prepend-icon="fa-solid fa-tags" title="Categorias" to="/admin/categories" />
      <v-list-item  prepend-icon="fa-solid fa-tags" title="Productos" to="/admin/products" />
      <v-list-item title="Cerrar Sesión" @click="logout" />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
const { logout } = useAuth()
</script>
