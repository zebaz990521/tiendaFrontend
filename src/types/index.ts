export interface RegisterForm {
  first_name: string
  last_name: string
  email: string
  password: string
  password_confirmation: string
}

export interface RegisterErrors {
  first_name: string[]
  last_name: string[]
  email: string[]
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

