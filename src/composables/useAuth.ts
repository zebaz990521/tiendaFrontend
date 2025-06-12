import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/clientAxios'

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  email_verified_at: string | null
  phone: string
  address: string
  created_at: string
  updated_at: string
}


const token = ref<string | null>(sessionStorage.getItem('token'))
const user = ref<User | null>(null)

export const useAuth = () => {
  const router = useRouter()

  const setToken = (t: string) => {
    token.value = t
    sessionStorage.setItem('token', t)
    api.defaults.headers.common.Authorization = `Bearer ${t}`
  }

  const fetchUser = async () => {
    const response = await api.get('/me')

    console.log(response.data)
    user.value = response.data
  }

  const login = async (data: any) => {
    const res = await api.post('/login', data)
    setToken(res.data.access_token)
    await fetchUser()
  }

  const register = async (data: any) => {
    const res = await api.post('/register', data)
    setToken(res.data.access_token)
    await fetchUser()
  }

  const logout = async () => {
    try {
      await api.post('/logout') // Opcional si tu API tiene endpoint de logout
    } catch (e) {}
    sessionStorage.removeItem('token')
    delete api.defaults.headers.common.Authorization
    token.value = null
    user.value = null
    router.push('/login')
  }

  return {
    user,
    token,
    login,
    register,
    fetchUser,
    logout,
  }
}
