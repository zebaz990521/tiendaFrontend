<template>
  <AuthLayout>
    <template #title>Iniciar Sesión</template>

    <v-form @submit.prevent="handleLogin">
      <v-text-field
        v-model="form.email"
        label="Correo electrónico"
        type="email"
        prepend-icon="mdi:mdi-email"
        :error-messages="errors.email"
        @input="validateField('email')"
        required
      />
      <v-text-field
        v-model="form.password"
        label="Contraseña"
        type="password"
        prepend-icon="mdi:mdi-lock"
        :error-messages="errors.password"
        @input="validateField('password')"
        required
      />

      <v-btn type="submit" color="primary" block :loading="loading">
        Entrar
      </v-btn>

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
import { useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuth } from '@/composables/useAuth'
import { loginSchema, type LoginSchema } from '@/schemas/loginSchema'
import type { ZodIssue } from 'zod'

const { login } = useAuth()
const router = useRouter()

const form = ref<LoginSchema>({
  email: '',
  password: '',
})

type LoginErrors = Record<keyof LoginSchema, string[]>

const errors = ref<LoginErrors>({
  email: [],
  password: [],
})

const loading = ref(false)
const serverError = ref<string | null>(null)

/**
 * Valida un solo campo con Zod
 */
const validateField = (field: keyof LoginSchema) => {
  errors.value[field] = []

  const fieldSchema = loginSchema.shape[field]
  const result = fieldSchema.safeParse(form.value[field])

  if (!result.success) {
    errors.value[field] = result.error.issues.map((issue) => issue.message)
  }
}

/**
 * Valida y envía el formulario
 */
const handleLogin = async () => {
  loading.value = true
  errors.value = {
    email: [],
    password: [],
  }
  serverError.value = null

  const result = loginSchema.safeParse(form.value)

  if (!result.success) {
    for (const issue of result.error.issues as ZodIssue[]) {
      const field = issue.path[0] as keyof LoginErrors
      errors.value[field].push(issue.message)
    }
    loading.value = false
    return
  }

  try {
    await login(form.value)
    router.push('/admin/dashboard')
  } catch (err: any) {
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
