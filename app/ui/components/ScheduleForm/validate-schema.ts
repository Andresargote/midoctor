import { z } from 'zod';

export const clientSchema = z.object({
	service_id: z.string().min(1, {
		message: 'Selecciona un servicio',
	}),
	date: z.string().min(1, {
		message: 'Selecciona un día',
	}),
	time: z.string().min(1, {
		message: 'Selecciona un horario',
	}),
	name: z.string().min(1, {
		message: 'Introduce tu nombre',
	}),
	phone: z
		.string({
			required_error: 'Introduce tu número de teléfono',
		})
		.min(1, {
			message: 'Introduce tu número de teléfono',
		})
		.refine(value => {
			if (!value) return false;

			const digitsOnly = value.replace(/\D/g, '');
			return digitsOnly.length >= 10;
		}, 'Introduce un número de teléfono válido con al menos 10 dígitos'),
	email: z.string().email({
		message: 'Introduce un email válido',
	}),
	comment: z.string().optional(),
});
