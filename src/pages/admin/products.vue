// @route-meta requiresAuth=true
<template>
  <DashboardLayout>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>Gestión de Productos</span>
        <v-btn color="primary" @click="openForm()">Nuevo Producto</v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="products"
        :loading="loading"
        class="elevation-1"
      >
        <template #item.image="{ item }">
          <v-avatar size="50" v-if="item.image">
            <v-img :src="getImageUrl(item.image)" />
          </v-avatar>
        </template>

        <template #item.actions="{ item }">
          <v-btn icon @click="openForm(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="deleteProduct(item.id)">
            <v-icon color="red">mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Diálogo de formulario -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ form.id ? 'Editar' : 'Nuevo' }} Producto</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="formRef" @submit.prevent="saveProduct">
            <v-text-field v-model="form.name" label="Nombre" required />
            <v-textarea v-model="form.description" label="Descripción" />
            <v-text-field v-model.number="form.price" label="Precio" type="number" required />
            <v-text-field v-model.number="form.stock" label="Stock" type="number" required />
            <v-select
              v-model="form.category_id"
              :items="categories"
              item-title="name"
              item-value="id"
              label="Categoría"
              required
            />
            <v-file-input
              v-model="imageFile"
              label="Imagen"
              accept="image/*"
              prepend-icon="mdi-camera"
              show-size
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveProduct">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Product, Category} from '@/types'
import clientAxios from '@/plugins/clientAxios'
import DashboardLayout from '@/layouts/DashboardLayout.vue'



const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const dialog = ref(false)
const formRef = ref()
const imageFile = ref<File | null>(null)

const form = ref<Partial<Product>>({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category_id: undefined
})

const headers = [
  { title: 'Imagen', key: 'image' },
  { title: 'Nombre', key: 'name' },
  { title: 'Precio', key: 'price' },
  { title: 'Stock', key: 'stock' },
  { title: 'Categoría', key: 'category_id' },
  { title: 'Acciones', key: 'actions', sortable: false }
]

const fetchProducts = async () => {
  loading.value = true
  try {
    const { data } = await clientAxios.get('/products')
    products.value = data
  } catch (err) {
    console.error('Error al cargar productos', err)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const { data } = await clientAxios.get('/categories')
    categories.value = data
  } catch (err) {
    console.error('Error al cargar categorías', err)
  }
}

const openForm = (item?: Product) => {
  form.value = item
    ? { ...item }
    : {
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category_id: undefined
      }
  imageFile.value = null
  dialog.value = true
}

const saveProduct = async () => {
  try {
    const payload = new FormData()
    payload.append('name', form.value.name || '')
    payload.append('description', form.value.description || '')
    payload.append('price', String(form.value.price ?? 0))
    payload.append('stock', String(form.value.stock ?? 0))
    payload.append('category_id', String(form.value.category_id ?? ''))

    if (imageFile.value) {
      payload.append('image', imageFile.value)
    }

    if (form.value.id) {
      payload.append('_method', 'PUT')
      await clientAxios.post(`/products/${form.value.id}`, payload)
    } else {
      await clientAxios.post('/products', payload)
    }

    dialog.value = false
    await fetchProducts()
  } catch (err) {
    console.error('Error al guardar producto', err)
  }
}

const deleteProduct = async (id: number) => {
  if (!confirm('¿Estás seguro de eliminar este producto?')) return
  try {
    await clientAxios.delete(`/products/${id}`)
    await fetchProducts()
  } catch (err) {
    console.error('Error al eliminar producto', err)
  }
}

const getImageUrl = (imagePath: string) => {
  return `${import.meta.env.VITE_API_URL}/storage/${imagePath}`
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>
