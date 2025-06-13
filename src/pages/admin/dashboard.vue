// @route-meta requiresAuth=true
<template>
  <DashboardLayout>
    <v-card>
      <v-card-title>Bienvenido al Dashboard</v-card-title>
      <v-card-text>Este es un panel protegido por autenticación JWT.</v-card-text>
    </v-card>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '@/layouts/DashboardLayout.vue'
</script>
