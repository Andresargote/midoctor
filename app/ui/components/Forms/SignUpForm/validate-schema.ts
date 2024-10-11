import { z } from 'zod';

export const signUpSchema = z.object({
	email: z
		.string()
		.min(1, {
			message: 'Introduce un email es requerido',
		})
		.email({
			message: 'Introduce un email válido (ej. "hola@ejemplo.com")',
		}),
});
