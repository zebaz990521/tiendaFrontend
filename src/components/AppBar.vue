<template>
  <v-app-bar :elevation="2">
  <template v-slot:prepend>
    <v-app-bar-nav-icon v-if="$vuetify.display.mobile" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
  </template>

  <v-app-bar-title>Panel Administrativo</v-app-bar-title>


  <template v-slot:append>
      <Avatar />
  </template>


</v-app-bar>

  <v-navigation-drawer
     v-model="drawer"
     v-if="$vuetify.display.mobile"
    :location="$vuetify.display.mobile ? 'left' : undefined"
    temporary
  >
    <v-list density="compact" nav>
      <v-list-item  prepend-icon="fa-solid fa-gauge" title="Panel" to="/admin/dashboard" ></v-list-item>
      <v-list-item  prepend-icon="fa-solid fa-tags" title="Categorias" to="/admin/categories" ></v-list-item>
      <v-list-item  prepend-icon="fa-solid fa-tags" title="Productos" to="/admin/products" ></v-list-item>
      <v-list-item   title="Cerrar Sesión" @click="logout" />
    </v-list>
  </v-navigation-drawer>
</template>


<script setup lang="ts">

     import { ref, watch } from 'vue'
     import { useAuth } from '@/composables/useAuth'

    const { logout } = useAuth()


    const drawer = ref(false)
    const group = ref(null)

  watch(group, () => {
    drawer.value = false
  })


</script>
