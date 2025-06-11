<template>
  <AuthLayout>
    <template #title>Iniciar Sesión</template>

    <v-form @submit.prevent="handleLogin" ref="formRef">
      <v-text-field
        v-model.trim="form.email"
        label="Correo electrónico"
        type="email"
        prepend-icon="mdi-email"
        :error-messages="errors.email"
        :rules="[rules.required, rules.email]"
        required
      />
      <v-text-field
        v-model.trim="form.password"
        label="Contraseña"
        type="password"
        prepend-icon="mdi-lock"
        :rules="[rules.required]"
        :error-messages="errors.password"
        required
      />
      <v-btn type="submit" color="primary" block :loading="loading">
        Entrar
      </v-btn>

        <!-- Enlace a registro -->
      <div class="text-center mt-4">
        <span>¿No tienes cuenta?</span>
        <RouterLink to="/register" class="text-primary font-weight-medium ms-1">
          Regístrate
        </RouterLink>
      </div>
    </v-form>

    <v-alert v-if="serverError" type="error" class="mt-4">
      {{ serverError }}
    </v-alert>
  </AuthLayout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuth } from '@/composables/useAuth'

const { login } = useAuth()

interface LoginForm {
  email: string
  password: string
}

interface LoginErrors {
  email: string[]
  password: string[]
}

const router = useRouter()


const form = ref<LoginForm>({ email: '', password: '' })
const errors = ref<LoginErrors>({ email: [], password: [] })
const loading = ref(false)
const serverError = ref<string | null>(null)
const formRef = ref()

const rules = {
  required: (v: string) => !!v || 'Este campo es obligatorio',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Correo inválido',
  min: (length: number) => (v: string) => v.length >= length || `Debe tener al menos ${length} caracteres`,
}

const handleLogin = async () => {
   const isValid = await formRef.value?.validate()
  if (!isValid) return

  loading.value = true
  errors.value = {
    email: [],
    password: [],
  }

  serverError.value = null

  try {
    await login(form.value)
    /* router.push('/dashboard') */
  } catch (err: any) {
    console.log(err)
    if (err.response?.status === 422) {
      errors.value = err.response.data.errors
    } else {
      serverError.value = 'Credenciales inválidas o error del servidor.'
    }
  } finally {
    loading.value = false
  }
}
</script>
