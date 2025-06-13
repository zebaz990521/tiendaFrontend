import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().nonempty('El nombre es obligatorio').max(255, 'Máximo 255 caracteres'),
  description: z.string().max(1000, 'Máximo 1000 caracteres').optional()
})
