export interface RegisterForm {
  first_name: string
  last_name: string
  email: string
  address: string
  phone: string
  password: string
  password_confirmation: string
}

export interface RegisterErrors {
  first_name: string[]
  last_name: string[]
  email: string[]
  address: string[]
  phone: string[]
  password: string[]
  password_confirmation: string[]
}

export interface LoginForm {
  email: string
  password: string
}

export interface LoginErrors {
  email: string[]
  password: string[]
}

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  stock: number
  image?: string
  category_id: number
  created_at?: string
  updated_at?: string
}



export interface Category {
  id: number
  name: string
  description: string
  created_at?: string
  updated_at?: string
}


export type Header =
  | { title: string; key: string; sortable?: undefined }
  | { title: string; key: string; sortable: boolean };
