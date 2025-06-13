import { z } from 'zod'

// Esquema base sin .refine para poder hacer .pick() campo por campo
const baseSchema = z.object({
  first_name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, 'Solo se permiten letras'),
  last_name: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, 'Solo se permiten letras'),
  email: z.string().email('Correo inválido'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  phone: z
    .string()
    .regex(/^[0-9]{8,15}$/, 'Número de teléfono inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Debe contener letras y números'),
  password_confirmation: z.string(),
})

// Esquema completo con validación de igualdad de contraseñas
export const registerSchema = baseSchema.refine(
  (data) => data.password === data.password_confirmation,
  {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
  }
)

// Tipado
export type RegisterSchema = z.infer<typeof baseSchema>
export { baseSchema as registerBaseSchema }
