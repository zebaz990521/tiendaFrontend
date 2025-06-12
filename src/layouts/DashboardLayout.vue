<template>
  <v-app>
    <Sidebar />
    <v-main class="ma-4">
      <AppBar />
      <slot />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import AppBar from '@/components/AppBar.vue';
import Sidebar from '@/components/Sidebar.vue'

</script>
