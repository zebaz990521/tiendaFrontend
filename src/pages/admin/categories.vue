<!-- @route-meta requiresAuth=true -->
<template>
  <DashboardLayout>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Gestión de Categorías</span>
        <v-btn color="primary" @click="openForm()">Nueva Categoría</v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="categories"
        :loading="loading"
        class="elevation-1"
      >
        <template #item.actions="{ item }">
          <v-btn icon @click="openForm(item)">
            <v-icon>mdi:mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="confirmDelete(item)">
            <v-icon color="red">mdi:mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Diálogo para crear o editar -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ form.id ? 'Editar' : 'Nueva' }} Categoría</span>
        </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="saveCategory">
            <v-text-field
              v-model="form.name"
              label="Nombre"
              :error-messages="formErrors.name"
              @input="formErrors.name = ''"
              required
            />
            <v-textarea
              v-model="form.description"
              label="Descripción"
              rows="3"
              :error-messages="formErrors.description"
              @input="formErrors.description = ''"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveCategory">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación para eliminar -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">¿Eliminar categoría?</v-card-title>
        <v-card-text>
          Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="red" @click="deleteCategory">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar de notificación -->
    <v-snackbar
  v-model="snackbar.show"
  :color="snackbar.color"
  timeout="3000"
  rounded="pill"
>
  <template>
    <v-icon v-if="!snackbar.loading" class="me-2" icon="{{ snackbar.icon }}"/>
    <v-progress-circular
      v-else
      indeterminate
      size="20"
      width="2"
      color="white"
      class="me-2"
    />
  </template>
  {{ snackbar.message }}
</v-snackbar>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { categorySchema } from '@/schemas/categorySchema'
import type { Category, Header } from '@/types'
import clientAxios from '@/plugins/clientAxios'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

// Estado
const categories = ref<Category[]>([])
const loading = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const selectedToDelete = ref<Category | null>(null)

const form = ref<Partial<Category>>({
  name: '',
  description: ''
})
const formErrors = ref<{ [key: string]: string }>({})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
  icon: 'mdi:mdi-check-circle', // icono por defecto
  loading: false            // spinner por defecto apagado
})

const headers: Header[] = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'name' },
  { title: 'Descripción', key: 'description' },
  { title: 'Acciones', key: 'actions', sortable: false }
]

const fetchCategories = async (): Promise<void> => {
  loading.value = true
  try {
    const { data } = await clientAxios.get<Category[]>('/categories')
    categories.value = data
  } catch (err) {
    showSnackbar('Error al cargar categorías', 'error')
    console.error(err)
  } finally {
    loading.value = false
  }
}

const openForm = (item?: Category) => {
  form.value = item ? { ...item } : { name: '', description: '' }
  formErrors.value = {}
  dialog.value = true
}

const saveCategory = async () => {
  formErrors.value = {}
  const result = categorySchema.safeParse(form.value)

  if (!result.success) {
    result.error.errors.forEach(err => {
      if (err.path[0]) {
        formErrors.value[err.path[0]] = err.message
      }
    })
    return
  }

  try {
    if (form.value.id) {
      await clientAxios.put(`/categories/${form.value.id}`, form.value)
      showSnackbar('Categoría actualizada correctamente', 'success')
    } else {
      await clientAxios.post('/categories', form.value)
      showSnackbar('Categoría creada correctamente', 'success')
    }
    dialog.value = false
    await fetchCategories()
  } catch (err: any) {
    if (err.response && err.response.status === 422) {
      const backendErrors = err.response.data.errors
      for (const field in backendErrors) {
        formErrors.value[field] = backendErrors[field][0]
      }
    } else {
      showSnackbar('Error al guardar categoría', 'error')
      console.error(err)
    }
  }
}

const confirmDelete = (category: Category) => {
  selectedToDelete.value = category
  deleteDialog.value = true
}

const deleteCategory = async () => {
  if (!selectedToDelete.value) return
  try {
    await clientAxios.delete(`/categories/${selectedToDelete.value.id}`)
    showSnackbar('Categoría eliminada correctamente', 'success')
    await fetchCategories()
  } catch (err) {
    showSnackbar('Error al eliminar categoría', 'error')
    console.error(err)
  } finally {
    deleteDialog.value = false
    selectedToDelete.value = null
  }
}

const showSnackbar = (
  message: string,
  color: 'success' | 'error' | 'info' | 'warning' = 'success',
  options: { loading?: boolean } = {}
) => {
  const icons: Record<string, string> = {
    success: 'mdi:mdi-check-circle',
    error: 'mdi:mdi-alert-circle',
    info: 'mdi:mdi-information',
    warning: 'mdi:mdi-alert'
  }

  snackbar.value.message = message
  snackbar.value.color = color
  snackbar.value.icon = icons[color] || 'mdi:mdi-information'
  snackbar.value.loading = options.loading || false
  snackbar.value.show = true
}

onMounted(() => {
  fetchCategories()
})
</script>


