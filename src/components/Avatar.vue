<template>
      <v-menu min-width="200px">
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            v-bind="props"
          >
            <v-avatar
              color="brown"
              size="large"
            >
              <span class="text-h5">{{ initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar
                color="brown"
                size="x-large"
              >
                <span class="text-h5">{{ initials }}</span>
              </v-avatar>
              <h3>{{ fullName }}</h3>
              <p class="text-caption mt-1">
                {{ email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn
                variant="text"
                rounded
                prepend-icon="fa-solid fa-circle-user"
              >
                Editar Cuenta
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn
                variant="text"
                rounded
                @click="logout"
                prepend-icon="fa-solid fa-right-from-bracket"
              >
                Cerrar Session
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>

</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { computed } from 'vue'

const { logout, user } = useAuth()




const initials = computed(() => {
  if (!user.value) return ''
  const first = user.value.first_name?.charAt(0) || ''
  const last = user.value.last_name?.charAt(0) || ''
  return `${first}${last}`.toUpperCase()
})

const fullName = computed(() => {
  if (!user.value) return ''
  return `${user.value.first_name} ${user.value.last_name}`
})

const email = computed(() => user.value?.email || '')

</script>
