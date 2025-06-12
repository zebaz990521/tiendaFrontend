<template>
  <AuthLayout>
    <template #title>Registro</template>

    <v-form @submit.prevent="handleRegister" ref="formRef">
      <v-text-field
        v-model.trim="form.first_name"
        label="Nombre"
        :rules="[rules.required]"
        :error-messages="errors.first_name"
        required
      />
      <v-text-field
        v-model.trim="form.last_name"
        label="Apellido"
        :rules="[rules.required]"
        required
        :error-messages="errors.last_name"
      />
      <v-text-field
        v-model.trim="form.email"
        label="Correo"
        type="email"
        :rules="[rules.required, rules.email]"
        required
        :error-messages="errors.email"
      />
      <v-text-field
        v-model.trim="form.password"
        label="Contraseña"
        type="password"
        :rules="[rules.required, rules.min(6)]"
        required
        :error-messages="errors.password"
      />

      <v-text-field
        v-model.trim="form.password_confirmation"
        label="Confirmar Contraseña"
        type="password"
        :rules="[rules.required, rules.min(6)]"
        required
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
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuth } from '@/composables/useAuth'
import type { RegisterErrors, RegisterForm } from '@/types';

const { register } = useAuth()
const router = useRouter()

const form = ref<RegisterForm>({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const errors = ref<RegisterErrors>({
  first_name: [],
  last_name: [],
  email: [],
  password: [],
  password_confirmation: []
})

const loading = ref(false)
const serverError = ref<string | null>(null)
const formRef = ref()

const rules = {
  required: (v: string) => !!v || 'Este campo es obligatorio',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Correo inválido',
  min: (length: number) => (v: string) => v.length >= length || `Debe tener al menos ${length} caracteres`,
}

const handleRegister = async () => {
  const isValid = await formRef.value?.validate()
  if (!isValid) return

  loading.value = true
  errors.value = {
    first_name: [],
    last_name: [],
    email: [],
    password: [],
    password_confirmation: []
  }
  serverError.value = null

  try {
     await register(form.value)
     router.push('/dashboard') 
  } catch (err: any) {
    if (err.response?.status === 422) {

      console.log(err)
      errors.value = err.response.data.errors
    } else {
      serverError.value = 'Ocurrió un error al registrar.'
    }
  } finally {
    loading.value = false
  }
}
</script>
