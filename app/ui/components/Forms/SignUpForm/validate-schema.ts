import { z } from 'zod';

export const signUpSchema = z.object({
  fullName: z.string().min(1, {
    message: 'Introduce tu nombre completo',
  }),
  email: z
    .string()
    .min(1, {
      message: 'Introduce un email es requerido',
    })
    .email({
      message: 'Introduce un email válido (ej. "hola@ejemplo.com")',
    })
    .endsWith('.com', {
      message: 'Introduce un email válido (ej. "hola@ejemplo.com")',
    }),
});
