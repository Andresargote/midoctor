import { z } from 'zod';

export const clientSchema = z.object({
	service: z.string().min(1, {
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
	email: z.string().email({
		message: 'Introduce un email válido',
	}),
	comment: z.string().optional(),
});
