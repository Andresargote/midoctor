import { z } from 'zod';

export const profileSchema = z.object({
	username: z
		.string()
		.min(1, {
			message: 'Por favor ingresa tu nombre de usuario',
		})
		.max(50, {
			message: 'El nombre de usuario no puede exceder los 50 caracteres',
		}),
	full_name: z
		.string()
		.min(1, {
			message: 'Por favor ingresa tu nombre completo',
		})
		.max(50, {
			message: 'El nombre completo no puede exceder los 50 caracteres',
		}),
	about_me: z
		.string()
		.min(1, {
			message: 'Por favor cuentanos sobre ti',
		})
		.max(200, {
			message: 'La descripción no puede exceder los 200 caracteres',
		}),
	profession: z.string().optional(),
	avatar_url: z.string().optional(),
});
