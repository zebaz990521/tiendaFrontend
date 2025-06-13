<template>
  <AuthLayout>
    <template #title>Registro</template>

    <v-form @submit.prevent="handleRegister">
      <v-text-field
        v-model="form.first_name"
        label="Nombre"
        :error-messages="errors.first_name"
         @input="validateField('first_name')"
        required
      />
      <v-text-field
        v-model="form.last_name"
        label="Apellido"
        required
        @input="validateField('last_name')"
        :error-messages="errors.last_name"
      />
      <v-text-field
        v-model="form.email"
        label="Correo"
        type="email"
        @input="validateField('email')"
        required
        :error-messages="errors.email"
      />
      <v-text-field
        v-model="form.address"
        label="Direccion"
        type="text"
        @input="validateField('address')"
        required
        :error-messages="errors.address"
      />
       <v-text-field
        v-model="form.phone"
        label="Telefono o Celular"
        type="tel"
        @input="validateField('phone')"
        required
        :error-messages="errors.phone"
      />
      <v-text-field
        v-model="form.password"
        label="Contraseña"
        type="password"
         @input="validateField('password')"
        required
        :error-messages="errors.password"
      />

      <v-text-field
        v-model="form.password_confirmation"
        label="Confirmar Contraseña"
        type="password"
        required
         @input="validateField('password_confirmation')"
        :error-messages="errors.password_confirmation"
      />

      <v-btn type="submit" color="success" block :loading="loading">Registrarse</v-btn>

      <div class="text-center mt-4">
        ¿Ya tienes una cuenta?
        <RouterLink to="/login" class="text-primary font-weight-medium ms-1">
          Inicia sesión
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
import type { ZodIssue } from 'zod'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuth } from '@/composables/useAuth'
import {
  registerSchema,
  registerBaseSchema,
  type RegisterSchema,
} from '@/schemas/registerSchema'

const { register } = useAuth()
const router = useRouter()

const form = ref<RegisterSchema>({
  first_name: '',
  last_name: '',
  email: '',
  address: '',
  phone: '',
  password: '',
  password_confirmation: ''
})

type RegisterErrors = Record<keyof RegisterSchema, string[]>

const errors = ref<RegisterErrors>({
  first_name: [],
  last_name: [],
  email: [],
  address: [],
  phone: [],
  password: [],
  password_confirmation: []
})

const loading = ref(false)
const serverError = ref<string | null>(null)

/**
 * Valida un campo específico usando Zod.
 */
const  validateField = (field: keyof RegisterSchema) =>  {
  errors.value[field] = []

  const fieldSchema = registerBaseSchema.shape[field]

  const result = fieldSchema.safeParse(form.value[field])

  if (!result.success) {
    errors.value[field] = result.error.issues.map((issue) => issue.message)
  }

  // Validar coincidencia de contraseñas también si se afecta password o confirmation
  if (field === 'password' || field === 'password_confirmation') {
    if (form.value.password !== form.value.password_confirmation) {
      errors.value.password_confirmation = ['Las contraseñas no coinciden']
    } else if (errors.value.password_confirmation[0] === 'Las contraseñas no coinciden') {
      errors.value.password_confirmation = []
    }
  }
}

const handleRegister = async () => {
  loading.value = true
  serverError.value = null

  // Reset errores
  Object.keys(errors.value).forEach((key) => {
    errors.value[key as keyof RegisterSchema] = []
  })

  const result = registerSchema.safeParse(form.value)

  if (!result.success) {
    for (const issue of result.error.issues as ZodIssue[]) {
      const field = issue.path[0] as keyof RegisterErrors
      errors.value[field].push(issue.message)
    }
    loading.value = false
    return
  }

  try {
    await register(form.value)
    router.push('/admin/dashboard')
  } catch (err: any) {
    if (err.response?.status === 422) {
      errors.value = err.response.data.errors
    } else {
      serverError.value = 'Ocurrió un error al registrar.'
    }
  } finally {
    loading.value = false
  }
}
</script>
