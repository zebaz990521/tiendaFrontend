<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { token, fetchUser } = useAuth()

onMounted(() => {
  if (token.value) {
    fetchUser().catch(() => {
      sessionStorage.removeItem('token')
    })
  }
})
</script>
